import React, { createContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; // Importar useNavigate
import '../css/context.css'

// Crear el contexto
export const AuthContext = createContext();

// Proveedor del contexto
export const AuthProvider = ({ children }) => {
    const [token, setToken] = useState(null);
    const [loading, setLoading] = useState(true); // Añadir estado de "loading" para saber si ya se verificó el token
    const navigate = useNavigate(); // Inicializar navigate

    useEffect(() => {
        const storedToken = localStorage.getItem('token');
        console.log("Token actual:", storedToken);

        if (storedToken) {
            setToken(storedToken);
        } else {
            console.log("No se encontró token, redirigiendo al login...");
            navigate('/login');
        }

        // Agregar un pequeño retraso antes de ocultar el loading
        const timeout = setTimeout(() => {
            setLoading(false);
        }, 2000); // 2000 ms = 2 segundos adicionales de carga

        return () => clearTimeout(timeout); // Limpiar el timeout si el componente se desmonta
    }, [navigate]);

    const login = (newToken) => {
        setToken(newToken);
        localStorage.setItem('token', newToken);
    };

    const logout = () => {
        setToken(null);
        localStorage.removeItem('token');
        navigate('/login');
    };

    if (loading) {
        // Mostrar algún indicador de carga mientras se verifica el token
        return (
            <div className="loading-container">
                <div className="loading-text">Cargando...</div>
            </div>);
    }

    return (
        <AuthContext.Provider value={{ token, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};
