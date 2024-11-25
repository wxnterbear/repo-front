import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "../css/passwordReset.css";
import URL from "./url";
import Swal from "sweetalert2";

const PasswordResetConfirm = () => {
  const { userId, token } = useParams();
  const navigate = useNavigate();

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");

  const handlePasswordReset = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      Swal.fire({
        title: "Error",
        text: "Las contraseñas no coinciden",
        icon: "error",
        confirmButtonText: "Aceptar",
      });
      return;
    }

    if (newPassword.length < 8) {
      Swal.fire({
        title: "Error",
        text: "La contraseña debe tener al menos 8 caracteres",
        icon: "error",
        confirmButtonText: "Aceptar",
      });
      return;
    }

    const formdata = new FormData();

    formdata.append("user_id", userId);
    formdata.append("token", token);
    formdata.append("new_password", newPassword);

    try {
      const response = await fetch(`${URL}/auth/password-reset-confirm/`, {
        method: "POST",
        body: formdata,
      });

      if (!response.ok) {
        const data = await response.json();
        Swal.fire({
          title: "Error",
          text: data.detail || "Error al restablecer la contraseña",
          icon: "error",
          confirmButtonText: "Aceptar",
        });
      }

      Swal.fire({
        title: "Éxito",
        text: "Contraseña restablecida con éxito",
        icon: "success",
        confirmButtonText: "Ir a login",
      }).then(() => {
        navigate("/login");
      });
    } catch (err) {
      Swal.fire({
        title: "Error",
        text:
          err.message ||
          "Hubo un problema al restablecer la contraseña. Inténtelo más tarde",
        icon: "error",
        confirmButtonText: "Aceptar",
      });
    }
  };

  return (
    <div className="psw-container">
      <h2>Restablecer contrasea</h2>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <form onSubmit={handlePasswordReset}>
        <label>
          Nueva Contraseña:
          <input
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
          />
        </label>
        <label>
          Confirmar Contraseña:
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
        </label>
        <button type="submit">Restablecer Contraseña</button>
      </form>
    </div>
  );
};

export default PasswordResetConfirm;
