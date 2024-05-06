import React, { useState, useEffect } from "react";
import { Navbar, Nav, OverlayTrigger, Tooltip, Button } from "react-bootstrap";
import {
  PersonFill,
  Search,
  HouseFill,
  CalendarWeekFill,
  BellFill,
  MusicNoteBeamed,
} from "react-bootstrap-icons";

import ModalAccount from "./ModalConfig";
import SearchBar from "./SearchBar";

// Componente para la barra de navegación superior
function NavbarTop() {
  // Estado para controlar la visibilidad del modal de usuario
  const [showModalAccount, setShowModalAccount] = useState(false);

  // Estado para controlar la visibilidad del modal de búsqueda
  const [showModalSearch, setShowModalSearch] = useState(false);

  // Estado para almacenar la posición de desplazamiento previa
  const [prevScrollPos, setPrevScrollPos] = useState(0);

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
      <Navbar className="navbar-top container-fluid justify-content-evenly bg-white " fixed="top" >
        
        {/**Barra de búsqueda */}
        <Nav className="container bg-body-secondary rounded-pill mx-3 px-3" >
          <Nav.Item
            onClick={() => setShowModalSearch(true)}
            className="d-flex align-items-center w-100 gap-3 py-2 text-black-50"
          >
            <Search />
            Buscar
          </Nav.Item>
        </Nav>

        {/**Icono usuario */}
        <Navbar.Brand className="ms-2 me-4">
          <Button
            type="button"
            variant="outline-dark"
            onClick={() => setShowModalAccount(true)}
            style={{
              height: "35px",
              width: "35px",
              padding: "0",
              borderRadius: "50%",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <PersonFill size={"25px"} />
          </Button>
        </Navbar.Brand>
      </Navbar>

      <ModalAccount showModal={showModalAccount} handleCloseModal={() => setShowModalAccount(false)} />
      <SearchBar showModal={showModalSearch} handleCloseModal={() => setShowModalSearch(false)} />
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
            <Nav.Link href="/" >
              <HouseFill size={"24px"} />
            </Nav.Link>
          </OverlayTrigger>

          {/* Botón para ir a la página de eventos */}
          <OverlayTrigger
            trigger={["hover", "focus"]}
            placement="top"
            overlay={<Tooltip id="tooltip">Eventos</Tooltip>}
          >
            <Nav.Link href="/eventos">
              <CalendarWeekFill size={"24px"} />
            </Nav.Link>
          </OverlayTrigger>

          {/* Botón para ir a la página de notificaciones */}
          <OverlayTrigger
            trigger={["hover", "focus"]}
            placement="top"
            overlay={<Tooltip id="tooltip">Notificaciones</Tooltip>}
          >
            <Nav.Link href="/notificaciones">
              <BellFill size={"24px"} />
            </Nav.Link>
          </OverlayTrigger>

          {/* Botón para ir a la página de repertorio */}
          <OverlayTrigger
            trigger={["hover", "focus"]}
            placement="top"
            overlay={<Tooltip id="tooltip">Repertorio</Tooltip>}
          >
            <Nav.Link href="/repertorio">
              <MusicNoteBeamed size={"24px"} />
            </Nav.Link>
          </OverlayTrigger>
        </Nav>
      </Navbar>
    </>
  );
}

export { NavbarTop, NavbarBottom }; // Exporta los componentes NavbarTop y NavbarBottom
