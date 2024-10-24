import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../css/unauthorized.css'

const Unauthorized = () => {
    const navigate = useNavigate();

    const handleRedirect = () => {
        navigate('/'); // Redirige al usuario a la página de inicio
    };

    return (
        <div className='container-u'>
            <h1 className='title-u'>Acceso Denegado</h1>
            <p className='message-u'>No tienes permiso para acceder a esta página</p>
            <button className='btn-u' onClick={handleRedirect}>
                Volver al inicio
            </button>
        </div>
    );
};

export default Unauthorized;
