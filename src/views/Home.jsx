import React from "react";
import { NavbarTop } from "../components/Navbar";
import { Card, Button, Alert } from "react-bootstrap";
import useAccountController from "../controllers/AccountController";

export default function Home() {
  const { account, logout, error } = useAccountController();

  return (
    <>
      <NavbarTop />

      <Card className="shadow my-3">
        <Card.Body>
          <h2 className="text-center py-3">Usuario</h2>
          {error && <Alert variant="danger">{error}</Alert>}
          {account && (
            <>
              <p>
                <strong>Nombre:</strong> {account.name}
              </p>
              <p>
                <strong>Apellidos:</strong> {account.surname}
              </p>
              <p>
                <strong>Email:</strong> {account.email}
              </p>
              <p>
                <strong>Fecha de nacimiento:</strong> {account.birthDate.toDate().toLocaleDateString()} {/* Convierte birthDate a objeto Date y luego a formato de fecha */}
              </p>
              <p>
                <strong>Instrumentos seleccionados:</strong>{" "}
                {account.selectedInstruments && account.selectedInstruments.join(", ")}
              </p>

              <Button type="button" className="w-100" onClick={logout}>
                Cerrar sesión
              </Button>
            </>
          )}
          {!account && <p>No hay usuario logeado</p>}
        </Card.Body>
      </Card>
      <div className="bg-light border-5" style={{ height: "1400px" }}></div>
    </>
  );
}

