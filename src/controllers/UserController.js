import { useRef, useState, useEffect } from "react";
import { useAuth } from "../services/AuthService";
import { auth, firestore } from "../config/firebase";
import { useNavigate, useLocation } from "react-router-dom";
import { registerLocale } from "react-datepicker";
import { es } from 'date-fns/locale/es';

/**
 * Custom hook para gestionar las funciones CRUD para los usuarios:
 *  -   (Create): CreateUser()
 *  -   (Retrieve): GetUserProfile()
 *  -   (Retrieve ALL): Se realiza en la barra de búsqueda en conjunto con el resto de colecciones <!TODO: mejorarlo y separarlo>
 *  -   (Update): EditUserData()
 *  -   (Delete): Se realiza a nivel de cuentas desde 'AccountController/handleDeleteAccount'
 */


/** Función CreateUser para crear un nuevo usuario en la vista 'CreateNewUser'
 * Maneja la interacción con los campos del formulario, la autenticación de usuario (con authService), y la validación de los datos ingresados.
 * Además, gestiona la visibilidad de un modal para la selección de la fecha de nacimiento.
 */
export function CreateUser() {
    // Obtiene el servicio de autenticación para registrar usuarios
    const { signup } = useAuth();

    // Navegación y location (obtiene el valor de '?...' de la url) de router
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

    // Estado para los instrumentos seleccionados
    const [selectedInstruments, setSelectedInstruments] = useState([]);

    // Función para manejar la selección / deselección de instrumentos y añadirlos al array
    const handleInstrumentSelection = (instrument) => {
        const isSelected = selectedInstruments.includes(instrument);
        if (isSelected) {
            setSelectedInstruments(prevInstruments => prevInstruments.filter(item => item !== instrument));
        } else {
            setSelectedInstruments(prevInstruments => [...prevInstruments, instrument]);
        }
    };

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
                // ! Mejorar el formato de capitalización (de esta forma no capitaliza segundos nombres o apellidos)
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
        nameRef, // Referencia al campo de nombre
        surnameRef, // Referencia al campo de apellidos
        selectedDate, // Fecha de nacimiento seleccionada
        maxDate, // Fecha máxima permitida
        selectedInstruments, // Instrumentos seleccionados
        handleSubmit, // Función para enviar el formulario
        navigate, // Función de navegación de React Router
        error, // Mensaje de error
        setSelectedDate, // Función para establecer la fecha seleccionada
        setSelectedInstruments, // Función para establecer los instrumentos seleccionados
        handleInstrumentSelection, // Maneja la selección de instrumentos en el modal
    };
}


/** Función EditUserData para editar los datos del usuario en la vista 'Profile'.
 * Maneja la interacción con los campos del formulario (nombre, apellidos e instrumentos).
 * Se podría ampliar permitiendo cambiar el email, contraseña o fecha de nacimiento.
 */
