import { useState, useEffect } from 'react';
import { useAuth } from "../services/AuthService";
import { firestore } from '../config/firebase';

/**
 * Custom hook para gestionar las funciones CRUD para los Grupos Musicales:
 *  -   (Create): CreateGroup()
 *  -   (Retrieve ALL): Se realiza en la barra de búsqueda en conjunto con el resto de colecciones <!TODO: mejorarlo y separarlo>
 *  -   (Update): TODO!
 *  -   (Delete): TODO!
 */
export function CreateGroup() {
    const { currentUser } = useAuth(); // Cargar los datos del usuario actual

    const [groupName, setGroupName] = useState(''); // Estado para almacenar el nombre del grupo
    const [members, setMembers] = useState([]); // Estado para almacenar los miembros del grupo
    const [selectedEvents, setSelectedEvents] = useState([]); // Estado para almacenar los eventos
    const [selectedSongs, setSelectedSongs] = useState([]); // Estado para almacenar el repertorio del grupo

    // Estados para la función de búsqueda en el paso 2 (Añadir nuevos miembros al grupo)
    const [searchInput, setSearchInput] = useState(''); // Indica si hay texto en la barra de búsqueda
    const [searchResults, setSearchResults] = useState([]); // Almacena los usuarios encontrados para mostrarlos
    const [usersData, setUsersData] = useState([]); // Almacena la información de los usuarios buscados y seleccionados

    const [step, setStep] = useState(1); // Estado para mostrar el progreso del formulario

    const [error, setError] = useState(''); // Estado para mostrar mensajes de error


    // Función asíncrona para manejar el avance al siguiente paso del formulario al clicar el botón 'Siguiente'
    const handleNextStep = async () => {

        // En el primer paso, verifica si se ha ingresado un nombre para el grupo y muestra un error si ya existe en la DB
        if (step === 1) {
            // Muestra un mensaje de error si no se ha ingresado un nombre
            if (!groupName.trim()) {
                setError('Por favor, introduce un nombre para el grupo.');
                return;
            }

            // Consulta Firestore para verificar si ya existe un grupo con el mismo nombre
            const groupRef = firestore.collection("groups").where("nombre", "==", groupName.trim());
            const groupSnapshot = await groupRef.get();

            // Si ya existe un grupo con el mismo nombre, muestra un mensaje de error
            if (!groupSnapshot.empty) {
                setError(`Ya existe un grupo llamado "${groupName}". Por favor, elige otro nombre.`);
                return;
            }
        }

        // Si no hay errores, avanza al siguiente paso y reinicia cualquier mensaje de error
        setError('');
        setStep(step + 1);
    };

    // Maneja el retroceso al paso anterior del formulario al clicar el botón 'Anterior'
    const handlePreviousStep = () => {
        setStep(step - 1);
    };

    /** 
     * Funciones para manejar la búsqueda, visualización y selección de los usuarios
     */

    useEffect(() => {
        // Define una función asincrónica para obtener los datos de los usuarios de Firestore
        const fetchUsers = async () => {
            try {
                // Realiza una consulta a la colección 'users' en Firestore y espera la respuesta
                const querySnapshot = await firestore.collection('users').get();
                // Mapea los documentos del snapshot a sus datos correspondientes y almacénalos en 'users'
                const users = querySnapshot.docs.map(doc => doc.data());
                // Actualiza el estado 'usersData' con el array de usuarios obtenido de Firestore
                setUsersData(users);
            } catch (error) {
                // Maneja cualquier error que ocurra durante la obtención de datos e imprímelo en la consola
                console.error('Error buscando usuarios: ', error);
            }
        };

        // Llama a la función 'fetchUsers' al montar el componente para obtener los datos de Firestore
        fetchUsers();
    }, []); // Ejecuta este efecto solo una vez, después del montaje del componente

    // Maneja el cambio en el campo de búsqueda de usuarios para invitar al grupo
    const handleSearchInputChange = (e) => {
        setSearchInput(e.target.value);
        // Cuando se escribe algo en el form control, busca y filtra los usuarios por email
        if (e.target.value.trim() !== '') {
            // Filtrado de usuarios disponibles para invitar
            const filteredUsers = usersData.filter((user) =>
                user.email.includes(e.target.value) // Muestra usuarios cuyo email coincide con la búsqueda
                && !members.includes(user.email)    // Excluye usuarios que ya se hayan añadido al array 'members'
                && user.email !== currentUser.email // Excluye al usuario actual (ya que será el admin del grupo)
            );
            // Limita los resultados a mostrar solo los primeros 3 cotando el array
            const limitedResults = filteredUsers.slice(0, 3);
            setSearchResults(limitedResults);
        } else {
            setSearchResults([]); // Si no hay texto en el campo de búsqueda, no se muestra ningún resultado
        }
    };

    // Maneja la incorporación de un nuevo miembro al grupo
    const handleAddMember = (email) => {
        setMembers((prevMembers) => [...prevMembers, email]); // Agrega el nuevo miembro al estado de miembros
        setSearchInput(''); // Limpia el campo de búsqueda después de agregar un miembro
        setSearchResults([]); // Limpia los resultados de la búsqueda después de agregar un miembro
    };

    // Maneja el cambio en el estado de un miembro seleccionado (marcado/desmarcado)
    const handleToggleMember = (index, checked) => {
        setMembers((prevMembers) => {
            if (!checked) {
                // Si el miembro ha sido desmarcado, elimínalo del estado de miembros
                const updatedMembers = [...prevMembers]; // Crea una copia del array para reiniciar el índice y que no se desmarquen usuarios no clicados
                updatedMembers.splice(index, 1);
                return updatedMembers;
            }
            return prevMembers;
        });
    };

    // Maneja la pérdida de foco del campo de búsqueda para ocultar el desplegable con los usuarios encontrados
    const handleSearchInputBlur = () => {
        // Establece un retraso para que cuando se seleccionan usuarios del desplegable puedan marcarse antes de que este desaparezca
        // Si no, al seleccionar un usuario instantáneamente pierde el foco y no se selecciona.
        setTimeout(() => {
            setSearchResults([]);
            setSearchInput(''); // Limpia el campo de búsqueda
        }, 100); // Limpia los resultados de la búsqueda cuando el campo de búsqueda pierde el foco después de 100ms
    };

    // Función para manejar el envío del formulario
    // TODO! Hacerlo...
    const handleSubmit = (event) => {
        event.preventDefault();
        console.log("Aún no se ha implementado el envío del formulario");
        setError(<>En desarrollo... &#128293;&#128187;</>);

        
    };

    return {
        step, // Paso en el que se encuentra el formulario
        handleNextStep, // Función para manejar el avance del formulario
        handlePreviousStep, // Función para manejar el retroceso del formulario
        currentUser, // Usuario actual, por defecto será el admin del grupo
        groupName, // Nombre de la agrupación musical creada
        setGroupName, // Estado para almacenar el nombre del grupo
        members, // Array con los emails de los músicos invitados
        handleAddMember, // Función para añadir nuevos miembros al array 'members'
        handleToggleMember, // Función para manejar los checkboxes del array 'members' y eliminarlos del array
        searchInput, // Texto en la barra de búsqueda
        handleSearchInputChange, // Actualiza los resultados del dropdown cuando se escribe en la barra de búsqueda
        handleSearchInputBlur, // Esconde la barra de búsqueda cuando pierde el foco
        searchResults, // Array con los resultados de la busqueda que se muestran en el dropdown
        selectedEvents, //TODO! Por implementar
        setSelectedEvents, //TODO! Por implementar
        selectedSongs, //TODO! Por implementar
        setSelectedSongs, //TODO! Por implementar
        error, // Mensajes de error
        handleSubmit //TODO! Por implementar
    }
}
