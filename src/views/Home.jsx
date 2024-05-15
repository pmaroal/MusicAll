import React from "react";
import { Alert, Card, Container, Image, OverlayTrigger, Tooltip } from 'react-bootstrap';
import { CalendarEvent, Clock, GeoAlt } from "react-bootstrap-icons";
import { GetUserProfile } from "../controllers/UserController";
import useAccountController from "../controllers/AccountController";
import { useAuth } from "../services/AuthService";
import { GetUserEvents } from "../controllers/EventController";

export default function Home() {
  const { account } = useAccountController();
  const { currentUser } = useAuth();
  const { userProfile, userGroups } = GetUserProfile();
  const { events } = GetUserEvents();

  return (
    <Container className="py-3">
      {account && userProfile ? (
        <div className="d-grid gap-4">
          <div className="d-flex align-items-center gap-2 bg-body-tertiary border rounded-pill p-2">
            <Image src={process.env.PUBLIC_URL + '/logo512.png'} style={{ maxWidth: '50px' }} className="border rounded-circle" />
            <span className="fs-4 m-0">¡Hola, {userProfile.name}!</span>
          </div>

          {userGroups.length > 0 ? (
            <div className="d-flex flex-wrap justify-content-center gap-3">
              {userGroups.map(group => (
                <Card key={group.id} className="flex-fill bg-body-tertiary border rounded-pill p-2">
                  <div className="d-flex align-items-center gap-2">
                    <Image src={process.env.PUBLIC_URL + '/logo512.png'} style={{ maxWidth: '50px' }} className="border rounded-circle" />
                    <span>{group.admin === currentUser.id ? 'Has creado' : 'Te has unido'} al grupo <strong className="text-nowrap">{group.name}</strong>.</span>
                  </div>
                </Card>
              ))}
            </div>
          ) : (
            <Alert variant="info" className="mt-3">
              ¡Para aprovechar al máximo MusicAll, crea tu propio grupo o únete a uno existente! Así podrás disfrutar de todas las funciones y beneficios que ofrecemos.
            </Alert>
          )}

          <hr className="my-2" />
          <h5 className="my-0">Próximos eventos:</h5>
          <div className="d-flex flex-wrap flex-row justify-content-center">
            {events.length > 0 ? (
              events.map(event => (
                <div className="col-12 col-md-6 px-2 pb-3">
                  <Card key={event.id} className="d-grid gap-2">
                    <Card.Header className="d-flex flex-fill gap-2">
                      <OverlayTrigger
                        trigger={["hover", "focus"]}
                        placement="top"
                        overlay={<Tooltip id="tooltip" className='text-capitalize'>{event.type}</Tooltip>}
                      >
                        <span className={`col-auto p-1 rounded-2 bg-${event.type === 'concierto' ? 'warning' : event.type === 'ensayo' ? 'success' : 'body-secondary'}`}></span>
                      </OverlayTrigger>

                      <Card.Title className="mb-0">{event.title}</Card.Title>
                      <span className='badge bg-white text-reset ms-auto align-self-center'>
                        {userGroups.find(group => group.id === event.groupId)?.name}
                      </span>
                    </Card.Header>

                    <Card.Body className='d-flex flex-wrap column-gap-3'>
                      {event.date && <span><CalendarEvent className='mb-1 me-1' /> {event.date}</span>}
                      {event.time && <span><Clock className='mb-1 me-1' /> {event.time}</span>}
                      {event.location && <span><GeoAlt className='mb-1 me-1' /> {event.location}</span>}
                    </Card.Body>
                  </Card>
                </div>
              ))
            ) : (
              <Alert variant="info" className="mt-3">
                ¡No hay eventos próximos! Asegúrate de estar al tanto de las novedades de tus grupos para no perderte ninguno.
              </Alert>
            )}
          </div>
        </div>
      ) : (
        <Alert variant="danger" className="mt-3">
          Error: No hay ningún usuario registrado
        </Alert>
      )}
    </Container>
  );
}
