import React, { useEffect, useState } from "react";
import axios from 'axios';
import '../css/proposals.css'; 

function Proposals() {
  const [proposals, setProposals] = useState([]); // Arreglo vacío para guardar las propuestas
  const [comments, setComments] = useState({}); // Objeto vacío para guardar los comentarios
  const [commentBy, setCommentBy] = useState({}); // Objeto vacío para guardar a la persona que hace el comentario

  // Hook para cargar las propuestas
  useEffect(() => {
    axios.get('http://localhost:3001/proposals')
      .then(response => setProposals(response.data))
      .catch(error => console.error('Error al cargar las propuestas:', error));
  }, []);

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

  // Envía el comentario al servidor
  const handleCommentSubmit = (proposalId) => {
    const comment = {
      body: comments[proposalId],
      comment_by: commentBy[proposalId],
    };
  
    axios.post(`http://localhost:3001/proposals/${proposalId}/comments`, comment)
      .then(response => {
        console.log('Comentario enviado:', response.data);
      })
      .catch(error => {
        console.error('Error al enviar el comentario:', error.response ? error.response.data : error.message);
      });
  };
  
  // Acepta la propuesta enviando la petición al back
  const handleAcceptProposal = (proposalId) => {
    axios.put(`http://localhost:3001/proposals/${proposalId}/accept`)
      .then(response => {
        console.log('Propuesta aceptada:', response.data);
      })
      .catch(error => console.error('Error al aceptar la propuesta:', error));
  };

// Rechaza la propuesta enviando la petición al back
  const handleRejectProposal = (proposalId) => {
    axios.put(`http://localhost:3001/proposals/${proposalId}/reject`)
      .then(response => {
        console.log('Propuesta rechazada:', response.data);
      })
      .catch(error => console.error('Error al rechazar la propuesta:', error));
  };

  // id de la propuesta como key
  return (
    <div className="proposals-container">
      {proposals.length === 0 ? (
        <p> ~ No hay propuestas para mostrar ~ </p>
      ) : (
        proposals.map(proposal => (
          <div key={proposal.id} className="proposal">
            <h3>{proposal.title}</h3>
            <p>{proposal.description}</p>
            <div>
              <select
                name="comment_by"
                value={commentBy[proposal.id] || ''}
                onChange={(e) => handleCommentByChange(e, proposal.id)}
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
                value={comments[proposal.id] || ''}
                onChange={(e) => handleCommentChange(e, proposal.id)}
                placeholder="Escribe un comentario..."
                required
              ></textarea>
              <button onClick={() => handleCommentSubmit(proposal.id)}>Enviar comentario</button>
            </div>
            <div className="buttons">
              <button onClick={() => handleAcceptProposal(proposal.id)}>Aceptar</button>
              <button onClick={() => handleRejectProposal(proposal.id)}>Rechazar</button>
            </div>
          </div>
        ))
      )}
    </div>
  );
}

export default Proposals;
