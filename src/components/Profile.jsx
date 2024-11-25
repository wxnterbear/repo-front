import React, { useState, useContext } from "react";
import Swal from "sweetalert2";
import { AuthContext } from "../context/AuthContext";
import Header from "./header";
import URL from "./url";
import "../css/profile.css";

const Profile = () => {
  const { username, email, token } = useContext(AuthContext);
  const [profileImage, setProfileImage] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const [menuHeight, setMenuHeight] = useState("0px");
  const [menuOpen, setMenuOpen] = useState(false);
  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
    setMenuHeight(menuOpen ? "0px" : "300px");
  };

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setProfileImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleChangePassword = async (event) => {
    event.preventDefault();
    const oldPassword = event.target.oldPassword.value;
    const newPassword1 = event.target.newPassword.value;
    const newPassword2 = event.target.confirmPassword.value;

    if (newPassword1 !== newPassword2) {
      Swal.fire("Error", "Las contraseñas no coinciden.", "error");
      return;
    }

    const formData = new FormData();
    formData.append("old_password", oldPassword);
    formData.append("new_password1", newPassword1);
    formData.append("new_password2", newPassword2);

    try {
      const response = await fetch(`${URL}/auth/change-password/`, {
        method: "POST",
        headers: {
          Authorization: `Token ${token}`,
        },
        body: formData,
      });

      if (response.ok) {
        Swal.fire("Éxito", "Contraseña actualizada correctamente.", "success");
        setShowModal(false);
      } else {
        const error = await response.json();
        Swal.fire("Error", error.message || "Algo salió mal.", "error");
        console.log(error);
      }
    } catch (err) {
      Swal.fire("Error", "No se pudo conectar al servidor.", "error");
    }
  };

  const closeModal = (e) => {
    if (e.target.classList.contains("modal-container-pro")) {
      setShowModal(false);
    }
  };

  return (
    <div
      className={`profile-container ${menuOpen ? "shifted" : ""}`}
      style={{ marginTop: menuHeight }}
    >
      <div className="header-container">
        <Header toggleMenu={toggleMenu} menuOpen={menuOpen} />
      </div>
      <h1 className="title-profile">Perfil</h1>

      <div className="infoContainer">
        <p className="infoText">
          <strong>Nombre de usuario:</strong> {username || "Sin datos"}
        </p>
        <p className="infoText">
          <strong>Correo asociado:</strong> {email || "Sin datos"}
        </p><br/>
        <button
          className="changePasswordButton"
          onClick={() => setShowModal(true)}
        >
          Cambiar contraseña
        </button>
      </div>

      {showModal && (
        <div className="modal-container-pro" onClick={closeModal}>
          <div
            className="modal-content-pro"
            onClick={(e) => e.stopPropagation()}
          >
            <h2>Cambiar contraseña</h2>
            <form onSubmit={handleChangePassword}>
              <input
                className="psw-profile"
                type="password"
                name="oldPassword"
                placeholder="Contraseña actual"
                required
              />
              <input
                className="psw-profile"
                type="password"
                name="newPassword"
                placeholder="Nueva contraseña"
                required
              />
              <input
                className="psw-profile"
                type="password"
                name="confirmPassword"
                placeholder="Confirmar nueva contraseña"
                required
              />

              <ul className="psw-conditions">
                <li>
                  Su contraseña no puede asemejarse tanto a su otra información
                  personal
                </li>
                <li>Su contraseña debe contener por lo menos 8 caracteres</li>
                <li>
                  Su contraseña no puede ser una clave utilizada comúnmente
                </li>
                <li>Su contraseña no puede ser completamente numérica</li>
              </ul>
              <div className="modal-buttons-pro">
                <button type="submit">Confirmar</button>
                <button type="button" onClick={() => setShowModal(false)}>
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;
