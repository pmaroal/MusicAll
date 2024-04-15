import React, { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

// Importar las vistas de la app
import SignUp from "./views/Signup";
import Home from "./views/Home";
import LogIn from "./views/Login";
import AddUserData from "./views/AddUserData";

import { NavbarBottom } from "./components/Navbar";

// Importar el Container de react-bootstrap
import { Container } from "react-bootstrap";

// Importar AuthProvider que contiene las funciones relacionadas con el inicio de sesión
import { AuthProvider, useAuth } from "./services/AuthService";

function App() {
  // Obtener el nombre de la aplicación desde el manifest.json y ponerlo como título de la web
  useEffect(() => {
    const appName = process.env.REACT_APP_NAME;
    document.title = appName;
  }, []);

  return (
    <Container
      className="container align-items-center justify-content-center"
      style={{ height: "100vh", maxWidth: "460px" }}
    >
      <Router>
        <AuthProvider>
          <Container style={{ margin: "75px 0 75px 0" }}>
            {/* Rutas de las páginas */}
            <Routes>
              <Route path="/" element={<PrivateRoute />} />

              <Route path="/login" element={<LogIn />} />
              <Route path="/registro" element={<SignUp />} />
              <Route path="/registro/nuevo-usuario" element={<AddUserData />} />
            </Routes>
          </Container>

          <NavbarBottom /> {/* Ajustar para que no se muestre en todas las vistas */}

        </AuthProvider>
      </Router>
    </Container>
  );
}

// Componente para manejar la ruta privada
// Si hay un usuario logeado va a la vista Home, en caso contrario va a /login
function PrivateRoute() {
  const { currentUser } = useAuth();

  return currentUser ? <Home /> : <Navigate to="/login" />;
}

export default App;
