import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import '../css/header.css';

const Header = () => {
    const navigate = useNavigate();
    const { logout } = useContext(AuthContext); // Usamos logout en lugar de setIsAuthenticated

    const handleLogout = () => {
        logout(); // Llamamos a la función logout del contexto
        navigate('/login'); // Redirige al login
    };

    const isLoggedIn = !!localStorage.getItem('token');

    return (
        <div className="header">
            <button className="opc" onClick={() => navigate('/brainstorming')}>Ir a lluvia de ideas</button>
            <button className="opc" onClick={() => navigate('/proposals')}>Ir a Propuestas</button>
            <button className="opc" onClick={() => navigate('/proposals_form')}>Ir al formulario de Propuestas</button>
            <button className="opc" onClick={() => navigate('/calendar')}>Ir a Calendario</button>
            {isLoggedIn && (
                <button className="opc" onClick={handleLogout}>Cerrar sesión</button>
            )}
        </div>
    );
};

export default Header;
