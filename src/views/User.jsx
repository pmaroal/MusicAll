import React from 'react';
import { Button, Alert, Table, Form } from "react-bootstrap";
import { EditUserData } from "../controllers/UserController";


// Componente para la visualización y edición del perfil de usuario
export default function User() {
        // Utiliza el hook useUserController para obtener referencias, estados y funciones relacionadas con el controlador de usuario
        const {
            account,
            editedAccount,
            error,
            message,
            editing,
            handleEdit,
            handleCancel,
            handleChange,
            handleSaveChanges,
        } = EditUserData();

    return (
        <>
            {/**Mostrar mensaje de error si existe */}
            {error && <Alert variant="danger">{error}</Alert>}

            {/**Mostrar información del perfil si existe una cuenta */}
            {account && (
                <>
                    <h2 className='text-center py-3'>Información de perfil</h2>

                    {message && <Alert variant="info">{message}</Alert>}

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
                                type="text"
                                name="birthDate"
                                value={account.birthDate.toDate().toLocaleDateString()}
                                disabled
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
                            <Button variant="danger" className='w-100 fw-semibold' onClick={handleEdit}>Editar perfil</Button>
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
