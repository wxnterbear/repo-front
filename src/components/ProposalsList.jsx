import React, { useEffect, useState } from "react";
import { useNavigate} from 'react-router-dom';
import axios from 'axios';
import '../css/proposalsList.css';
import Header from './header';

const ProposalsList = () => {
    const [proposals, setProposals] = useState([]);
    const navigate = useNavigate(); // Inicializa useNavigate

    useEffect(() => {
        // Función asincrónica para poder obtener las propuestas de la api
        const fetchProposals = async () => {
            try {
                // Solicitud get para obtener las propuestas
                const response = await axios.get('https://django-tester.onrender.com/content_proposal');
                // await -> provoca que la ejecución de una función async sea pausada 
                // hasta que una Promise sea terminada o rechazada, y regresa a la ejecución
                // de la función async después del término.

                setProposals(response.data) // Actualiza el estado de 'proposal' con las propuestas obtenidas

            } catch (error) {

                console.error('Error al obtener las propuestas: ', error);

            }
        };

        fetchProposals();
    }, []) // [] -> El hook de efecto solo se ejecuta una vez (al montar el componente)

    // Función para manejar el clic en el elemento <li>
    const handleClick = (id) => {
        navigate(`/content_proposal/${id}`); // Navega a la ruta del detalle de la propuesta
    };

    return (
        <div className="proposals-list">
            <Header />
            <h1>Propuestas</h1>
            <ul>
                {/* Lista para mostrar las propuestas */}
                {proposals.map(proposal => (
                    // Itera sobre el array de propuestas y muestra un elemento li por cada propuesta
                    <li className="proposals" key={proposal.id} onClick={() => handleClick(proposal.id)}>
                        {/* Cada propuesta se muestra en un elemento li con una key única */}       
                        Nombre: {proposal.title} <br/ >
                        Descripción: {proposal.copy} <br/ >
                        Hecha por: {proposal.proposed_by}
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default ProposalsList;


