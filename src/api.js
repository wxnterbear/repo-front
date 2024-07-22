import axios from 'axios';

// Aquí se define la URL base para la api
const API_BASE_URL = 'http://127.0.0.1:8000/content_proposal/';

// Se crea un intancia de axios
const api = axios.create({
    // Se establece la URL base para todas las solicitudes
  baseURL: API_BASE_URL,
});

// Función para cargar todas las propuestas de contenido
export const getProposals = () => {
    // Solicitud get para obtener todas las propuestas
  return api.get('/');
};

// Función para cargar una propuesta por su id
export const getProposalById = (id) => {
    // Solicitud get para obtener la propuesta
  return api.get(`/${id}/`);
};

// Función para crear propuesta de contenido
export const createProposal = (data) => {
    // Solicitud post para crear propuesta
  return api.post('/', data);
};

// Función para actualizar una propuesta por su id
export const updateProposal = (id, data) => {
    // Solicitud put a la url con el id de la propuesta 
    return api.put(`/${id}/`, data);
  };
  
// Función para eliminar una propuesta por su id
  export const deleteProposal = (id) => {
    // Solicitud delete a la url con el id de la propuesta 
    return api.delete(`/${id}/`);
  };
