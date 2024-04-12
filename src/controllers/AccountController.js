import React, { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import { useAuth } from "../services/AuthService";
import AccountModel from "../models/AccountModel";

function useAccountController() {
    const { currentUser, logout } = useAuth();
    const [account, setAccount] = useState(null);
    const [error, setError] = useState("");

    // Definir el React-Router para navegar entre rutas
    const navigate = useNavigate();

    useEffect(() => {
        if (currentUser) {
            const { email } = currentUser;
            const account = new AccountModel(email, "Nombre de Usuario");
            setAccount(account);
        } else {
            setAccount(null);
        }
    }, [currentUser]);

    const handleLogout = async () => {
        try {
            await logout();
            navigate("/")
        } catch (error) {
            setError("No se ha podido cerrar la sesión");
        }
    };

    return { account, logout: handleLogout, error };
}

export default useAccountController;
