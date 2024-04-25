import React, { useState, useEffect } from "react";
import { Nav, Navbar, OverlayTrigger, Tooltip, Button } from "react-bootstrap";
import {
  PersonFill,
  HouseFill,
  CalendarWeekFill,
  BellFill,
  MusicNoteBeamed,
} from "react-bootstrap-icons";

import ModalAccount from "./ModalConfig";

// Componente para la barra de navegación superior
function NavbarTop() {
  // Estado para controlar la visibilidad del modal
  const [showModal, setShowModal] = useState(false);
  // Estado para almacenar la posición de desplazamiento previa
  const [prevScrollPos, setPrevScrollPos] = useState(0);

  // Función para mostrar el modal
  const handleShowModal = () => setShowModal(true);
  // Función para cerrar el modal
  const handleCloseModal = () => setShowModal(false);

  // Efecto para controlar el comportamiento de la barra de navegación al hacer scroll
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollPos = window.scrollY;

      // Oculta la barra de navegación cuando se desplaza hacia abajo y la muestra cuando se desplaza hacia arriba
      if (prevScrollPos > currentScrollPos) {
        document.querySelector(".navbar-top").style.top = "0";
      } else {
        document.querySelector(".navbar-top").style.top = "-75px";
      }

      setPrevScrollPos(currentScrollPos);
    };

    // Agrega el evento de escucha para el scroll
    window.addEventListener("scroll", handleScroll);

    // Remueve el evento de escucha al desmontar el componente
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [prevScrollPos]);

  return (
    <>
      <Navbar className="navbar-top bg-white mx-auto" fixed="top" >
        <Nav className="container bg-body-secondary rounded-pill justify-content-end" >
          {/**Icono usuario */}
          <Nav.Link>
            <Button
              type="button"
              variant="outline-dark"
              onClick={handleShowModal}
              style={{
                height: "35px",
                width: "35px",
                padding: "0",
                borderRadius: "50%",
                border: "1.5px solid #000",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <PersonFill size={"20px"} />
            </Button>
          </Nav.Link>
        </Nav>
      </Navbar>

      <ModalAccount showModal={showModal} handleCloseModal={handleCloseModal} />
    </>
  );
}

// Componente para la barra de navegación inferior
function NavbarBottom() {
  return (
    <>
    <Navbar
      className="container bg-body-secondary mx-auto rounded-top-5"
      fixed="bottom"
    >
      <Nav className="container justify-content-around">
        {/* Botón para ir a la página de inicio */}
        <OverlayTrigger
          trigger={["hover", "focus"]}
          placement="top"
          overlay={<Tooltip id="tooltip">Inicio</Tooltip>}
        >
          <Nav.Link href="/" className="nav-link">
            <HouseFill size={"24px"} />
          </Nav.Link>
        </OverlayTrigger>

        {/* Botón para ir a la página de eventos */}
        <OverlayTrigger
          trigger={["hover", "focus"]}
          placement="top"
          overlay={<Tooltip id="tooltip">Eventos</Tooltip>}
        >
          <Nav.Link href="/eventos" className="nav-link">
            <CalendarWeekFill size={"24px"} />
          </Nav.Link>
        </OverlayTrigger>

        {/* Botón para ir a la página de notificaciones */}
        <OverlayTrigger
          trigger={["hover", "focus"]}
          placement="top"
          overlay={<Tooltip id="tooltip">Notificaciones</Tooltip>}
        >
          <Nav.Link href="/notificaciones" className="nav-link">
            <BellFill size={"24px"} />
          </Nav.Link>
        </OverlayTrigger>

        {/* Botón para ir a la página de repertorio */}
        <OverlayTrigger
          trigger={["hover", "focus"]}
          placement="top"
          overlay={<Tooltip id="tooltip">Repertorio</Tooltip>}
        >
          <Nav.Link href="/repertorio" className="nav-link">
            <MusicNoteBeamed size={"24px"} />
          </Nav.Link>
        </OverlayTrigger>
      </Nav>
    </Navbar>
    </>
  );
}

export { NavbarTop, NavbarBottom }; // Exporta los componentes NavbarTop y NavbarBottom
