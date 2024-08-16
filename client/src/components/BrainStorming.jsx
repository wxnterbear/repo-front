import React, { useState, useEffect } from "react";
import axios from "axios";
import Modal from "react-modal";
import { useNavigate } from 'react-router-dom';
import '../css/ideas.css'

const Brainstorming = () => {
    const [ideas, setIdeas] = useState([]); // Estado para almacenar las ideas
    const [newIdea, setNewIdea] = useState(''); // Estado para la nueva idea 
    const [modalIsOpen, setModalIsOpen] = useState(false); // Estado para controlar si el modal está abierto
    const [selectedIdea, setSelectedIdea] = useState(null); // Estado para la idea seleccionada en el modal
    const [selectedUser, setSelectedUser] = useState(''); // Estado para el usuario seleccionado en el modal
    const [action, setAction] = useState(''); // Estado para la acción seleccionada (aceptar/rechazar) en el modal
    const navigate = useNavigate(); // para pasar al otro componente

    useEffect(() => {
        const fetchIdeas = async () => {
            const response = await axios.get('http://localhost:3001/ideas');
            setIdeas(response.data);
        };

        fetchIdeas();
    }, []);



    const handleInputChange = (e) => {
        setNewIdea(e.target.value);
    };

    const handleAddIdea = async () => {
        if (newIdea.trim()) { // Verifica que la idea no esté vacía después de eliminar espacios en blanco
            await axios.post('http://localhost:3001/ideas', { idea: newIdea }); // Envía la nueva idea al servidor
            setIdeas([...ideas, newIdea]); // Actualiza 'ideas' con la nueva idea
            setNewIdea(''); // Limpia el textarea
        }
    };

    // Abre el modal para una idea específica
    const openModal = (idea) => {
        setSelectedIdea(idea); // Establece la idea seleccionada
        setModalIsOpen(true); // Abre el modal
    };

    // Cierra el modal
    const closeModal = () => {
        setModalIsOpen(false);
        setSelectedIdea(null); // Resetea la idea seleccionada
        setSelectedUser(''); // Resetea el usuario seleccionado
        setAction(''); // Resetea la acción seleccionada
    };

    // Maneja la acción de aceptar o rechazar la idea
    const handleAction = async () => {
        if (selectedUser && action) { // Verifica que un usuario y una acción estén seleccionados
            const endpoint = action === 'accept' ? 'accept' : 'reject'; // Determina el endpoint en función de la acción
            await axios.post(`http://localhost:3001/ideas/${endpoint}`, { // Envía la idea y el usuario al servidor
                idea: selectedIdea,
                user: selectedUser
            });
            setIdeas(ideas.filter(i => i !== selectedIdea)); // Elimina la idea aceptada o rechazada del estado ideas
            closeModal(); // Cierra el modal
        }
    };

    return (
        <div className="brainstorming-container">
            <div className="brainstorming-header">
                <h1 className="title"><strong>Lluvia de ideas</strong></h1>
                <button className="archive-button" onClick={() => navigate('/ideas-archive')}><strong>Ideas Aceptadas/Rechazadas</strong></button> {/* Botón para navegar */}     
            </div>
            <textarea
                value={newIdea}
                onChange={handleInputChange}
                placeholder="Añade una nueva idea..."
            ></textarea>
            <br />
            <button onClick={handleAddIdea}>Agregar idea</button>
            <div className="ideas-board">
                {ideas.map((idea, index) => ( // Mapea las ideas y renderiza un div para cada una
                    <div key={index} className="idea-postit" onClick={() => openModal(idea)}> {/* Cada idea es un "post-it" */}
                        {idea}
                    </div>
                ))}
            </div>
            <Modal
                isOpen={modalIsOpen}
                onRequestClose={closeModal} // Evento onRequestClose para cerrar el modal
                contentLabel="Idea Modal" // Etiqueta de contenido para el modal
                className="modal"
                overlayClassName="modal-overlay"
            >
                <h2>¿Qué deseas hacer con la idea?</h2>
                <select
                    value={selectedUser}
                    onChange={(e) => setSelectedUser(e.target.value)} // Evento onChange para actualizar el estado user
                >
                    <option value="" disabled>Selecciona un usuario</option>
                    <option value="salo">salo</option>
                    <option value="root">root</option>
                    <option value="R1oGeyms">R1oGeyms</option>
                </select>
                <br />
                <select
                    value={action}
                    onChange={(e) => setAction(e.target.value)} // Evento onChange para actualizar el estado action
                >
                    <option value="" disabled>Selecciona una acción</option>
                    <option value="accept">Aceptar</option>
                    <option value="reject">Rechazar</option>
                </select>
                <br />
                <button onClick={handleAction}>Confirmar</button> {/* Botón para confirmar la acción */}
                <button onClick={closeModal}>Cancelar</button> {/* Botón para cancelar y cerrar el modal */}
            </Modal>
        </div>
    );
}

export default Brainstorming;