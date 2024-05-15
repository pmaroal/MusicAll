import { useState, useEffect } from 'react';
import { useAuth } from '../services/AuthService';
import { firestore } from '../config/firebase';
import EventModel from '../models/EventModel';
import { GetGroupInfo } from '../controllers/MusicalGroupController';

/**
 * Custom hook para gestionar las funciones CRUD de los eventos:
 *  -   (Create): CreateEvent()
 *  -   (Retrieve): GetUserEvents()
 *  -   (Retrieve ALL): Se realiza en la barra de búsqueda en conjunto con el resto de colecciones <!TODO: mejorarlo y separarlo>
 *  -   (Update): <!TODO: Sin implementar aún>
 *  -   (Delete): DeleteEvent() <No funciona!>
 */

/**Función CreateEvent para crear un nuevo grupo en la vista 'Events'
 * Maneja los campos el formulario y los datos de los eventos nuevos, usando un EventModel
 * Además, permite asociar un evento con un grupo con la colección intermedia 'rel_group_event'>
 */
export function CreateEvent() {
  // Obtener el usuario actual autenticado
  const { currentUser } = useAuth();

  // Estados para almacenar los detalles del evento y posibles errores
  const [eventTitle, setEventTitle] = useState('');
  const [selectedGroup, setSelectedGroup] = useState('');
  const [eventType, setEventType] = useState('ensayo');
  const [eventDate, setEventDate] = useState(new Date());
  const [eventTime, setEventTime] = useState(['09:00', '10:00']);
  const [eventLocation, setEventLocation] = useState('');
  const [error, setError] = useState('');

  // Función para manejar la creación de un evento
  const handleCreateEvent = async () => {
    try {
      // Validar que se haya ingresado un título para el evento
      // >!TODO: No sirve para nada esta validación, hay que implementarla correctamente>
      if (!eventTitle) {
        setError('Por favor, ingresa un título para el evento.');
        return;
      }

      const title = eventTitle; //Título del evento
      const date = eventDate.toLocaleDateString(); // Fecha del evento
      const time = eventTime.join('-'); // Unir la hora de inicio y fin en un array
      const createdBy = currentUser.uid; // Usuario que la ha creado
      const type = eventType; // Tipo de evento (ensayo, concierto)
      const location = eventLocation; // Ubicación del evento

      // Crear un nuevo objeto de evento
      const newEvent = new EventModel(title, type, createdBy, date, time, location);

      // Agregar el evento a la colección en Firestore
      const eventRef = await firestore.collection("events").add({
        title: newEvent.title,
        type: newEvent.type,
        createdBy: newEvent.createdBy,
        date: newEvent.date,
        time: newEvent.time,
        location: newEvent.location,
      });

      // Obtener el ID del evento recién creado y actualizar el documento
      const eventId = eventRef.id;
      await eventRef.update({
        eventId: eventId,
      });

      // Si se seleccionó un grupo, asociar el evento con el grupo
      if (selectedGroup) {
        await firestore.collection("rel_group_event").add({
          groupId: selectedGroup,
          eventId: eventRef.id
        });
      }

      // Restablecer los estados para los detalles del evento
      setEventTitle('');
      setEventDate(new Date());
      setEventTime(['09:00', '10:00']);
      setSelectedGroup('');
      setEventType('ensayo');

    } catch (error) {
      console.error("Error creando evento: ", error);
    }
  };

  return {
    error, // Mensaje de error
    eventTitle, // Título del evento
    setEventTitle, // Función para actualizar el título 
    selectedGroup, // Grupo seleccionado para el evento
    setSelectedGroup, // Función para actualizar el grupo seleccionado
    eventType, // Tipo de evento
    setEventType, // Función para actualizar el tipo de evento
    eventDate, // Fecha del evento
    setEventDate, // Función para actualizar la fecha del evento
    eventTime, // Hora del evento
    setEventTime, // Función para actualizar la hora del evento
    eventLocation, // Ubicación
    setEventLocation, // Función para actualizar la ubicación
    handleCreateEvent, // Función para crear un nuevo evento con el formulario
  };
}




/**Función GetUserEvents para obtener y mostrar los eventos del usuario en la vista 'Events'
 * Ordena el array de eventos por fecha, ya que la BBDD no permite hacer búsquedas compuestas (where.orderBy)
 */
export function GetUserEvents() {
  // Obtener el usuario actual autenticado y los grupos asociados
  const { currentUser } = useAuth();
  const { userGroups } = GetGroupInfo();

  // Estado para almacenar los eventos del usuario
  const [events, setEvents] = useState([]);

  // Efecto para obtener los eventos del usuario y sus grupos asociados
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        // Verificar si el usuario tiene grupos asociados
        if (userGroups.length === 0) return;

        // Obtener los eventos creados por el usuario
        const userEvents = await firestore.collection("events").where("createdBy", "==", currentUser.uid).get();
        const fetchedUserEvents = userEvents.docs.map(doc => ({ id: doc.id, ...doc.data() }));

        // Obtener los eventos de los grupos asociados al usuario
        const groupEvents = [];

        // Obtener los IDs de los grupos asociados al usuario
        const groupIds = userGroups.map(group => group.id);

        // Recorrer los grupos del usuario buscando eventos asociados
        for (const groupId of groupIds) {
          const groupEventsRef = await firestore.collection("rel_group_event").where("groupId", "==", groupId).get();
          const fetchedGroupEvents = groupEventsRef.docs.map(doc => doc.data().eventId);

          // Comprueba que no sean los mismos eventos que ha creado el usuario (y ya ha mostrado)
          for (const eventId of fetchedGroupEvents) {
            const eventRef = await firestore.collection("events").doc(eventId).get();
            if (eventRef.exists && eventRef.data().createdBy !== currentUser.uid) {
              const eventData = { id: eventRef.id, ...eventRef.data(), groupId };
              groupEvents.push(eventData);
            }
          }
        }

        // Combina los eventos (usuario + grupos) y los ordena por fecha
        const combinedEvents = [...fetchedUserEvents, ...groupEvents];
        const sortedEvents = combinedEvents.sort((a, b) => {
          const dateA = new Date(a.date.split("/").reverse().join("/"));
          const dateB = new Date(b.date.split("/").reverse().join("/"));
          return dateB - dateA;
        });

        setEvents(sortedEvents);
      } catch (error) {
        console.error("Error: ", error);
      }
    };

    fetchEvents();
  }, [currentUser, userGroups]);

  return {
    userGroups, // Grupos del usuario
    events, // Eventos asociados al usuario y sus grupos
  }
}



/**Función DeleteEvent para eliminar un grupo en la vista 'Events' */
export async function DeleteEvent(eventId) {
    try {
      // Eliminar el evento de la colección en Firestore
      await firestore.collection("events").doc(eventId).delete();

      // Buscar y eliminar las referencias del evento en la colección de relaciones grupo-evento
      const relGroupEventQuery = firestore.collection("rel_group_event").where("eventId", "==", eventId);
      const relGroupEventSnapshot = await relGroupEventQuery.get();

      // Si hay relaciones entre evento y grupo, las elimina.
      if (!relGroupEventSnapshot.empty) {
        relGroupEventSnapshot.forEach(async (doc) => {
          await doc.ref.delete();
        });
      } else {
        console.log("Error al buscar a que grupo pertenece el evento");
      }

      console.log("Se eliminó el evento", eventId)

    } catch (error) {
      console.error("Error eliminando el evento: ", error);
    }
}
