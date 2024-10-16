import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const ProtectedRoute = ({ children }) => {
    const { token } = useContext(AuthContext);  // Accede al token del contexto

    if (!token) {
        // Si no hay token, redirige al login
        return <Navigate to="/login" />;
    }

    // Si hay token, renderiza el componente hijo (la ruta protegida)
    return children;
};

export default ProtectedRoute;
