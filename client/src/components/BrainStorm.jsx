import React, {useState} from "react";
import axios from 'axios';
import { useParams } from "react-router-dom";

const BrainStorm = async () => {

    const [formData, setFormData] = useState ([{

        title: '',
        type: '',       
        social_media: '',
        descripction: '',
        url: '',
        copy: '',
        proposed_by: '',
    }]);

    const [message, setMessage] = useState ('');

    const handleChange = (e) => {

        setFormData ({

            ...formData,
            [e.target.name] : e.target.value
        });
    }

    const handleSubmit = async(e) =>{

        e.preventDefault ();

        if (!formData.title || !formData.type || !formData.social_media || !formData.proposed_by) {
            setMessage('Por favor, complete todos los campos obligatorios.');
            return;
          }
    }

    try {

        const response = await axios.post('http://127.0.0.1:8000/content_proposal/', formData);
            setMessage('Propuesta enviada con éxito.');
            // Limpiar el formulario
            setFormData({
              title: '',
              type: '',
              social_media: '',
              description: '',
              copy: '',
              proposed_by: ''
            });
        
    } catch (error) {

        setMessage('Error al enviar la propuesta. Por favor, intente nuevamente.');
            console.error('Error al enviar la propuesta:', error);
        
    }

    return (
        <div className="brainstorming">
          <h1>Enviar Propuesta</h1>
          <form onSubmit={handleSubmit}>
            <label>
              Título:
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
              />
            </label>
            <label>
              Tipo:
              <input
                type="text"
                name="type"
                value={formData.type}
                onChange={handleChange}
                required
              />
            </label>
            <label>
              Red social:
              <input
                type="text"
                name="social_media"
                value={formData.social_media}
                onChange={handleChange}
                required
              />
            </label>
            <label>
              Descripción:
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
              />
            </label>
            <label>
              Copy:
              <textarea
                name="copy"
                value={formData.copy}
                onChange={handleChange}
              />
            </label>
            <label>
              Propuesto por:
              <input
                type="text"
                name="proposed_by"
                value={formData.proposed_by}
                onChange={handleChange}
                required
              />
            </label>
            <button type="submit">Enviar</button>
          </form>
          {message && <p>{message}</p>}
        </div>
      );

    
}

export default BrainStorm;
