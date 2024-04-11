// Importar React y los hooks necesarios desde react-router-dom y react-bootstrap
import React, { useState } from "react";
import { NavbarTop } from "../components/Navbar";
import { Card, Button, Alert } from "react-bootstrap";
import { useAuth } from "../services/AuthService";
import { useNavigate } from "react-router-dom";

export default function Home() {
    // Definir variable para almacenar errores
    const [error, setError] = useState("");
    // Obtener el usuario actual y la función de cierre de sesión del contexto/servicio de autenticación
    const { currentUser, logout } = useAuth();
    // Definir el React-Router para navegar entre rutas
    const navigate = useNavigate();

    // Definir una función asincrónica para manejar el cierre de sesión
    async function handleLogout() {
        setError(""); // Reiniciar el estado de error

        try {
            await logout(); // Ejecutar la función de cierre de sesión
            navigate("/login"); // Volver a la página de inicio de sesión
        } catch {
            setError("No se ha podido cerrar la sesión");
        }
    }

    // Función para mostrar la información del usuario logeado o un mensaje si no hay usuario logeado
    function displayUserInfo(currentUser, handleLogout) {
        let userInfo = null;

         // Si hay un usuario logeado
        if (currentUser) {
            // Mostrar su información y el botón de cierre de sesión
            userInfo = (
                <>
                <p><strong>Email:</strong> {currentUser.email}</p>
                <Button type="button" className="w-100" onClick={handleLogout}>Cerrar sesión</Button>
                </>
            );
        } else {
            // Si no hay usuario logeado, mostrar un mensaje indicandolo
            userInfo = <p>No hay usuario logeado</p>;
        }

        return userInfo; // Devolver la información del usuario
    }

    // Llamar a la función displayUserInfo
    const userInfo = displayUserInfo(currentUser, handleLogout);


    return (
        <>
        <NavbarTop />
        
        <Card className='shadow my-3'>
            <Card.Body>
                <h2 className="text-center py-3">Usuario</h2>
                {error && <Alert variant="danger">{error}</Alert>}
                <div>{userInfo}</div>
            </Card.Body>
        </Card>
        <div className="bg-light border-5" style={{height:"1400px"}}></div>

        </>
    );
}
