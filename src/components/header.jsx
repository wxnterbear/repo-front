import React, { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import '../css/header.css';

const Header = () => {
    const [menuOpen, setMenuOpen] = useState(false); // Estado para controlar el menú
    const navigate = useNavigate();
    const { logout } = useContext(AuthContext);

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const isLoggedIn = !!localStorage.getItem('token');

    const toggleMenu = () => {
        setMenuOpen(prevState => !prevState);
    };

    return (
        <div className={`header ${menuOpen ? 'header-expanded' : ''}`}>
            <button className="hamburger" onClick={toggleMenu}>☰</button>
            <div className={`menu ${menuOpen ? 'open' : ''}`}>
                <button className="opc" onClick={() => navigate('/brainstorming')}>Ir a lluvia de ideas</button>
                <button className="opc" onClick={() => navigate('/proposals')}>Ir a Propuestas</button>
                <button className="opc" onClick={() => navigate('/proposals_form')}>Ir al formulario de Propuestas</button>
                <button className="opc" onClick={() => navigate('/calendar')}>Ir a Calendario</button>
                {isLoggedIn && (
                    <button className="opc" onClick={handleLogout}>Cerrar sesión</button>
                )}
            </div>
        </div>
    );
};

export default Header;
