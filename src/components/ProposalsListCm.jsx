import React, { useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';
import '../css/proposalsList.css';
import '../css/header.css';

const ProposalsListCm = () => {
    const [proposals, setProposals] = useState([]);
    const navigate = useNavigate(); // Inicializa useNavigate

    // Función para obtener las propuestas
    const fetchContentProposal = async () => {
        try {
            // Obtener el token del localStorage
            const token = localStorage.getItem('token');

            if (!token) {
                alert('No tienes token de acceso. Inicia sesión primero.');
                navigate('/login');  // Redirigir al login si no hay token
                return;
            }

            // Realizar la solicitud GET con el token en el header
            const response = await fetch('https://django-tester.onrender.com/content_proposal/', {
                method: 'GET',
                headers: {
                    'Authorization': `Token ${token}`,  // Enviar el token en el header
                    'Content-Type': 'application/json'
                }
            });

            const data = await response.json();

            if (response.ok) {
                setProposals(data); // Actualiza el estado con los datos obtenidos
            } else {
                console.error('Error al obtener las propuestas:', data);
            }
        } catch (error) {
            console.error('Error en la solicitud GET:', error);
        }
    };

    useEffect(() => {
        fetchContentProposal();  // Ejecutar la función al montar el componente
    }, []);  // El hook de efecto solo se ejecuta una vez (al montar el componente)

    // Función para manejar el clic en el elemento <li>
    const handleClick = (id) => {
        navigate(`/content_proposal/${id}`); // Navega a la ruta del detalle de la propuesta
    };

    return (
        <div className="proposals-list">
            <div className="header">
                <button className="opc" onClick={() => navigate('/brainstorming')}>Ir a lluvia de ideas</button>
                <button className="opc" onClick={() => navigate('/proposals')}>Ir a Propuestas</button>
                <button className="opc" onClick={() => navigate('/proposals_form')}>Ir al formulario de Propuestas</button>
                <button className="opc" onClick={() => navigate('/calendar')}>Ir a Calendario</button>
            </div>
            <h1>Propuestas</h1>
            <ul>
                {/* Lista para mostrar las propuestas */}
                {proposals.map(proposal => (
                    <li className="proposals" key={proposal.id} onClick={() => handleClick(proposal.id)}>
                        {/* Cada propuesta se muestra en un elemento li con una key única */}
                        Nombre: {proposal.title} <br />
                        Descripción: {proposal.copy} <br />
                        Hecha por: {proposal.proposed_by}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default ProposalsListCm;
