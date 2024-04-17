import { useRef, useState, useEffect } from "react";
import { useAuth } from "../services/AuthService";
import { useNavigate, useLocation } from "react-router-dom";
import { registerLocale } from "react-datepicker";
import { es } from 'date-fns/locale/es';

/**
 * Custom hook para gestionar la lógica del formulario de registro de usuarios.
 * Maneja la interacción con los campos del formulario, la autenticación de usuario (con authService), y la validación de los datos ingresados.
 * Además, gestiona la visibilidad de un modal para la selección de la fecha de nacimiento.
 */
export default function useUserController() {
    // Obtiene el servicio de autenticación para registrar usuarios
    const { signup } = useAuth();

    // Navegación y ubicación del router
    const navigate = useNavigate();
    const location = useLocation();

    // Estado para gestionar mensajes de error
    const [error, setError] = useState("");

    // Referencias a los campos del formulario
    const nameRef = useRef();
    const surnameRef = useRef();

    // Estado para la fecha de nacimiento seleccionada
    const [selectedDate, setSelectedDate] = useState(null);

    // Estado para la fecha máxima permitida
    const [maxDate, setMaxDate] = useState(new Date());

    // Calendario en local-ES (idioma y comienza en lunes)
    registerLocale('es', es);

    // Efecto para establecer la fecha máxima permitida al cargar el componente
    useEffect(() => {
        const today = new Date();
        setMaxDate(today);
    }, []);

    // Estado para controlar la visibilidad del modal
    const [showModal, setShowModal] = useState(false); 

    // Función para mostrar el modal de selección de fecha
    const handleShowModal = () => { setShowModal(true); }; 

    // Función para cerrar el modal de selección de fecha
    const handleCloseModal = () => { setShowModal(false); }; 

    // Estado para los instrumentos seleccionados
    const [selectedInstruments, setSelectedInstruments] = useState([]);

    // Función para manejar el envío del formulario
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            setError("");

            const { state } = location;
            const email = state.email;
            const password = state.password;

            // Registro del usuario con los datos proporcionados
            await signup(email, password, {
                // ! Mejorar el formato de capitalización
                // Se puede usar la clase de Bootstrap text-capitalize para poner en mayús la primera letra de cada palabra, pero se guardaría en minúsculas en la db
                name: nameRef.current.value.charAt(0).toUpperCase() + nameRef.current.value.slice(1),
                surname: surnameRef.current.value.charAt(0).toUpperCase() + surnameRef.current.value.slice(1),
                birthDate: selectedDate,
                selectedInstruments: selectedInstruments
            });

            // Redireccionar a inicio después de registrarse
            navigate("/");
        } catch (error) {
            // Manejo de errores durante el registro
            setError("Error al crear la cuenta.");
        }
    }

    // Retorna los elementos necesarios para interactuar con el formulario y el modal
    return {
        nameRef,
        surnameRef,
        selectedDate,
        maxDate,
        selectedInstruments,
        handleSubmit,
        error,
        setSelectedDate,
        setSelectedInstruments,
        showModal,
        handleShowModal,
        handleCloseModal
    };
}
