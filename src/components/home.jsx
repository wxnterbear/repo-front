import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import '../css/home.css';
import '../css/header.css';
import Header from "./header";

const Home = () => {
    const [menuOpen, setMenuOpen] = useState(false);
    const navigate = useNavigate();

    const toggleMenu = () => {
        setMenuOpen(!menuOpen);
    };

    return (
        <div className={`home-container ${menuOpen ? 'shifted' : ''}`}>
            <div className="header-container">
                <Header toggleMenu={toggleMenu} menuOpen={menuOpen} />
            </div>
            <h1 className="title-home">¡Bienvenido!</h1>
            <p className="p-home">
                Únete a nosotros en este viaje, donde cada voz cuenta y cada visión puede transformar el futuro.
            </p>
            {/* <div className="auth-buttons">
                <button className="opc-l" onClick={() => navigate('/login')}>Login</button>
            </div>
            */}
        </div>
    );
};

export default Home;
