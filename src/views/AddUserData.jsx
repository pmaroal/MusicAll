import React, { useRef, useState, useEffect } from "react";
import { useAuth } from "../services/AuthService";
import {
    Form,
    Button,
    Card,
    Alert,
    CardHeader,
    Dropdown,
    ListGroup,
} from "react-bootstrap";
import { ArrowLeft } from "react-bootstrap-icons";
import DatePicker, { registerLocale } from "react-datepicker";
import { es } from 'date-fns/locale/es';
import "react-datepicker/dist/react-datepicker.css";
import { useNavigate, useLocation } from "react-router-dom";

export default function AddUserData() {
    const { signup } = useAuth();
    const nameRef = useRef();
    const surnameRef = useRef();
    const navigate = useNavigate();
    const location = useLocation();
    const [error, setError] = useState("");
    const [selectedDate, setSelectedDate] = useState(null);
    const [maxDate, setMaxDate] = useState(new Date());
    const [selectedInstruments, setSelectedInstruments] = useState([]);

    registerLocale('es', es)

    useEffect(() => {
        const today = new Date();
        setMaxDate(today);
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            setError("");

            const { state } = location;
            const email = state.email;
            const password = state.password;

            await signup(email, password, {
                name: nameRef.current.value.charAt(0).toUpperCase() + nameRef.current.value.slice(1),   // ! Mejorar
                surname: surnameRef.current.value.charAt(0).toUpperCase() + surnameRef.current.value.slice(1),
                
                birthDate: selectedDate,
                selectedInstruments: selectedInstruments
            });
            navigate("/");
        } catch (error) {
            setError("Error al crear la cuenta.");
        }
    }

    return (
        <>
            <Card className="shadow">
                <CardHeader>
                    <Button
                        type="button"
                        variant="outline-dark"
                        className="border-0 pb-2"
                        onClick={() => navigate(-1)}
                    >
                        {" "}
                        <ArrowLeft />{" "}
                    </Button>
                </CardHeader>
                <Card.Body>
                    <Form onSubmit={handleSubmit}>
                        <Form.Group id="name" className="my-3">
                            <Form.Label>Nombre</Form.Label>
                            <Form.Control type="text" ref={nameRef} required />
                        </Form.Group>

                        <Form.Group id="surname" className="my-3">
                            <Form.Label>Apellidos</Form.Label>
                            <Form.Control type="text" ref={surnameRef} required />
                        </Form.Group>

                        <Form.Group id="birthday" className="d-grid my-3">
                            <Form.Label>Fecha de nacimiento</Form.Label>
                            <DatePicker
                                selected={selectedDate}
                                onChange={(date) => setSelectedDate(date)}
                                dateFormat="dd/MM/yyyy"
                                placeholderText="Selecciona tu fecha de nacimiento"
                                className="w-100 pt-1"
                                showIcon
                                calendarIconClassname="ps-1"
                                toggleCalendarOnIconClick
                                maxDate={maxDate}
                                locale="es"
                                required
                            />
                        </Form.Group>

                        <Dropdown>
                            <Dropdown.Toggle variant="transparent" className="container text-start ps-0 border-0">
                                Instrumentos
                            </Dropdown.Toggle>
                            <Dropdown.Menu className="w-100 px-2">
                                <ListGroup variant="flush">
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
                            </Dropdown.Menu>
                        </Dropdown>

                        {/**Lista de instrumentos seleccionados */}
                        <ListGroup className="my-3">
                            {selectedInstruments.map((instrument, index) => (
                                <ListGroup.Item key={index}>
                                    {instrument}
                                </ListGroup.Item>
                            ))}
                        </ListGroup>

                        <div className="d-flex gap-3 mt-4">
                            <Button type="submit" className="w-100">
                                Crear cuenta
                            </Button>
                        </div>

                        {error && <Alert variant="danger">{error}</Alert>}
                    </Form>
                </Card.Body>
            </Card>
        </>
    );
}
