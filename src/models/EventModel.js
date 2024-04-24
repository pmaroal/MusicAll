import React, { useState } from "react";
import Calendar from 'react-calendar';
import Modal from 'react-modal';

export default function Events() {
  const [date, setDate] = useState(new Date());
  const [events, setEvents] = useState([]);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [newEvent, setNewEvent] = useState("");

  const handleDateChange = (date) => {
    setDate(date);
    setModalIsOpen(true);
  };

  const handleEventSubmit = () => {
    setEvents([...events, { date, description: newEvent }]);
    setModalIsOpen(false);
    setNewEvent("");
  };

  const handleCloseModal = () => {
    setModalIsOpen(false);
    setNewEvent("");
  };

  return (
    <div>
      <h2 className="text-center">Eventos</h2>
      <Calendar onChange={handleDateChange} value={date} />
      <div>
        <h3>Eventos próximos:</h3>
        <ul>
          {events.map((event, index) => (
            <li key={index}>
              <strong>{event.date.toDateString()}</strong>: {event.description}
            </li>
          ))}
        </ul>
      </div>
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={handleCloseModal}
        contentLabel="Agregar Evento"
      >
        <h2>Agregar Evento</h2>
        <input
          type="text"
          value={newEvent}
          onChange={(e) => setNewEvent(e.target.value)}
          placeholder="Descripción del evento"
        />
        <button onClick={handleEventSubmit}>Agregar</button>
        <button onClick={handleCloseModal}>Cancelar</button>
      </Modal>
    </div>
  );
}
