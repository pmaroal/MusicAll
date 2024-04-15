import React from "react";
import { Modal, ModalTitle } from "react-bootstrap";
import { PersonFill } from "react-bootstrap-icons";
import { useNavigate } from "react-router-dom";
import useAccountController from "../controllers/AccountController";

function AccountModal({ showModal, handleCloseModal }) {
    const { account, logout } = useAccountController();
    const navigate = useNavigate(); // Obtiene la función navigate

    const handleLogout = () => {
        logout();
        handleCloseModal(); // Cierra el modal después de hacer clic en el botón de cerrar sesión
    };

    return (
        <Modal show={showModal} onHide={handleCloseModal} id="AccountConf-modal">
            <Modal.Header closeButton>
                <ModalTitle>MusicAll</ModalTitle>
            </Modal.Header>
            <Modal.Body>
                <div className="d-flex bg-body-secondary p-2 rounded-2">
                    <PersonFill
                        className="d-flex"
                        style={{
                            height: "75px",
                            width: "75px",
                            padding: "10px",
                            borderRadius: "50%",
                            border: "2px solid #000",
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                        }}
                    />
                    <div className="d-grid my-auto ">
                        {account && (
                            <>
                                <strong className="ms-3">{account.name} {account.surname}</strong>
                                <small className="rounded-pill text-center bg-body-tertiary ms-3 px-2">
                                    {account.email}
                                </small>
                            </>
                        )}
                    </div>
                </div>

                <div className="list-group bg-body-secondary my-3 rounded-2">
                    <button
                        type="button"
                        onClick={() => navigate("/login")} // Navega a la ruta /login
                        className="list-group-item text-start"
                        disabled={account ? true : false}
                    >
                        Iniciar sesión
                    </button>
                    <button
                        type="button"
                        onClick={() => navigate("/registro")} // Navega a la ruta /registro
                        className="list-group-item text-start"
                        disabled={account ? true : false}
                    >
                        Registrarse
                    </button>
                    <button
                        type="button"
                        onClick={handleLogout}
                        className="list-group-item text-start"
                        disabled={!account}
                    >
                        Cerrar sesión
                    </button>
                </div>
            </Modal.Body>
        </Modal>
    );
}

export default AccountModal;
