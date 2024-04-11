import React from "react";
import { Link } from "react-router-dom";
import { Nav, Navbar } from "react-bootstrap";

function NavbarTop() {
  return (
    <Navbar>
        <Nav className="navbar bg-body-secondary text-center row-cols-3 rounded-bottom-5 fixed-top">
          <Link to='/' className="nav-link">Inicio</Link>
          <Link to='/sign-up' className="nav-link">Registrarse</Link>
          <Link to="/login" className="nav-link">Iniciar sesión</Link>
        </Nav>
    </Navbar>
  );
}

function NavbarBottom() {
  return (
    <Navbar>
        <Nav className="navbar bg-body-secondary text-center row-cols-3 rounded-top-5 fixed-bottom">
          <Link to='/' className="nav-link">Inicio</Link>
          <Link to='/sign-up' className="nav-link">Registrarse</Link>
          <Link to="/login" className="nav-link">Iniciar sesión</Link>
        </Nav>
    </Navbar>
  );
}

export {NavbarTop, NavbarBottom};
