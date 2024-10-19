import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import '../css/proposalDetail.css';
import Header from './header';

const ProposalDetail = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const [loading, setLoading] = useState(true);
    const [comments, setComments] = useState([]);
    const [selectedProposal, setSelectedProposal] = useState(null);
    const [error, setError] = useState('');
    const [newComment, setNewComment] = useState('');

    // Estado para el modal de cambio de estado
    const [showStatusModal, setShowStatusModal] = useState(false);
    const [newStatus, setNewStatus] = useState('');  // Nuevo estado seleccionado

    // Función para obtener la propuesta y los comentarios
    const fetchContentProposal = async () => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                alert('No tienes token de acceso. Inicia sesión primero.');
                navigate('/login');
                return;
            }

            const response = await fetch(`https://django-tester.onrender.com/content_proposal/${id}/`, {
                method: 'GET',
                headers: {
                    'Authorization': `Token ${token}`,
                    'Content-Type': 'application/json',
                },
            });

            if (response.ok) {
                const data = await response.json();
                const proposal = data.proposal;

                if (proposal) {
                    setSelectedProposal(proposal);
                    fetchComments(); // Llama a la función para obtener comentarios
                } else {
                    setError('Propuesta no encontrada.');
                }
            } else {
                setError('Error al obtener los datos.');
            }
        } catch (error) {
            setError('Error en la solicitud al servidor.');
        } finally {
            setLoading(false);
        }
    };

    // Función para obtener los comentarios
    const fetchComments = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`https://django-tester.onrender.com/content_proposal/${id}/`, {
                method: 'GET',
                headers: {
                    'Authorization': `Token ${token}`,
                    'Content-Type': 'application/json',
                },
            });

            if (response.ok) {
                const data = await response.json();
                setComments(data.comments); // Actualiza el estado con los comentarios obtenidos
            } else {
                console.error('Error al obtener comentarios');
            }
        } catch (error) {
            console.error('Error en la solicitud al servidor:', error);
        }
    };

    useEffect(() => {
        fetchContentProposal();
    }, [id, navigate]);

    const handleAddComment = async (event) => {
        event.preventDefault();
        if (!newComment.trim()) return;

        try {
            const token = localStorage.getItem('token');
            const formData = new FormData();
            formData.append('id', selectedProposal.id);
            formData.append('body', newComment);

            const response = await fetch(`https://django-tester.onrender.com/content_proposal/comment/`, {
                method: 'POST',
                headers: {
                    'Authorization': `Token ${token}`,
                },
                body: formData,
            });

            if (response.ok) {
                setNewComment(''); // Limpia el campo del nuevo comentario
                fetchComments(); // Vuelve a cargar los comentarios después de agregar uno nuevo
            } else {
                const errorData = await response.json();
                alert(`Error al agregar el comentario: ${JSON.stringify(errorData)}`);
            }
        } catch (error) {
            alert('Error al agregar el comentario');
        }
    };

    // Función para cambiar el estado de la propuesta
    const handleStatusChange = async () => {
        try {
            const token = localStorage.getItem('token');
            const formData = new FormData();
            formData.append('id', selectedProposal.id);
            formData.append('status', newStatus);  // Estado seleccionado

            const response = await fetch(`https://django-tester.onrender.com/content_proposal/change_status/`, {
                method: 'POST',
                headers: {
                    'Authorization': `Token ${token}`,
                },
                body: formData,
            });

            if (response.ok) {
                const result = await response.json();
                alert(`Estado cambiado correctamente: ${result.message}`);
                setShowStatusModal(false);  // Cerrar el modal después de cambiar el estado
            } else {
                const errorData = await response.json();
                alert(`Error al cambiar el estado: ${JSON.stringify(errorData)}`);
            }
        } catch (error) {
            alert('Error al cambiar el estado de la propuesta');
        }
    };

    if (loading) {
        return <p>Cargando...</p>;
    }

    if (!selectedProposal) {
        return <p className='proposal_empty'>No se encontró la propuesta.</p>;
    }

    return (
        <div className="proposal-detail-ad">
            <Header />
            <div className="proposal-container-ad">
                <div className="proposal-details-ad">
                    <h1>{selectedProposal.title}</h1>
                    <p><strong>Descripción:</strong> {selectedProposal.description || 'No hay descripción'}</p>
                    <p><strong>Tipo:</strong> {selectedProposal.type}</p>
                    <p><strong>Red social:</strong> {selectedProposal.social_media}</p>
                    <p><strong>Copy:</strong> {selectedProposal.copy || 'No hay copy'}</p>
                    <p><strong>Creado por:</strong> {selectedProposal.proposed_by || 'Desconocido'}</p>
                    <p><strong>Fecha de actualización:</strong> {selectedProposal.updated_at || 'Desconocida'}</p>
                </div>

                <div className="proposal-comments-ad">
                    <h2>Comentarios</h2>
                    {Array.isArray(comments) && comments.length > 0 ? (
                        comments.map((comment, index) => (
                            <div key={comment.id || index} className="comment-ad">
                                <p><strong>{comment.comment_by || 'Usuario desconocido'}</strong>: {comment.body || 'Comentario vacío'}</p>
                            </div>
                        ))
                    ) : (
                        <p>No hay comentarios.</p>
                    )}

                    <form onSubmit={handleAddComment}>
                        <textarea
                            className='comments-ad'
                            value={newComment}
                            onChange={(e) => setNewComment(e.target.value)}
                            placeholder="Escribe un comentario..."
                            required
                        />
                        <button className='btn-save-ad' type="submit">Agregar Comentario</button>
                    </form>
                </div>
            </div>
            <button className="btn-change-status-ad" onClick={() => setShowStatusModal(true)}>
                Cambiar Estado de la Propuesta
            </button>
            {/* Modal para cambiar el estado */}
            {showStatusModal && (
                <div className="modal-overlay-ad">
                    <div className="modal-content-ad">
                        <h2>Cambiar Estado</h2>
                        <label>Estado:</label>
                        <select
                            value={newStatus}
                            onChange={(e) => setNewStatus(e.target.value)}
                            className="status-select"
                        >
                            <option value="">Seleccionar...</option>
                            <option value="RJ">Rechazar</option>
                            <option value="AP">Aceptar</option>
                            <option value="MC">Pedir Cambios</option>
                        </select>
                        <button className="btn-save-ad" onClick={handleStatusChange}>
                            Enviar
                        </button>
                        <button className="btn-close-ad" onClick={() => setShowStatusModal(false)}>
                            Cancelar
                        </button>
                    </div>
                </div>
            )}

            {error && <p className="error-message">{error}</p>}
        </div>
    );
};

export default ProposalDetail;