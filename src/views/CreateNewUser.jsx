import React from "react";
import { useNavigate } from "react-router-dom";
import { Form, Button, Card, Alert, Accordion, ListGroup, Modal } from "react-bootstrap";
import { ArrowLeft } from "react-bootstrap-icons";
import Calendar from 'react-calendar' // Importar paquete react-calendar para el widget del calendario (https://www.npmjs.com/package/react-calendar)
import 'react-calendar/dist/Calendar.css';
import useUserController from "../controllers/UserController";

export default function CreateNewUser() {
    // Utiliza el hook useUserController para obtener referencias, estados y funciones relacionadas con el controlador de usuario
    const {
        nameRef,
        surnameRef,
        selectedDate,
        maxDate,
        handleSubmit,
        error,
        setSelectedDate,
        setSelectedInstruments,
        showModal,
        handleShowModal,
        handleCloseModal
    } = useUserController();
    
    // Hook de React Router para la navegación
    const navigate = useNavigate();

    return (
        <>
            {/**Card que contiene el formulario de registro */}
            <Card className="shadow">
                <Card.Header>
                    {/**Botón para volver atrás */}
                    <Button
                        type="button"
                        variant="outline-dark"
                        className="border-0 pb-2"
                        onClick={() => navigate(-1)}
                    >
                        <ArrowLeft />
                    </Button>
                </Card.Header>

                <Card.Body>
                    {/**Formulario de registro */}
                    <Form onSubmit={handleSubmit}>
                        {/**Campo de nombre */}
                        <Form.Group id="name" className="my-3">
                            <Form.Label>Nombre</Form.Label>
                            <Form.Control type="text" ref={nameRef} required />
                        </Form.Group>

                        {/**Campo de apellidos */}
                        <Form.Group id="surname" className="my-3">
                            <Form.Label>Apellidos</Form.Label>
                            <Form.Control type="text" ref={surnameRef} required />
                        </Form.Group>

                        {/**Campo de fecha de nacimiento */}
                        <Form.Group id="birthday" className="d-grid my-3">
                            <Form.Label>Fecha de nacimiento</Form.Label>
                            
                            {/**Botón para abrir el modal de selección de fecha */}
                            <Button type="button" variant="outline-dark" className="text-start" onClick={handleShowModal}>
                                {/**Si hay una fecha seleccionada, muestra la fecha en formato específico, de lo contrario, muestra un mensaje predeterminado */}
                                {selectedDate ? selectedDate.toLocaleDateString("es-ES", {
                                    day: "2-digit",
                                    month: "2-digit",
                                    year: "numeric",
                                }) : "Seleccionar fecha"}
                            </Button>

                            {/**Modal de selección de fecha */}
                            <Modal show={showModal} onHide={handleCloseModal} centered>
                                <Modal.Body>
                                    {/**Componente Calendar para seleccionar la fecha */}
                                    <Calendar 
                                        selected={selectedDate}
                                        onChange={(date) => setSelectedDate(date)}
                                        dateFormat="dd/MM/yyyy"
                                        maxDate={maxDate}
                                        minDate={new Date(1901, 0, 1)}
                                        locale="es"
                                        className="container"
                                        required
                                    />
                                </Modal.Body>
                            </Modal>
                        </Form.Group>

                        {/**Acordeón de instrumentos disponibles */}
                        <Accordion className="my-3">
                            <Accordion.Header>Instrumentos</Accordion.Header>
                            <Accordion.Body className="pt-1">
                                <ListGroup variant="flush">
                                    {/**Mapea los instrumentos disponibles y sus checkboxes */}
                                    {["Guitarra", "Teclado", "Bajo", "Batería", "Trompeta"].map((instrument, index) => (
                                        <ListGroup.Item key={index}>
                                            <Form.Check
                                                type="checkbox"
                                                label={instrument}
                                                onChange={() => setSelectedInstruments(prevInstruments => {
                                                    const isSelected = prevInstruments.includes(instrument);
                                                    return isSelected ? prevInstruments.filter(item => item !== instrument) : [...prevInstruments, instrument];
                                                })}
                                            />
                                        </ListGroup.Item>
                                    ))}
                                </ListGroup>
                            </Accordion.Body>
                        </Accordion>

                        {/**Botón de enviar el formulario */}
                        <div className="d-flex gap-3 mt-4">
                            <Button type="submit" className="w-100">
                                Crear cuenta
                            </Button>
                        </div>

                        {/**Muestra un mensaje de error si hay algún error durante el registro */}
                        {error && <Alert variant="danger">{error}</Alert>}
                    </Form>
                </Card.Body>
            </Card>
        </>
    );
}
