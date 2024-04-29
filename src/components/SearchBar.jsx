import React, { useEffect, useState } from "react";
import { firestore } from "../config/firebase";
import { Modal, ListGroup, Badge, Form, Alert } from "react-bootstrap";
import { PersonCircle, MusicNoteList, PeopleFill, CalendarWeekFill } from "react-bootstrap-icons";

function SearchBar({ showModal, handleCloseModal }) {
    const [searchResults, setSearchResults] = useState([]);
    const [selectedFilter, setSelectedFilter] = useState("users"); // Filtro 'users' por defecto
    const [searchText, setSearchText] = useState("");
    const [error, setError] = useState("");

    /**
     * !TODO:
     *  -   Mejorar la función de búsqueda, en un fichero específico para ello.
     *  -   Añadir acciones al hacer clic en cada resultado de búsqueda
     *  -   Añadir botones de acciones rápidas en cada resultado de búsqueda
     *  -   Actualizar los campos de búsqueda y ajustarlo al resto de categorías (ahora solo muestra data de users, el resto vacíos)
    */
    

    useEffect(() => {
        // Función asincrónica para obtener datos de Firestore
        const fetchData = async () => {
            try {
                let query;
                // Seleccionar la colección adecuada según el filtro seleccionado
                if (selectedFilter === "users") {
                    query = firestore.collection("users");
                } else if (selectedFilter === "groups") {
                    query = firestore.collection("groups");
                } else if (selectedFilter === "songs") {
                    query = firestore.collection("songs");
                } else if (selectedFilter === "events") {
                    query = firestore.collection("events");
                }
    
                // Obtener todos los documentos de la colección seleccionada
                const querySnapshot = await query.get();
    
                // Filtrar los resultados solo si hay texto de búsqueda
                if (searchText) {
                    // Convertir los documentos a datos
                    const allResults = querySnapshot.docs.map((doc) => doc.data());
                    // Filtrar los resultados localmente según el texto de búsqueda
                    const filteredResults = allResults.filter(result =>
                        result.name.toLowerCase().includes(searchText.trim().toLowerCase()) // Buscar por nombre
                        || result.surname.toLowerCase().includes(searchText.trim().toLowerCase()) // Buscar por apellido
                        || result.email.toLowerCase().includes(searchText.trim().toLowerCase()) // Buscar por email
                        
                    );
                    // Establecer los resultados filtrados en el estado
                    setSearchResults(filteredResults);
                    if (filteredResults.length === 0) {
                        setError("No se han encontrado datos con tu búsqueda.");
                    } else {
                        setError(""); // Limpiar el mensaje de error si se encuentran resultados
                    }
                } else {
                    // Convertir los documentos a datos
                    const allResults = querySnapshot.docs.map((doc) => doc.data());
                    // Establecer todos los resultados en el estado
                    setSearchResults(allResults);
                    setError(""); // Limpiar el mensaje de error si se encuentran resultados
                }
            } catch (error) {
                setError("Error al obtener los resultados: " + error.message);
            }
        };
    
        // Ejecutar la función fetchData cuando el modal esté visible
        if (showModal) {
            fetchData();
        }
    }, [showModal, selectedFilter, searchText]);

    // Función para cambiar el filtro seleccionado
    const handleFilterChange = (filter) => {
        setSelectedFilter(filter);
        setSearchText(""); // Limpiar el texto de búsqueda al cambiar el filtro
    };

    // Función para manejar cambios en el texto de búsqueda
    const handleSearchChange = (e) => {
        setSearchText(e.target.value);
        setError(""); // Limpiar el mensaje de error al cambiar el texto de búsqueda
    };

    // Función para obtener el icono correspondiente al filtro seleccionado
    const getFilterIcon = (filter) => {
        switch (filter) {
            case "users":
                return <PersonCircle />;
            case "groups":
                return <PeopleFill />;
            case "songs":
                return <MusicNoteList />;
            case "events":
                return <CalendarWeekFill />;
            default:
                return null;
        }
    };

    return (
        <Modal show={showModal} onHide={handleCloseModal} fullscreen>
            <Modal.Header className="mx-2 gap-4" closeButton>
                <Form.Control
                    type="text"
                    placeholder="Buscar..."
                    value={searchText}
                    onChange={handleSearchChange}
                    className="rounded-pill bg-body-tertiary"
                />
            </Modal.Header>
            <Modal.Body>
                <div className="d-flex justify-content-center gap-3 mb-3">
                    {/**Botones de filtro */}
                    {/**Filtro usuarios */}
                    <Badge
                        bg={selectedFilter === "users" ? "success" : "secondary"}
                        className="d-flex align-items-center gap-2 rounded-pill"
                        onClick={() => handleFilterChange("users")}
                        style={{ cursor: "pointer" }}
                    >
                        {getFilterIcon("users")} Usuarios
                    </Badge>

                    {/**Filtro grupos */}
                    <Badge
                        bg={selectedFilter === "groups" ? "success" : "secondary"}
                        className="d-flex align-items-center gap-2 rounded-pill"
                        onClick={() => handleFilterChange("groups")}
                        style={{ cursor: "pointer" }}
                    >
                        {getFilterIcon("groups")} Grupos
                    </Badge>

                    {/**Filtro repertorio */}
                    <Badge
                        bg={selectedFilter === "songs" ? "success" : "secondary"}
                        className="d-flex align-items-center gap-2 rounded-pill"
                        onClick={() => handleFilterChange("songs")}
                        style={{ cursor: "pointer" }}
                    >
                        {getFilterIcon("songs")} Repertorio
                    </Badge>

                    {/**Filtro eventos */}
                    <Badge
                        bg={selectedFilter === "events" ? "success" : "secondary"}
                        className="d-flex align-items-center gap-2 rounded-pill"
                        onClick={() => handleFilterChange("events")}
                        style={{ cursor: "pointer" }}
                    >
                        {getFilterIcon("events")} Eventos
                    </Badge>
                </div>

                {/**Mostrar mensaje de error si no se encuentra nada en la búsqueda */}
                {error && <Alert variant="danger" className="container">{error}</Alert>}

                {/**Lista de resultados */}
                <ListGroup variant="flush">
                    {searchResults.map((result, index) => (
                        <ListGroup.Item key={index} className="d-flex align-items-center w-100 py-3 gap-3">
                            {getFilterIcon(selectedFilter)}
                            <div className="d-grid">
                                {result.name} {result.surname}
                            <span className="rounded-pill bg-body-secondary small px-2">{result.email}</span>
                            </div>
                        </ListGroup.Item>
                    ))}
                </ListGroup>
            </Modal.Body>
        </Modal>
    );
}

export default SearchBar;
