import { useState, useEffect } from "react";
import { firestore } from "../config/firebase";
import { useAuth } from "../services/AuthService";

// Define la función formatDate aquí
const formatDate = (date) => {
  const day = date.getDate();
  const month = date.getMonth() + 1;
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
};

export default function useEventController() {
  const { currentUser } = useAuth();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUserEvents = async () => {
      try {
        setLoading(true);
        setError(null);

        const userEventsRef = firestore.collection("events").where("idUser", "==", currentUser.uid);
        const snapshot = await userEventsRef.get();

        const userEvents = [];
        snapshot.forEach((doc) => {
          const id = doc.id;
          const data = doc.data();
          const eventModel = {
            id: id,
            date: formatDate(data.date.toDate()), // Formatear la fecha
            event: data.event,
            idUser: data.idUser
          };
          userEvents.push(eventModel);
        });

        setEvents(userEvents);
        setLoading(false);
      } catch (error) {
        setError(error);
        setLoading(false);
      }
    };

    fetchUserEvents();
  }, [currentUser]);

  const addEvent = async (eventText, selectedDate) => {
    try {
      setLoading(true);
      setError(null);

      // Validar eventText
      if (!eventText.trim()) {
        alert("Ingrese una descripción para el evento.");
        return;
      }

      // Sanitizar eventText (eliminar caracteres especiales, etc.)
      const sanitizedEventText = eventText.replace(/[^a-zA-Z0-9\s]/g, '');

      const eventRef = firestore.collection("events");

      await eventRef.add({
        date: selectedDate,
        event: sanitizedEventText,
        idUser: currentUser.uid,
      });

      const updatedEvents = [...events, {
        id: 'tempId', // Asignar un ID temporal mientras se obtiene el ID de Firestore
        date: formatDate(selectedDate), // Formatear la fecha
        event: sanitizedEventText,
        idUser: currentUser.uid,
      }];
      setEvents(updatedEvents);
      setLoading(false);
    } catch (error) {
      setError(error);
      setLoading(false);
    }
  };

  const deleteEvent = async (eventId) => {
    try {
      setLoading(true);
      setError(null);

      const eventRef = firestore.collection("events").doc(eventId);
      await eventRef.delete();

      const updatedEvents = events.filter(event => event.id !== eventId);
      setEvents(updatedEvents);
      setLoading(false);
    } catch (error) {
      setError(error);
      setLoading(false);
    }
  };

  return { events, loading, error, addEvent, deleteEvent };
}
