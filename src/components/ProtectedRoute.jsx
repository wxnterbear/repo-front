import { useContext } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const ProtectedRoute = ({ requiredAdmin }) => {
    const { token, isAdmin } = useContext(AuthContext);

    console.log("Token:", token);
    console.log("User is admin:", isAdmin);

    // Si no hay token, redirige al login
    if (!token) {
        return <Navigate to="/login" replace />;
    }

    // Si se requiere un admin y el usuario no es admin
    if (requiredAdmin && !isAdmin) {
        return <Navigate to="/unauthorized" replace />;
    }

    // Si se requiere un no-admin y el usuario es admin
    if (!requiredAdmin && isAdmin) {
        return <Navigate to="/unauthorized" replace />;
    }

    return <Outlet />; // Renderiza las rutas hijas
};

export default ProtectedRoute;
