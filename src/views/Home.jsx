import React from "react";
import { Container, Card } from 'react-bootstrap';
import useEventController from "../controllers/EventController";

export default function Home() {
  const { events, loading, error } = useEventController();

  return (
    <Container className="text-center">
      <h2 className="">Inicio</h2>
      <Card>
        <Card.Body>
          <h3>Eventos Próximos</h3>
          {loading ? (
            <p>Cargando eventos...</p>
          ) : error ? (
            <p>Error al cargar eventos: {error.message}</p>
          ) : events.length > 0 ? (
            <ul>
              {events.map((event) => (
                <li key={event.id}>
                  <strong>{event.date}</strong>: {event.event}
                </li>
              ))}
            </ul>
          ) : (
            <p>No hay eventos próximos.</p>
          )}
        </Card.Body>
      </Card>
    </Container>
  );
}
