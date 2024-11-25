import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "../css/passwordReset.css";
import URL from "./url";
import Swal from "sweetalert2";

const PasswordReset = () => {
  const { userId, token } = useParams(); // Obtiene userId y token de la URL
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isEmailSent, setIsEmailSent] = useState(false);
  const [error, setError] = useState("");

  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    const formdata = new FormData();
    formdata.append("email", email);
    try {
      const response = await fetch(`${URL}/auth/reset-password/`, {
        method: "POST",
        body: formdata,
      });

      if (!response.ok) {
        console.log("------------");
        const data = await response.json();
        console.log(data);
        Swal.fire({
          title: "Error",
          text: data.detail || "No se encuentra el correo registrado",
          icon: "error",
          confirmButtonText: "Aceptar",
        });
        return;
      }

      setIsEmailSent(true);
      setError("");
      Swal.fire({
        title: "Éxito",
        text: "Se ha enviado un enlace de restablecimiento a tu correo",
        icon: "success",
        confirmButtonText: "Aceptar",
      });
    } catch (err) {
      Swal.fire({
        title: "Error",
        text: "No se pudo conectar con el servidor. Inténtalo más tarde.",
        icon: "error",
        confirmButtonText: "Aceptar",
      });
    }
  };

  return (
    <div className="psw-container">
      <center>
        <h2>
          {isEmailSent
            ? "Restablecer Contraseña"
            : "Solicitar Restablecimiento de Contraseña"}
        </h2>
        {error && <p style={{ color: "red" }}>{error}</p>}
        {!isEmailSent ? (
          <form onSubmit={handleEmailSubmit}>
            <label>
              Correo Electrónico:
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </label>
            <button type="submit">Enviar Correo</button>
          </form>
        ) : (
          <div className="confirm-container">
            <h1>Se te ha enviado un enlace de restablecimiento</h1>
            <p>Revisa tu bandeja de entrada o carpeta de spam</p>
          </div>
        )}
      </center>
    </div>
  );
};

export default PasswordReset;
