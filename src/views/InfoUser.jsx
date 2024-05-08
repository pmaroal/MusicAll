import React from 'react';
import { Alert, Table, Container, Card, Button } from 'react-bootstrap';
import { GetUserProfile } from '../controllers/UserController';
import { useAuth } from "../services/AuthService";
import { Calendar2, Gift, PersonFill } from 'react-bootstrap-icons';


export default function UserProfile() {
    const { userProfile, error } = GetUserProfile(); // Cargar el usuario de la búsqueda y mensaje de error de la función 'GetUserProfile' del controlador
    const { currentUser } = useAuth(); // Cargar los datos del usuario actual

    return (
        <>
            {/**Mensajes de error */}
            {error && <Alert variant="danger">{error}</Alert>}
            {/**Si hay usuario, muestra sus datos */}
            {userProfile && (
                <Container className='pt-3'>
                    <Card>
                        {/**Encabezado con datos básicos del usuario.
                         * Si el perfil es del propio usuario de la app cambia el color de fondo
                         */}
                        <Card.Header className={`${userProfile.uid === currentUser.uid ? 'bg-info-subtle p-3' : 'p-3'}`}>
                            <div className='row gap-2'>
                                {/**Imagen del perfil */}
                                <div className='col-auto'>
                                    <PersonFill
                                        className="btn btn-secondary"
                                        style={{
                                            height: "75px",
                                            width: "75px",
                                            padding: "10px",
                                            borderRadius: "50%",
                                            display: "flex",
                                            justifyContent: "center",
                                            alignItems: "center",
                                            backgroundColor: "",
                                        }}
                                    />
                                </div>

                                {/**Columna con datos del usuario */}
                                <div className='col'>
                                    <h2 className='fw-bold'>{userProfile.name} {userProfile.surname}</h2>
                                    <h5 className=''>{userProfile.email}</h5>
                                </div>

                                {/**Columna con botón de 'Invitar al grupo' o 'Editar tu perfil' (si es tu propia cuenta) */}
                                <div className='col-auto ms-auto'>
                                    <Button
                                        type='button'
                                        variant='dark'
                                        /**Va a tu perfil si es tu cuenta, o a inicio si no 
                                         * <TODO! implementar funciones para invitar a grupo> 
                                         * */ 
                                        href={userProfile.uid === currentUser.uid ? '/mi-perfil' : '/'} 
                                    >
                                        {userProfile.uid === currentUser.uid ? 'Editar tu perfil' : 'Invitar a tu grupo'}
                                    </Button>
                                </div>
                            </div>

                            {/**Info de fechas */}
                            <div className='d-flex flex-wrap column-gap-4 mt-3'>
                                {/**Fecha de creación de la cuenta */}
                                <span className="text-muted">
                                    <Calendar2 className='mb-1 me-2' />
                                    {/**Como ya se formatea la fecha antes de guardarla, solo se muestra la primera parte del array (dd/mm/aa , hh:mm:ss) */}
                                    Se unió en: {userProfile.creationDate.split(',')[0] || 'sin datos'}
                                </span>

                                {/**Fecha de nacimiento */}
                                <span className="text-muted">
                                    <Gift className='mb-1 me-2' />
                                    Fecha de nacimiento: {userProfile.birthDate.toDate().toLocaleDateString() || 'sin datos'}
                                </span>
                            </div>
                        </Card.Header>

                        {/**Cuerpo con detalles de la cuenta */}
                        <Card.Body>
                            {/**Grupos a los que pertenece <TODO! Implementar> */}
                            <div>
                                <h4>Grupos</h4>
                                <p>{userProfile.name} aún no pertenece a nigún grupo.</p>
                            </div>

                            {/**Instrumentos del músico <TODO! Poner más bonito> */}
                            <h4>Instrumentos</h4>
                            {/**Mapea los instrumentos del array y los muestra en una tabla */}
                            <Table bordered hover size="sm" className="mb-3">
                                <tbody>
                                    {userProfile.selectedInstruments.map((instrument, index) => (
                                        <tr key={index}>
                                            <td className="col-1 text-center">{index + 1}</td>
                                            <td className="ps-2">{instrument}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </Table>
                        </Card.Body>
                    </Card>
                </Container>
            )}
        </>
    );
}
