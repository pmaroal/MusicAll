import React, { useState } from "react";
import { Container, Button } from 'react-bootstrap';
import Calendar from 'react-calendar';
import useEventController from '../controllers/EventController';

export default function Events() {
  const [selectedDate, setSelectedDate] = useState(null); // Estado para la fecha seleccionada
  const {
    events,
    loading,
    error,
    addEvent, // Función para agregar evento
    deleteEvent // Función para eliminar evento
  } = useEventController();

  // Función para formatear la fecha
  const formatDate = (date) => {
    const day = date.getDate();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  };

  const handleCreateEvent = async () => {
    if (!selectedDate) {
      alert("Seleccione una fecha para el evento.");
      return;
    }

    const eventText = prompt("Ingrese la descripción del evento:");
    if (!eventText) {
      return; // Manejar el caso sin texto de evento
    }

    await addEvent(eventText, selectedDate); // Llamar a la función para agregar evento
    setSelectedDate(null); // Limpiar la fecha seleccionada
  };

  const handleDeleteEvent = async (eventId) => {
    if (window.confirm("¿Estás seguro de que quieres eliminar este evento?")) {
      await deleteEvent(eventId);
    }
  };

  return (
    <Container className="py-4">
      <h2 className="text-center mb-4">Eventos</h2>
      <Calendar onChange={(newDate) => setSelectedDate(newDate)} value={selectedDate} className="mx-auto mb-4" />

      <div>
        <h3>Eventos próximos:</h3>
        {loading ? (
          <p>Cargando eventos...</p>
        ) : error ? (
          <p>Error al cargar eventos: {error.message}</p>
        ) : events.length > 0 ? (
          <ul>
            {events.map((event) => (
              <li key={event.id}>
                <strong>{event.date}</strong>: {event.event}
                <Button variant="danger" onClick={() => handleDeleteEvent(event.id)}>Eliminar</Button>
              </li>
            ))}
          </ul>
        ) : (
          <p>No hay eventos próximos.</p>
        )}
      </div>

      <Button variant="primary" onClick={handleCreateEvent}>Crear Evento</Button>
    </Container>
  );
}
