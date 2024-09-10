import React from "react";
import { useNavigate } from "react-router-dom";
import '../css/home.css';
import '../css/header.css';

const Home = () => {

    const navigate = useNavigate();

    return (
        <div className="home-container">
          <div className="header">
            <button className="opc" onClick={() => navigate('/brainstorming')}>Ir a lluvia de ideas</button>
            <button className="opc" onClick={() => navigate('/proposals')}>Ir a Propuestas</button>
            <button className="opc" onClick={() => navigate('/proposals_form')}>Ir al formulario de Propuestas</button>
            <button className="opc" onClick={() => navigate('/calendar')}>Ir a Calendario</button>
          </div>
          <h1 className="title-home">¡Bienvenido!</h1>
          <p className="p-home"> Únete a nosotros en este viaje, donde cada voz cuenta y cada visión puede transformar el futuro. </p>
          <div className="auth-buttons">
            <button className="opc-l" onClick={() => navigate('/login')}>Login</button>
            <button className="opc-r" onClick={() => navigate('/register')}>Register</button>
          </div>
        </div>
      );
    };
    
export default Home;
