// Importar React y los hooks necesarios desde react-router-dom y react-bootstrap
import React, { useRef, useState } from "react";
import { useAuth } from "../services/AuthService";
import { Form, Button, Card, Alert } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';

// Definir y exportar la vista para registrar una nueva cuenta
export default function Signup() {
    // Referencias a los campos de email y contraseña del formulario
    const emailRef = useRef();
    const passwordRef = useRef();
    const passwordConfRef = useRef();

    // Función de registro de useAuth
    const { signup } = useAuth();
    // Definir el React-Router para navegar entre rutas
    const navigate = useNavigate();
    // Estado para manejar los errores de registro
    const [error, setError] = useState('');
    // Estado para indicar si la solicitud de registro de cuenta está en curso
    const [loading, setLoading] = useState(false);

    // Función asincrónica para manejar el envío del formulario de registro
    async function handleSubmit(e) {
        e.preventDefault(); // Impedir el comportamiento predeterminado del formulario

        // Validar que ambas contraseñas coincidan
        if (passwordRef.current.value !== passwordConfRef.current.value) {
            return setError('Las contraseñas no coinciden.');
        }

        // Validar que la contraseña tenga al menos 6 caracteres (requisito de FireBase Auth)
        if (passwordRef.current.value.length < 6) {
            return setError('La contraseña debe tener al menos 6 caracteres.');
        }

        try {
            setError(""); // Limpiar el mensaje de error
            setLoading(true); // Establecer el estado de carga en verdadero
            
            // Llamar a la función de registro con el email y la contraseña
            await signup(emailRef.current.value, passwordRef.current.value);
            
            // Redirigir al usuario a la página de inicio
            // TODO: Mejorar con mensajes de confirmación
            navigate("/")
            
        } catch (error) {
            setError('Error al crear la cuenta.');
        }

        // Establecer el estado de carga en falso después de manejar el registro
        setLoading(false);
    }

    return (
        <>
            <Card className='shadow my-3'>
                <Card.Body>
                    <h2 className='text-center py-3'>Crear una cuenta</h2>
                    <Form onSubmit={handleSubmit}>
                        <Form.Group id='email' className='my-2'>
                            <Form.Label>Email</Form.Label>
                            <Form.Control type='email' ref={emailRef} required />
                        </Form.Group>
                        <Form.Group id='password' className='my-2'>
                            <Form.Label>Contraseña</Form.Label>
                            <Form.Control type='password' ref={passwordRef} required />
                        </Form.Group>
                        <Form.Group id='password-confirmation' className='my-2'>
                            <Form.Label>Vuelve a escribir tu contraseña</Form.Label>
                            <Form.Control type='password' ref={passwordConfRef} required />
                        </Form.Group>
                        <Button type='submit' className='w-100 my-2' disabled={loading}>Registrarse</Button>

                        {error && <Alert variant="danger">{error}</Alert>}
                    </Form>
                </Card.Body>
            </Card>
            <div className='mt-4'>
                <Link to="/login" className='nav-link'><p>¿Ya tienes una cuenta? Iniciar sesión</p></Link>
            </div>
        </>
    )
}

