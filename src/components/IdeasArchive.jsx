import React, { useState, useEffect } from "react";
import { useNavigate} from 'react-router-dom';
import axios from "axios";
import '../css/ideasArchive.css';
import '../css/header.css';

const IdeasArchive = () => {
    const [acceptedIdeas, setAcceptedIdeas] = useState([]); // Estado para almacenar las ideas aceptadas
    const [rejectedIdeas, setRejectedIdeas] = useState([]); // Estado para almacenar las ideas rechazadas

    const navigate = useNavigate();

    useEffect(() => {

        const fetchIdeas = async () => {
            try {
                const acceptedResponse = await axios.get('django-tester.onrender.com/ideas/accepted');
                setAcceptedIdeas(acceptedResponse.data); // Actualiza  'acceptedIdeas' con las ideas aceptadas

                const rejectedResponse = await axios.get('django-tester.onrender.com/ideas/rejected');
                setRejectedIdeas(rejectedResponse.data); // Actualiza  'rejectedIdeas' con las ideas rechazadas
            } catch (error) {
                console.error('Error fetching ideas:', error);
            }
        };

        fetchIdeas(); // Llama a la función para obtener las ideas
    }, []); // El segundo argumento [] asegura que esto solo se ejecute una vez al montar el componente

    return (
        <div className="ideas-archive-container"> {/* Contenedor principal */}
        <div className="header">
            <button className="opc" onClick={() => navigate('/brainstorming')}>Ir a lluvia de ideas</button>
            <button className="opc" onClick={() => navigate('/proposals')}>Ir a Propuestas</button>
            <button className="opc" onClick={() => navigate('/proposals_form')}>Ir al formulario de Propuestas</button>
            <button className="opc" onClick={() => navigate('/calendar')}>Ir a Calendario</button>
          </div>
            <div className="ideas-board-a-r accepted">
                <h1 className="title-a">Ideas Aceptadas</h1> {/* Título para las ideas aceptadas */}
                <div className="ideas-list-a-r"> {/* Contenedor para las ideas aceptadas */}
                    {acceptedIdeas.map((idea, index) => ( // Mapea las ideas aceptadas y renderiza un div para cada una
                        <div key={index} className="idea-postit-a-r"> {/* Cada idea es un "post-it" */}
                            <p><strong>Idea:</strong> {idea.idea}</p> {/* Texto de la idea */}
                            <p><strong>Usuario:</strong> {idea.user}</p> {/* Usuario que tomó la acción */}
                        </div>
                    ))}
                </div>
            </div>
            <div className="ideas-board-a-r rejected">
                <h1 className="title-r">Ideas Rechazadas</h1> {/* Título para las ideas rechazadas */}
                <div className="ideas-list-a-r"> {/* Contenedor para las ideas rechazadas */}
                    {rejectedIdeas.map((idea, index) => ( // Mapea las ideas rechazadas y renderiza un div para cada una
                        <div key={index} className="idea-postit-a-r"> {/* Cada idea es un "post-it" */}
                            <p><strong>Idea:</strong> {idea.idea}</p> {/* Texto de la idea */}
                            <p><strong>Usuario:</strong> {idea.user}</p> {/* Usuario que tomó la acción */}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default IdeasArchive; // Exporta el componente para su uso en otros archivos
