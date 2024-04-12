// Importar React y los hooks necesarios desde react-router-dom y react-bootstrap
import React, { useRef, useState } from "react";
import { useAuth } from "../services/AuthService";
import { Form, Button, Card, Alert } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';


// Definir y exportar la vista para iniciar sesión
export default function Signup() {
    // Referencias a los campos de email y contraseña del formulario
    const emailRef = useRef();
    const passwordRef = useRef();
    // Función de autenticación de useAuth
    const { login } = useAuth();
    // Definir el React-Router para navegar entre rutas
    const navigate = useNavigate();
    // Estado para manejar los errores de autenticación
    const [error, setError] = useState('');
    // Estado para indicar si la solicitud de inicio de sesión está en curso
    const [loading, setLoading] = useState(false);


    // Función asincrónica que maneja el envío del formulario de inicio de sesión
    async function handleSubmit(e) {
        e.preventDefault(); // Impedir el comportamiento predeterminado del formulario

        try {
            setError(""); // Limpiar el mensaje de error
            setLoading(true); // Establecer el estado de carga en verdadero
            
            // Llamar a la función de iniciar sesión con el email y la contraseña
            await login(emailRef.current.value, passwordRef.current.value);
            // Redirigir al usuario a la página de inicio
            navigate("/")
            
        } catch (error) {
            setError('Error al iniciar sesión.');
        }
        // Establecer el estado de carga en falso después de manejar el registro
        setLoading(false);
    }

    return (
        <>
            <Card className='shadow my-3'>
                <Card.Body>
                    <h2 className='text-center py-3'>Iniciar sesión</h2>
                    <Form onSubmit={handleSubmit}>
                        <Form.Group id='email' className='my-2'>
                            <Form.Label>Email</Form.Label>
                            <Form.Control type='email' ref={emailRef} required />
                        </Form.Group>
                        <Form.Group id='password' className='my-2'>
                            <Form.Label>Contraseña</Form.Label>
                            <Form.Control type='password' ref={passwordRef} required />
                        </Form.Group>
                        <Button type='submit' className='w-100 my-2' disabled={loading}>Iniciar sesión</Button>
                        {error && <Alert variant="danger">{error}</Alert>}
                    </Form>
                </Card.Body>
            </Card>
            <div className='mt-4'>
                <Link to="/sign-up" className='nav-link'><p>¿No tienes una cuenta? Regístrate</p></Link>
                <Link to="/" className="nav-link"><p>¿Has olvidado la contraseña?</p></Link>
                <Link to="/" className="nav-link"><p>Política de Privacidad</p></Link>
            </div>
        </>
    )
}

