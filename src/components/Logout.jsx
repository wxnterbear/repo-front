// components/Logout.js
import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const Logoutl = () => {
    const { logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        localStorage.removeItem('token'); // Elimina el token del localStorage
        
    };

    return (
        <button onClick={handleLogout}>
            Logout
        </button>
    );
};

export default Logoutl;
