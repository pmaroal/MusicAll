import React, { useState } from 'react';
import { Button, Dropdown, Table, Card, OverlayTrigger, Tooltip, ListGroup, } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { GetGroupInfo, DeleteGroup, EditGroup } from '../controllers/MusicalGroupController';
import { CalendarEvent, ChevronLeft, Clock, GeoAlt, PencilSquare, PersonGear, PlusLg, Save, XLg } from 'react-bootstrap-icons';
import ModalConfirmation from '../components/ModalConfirmation';
import { GetUserEvents } from '../controllers/EventController';

export default function InfoGroup() {

    const {
        navigate,
        currentUser, // Datos del usuario actual
        groupMembers, // Objeto con un listado de usuarios en un grupo
        selectedGroup, // Datos del grupo seleccionado
    } = GetGroupInfo();


    // Llamar al Hook EditGroup del MusicalGroupController para modificar los datos del grupo
    const {
        roleInBand, // Atributo del rol en la banda por instrumento
        handleRoleSelection, // Manejar el rol en la banda
        // inviteUserToGroup,  // Función para añadir un nuevo miembro al grupo <!TODO: Sin implementar todavía>
        leaveGroup, // Función para manejar la salida del grupo de un usuario
    } = EditGroup();

    // Llamar al Hook DeleteGroup del MusicalGroupController para elimnar el grupo
    const {
        deleteGroup, // Función para eliminarlo
    } = DeleteGroup();

    const {
        events,
    } = GetUserEvents();

    const [editing, setEditing] = useState(false); // Estado para el modo edición
    const [showConfirmation, setShowConfirmation] = useState(false); // Estados para el modal de confirmación (al borrar un grupo)


    // Función para manejar el modo edición en forma de toggle
    const toggleEditMode = () => {
        setEditing(editing => !editing);
    }

    // Función para asociar un instrumento a una imagen (código DEC de emojis en UTF-8), para que se vea más bonito
    const getEmojiForInstrument = (instrument) => {
        switch (instrument) {
            case 'Voz': return <span>&#127908;</span>;
            case 'Guitarra': return <span>&#127928;</span>;
            case 'Trompeta': return <span>&#127930;</span>;
            case 'Teclado': return <span>&#127929;</span>;
            case 'Batería': return <span>&#129345;</span>;
            case 'Violín': return <span>&#127931;</span>;
            case 'Saxofón': return <span>&#127927;</span>;
            default: return '';
        }
    };

    return (
        <>
            {selectedGroup && (
                <>
                    <div className='d-flex flex-wrap gap-2 pt-3'>
                        <Button
                            variant="outline-dark"
                            className='float-start border-0'
                            onClick={() => navigate('/mis-grupos')}
                        >
                            <ChevronLeft className='mb-1' />
                        </Button>

                        <h2 className='mx-auto'>{selectedGroup.name}</h2>

                    </div>

                    {/**Tarjeta con información del grupo seleccionado a partir de la URL */}
                    <Card key={selectedGroup.id} className='my-3'>
                        {/**Encabezado de la Card con detalles e info del grupo
                     * <!TODO: Mejorar presentación>
                     */}
                        <Card.Header className='d-flex flex-wrap flex-column column-gap-3'>
                            <p><strong>Fecha de creación: </strong>{selectedGroup.creationDate.split(',')[0]}</p>
                            <p><strong>Número de miembros: </strong>{groupMembers[selectedGroup.id]?.length || 0}</p>
                        </Card.Header>

                        {/**Cuerpo de la Card con los detalles de los miembros, canciones y eventos del grupo */}
                        <Card.Body>
                            {/**Tabla con información de los miembros */}
                            <Table striped hover size='sm' className='mb-3'>
                                <thead>
                                    <tr>
                                        <th colSpan={2}>
                                            {/**Encabezado de Miembros del Grupo */}
                                            <h4>Miembros del grupo:

                                                {/**Si el usuario es el Admin aparece un botón para activar el 'modo edición' */}
                                                {selectedGroup.admin === currentUser.uid && (
                                                    <>
                                                        {/**Si no está en modo edición muestra el botón de 'editar' */}
                                                        {!editing ? (
                                                            <Button
                                                                type='button'
                                                                variant='outline-dark'
                                                                className='btn-sm float-end border-0'
                                                                onClick={toggleEditMode}
                                                            >
                                                                Editar <PencilSquare className='mb-1' />
                                                            </Button>
                                                        ) : ( //Si esta en 'edición' muestra el botón de 'guardar cambios'
                                                            <Button
                                                                type='button'
                                                                variant='outline-dark'
                                                                className='btn-sm float-end border-0'
                                                                onClick={toggleEditMode} // <!TODO: por ahora también funciona solo de toggle>
                                                            >
                                                                Guardar <Save className='mb-1' />
                                                            </Button>
                                                        )}
                                                    </>
                                                )}
                                            </h4>
                                        </th>
                                    </tr>
                                </thead>

                                {/**Cuerpo de la tabla con todos los miembros del grupo */}
                                <tbody>
                                    {groupMembers[selectedGroup.id]?.map((member, memberIndex) => (
                                        <tr key={memberIndex}>
                                            <td className='col-1 border-end'>

                                                {/**Dropdown con los instrumentos de cada músico */}
                                                <Dropdown>
                                                    <Dropdown.Toggle id={`dropdown-basic-${memberIndex}`}
                                                        variant="transparent"
                                                        className="w-100 rounded-0 border-0"
                                                        disabled={!editing || member.instruments.length === 0} // Si no está activado el modo edición o el usuario no tiene instrumentos lo desabilita
                                                    >
                                                        {/**Muestra el instrumento seleccionado */}
                                                        {roleInBand[member.uid] ? getEmojiForInstrument(roleInBand[member.uid]) : ''}
                                                    </Dropdown.Toggle>

                                                    {/**Menú del dropdown con todos los instrumentos de cada músico */}
                                                    {member.instruments.length > 0 && (
                                                        <Dropdown.Menu>
                                                            {member.instruments.map((instrument, instrumentIndex) => (
                                                                <Dropdown.Item
                                                                    key={instrumentIndex}
                                                                    onClick={() => handleRoleSelection(member.uid, instrument)}
                                                                    className="d-flex align-items-center"
                                                                >
                                                                    {getEmojiForInstrument(instrument)} <span className="ms-2">{instrument}</span>
                                                                </Dropdown.Item>
                                                            ))}
                                                            {/**Botón de resetear instrumento seleccionado */}
                                                            <Dropdown.Divider />
                                                            <Dropdown.Item onClick={() => handleRoleSelection(member.uid, "")} className="text-center small font-monospace">
                                                                Reset
                                                            </Dropdown.Item>
                                                        </Dropdown.Menu>
                                                    )}
                                                </Dropdown>
                                            </td>

                                            {/**Columna con el resto de datos del músico */}
                                            <td className='align-content-center ps-2 fw-semibold'>
                                                {/**Datos personales, al clicarlo lleva a su perfil */}
                                                <Link to={`/perfil?usuario=${member.email}`} className='text-reset '>
                                                    {member.name} {member.surname}
                                                </Link>

                                                {/**Si el usaurio es el admin muestra una badge indicándolo, con un overlay */}
                                                {member.role === 'admin' &&
                                                    <OverlayTrigger overlay={<Tooltip className='text-capitalize'>{member.role}</Tooltip>}>
                                                        <span className="badge bg-warning-subtle border text-reset p-1 ms-2"><PersonGear /></span>
                                                    </OverlayTrigger>
                                                }

                                                {/**Si es el propio usuario muestra un botón para salir del grupo, a no ser que sea el admin
                                                 * <!TODO: Pensar una forma mejor para que el admin salga del grupo y promocione a otro a admin>
                                                 */}
                                                {(member.uid === currentUser.uid) && (member.role !== 'admin') && (
                                                    <Button className='btn-sm float-end'
                                                        variant='outline-secondary'
                                                        onClick={() => leaveGroup(currentUser.uid, selectedGroup.id)}
                                                    >
                                                        <XLg className='mb-1' />
                                                    </Button>
                                                )}
                                            </td>
                                        </tr>
                                    ))}

                                    {/**Fila que se activa en modo edición para añadir músicos
                                    * <!TODO: Sin implementar>
                                     */}
                                    {editing && (
                                        <tr>
                                            <td colSpan={2}>
                                                <Button
                                                    variant='transparent'
                                                    className='btn-sm w-100 text-muted'
                                                    onClick={() => console.log('Aun no se ha añadido la funcionalidad para añadir usuarios desde esta pantalla')}
                                                >
                                                    <PlusLg className='mb-1' /> Invitar músicos
                                                </Button>
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </Table>


                            {/**<!TODO: Crear tablas con el resto de elementos -> Repertorio y Eventos> */}
                            {/**Mapeo de todos los eventos del usuario y sus grupos */}
                            <h4 className='mt-4'>Eventos planificados:</h4>
                            
                            <ListGroup>
                            {events.map(event => (
                                <ListGroup.Item key={event.id} 
                                    className={`d-flex flex-wrap flex-row justify-content-between column-gap-2 
                                        ${event.date < new Date().toLocaleDateString() ? 'bg-body-secondary' : ''}`}
                                    >
                                    {/**Encabezado del evento */}
                                    <div className='col'>
                                        {/**Tipo de evento (concierto = amarillo, ensayo = verde) */}
                                        <OverlayTrigger
                                            trigger={["hover", "focus"]}
                                            placement="top"
                                            overlay={<Tooltip id="tooltip" className='text-capitalize'>{event.type}</Tooltip>}
                                        >
                                            <span className={`px-1 me-2 rounded-2 bg-${event.type === 'concierto' ? 'warning'
                                                : event.type === 'ensayo' ? 'success'
                                                    : 'body-secondary'}`}>
                                            </span>
                                        </OverlayTrigger>
                                        {/**Nombre del evento */}
                                        <span className='fw-semibold'>{event.title}</span>
                                    </div>

                                    {/**Datos del evento */}
                                    <div className='col d-flex flex-wrap column-gap-3'>
                                        {/**Comprueba si existen los datos antes de mostrarlos */}
                                        {event.date &&
                                            // Fecha del evento
                                            <span className='text-nowrap'><CalendarEvent className='mb-1 me-1' /> {event.date}</span>
                                        }
                                        {event.time &&
                                            // Hora del evento
                                            <span className='text-nowrap'><Clock className='mb-1 me-1' /> {event.time}</span>
                                        }
                                        {event.location &&
                                            // Ubicación del evento
                                            <span className='text-nowrap'><GeoAlt className='mb-1 me-1' /> {event.location}</span>
                                        }
                                    </div>
                                </ListGroup.Item>
                            ))}
                            </ListGroup>
                        </Card.Body>

                        {/**En modo edición, mostrar un footer con la opción de eliminar grupo */}
                        {editing && (
                            <Card.Footer
                                className='btn btn-sm btn-outline-danger border-0 w-100'
                                onClick={() => setShowConfirmation(
                                    <ModalConfirmation
                                        showModal={showConfirmation}
                                        closeModal={() => setShowConfirmation(false)}
                                        action={() => deleteGroup(selectedGroup.groupId)}
                                        actionTxt={<>eliminar el grupo <span className='text-nowrap text-decoration-underline'>{selectedGroup.name}</span></>}
                                    />
                                )}
                            >
                                Eliminar grupo
                            </Card.Footer>
                        )}
                    </Card>
                </>
            )}
        </>
    )
}
