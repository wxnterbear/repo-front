import React, { createContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../css/context.css";

// Crear el contexto
export const AuthContext = createContext();

// Proveedor del contexto
export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    const storedIsAdmin = localStorage.getItem("isAdmin") === "true";
    const storedUsername = localStorage.getItem("username");
    const storedEmail = localStorage.getItem("email");

    if (storedToken) {
      setToken(storedToken);
      setIsAdmin(storedIsAdmin);
      setUsername(storedUsername);
      setEmail(storedEmail);
    }

    const timeout = setTimeout(() => {
      setLoading(false);
    }, 2000);

    return () => clearTimeout(timeout);
  }, [navigate]);

  const login = (newToken, adminStatus, user, email) => {
    console.log("User received in login:", user);
    setToken(newToken);
    setUsername(user);
    setEmail(email);
    setIsAdmin(!!adminStatus);
    localStorage.setItem("token", newToken);
    localStorage.setItem("isAdmin", adminStatus ? "true" : "false");
    localStorage.setItem("username", user);
    localStorage.setItem("email", email);
  };

  const logout = () => {
    setToken(null);
    setIsAdmin(false);
    setUsername("");
    setEmail("");
    localStorage.removeItem("token");
    localStorage.removeItem("isAdmin");
    localStorage.removeItem("username");
    localStorage.removeItem("email");
    navigate("/login");
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-text">Cargando...</div>
      </div>
    );
  }

  return (
    <AuthContext.Provider
      value={{ token, isAdmin, login, logout, username, email }}
    >
      {children}
    </AuthContext.Provider>
  );
};
