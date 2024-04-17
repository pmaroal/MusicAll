import React, { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import { useAuth } from "../services/AuthService";
import AccountModel from "../models/AccountModel";
import { firestore } from "../config/firebase";

/**
 * Custom hook para gestionar la lógica relacionada con la cuenta de usuario.
 * Maneja la obtención de datos del usuario desde Firestore, el cierre de sesión y la gestión de errores.
 */
function useAccountController() {
    // Obtiene el usuario actual y la función de cierre de sesión del servicio de autenticación
    const { currentUser, logout } = useAuth();
    
    // Estado para almacenar los datos de la cuenta del usuario
    const [account, setAccount] = useState(null);
    
    // Estado para gestionar los mensajes de error
    const [error, setError] = useState(""); 
    
    // Función de navegación
    const navigate = useNavigate();

    // Efecto para obtener y actualizar los datos del usuario
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
                        const { email, name, surname, birthDate, selectedInstruments } = userData;

                        // Crea una instancia de AccountModel con los datos del usuario
                        const accountData = new AccountModel(email, name, surname, birthDate, selectedInstruments);
                        
                        // Actualiza el estado con los datos de la cuenta del usuario
                        setAccount(accountData);

                    // Mensaje de error si no se encuentran datos para el usuario
                    } else {
                        setError("No se encontraron datos para este usuario");
                    }

                // Si no hay usuario logueado, establece la cuenta como null
                } else {
                    setAccount(null);
                }

            // Mensaje de error en caso de error al cargar los datos del usuario
            } catch (error) {
                setError("Error al cargar los datos del usuario");
            }
        };

        // Llama a la función para obtener y actualizar los datos del usuario
        fetchUserData();
    }, [currentUser]); // Efecto se ejecuta cada vez que currentUser cambia

    // Función para manejar el cierre de sesión
    const handleLogout = async () => {
        try {
            await logout(); // Cierra la sesión del usuario
            navigate("/"); // Redirige al usuario a la página de inicio
        } catch (error) {
            setError("No se ha podido cerrar la sesión"); // Mensaje de error en caso de fallo al cerrar sesión
        }
    };

    // Retorna los datos de la cuenta del usuario, la función de cierre de sesión y el mensaje de error
    return { account, logout: handleLogout, error };
}

export default useAccountController; // Exporta el hook
