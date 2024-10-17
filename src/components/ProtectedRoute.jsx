import { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const ProtectedRoute = ({ children }) => {
    const { token } = useContext(AuthContext);

    if (!token) {
        // Redirigir al login solo si no hay token
        return <Navigate to="/login" replace />;
    }

    // Si hay token, renderizar el componente solicitado
    return children;
};

export default ProtectedRoute;