export function EditUserData() {
    const { currentUser } = useAuth(); // Obtiene el usuario actual autenticado
    const navigate = useNavigate(); // Función de navegación de React Router

    // Obtener datos del usuario y mensajes de error y confirmación
    const [account, setAccount] = useState(null);

    // Estado para los mensajes de error y éxito
    const [error, setError] = useState("");
    const [message, setMessage] = useState("");

    // Estado para controlar el modo de edición del perfil
    const [editing, setEditing] = useState(false); // Estado para indicar si el usuario está editando el perfil

    // Estado para almacenar los datos editados del perfil
    const [editedAccount, setEditedAccount] = useState({}); // Estado para almacenar los datos editados del perfil


    // Efecto para obtener los datos del usuario al cargar el componente o al cambiar el usuario actual
    useEffect(() => {
        // Función asincrónica para obtener los datos del usuario
        const fetchUserData = async () => {
            try {
                // Verifica si hay un usuario autenticado
                if (currentUser) {
                    const { uid } = currentUser; // Obtiene el ID del usuario actual
                    const userRef = firestore.collection("users").doc(uid); // Referencia al documento del usuario en Firestore
                    const userDoc = await userRef.get(); // Obtiene el documento del usuario

                    // Verifica si el documento del usuario existe en Firestore
                    if (userDoc.exists) {
                        const userData = userDoc.data(); // Obtiene los datos del usuario del documento
                        setAccount(userData); // Establece los datos del usuario
                        setEditedAccount(userData); // Establece los datos editados del usuario
                    } else {
                        setError("No se encontraron datos para este usuario"); // Mensaje de error si no se encuentran datos
                    }
                } else {
                    setAccount(null); // Establece los datos del usuario como nulos si no hay usuario autenticado
                }
            } catch (error) {
                setError("Error al cargar los datos del usuario"); // Mensaje de error si hay un error al cargar los datos del usuario
            }
        };
        fetchUserData(); // Llama a la función para obtener los datos del usuario al montar el componente o al cambiar el usuario actual
    }, [currentUser]); // Ejecuta el efecto cuando el usuario actual cambia


    // Función para activar el modo de edición del perfil
    const handleEdit = () => {
        setMessage(false);
        setEditing(true);
    };

    // Función para cancelar la edición del perfil
    const handleCancel = () => {
        setEditing(false);
    };

    // Función para manejar los cambios en los campos del formulario de edición
    const handleChange = (e) => {
        const { name, value } = e.target;
        setEditedAccount(prevAccount => ({
            ...prevAccount,
            [name]: value
        }));
    };

    // Función para manejar la selección de instrumentos
    const handleInstrumentChange = (instrument) => {
        // Verifica si el instrumento ya está en la lista
        if (editedAccount.selectedInstruments.includes(instrument)) {
            // Si ya existe, lo elimina de la lista
            setEditedAccount(prevAccount => ({
                ...prevAccount,
                selectedInstruments: prevAccount.selectedInstruments.filter(item => item !== instrument)
            }));
        } else {
            // Si no agrega el instrumento a la lista
            setEditedAccount(prevAccount => ({
                ...prevAccount,
                selectedInstruments: [...prevAccount.selectedInstruments, instrument]
            }));
        }
    };


    // Función asincrónica para guardar los cambios realizados en el perfil del usuario
    async function handleSaveChanges() {
        try {
            const user = auth.currentUser;
            const updateData = {}; // Objeto para almacenar los datos actualizados del usuario

            // Verifica si se han editado los campos de nombre y apellidos
            if (editedAccount.name !== undefined) {
                updateData.name = editedAccount.name; // Actualiza el nombre del usuario en el objeto de datos actualizados
            }

            if (editedAccount.surname !== undefined) {
                updateData.surname = editedAccount.surname; // Actualiza el apellido del usuario en el objeto de datos actualizados
            }

            // Verifica si se han modificado los instrumentos
            if (editedAccount.selectedInstruments !== undefined) {
                updateData.selectedInstruments = editedAccount.selectedInstruments; // Actualiza los instrumentos del usuario en el objeto de datos actualizados
            }

            // Verifica si se han realizado cambios en los datos del usuario
            if (Object.keys(updateData).length > 0) {
                await firestore.collection('users').doc(user.uid).update(updateData); // Actualiza los datos del usuario en la base de datos
                setAccount(editedAccount); // Establece los datos del usuario con los datos editados
                navigate("/mi-perfil"); // Redirecciona al usuario a su perfil
                setEditing(false); // Desactiva el modo de edición
                setMessage("Los datos se han actualizado correctamente."); // Mensaje de confirmación de la actualización exitosa
            } else {
                setMessage("No se realizaron cambios."); // Mensaje si no hay cambios para actualizar
            }
        } catch (error) {
            setError("Error al guardar los cambios."); // Mensaje de error si no se pueden guardar los cambios
        }
    }



    // Retorna los elementos necesarios para interactuar con el formulario de edición del perfil
    return {
        account, // Datos del usuario
        editedAccount, // Datos editados del usuario
        error, // Mensaje de error
        message, // Mensaje de confirmación
        editing, // Estado de edición del perfil
        handleEdit, // Función para activar el modo de edición
        handleCancel, // Función para cancelar la edición
        handleChange, // Función para manejar cambios en los campos
        handleInstrumentChange, // Función para manejar la selección de instrumentos
        handleSaveChanges, // Función para guardar los cambios
    }
}

/** 
 * Función GetUserProfile para obtener el perfil de un usuario específico.
 * Se utiliza para cargar los datos de los usuarios en la vista 'InfoUser'.
 */
export function GetUserProfile() {
    const [userProfile, setUserProfile] = useState(null);
    const [error, setError] = useState('');
    const location = useLocation();

    useEffect(() => {
        const getUserEmailFromURL = () => {
            const searchParams = new URLSearchParams(location.search);
            return searchParams.get('usuario');
        };

        const userEmail = getUserEmailFromURL();

        const fetchUserProfile = async () => {
            try {
                const userQuery = await firestore.collection("users").where("email", "==", userEmail).get();
                if (!userQuery.empty) {
                    const userData = userQuery.docs[0].data();
                    setUserProfile(userData);
                } else {
                    setError("No se encontraron datos para este usuario");
                }
            } catch (error) {
                setError("Error al cargar el perfil del usuario");
            }
        };

        fetchUserProfile();
    }, [location.search]);

    return {
        userProfile, // Datos del usuario buscado
        error, // Mensaje de error
    };
}
