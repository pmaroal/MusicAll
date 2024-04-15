import React, { useState } from "react";
import { Nav, Navbar, OverlayTrigger, Tooltip, Form, FormControl } from "react-bootstrap";
import {
  PersonFill,
  HouseFill,
  CalendarWeekFill,
  BellFill,
  MusicNoteBeamed,
} from "react-bootstrap-icons";

import AccountModal from "./ModalAccount";

function NavbarTop() {
  const [showModal, setShowModal] = useState(false);

  const handleShowModal = () => setShowModal(true);
  const handleCloseModal = () => setShowModal(false);

  return (
    <>
      <Navbar className="mx-auto" fixed="top" style={{ maxWidth: "460px" }}>
        <Nav
          className="container-fluid bg-body-secondary rounded-pill justify-content-end"
          style={{ margin:"5px 10px 10px", padding: "5px 10px 5px" }}
          >

          <OverlayTrigger
            trigger={["hover", "focus"]}
            placement="bottom"
            overlay={<Tooltip id="tooltip">Configuración</Tooltip>}
          >
            <Nav.Item
              onClick={handleShowModal}
              className="btn btn-primary"
              style={{
                height: "35px",
                width: "35px",
                padding: "0",
                borderRadius: "50%",
                border: "2px solid #000",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <PersonFill size={"20px"} />
            </Nav.Item>
          </OverlayTrigger>

        </Nav>
      </Navbar>

      <AccountModal showModal={showModal} handleCloseModal={handleCloseModal} />
    </>
  );
}

function NavbarBottom() {
  return (
    <Navbar
      className="bg-body-secondary mx-auto rounded-top-5"
      fixed="bottom"
      style={{ maxWidth: "460px" }}
    >
      <Nav className="container justify-content-around">
        <OverlayTrigger
          trigger={["hover", "focus"]}
          placement="top"
          overlay={<Tooltip id="tooltip">Inicio</Tooltip>}
        >
          <Nav.Link href="/" className="nav-link">
            <HouseFill size={"24px"} />
          </Nav.Link>
        </OverlayTrigger>

        <OverlayTrigger
          trigger={["hover", "focus"]}
          placement="top"
          overlay={<Tooltip id="tooltip">Eventos</Tooltip>}
        >
          <Nav.Link href="/" className="nav-link">
            <CalendarWeekFill size={"24px"} />
          </Nav.Link>
        </OverlayTrigger>

        <OverlayTrigger
          trigger={["hover", "focus"]}
          placement="top"
          overlay={<Tooltip id="tooltip">Notificaciones</Tooltip>}
        >
          <Nav.Link href="/" className="nav-link">
            <BellFill size={"24px"} />
          </Nav.Link>
        </OverlayTrigger>

        <OverlayTrigger
          trigger={["hover", "focus"]}
          placement="top"
          overlay={<Tooltip id="tooltip">Repertorio</Tooltip>}
        >
          <Nav.Link href="/" className="nav-link">
            <MusicNoteBeamed size={"24px"} />
          </Nav.Link>
        </OverlayTrigger>
      </Nav>
    </Navbar>
  );
}

export { NavbarTop, NavbarBottom };
