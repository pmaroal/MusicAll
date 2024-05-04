import React, { useEffect, useState } from "react";
import { firestore } from "../config/firebase";
import { Modal, ListGroup, Badge, Form, Alert, Button, OverlayTrigger, Tooltip } from "react-bootstrap";
import { PersonCircle, MusicNoteList, PeopleFill, CalendarWeekFill, ArrowLeft } from "react-bootstrap-icons";
import { useAuth } from "../services/AuthService";
import { Link } from "react-router-dom";

function SearchBar({ showModal, handleCloseModal }) {
    const [searchResults, setSearchResults] = useState([]);
    const [selectedFilter, setSelectedFilter] = useState("users"); // Filtro 'users' por defecto
    const [searchText, setSearchText] = useState("");
    const [error, setError] = useState("");
    const { currentUser } = useAuth(); // Obtiene el usuario actual autenticado

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
                //<!TODO: hay que añadir el filtrado por grupos en canciones y eventos>
                // Seleccionar la colección adecuada según el filtro seleccionado
                if (selectedFilter === "users") {
                    query = firestore.collection("users");
                } else if (selectedFilter === "groups") {
                    query = firestore.collection("groups");
                } else if (selectedFilter === "songs") {
                    // Mostrar solo las canciones del usuario
                    query = firestore.collection("songs");  //.where("idUser", "==", currentUser.uid); ! Descomentar fuera de pruebas para restrigir los resultados
                } else if (selectedFilter === "events") {
                    // Mostrar solo los eventos del usuario y ordenarlas por fecha
                    query = firestore.collection("events").orderBy("date"); 
                    // .where("idUser", "==", currentUser.uid); <!TODO: configurar indices en Firestore para realizar queries compuestas>
                }
                

                // Obtener documentos de la colección seleccionada, limitando 'users' y 'groups' a 5 para una carga inicial más rápida.
                let querySnapshot = await query.get();
                if (selectedFilter === "users" || selectedFilter === "groups") {
                    querySnapshot = await query.limit(5).get();
                }
                

                // Filtrar los resultados solo si hay texto de búsqueda
                if (searchText) {
                    querySnapshot = await query.get();
                    // Convertir los documentos a datos
                    const allResults = querySnapshot.docs.map((doc) => doc.data());
                    // Filtrar los resultados localmente según el texto de búsqueda
                    let filteredResults = [];
                    if (selectedFilter === "users" || selectedFilter === "groups") {
                        filteredResults = allResults.filter(result =>
                            (result.name && result.name.toLowerCase().includes(searchText.trim().toLowerCase())) || // Buscar por nombre
                            (result.surname && result.surname.toLowerCase().includes(searchText.trim().toLowerCase())) || // Buscar por apellido
                            (result.email && result.email.toLowerCase().includes(searchText.trim().toLowerCase())) // Buscar por email
                        );
                    } else if (selectedFilter === "groups") {
                        filteredResults = allResults.filter(result =>
                            (result.nombre && result.nombre.toLowerCase().includes(searchText.trim().toLowerCase())) // Buscar por evento
                        );
                    } else if (selectedFilter === "events") {
                        filteredResults = allResults.filter(result =>
                            (result.event && result.event.toLowerCase().includes(searchText.trim().toLowerCase())) // Buscar por evento
                        );
                    } else if (selectedFilter === "songs") {
                        filteredResults = allResults.filter(result =>
                            (result.title && result.title.toLowerCase().includes(searchText.trim().toLowerCase())) // Buscar por título de canción
                        );
                    }

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
    }, [showModal, selectedFilter, searchText, currentUser.uid]);


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
            <Modal.Header className="gap-3">
                {/**Botón para volver atrás */}
                <Button
                    type="button"
                    variant="outline-dark"
                    className="border-0 pb-2 pt-1"
                    onClick={handleCloseModal}
                >
                    <ArrowLeft />
                </Button>

                <Form.Control
                    type="text"
                    placeholder="Buscar..."
                    value={searchText}
                    onChange={handleSearchChange}
                    className="rounded-pill bg-body-secondary"
                />

            </Modal.Header>
            <Modal.Body>
                <div className="row row-cols-auto justify-content-evenly gap-2 mb-3">
                    {/**Botones de filtro */}
                    {/**Filtro usuarios */}
                    <Badge
                        bg={selectedFilter === "users" ? "info" : "body-secondary text-dark"}
                        className="d-flex align-items-center gap-1 rounded-pill"
                        onClick={() => handleFilterChange("users")}
                        style={{ cursor: "pointer" }}
                    >
                        {getFilterIcon("users")} Usuarios
                    </Badge>

                    {/**Filtro grupos */}
                    <Badge
                        bg={selectedFilter === "groups" ? "info" : "body-secondary text-dark"}
                        className="d-flex align-items-center gap-1 rounded-pill"
                        onClick={() => handleFilterChange("groups")}
                        style={{ cursor: "pointer" }}
                    >
                        {getFilterIcon("groups")} Grupos
                    </Badge>

                    {/**Filtro repertorio */}
                    <Badge
                        bg={selectedFilter === "songs" ? "info" : "body-secondary text-dark"}
                        className="d-flex align-items-center gap-1 rounded-pill"
                        onClick={() => handleFilterChange("songs")}
                        style={{ cursor: "pointer" }}
                    >
                        {getFilterIcon("songs")} Repertorio
                    </Badge>

                    {/**Filtro eventos */}
                    <Badge
                        bg={selectedFilter === "events" ? "info" : "body-secondary text-dark"}
                        className="d-flex align-items-center gap-1 rounded-pill"
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
                        <ListGroup.Item key={index} className="container">
                            {/**Perfiles de usuario */}
                            {selectedFilter === 'users' && (
                                <Link className="link-unstyled text-reset text-decoration-none d-flex align-items-center gap-3"
                                    to={`/perfil?usuario=${result.email}`}
                                    onClick={handleCloseModal}
                                    >
                                    {getFilterIcon(selectedFilter)}
                                    <div className="d-grid">
                                        {result.name} {result.surname}
                                        <span className="rounded-pill bg-body-secondary text-muted small px-2">{result.email}</span>
                                    </div>
                                </Link>
                            )}

                            {/**Agrupaciones musicales */}
                            {selectedFilter === 'groups' && (
                                <>
                                    {getFilterIcon(selectedFilter)}
                                    {result.nombre} -
                                    Número de miembros: {result.nIntegrantes}
                                </>
                            )}

                            {/**Repertorio */}
                            {selectedFilter === 'songs' && (
                                <>
                                    {getFilterIcon(selectedFilter)}
                                    Nombre de la cancion
                                </>
                            )}

                            {/**Eventos */}
                            {selectedFilter === 'events' && (
                                <div className="d-grid">
                                    {/**Mostrar la fecha */}
                                    {result.date && (
                                        <span className="small fw-semibold text-capitalize">
                                            {result.date.toDate().toLocaleDateString('es-ES', {
                                                weekday: 'long',
                                                day: '2-digit',
                                                month: 'long',
                                                year: 'numeric',
                                            })}
                                        </span>
                                    )}

                                    <div className="row mt-2">
                                        {/**Mostrar la hora */}
                                        {result.date && (
                                            <span className="col-auto me-1 small fw-semibold">
                                                {result.date.toDate().toLocaleTimeString('es-ES', {
                                                    hour: '2-digit',
                                                    minute: '2-digit'
                                                })}
                                            </span>
                                        )}

                                        {/**Colorear según el tipo de evento */}
                                        <OverlayTrigger
                                            trigger={["hover", "focus"]}
                                            placement="top"
                                            overlay={<Tooltip id="tooltip">{result.event}</Tooltip>}
                                        >
                                            <span className={`col px-1 rounded-2 bg-${result.event === 'Concierto' ? 'warning' :
                                                result.event === 'Ensayo' ? 'success' :
                                                    'body-secondary'}`}>
                                            </span>
                                        </OverlayTrigger>

                                        {/**Nombre del evento */}
                                        <span className="col-auto">Nombre del evento</span>
                                    </div>
                                </div>
                            )}
                        </ListGroup.Item>
                    ))}
                </ListGroup>

            </Modal.Body >
        </Modal >
    );
}

export default SearchBar;
