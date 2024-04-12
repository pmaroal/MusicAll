import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";

// Importar las vistas de la app
import SignUp from "./views/Signup";
import Home from "./views/Home";
import LogIn from "./views/Login";

import { NavbarBottom } from "./components/Navbar";

// Importar el Container de react-bootstrap
import { Container } from "react-bootstrap";

// Importar AuthProvider que contiene las funciones relacionadas con el inicio de sesión
import { AuthProvider } from "./services/AuthService";

function App() {
  return (
    <Container
      className="container align-items-center justify-content-center"
      style={{ minHeight: "100vh", maxWidth: "460px" }}
    >
      <Router>
        <AuthProvider>
          <body style={{ margin: "75px 0 75px 0" }}>
              {/* Rutas de las páginas */}
              <Routes>
                <Route exact path="/" element={<Home />} />
                <Route path="/sign-up" element={<SignUp />} />
                <Route path="/login" element={<LogIn />} />
              </Routes>
          </body>
          <NavbarBottom />
        </AuthProvider>
      </Router>
    </Container>
  );
}

export default App;
