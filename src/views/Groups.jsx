import React, { useState } from 'react';
import { Alert, Button, Dropdown, Table, Container, Card, OverlayTrigger, Tooltip, Nav } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { GetGroupInfo, DeleteGroup, EditGroup } from '../controllers/MusicalGroupController';
import { PencilSquare, PersonGear, PlusLg, Save, XLg } from 'react-bootstrap-icons';
import ModalConfirmation from '../components/ModalConfirmation';

// Componente para mostrar los datos de los grupos, editarlos y elimnarlos en la pantalla '/mis-grupos'
export default function Groups() {

    /**<!TODO: Cada función tiene un 'error' distinto y como son de tipo 'const' no se pueden importar todos así que hay que ver como corregirlo> */

    // Llamar al Hook GetGroupInfo del MusicalGroupController para obtener los datos de los grupos del usuario
    const {
        navigate, // Permite navegar entre pantallas
        currentUser, // Datos del usuario actual
        userGroups, // Listado de grupos del usuario
        groupMembers, // Objeto con un listado de usuarios en un grupo
        selectedGroup, // Datos del grupo seleccionado
        setSelectedGroup, // Estado para indicar el grupo seleccionado
        error, // Mensaje de error
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
        <Container className='pt-3'>
            {/**Encabezado de la vista con el título y un botón para crear grupos */}
            <div className='d-flex flex-wrap-reverse justify-content-center justify-content-sm-between gap-2 mb-2'>
                <h2>Mis grupos</h2>

                {/**Botón 'Crear Nuevo Grupo' */}
                <Button variant='primary' className='ms-auto' onClick={() => navigate("/crear-grupo")}>
                    <PlusLg className='mb-1' /> Nuevo grupo
                </Button>
            </div>

            <hr />

            {/**Si el usuario pertenece a algún grupo, muestra una lista de todos sus grupos */}
            {userGroups.length > 0 ? (
                <Nav variant="pills" className='justify-content-center column-gap-2 my-3'>
                    {userGroups.map((group, index) => (
                        <Nav.Item key={index}>
                            <Link
                                key={index}
                                to={`/mis-grupos?nombre=${group.name}`}
                                className={`nav-link rounded-pill ${selectedGroup && selectedGroup.name === group.name ? 'active fw-semibold' : 'text-reset'}`}
                                onClick={() => { setSelectedGroup(group); setEditing(false) }}
                            >
                                {group.name}
                            </Link>
                        </Nav.Item>
                    ))}
                </Nav>

            ) : (
                <>
                    {/**Si no hay grupos mmuestra un mensaje de error */}
                    {error && (<Alert variant='danger' className='text-center'>{error}</Alert>)}
                </>
            )}

            {/**Tarjeta con información del grupo seleccionado, hasta que no se seleccione uno en el Dropdown anterior no se muestra nada */}
            {selectedGroup && (
                <>
                    <Card key={selectedGroup.id} className='my-3'>
                        {/**Encabezado de la Card con detalles e info del grupo
                     * <!TODO: Mejorar presentación>
                     */}
                        <Card.Header className='d-flex flex-wrap flex-row column-gap-3'>
                            <p><strong>Nombre:</strong> {selectedGroup.name}</p>
                            <p><strong>Estilos:</strong> Rock, Pop, Jazz</p>
                            <p><strong>Fecha de creación:</strong> {selectedGroup.creationDate.split(',')[0]}</p>
                            <p><strong>Número de miembros:</strong> {groupMembers[selectedGroup.id]?.length || 0}</p>
                        </Card.Header>

                        {/**Cuerpo de la Card con los detalles de los miembros, canciones y eventos del grupo */}
                        <Card.Body>
                            {/**Tabla con información de los miembros */}
                            <Table striped hover size='sm'>
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

                        </Card.Body>

                        {/**En modo edición, mostrar un footer con la opción de eliminar grupo
                         * <!TODO: Añadir un modal de confirmación antes de eliminar el grupo>
                         */}
                        {editing && (
                            <Card.Footer
                                className='btn btn-sm btn-outline-danger border-0 w-100'
                                onClick={() => setShowConfirmation(ModalConfirmation)}
                            >
                                Eliminar grupo
                            </Card.Footer>
                        )}
                    </Card>

                    {/**Llamada al modal de confirmación
                     * Tiene como atributos adicionales la función que tiene que confirmar y un texto informativo
                     */}
                    <ModalConfirmation
                        showModal={showConfirmation}
                        closeModal={() => setShowConfirmation(false)}
                        action={() => deleteGroup(selectedGroup.groupId)}
                        actionTxt={<>eliminar el grupo <span className='text-nowrap text-decoration-underline'>{selectedGroup.name}</span></>}
                    />
                </>
            )}
        </Container>
    );
}
