import React from "react";
import { Navigate, useNavigate } from "react-router-dom";
import '../css/home.css';

const Home = () => {

    const navigate = useNavigate();

    return (
        <div className="home-container">
          <h1 className="title-home">Bienvenido</h1>
          <div className="button-container">
            <button className="opc" onClick={() => navigate('/brainstorming')}>Ir a lluvia de ideas</button>
            <button className="opc" onClick={() => navigate('/proposals')}>Ir a Propuestas</button>
            <button className="opc" onClick={() => navigate('/proposals_form')}>Ir al formulario de Propuestas</button>
            <button className="opc" onClick={() => navigate('/calendar')}>Ir a Calendario</button>
          </div>
        </div>
      );
    };
    
export default Home;