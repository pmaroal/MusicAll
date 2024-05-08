import React from 'react';
import { Button, Container } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

export default function Groups() {
    const navigate = useNavigate();

    return (
        <Container className='text-center'>
            <h2>Mis grupos</h2>
            
            <p>Aún no perteneces a ningún grupo.</p>
            <Button 
                variant='primary'
                onClick={() => navigate("/crear-grupo")} // Cambiado a una función de flecha para evitar la navegación inmediata al renderizar
            >
                Crear un nuevo grupo
            </Button>
        </Container>
    );
}
