import React, { useState } from "react";
import axios from 'axios';
import '../css/proposalsForm.css';

const ProposalsForms = () => {

    const [title, setTitle] = useState('');
    const [type, setType] = useState('');
    const [socialMedia, setSocialMedia] = useState('');
    const [copy, setCopy] = useState('');
    const [description, setDescription] = useState('');
    const [proposedBy, setProposedBy] = useState('');
    const [files, setFiles] = useState([]);

    // Manejadores de los eventos -> actualizan los hook cuando el usuario cambie los valores de los campos

    const handleTitleChange = (e) => setTitle(e.target.value);
    const handleTypeChange = (e) => setType(e.target.value);
    const handleSocialMediaChange = (e) => setSocialMedia(e.target.value);
    const handleDescriptionChange = (e) => setDescription(e.target.value);
    const handleCopyChange = (e) => setCopy(e.target.value);
    const handleProposedByChange = (e) => setProposedBy(e.target.value);
    const handleFilesChange = (e) => setFiles(e.target.files);

    // Manejador para enviar el form

    const handleSubmit = async (e) => {
        e.preventDefault(); // Previene que la página se recargue

        const formData = new FormData(); //  Se crea una instancia para enviar datos

        // Se añaden los datos del form al formdata
        formData.append('title', title);
        formData.append('type', type);
        formData.append('social_media', socialMedia);
        formData.append('copy', copy);
        formData.append('description', description);
        formData.append('proposed_by', proposedBy);

        //Se aaden los archivos seleccionados al formdata

        for (let i = 0; i < files.length; i++) {
            formData.append('files', files[i]);
        }

        try {

            const response = await axios.post('http://localhost:8000/content_proposal/', formData, {
                // El encabezado indica que el body de la solicitud 'formdata' está codificado en
                // 'multipart/form-data' -> formato para enviar archivos a través de http
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            console.log('Respuesta del servidor:', response.data); // respuesta del servidor en la consola
            alert('Propuesta enviada con éxito');

        } catch (error) {

            console.error('Error al enviar la propuesta:', error); //
            alert('Hubo un error al enviar la propuesta');
        }
    }

    return (
        <form onSubmit={handleSubmit}>
            <div className="form-container">
                <strong className="title-p">Propuestas de contenido</strong>
                <div className="title-container">
                    <label>Title:</label>
                    <input type="text" value={title} onChange={handleTitleChange} required />
                </div>
                <div className="type-container">
                    <label>Type:</label>
                    <select value={type} onChange={handleTypeChange} required>
                        <option value="">---------</option>
                        <option value="VID">Video</option>
                        <option value="IMG">Image</option>
                        <option value="STI">Storie_Image</option>
                        <option value="STV">Storie_Video</option>
                    </select>
                </div>
                <div className="sm-container">
                    <label>Social Media:</label>
                    <select value={socialMedia} onChange={handleSocialMediaChange} required>
                        <option value="">---------</option>
                        <option value="IG">Instagram</option>
                        <option value="FB">Facebook</option>
                        <option value="IF">Instagram-Facebook</option>
                    </select>
                </div>
                <div className="copy-container">
                    <label>Copy:</label>
                    <textarea className="copy" value={copy} onChange={handleCopyChange} required ></textarea>
                </div>
                <div className="description-container">
                    <label>Description:</label>
                    <textarea className="description" value={description} onChange={handleDescriptionChange} required ></textarea>
                </div>
                <div className="pb-container">
                    <label>Proposed By:</label>
                    <select value={proposedBy} onChange={handleProposedByChange} required>
                        <option value="">---------</option>
                        <option value="wavy">wavy</option>
                    </select>
                </div>
                <div className="file-container">
                    <label>Files:</label>
                    <input type="file" multiple onChange={handleFilesChange} />
                </div>
                <button className="btn-pform" type="submit">Enviar Propuesta</button>
            </div>

        </form>
    );



}

export default ProposalsForms;