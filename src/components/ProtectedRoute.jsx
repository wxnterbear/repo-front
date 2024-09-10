import React from 'react';
import { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { authContext } from '../context/AuthContext';

// Componente que protege una ruta
function ProtectedRoute({ children }) {
  const { isAuthenticated } = useContext(authContext); // Obtiene el estado de autenticación desde authcontext

  if (!isAuthenticated) {
    return <Navigate to="/login" />; // Redirigir a login
  }

  return children;
}

export default ProtectedRoute;