import React from "react";
import { Container, Modal, Button } from 'react-bootstrap';
import Calendar from 'react-calendar';
import useEventsController from '../controllers/EventController';

export default function Events() {
  const { 
    date, 
    events, 
    modalIsOpen, 
    newEvent, 
    handleDateChange, 
    handleEventSubmit, 
    handleCloseModal, 
    setNewEvent 
  } = useEventsController();

  return (
    <Container className="py-4">
      <h2 className="text-center mb-4">Eventos</h2>
      <Calendar onChange={handleDateChange} value={date} className="mx-auto mb-4" />

      <div>
        <h3>Eventos próximos:</h3>
        {events.length > 0 ? (
          <ul>
            {events.map((event, index) => (
              <li key={index}>
                <strong>{event.date.toDateString()}</strong>: {event.description}
              </li>
            ))}
          </ul>
        ) : (
          <p>No hay eventos próximos.</p>
        )}
      </div>

      <Modal show={modalIsOpen} onHide={handleCloseModal} className="modal-lg" centered>
        <Modal.Header closeButton>
          <Modal.Title>Agregar Evento</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <input
            type="text"
            value={newEvent}
            onChange={(e) => setNewEvent(e.target.value)}
            className="form-control mb-3"
            placeholder="Descripción del evento"
          />
        </Modal.Body>
        <Modal.Footer>
          <Button variant="primary" onClick={handleEventSubmit}>Agregar</Button>
          <Button variant="secondary" onClick={handleCloseModal}>Cancelar</Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
}
