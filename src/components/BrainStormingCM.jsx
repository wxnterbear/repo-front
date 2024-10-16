import React, { useState, useEffect } from "react";
import axios from "axios";
import Modal from "react-modal";
import { useNavigate } from 'react-router-dom';
import '../css/ideas.css'
import Header from './header';

const BrainstormingCM = () => {
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
        if (action === 'edit') {
            if (selectedIdea) {
                await axios.put(`http://localhost:3001/ideas/${selectedIdea.id}`, {
                    idea: selectedIdea.idea
                });
                const updatedIdeas = ideas.map(idea =>
                    idea.id === selectedIdea.id ? selectedIdea : idea
                );
                setIdeas(updatedIdeas); // Actualiza la lista de ideas con la idea editada
                closeModal();
            }
        } else if (action === 'delete') {
            if (selectedIdea) {
                await axios.delete(`http://localhost:3001/ideas/${selectedIdea.id}`);
                setIdeas(ideas.filter(i => i.id !== selectedIdea.id)); // Elimina la idea del estado
                closeModal();
            }
        };
    };

    return (
        <div className="brainstorming-container">
            <Header />
            <div className="brainstorming-header">
                <h1 className="title-brainstorming">Lluvia de ideas</h1>
                <button className="archive-button" onClick={() => navigate('/ideas-archive')}>Ideas Aceptadas/Rechazadas</button> {/* Botón para navegar */}
            </div>
            <center><textarea
                className="textarea-brainstorming"
                value={newIdea}
                onChange={handleInputChange}
                placeholder="Añade una nueva idea..."
            ></textarea>
                <br />
                <button className="btn-add" onClick={handleAddIdea}>Agregar idea</button></center>
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
                    <option value="edit">Editar</option>
                    <option value="delete">Eliminar</option>
                </select>
                <br />

                {action === 'edit' && (
                    <>
                        <textarea
                            value={selectedIdea ? selectedIdea.idea : ''}
                            onChange={(e) => setSelectedIdea({ ...selectedIdea, idea: e.target.value })}
                        />
                        <br />
                    </>
                )}

                {action === 'delete' && (
                    <p className="conf_delete">¿Estás seguro de que deseas eliminar esta idea?</p>
                )}
                <button className='btn' onClick={handleAction}>Confirmar</button> {/* Botón para confirmar la acción */}
                <button className='btn' onClick={closeModal}>Cancelar</button> {/* Botón para cancelar y cerrar el modal */}
            </Modal>
        </div>
    );
}

export default BrainstormingCM;