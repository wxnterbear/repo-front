import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import '../css/proposalDetail.css';
import Header from './header';

const ProposalDetail = () => {
  const navigate = useNavigate();
  const { id } = useParams();  // Obtiene el id desde los parámetros de la url
  const [loading, setLoading] = useState(true); // Maneja el estado de carga
  const [comments, setComments] = useState({}); // Objeto para guardar comentarios
  const [commentBy, setCommentBy] = useState({}); // Objeto para la persona que hace el comentario
  const [selectedProposal, setSelectedProposal] = useState(null); // Cambiado a null para evitar problemas de renderizado
  const [error, setError] = useState(''); // Estado para manejar mensajes de error
  const [statusAction, setStatusAction] = useState(''); // Hook para el estado de la propuesta

  // Obtener los datos de las propuestas
  useEffect(() => {
    const fetchProposals = async () => {
      try {
        const response = await fetch('https://django-tester.onrender.com/content_proposal/', {
          credentials: 'include', // Incluye las credenciales (cookies) en la solicitud si es necesario
        });
        const data = await response.json();
        const proposal = data.find((proposal) => proposal.id === parseInt(id));
        console.log('Propuesta seleccionada:', proposal);
        setSelectedProposal(proposal);
      } catch (error) {
        console.error('Error obteniendo las propuestas:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProposals();
  }, [id]);

  // Actualiza el estado de 'comments' cuando se escribe un comentario
  const handleCommentChange = (event, proposalId) => {
    setComments({
      ...comments,
      [proposalId]: event.target.value,
    });
  };

  // Actualiza el estado de 'commentBy' cuando cambia la persona del comentario
  const handleCommentByChange = (event, proposalId) => {
    setCommentBy({
      ...commentBy,
      [proposalId]: event.target.value,
    });
  };

  // Actualiza el estado de 'statusAction' cuando se selecciona una opción
  const handleStatusChange = (event) => {
    setStatusAction(event.target.value);
  };

  // Envía el comentario y la acción al servidor
  const handleCommentSubmit = async (proposalId) => {
    if (!comments[proposalId] || !commentBy[proposalId] || !statusAction) {
      setError('Por favor, completa todos los campos antes de enviar el comentario.');
      return;
    }

    const comment = {
      body: comments[proposalId],
      comment_by: commentBy[proposalId],
    };

    try {
      // Envía el comentario al servidor
      const commentResponse = await fetch(`https://django-tester.onrender.com/proposals/${proposalId}/comments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(comment),
      });

      if (!commentResponse.ok) {
        throw new Error('Error al enviar el comentario');
      }

      console.log('Comentario enviado:', await commentResponse.json());
      setError('');

      // Envía la acción correspondiente (aceptar o rechazar)
      if (statusAction === 'accept' || statusAction === 'reject') {
        const actionResponse = await fetch(`https://django-tester.onrender.com/proposals/${proposalId}/${statusAction}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (!actionResponse.ok) {
          throw new Error(`Error al ${statusAction === 'accept' ? 'aceptar' : 'rechazar'} la propuesta`);
        }

        console.log(`Propuesta ${statusAction === 'accept' ? 'aceptada' : 'rechazada'}:`, await actionResponse.json());
      }

      // Limpia el estado después de enviar
      setStatusAction('');
    } catch (error) {
      console.error(error.message);
      setError('Error al enviar el comentario o la acción. Inténtalo nuevamente.');
    }
  };

  if (loading) {
    return <p>Cargando...</p>;
  }

  if (!selectedProposal) {
    return <p>No se encontró la propuesta.</p>;
  }

  return (
    <div className="proposal-detail">
      <Header />
      <h1>{selectedProposal.title}</h1>
      <p><strong>Descripción:</strong> {selectedProposal.desc || 'No hay descripción'}</p>
      <p><strong>Descripción 2.0:</strong> {selectedProposal.descripcion}</p>
      <p><strong>Tipo:</strong> {selectedProposal.type}</p>
      <p><strong>Red social:</strong> {selectedProposal.social_media}</p>
      <p><strong>Copy:</strong> {selectedProposal.copy || 'No hay copy'}</p>
      <p><strong>Creado por:</strong> {selectedProposal.proposed_by || 'Desconocido'}</p>
      <p><strong>Fecha de actualización:</strong> {selectedProposal.updated || 'Desconocida'}</p>

      {error && <p className="error-message">{error}</p>}

      <div>
        <select
          name="comment_by"
          value={commentBy[selectedProposal.id] || ''}
          onChange={(e) => handleCommentByChange(e, selectedProposal.id)}
        >
          <option value="" disabled>Selecciona un usuario</option>
          <option value="salo">salo</option>
          <option value="root">root</option>
          <option value="R1oGeyms">R1oGeyms</option>
        </select>
        <textarea
          name="body"
          cols="3"
          rows="3"
          value={comments[selectedProposal.id] || ''}
          onChange={(e) => handleCommentChange(e, selectedProposal.id)}
          placeholder="Escribe un comentario..."
          required
        ></textarea>
        <select
          name="status_action"
          value={statusAction}
          onChange={handleStatusChange}
        >
          <option value="" disabled>Selecciona una acción</option>
          <option value="AP">Aceptar</option>
          <option value="RJ">Rechazar</option>
          <option value="MC">Solicitar cambios</option>
        </select>
        <button
          className='btn-detail'
          onClick={() => handleCommentSubmit(selectedProposal.id)}
          disabled={!commentBy[selectedProposal.id] || !comments[selectedProposal.id] || !statusAction}
        >
          Enviar comentario
        </button>
      </div>
    </div>
  );
};

export default ProposalDetail;
