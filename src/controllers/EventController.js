import React, { useState } from "react";

function useEventsController() {
  const [date, setDate] = useState(new Date());
  const [events, setEvents] = useState([]);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [newEvent, setNewEvent] = useState("");

  const handleDateChange = (date) => {
    setDate(date);
    setModalIsOpen(true);
  };

  const handleEventSubmit = () => {
    if (newEvent.trim() !== "") {
      setEvents([...events, { date, description: newEvent }]);
      setModalIsOpen(false);
      setNewEvent("");
    } else {
      alert("Por favor, introduce una descripción para el evento.");
    }
  };

  const handleCloseModal = () => {
    setModalIsOpen(false);
    setNewEvent("");
  };

  return { date, events, modalIsOpen, newEvent, handleDateChange, handleEventSubmit, handleCloseModal, setNewEvent };
}

export default useEventsController; // Exporta el hook
