import React, { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import { useAuth } from "../services/AuthService";
import AccountModel from "../models/AccountModel";
import { firestore } from "../config/firebase";

function useAccountController() {
    const { currentUser, logout } = useAuth();
    const [account, setAccount] = useState(null);
    const [error, setError] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                if (currentUser) {
                    const { uid } = currentUser; // Obtén el ID de usuario
                    const userRef = firestore.collection("users").doc(uid); // Referencia al documento de usuario en Firestore
                    const userDoc = await userRef.get(); // Obtiene los datos del documento

                    if (userDoc.exists) {
                        const userData = userDoc.data(); // Datos del usuario
                        const { email, name, surname, birthDate, selectedInstruments } = userData;
                        const accountData = new AccountModel(email, name, surname, birthDate, selectedInstruments);
                        setAccount(accountData);
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

    const handleLogout = async () => {
        try {
            await logout();
            navigate("/");
        } catch (error) {
            setError("No se ha podido cerrar la sesión");
        }
    };

    return { account, logout: handleLogout, error };
}

export default useAccountController;
