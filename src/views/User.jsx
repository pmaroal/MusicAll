import React, { useState, useEffect } from 'react';
import { useAuth } from "../services/AuthService";
import { auth, firestore } from "../config/firebase";
import { Button, Alert, Table, Form } from "react-bootstrap";
import { useNavigate } from 'react-router-dom';

// Componente para la visualización y edición del perfil de usuario
export default function User() {
    const navigate = useNavigate();
    const { currentUser } = useAuth();

    // Obtener datos del usuario y mensajes de error del controlador de cuenta
    const [account, setAccount] = useState(null);
    const [error, setError] = useState("");

    // Estado para controlar el modo de edición del perfil
    const [editing, setEditing] = useState(false);
    // Estado para almacenar los datos editados del perfil
    const [editedAccount, setEditedAccount] = useState({});

    // Función para obtener los datos del usuario
    useEffect(() => {
        const fetchUserData = async () => {
            try {
                if (currentUser) {
                    const { uid } = currentUser; // ID del usuario en Firebase
                    const userRef = firestore.collection("users").doc(uid); // Referencia al documento de usuario en Firestore
                    const userDoc = await userRef.get(); // Petición async de los datos del documento

                    if (userDoc.exists) {
                        // Datos del usuario
                        const userData = userDoc.data();
                        setAccount(userData);
                        setEditedAccount(userData);
                    } else {
                        setError("No se encontraron datos para este usuario");
                    }
                } else {
                    setAccount(null);
                }
            } catch (error) {
                setError("Error al cargar los datos del usuario");
            }
        };

        fetchUserData();
    }, [currentUser]);

    // Función para habilitar el modo de edición
    const handleEdit = () => {
        setEditing(true);
    };

    // Función para cancelar la edición y volver al modo de visualización
    const handleCancel = () => {
        setEditing(false);
    };

    // Función para guardar los cambios realizados en el perfil del usuario
    async function handleSaveChanges() {
        try {
            const user = auth.currentUser;
            const updateData = {}; // Objeto para almacenar los datos a actualizar

            // Verificar si editedAccount.name está definido y agregarlo al objeto de actualización
            if (editedAccount.name !== undefined) {
                updateData.name = editedAccount.name;
            }

            // Verificar si editedAccount.surname está definido y agregarlo al objeto de actualización
            if (editedAccount.surname !== undefined) {
                updateData.surname = editedAccount.surname;
            }

            // Actualizar los datos en Firestore solo si hay campos definidos para actualizar
            if (Object.keys(updateData).length > 0) {
                await firestore.collection('users').doc(user.uid).update(updateData);
            }

            setAccount(editedAccount); // Actualizar la cuenta en el estado
            navigate("/usuario");
            setEditing(false); // Cambia al modo de visualización después de guardar los cambios
        } catch (error) {
            console.error("Error updating user profile:", error);
            setError("Error al guardar los cambios");
        }
    }

    // Función para manejar los cambios en los campos del formulario de edición
    const handleChange = (e) => {
        const { name, value } = e.target;
        setEditedAccount(prevAccount => ({
            ...prevAccount,
            [name]: value
        }));
    };

    return (
        <>
            {/**Mostrar mensaje de error si existe */}
            {error && <Alert variant="danger">{error}</Alert>}

            {/**Mostrar información del perfil si existe una cuenta */}
            {account && (
                <>
                    <h2 className='text-center py-3'>Información de perfil</h2>

                    {/**Presentado en un Form para poder editarlo */}
                    <Form>

                        {/**Campo de email */}
                        <Form.Group className="my-3">
                            <Form.Label className='fw-semibold'>Email</Form.Label>
                            <Form.Control
                                type="email"
                                name="email"
                                value={editing ? editedAccount.email : account.email}
                                onChange={handleChange}
                                disabled // TODO: Gestionar cambio de email usando AuthService
                            />
                            {/**Mostrar fecha de creación de la cuenta */}
                            <Form.FloatingLabel className='text-center text-secondary small'>Creado en: {account.creationDate || "sin datos"}</Form.FloatingLabel>
                        </Form.Group>

                        {/**Campo de nombre */}
                        <Form.Group className="my-3">
                            <Form.Label className='fw-semibold'>Nombre</Form.Label>
                            <Form.Control
                                type="text"
                                name="name"
                                value={editing ? editedAccount.name : account.name}
                                onChange={handleChange}
                                disabled={!editing}
                            />
                        </Form.Group>

                        {/**Campo de apellidos */}
                        <Form.Group className="my-3">
                            <Form.Label className='fw-semibold'>Apellidos</Form.Label>
                            <Form.Control
                                type="text"
                                name="surname"
                                value={editing ? editedAccount.surname : account.surname}
                                onChange={handleChange}
                                disabled={!editing}
                            />
                        </Form.Group>

                        {/**Campo de fecha de nacimiento */}
                        <Form.Group className="my-3">
                            <Form.Label className='fw-semibold'>Fecha de nacimiento</Form.Label>
                            <Form.Control
                                type="text" // Ajusta el tipo de entrada según el formato de fecha esperado
                                name="birthDate"
                                value={account.birthDate.toDate().toLocaleDateString()}
                                onChange={handleChange}
                                disabled // TODO: Gestionar cambio de fecha de nacimiento
                            />
                        </Form.Group>
                    </Form>

                    {/**Tabla de instrumentos seleccionados */}
                    <Table borderless hover size='sm' className='my-3'>
                        <thead>
                            <tr>
                                <th colSpan={2} className='border-0'>Instrumentos</th>
                            </tr>
                        </thead>
                        <tbody>
                            {account.selectedInstruments.map((instrument, index) => (
                                <tr key={index}>
                                    <td>{index + 1}</td>
                                    <td className='fw-semibold'>{instrument}</td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>

                    {/**Botón para editar perfil */}
                    <div className='d-flex gap-3 mt-4'>
                        {/**Si está en modo edición, mostrar el botón de editar */}
                        {!editing ? (
                            <Button variant="danger" className='w-100 fw-bold' onClick={handleEdit}>Editar perfil</Button>
                        ) : (
                            <> {/**Botones para cancelar y guardar cambios en el modo de edición */}
                                <Button variant="secondary" onClick={handleCancel}>Cancelar</Button>
                                <Button variant="success" className='w-100' onClick={handleSaveChanges}>Guardar cambios</Button>
                            </>
                        )}
                    </div>
                </>
            )}

            {/**Mensaje si no hay usuario logeado */}
            {!account && <p>No hay usuario logeado</p>}
        </>
    );
}
