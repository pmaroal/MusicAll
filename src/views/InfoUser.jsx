import React from 'react';
import { Alert, Table, Container } from 'react-bootstrap';
import { GetUserProfile } from '../controllers/UserController';

export default function UserProfile() {
    const { userProfile, error } = GetUserProfile();

    if (error) {
        return <p>Error: {error}</p>;
    }

    return (
        <>
            {error && <Alert variant="danger">{error}</Alert>}
            {userProfile && (

                <Container className="py-3">
                    <div className="mb-3">
                        <span className="fw-bold">Nombre: </span>
                        <span>{userProfile.name}</span>
                    </div>
                    <div className="mb-3">
                        <span className="fw-bold">Apellidos: </span>
                        <span>{userProfile.surname}</span>
                    </div>
                    <div className="mb-3">
                        <span className="fw-bold">Email: </span>
                        <span>{userProfile.email}</span>
                        <p className="text-muted">Se unió en: {userProfile.creationDate.split(',')[0] || 'sin datos'}</p>
                    </div>
                    <div className="mb-3">
                        <span className="fw-bold">Fecha de nacimiento: </span>
                        <span>{userProfile.birthDate.toDate().toLocaleDateString() || 'sin datos'}</span>
                    </div>

                    <Table borderless hover size="sm" className="mb-3">
                        <thead>
                            <tr>
                                <th colSpan={2} className="">Instrumentos</th>
                            </tr>
                        </thead>
                        <tbody>
                            {userProfile.selectedInstruments.map((instrument, index) => (
                                <tr key={index}>
                                    <td className="">{index + 1}</td>
                                    <td className="">{instrument}</td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>
                </Container>


            )}
        </>
    );
}
