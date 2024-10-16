import React, { useState, useContext } from "react";
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Select from 'react-select';
import '../css/proposalsForm.css';
import Header from './header';
import { AuthContext } from "../context/AuthContext";

const ProposalsForms = () => {
    const navigate = useNavigate();
    const { token } = useContext(AuthContext);

    const [title, setTitle] = useState('');
    const [type, setType] = useState('');
    const [socialMedia, setSocialMedia] = useState([]);
    const [copy, setCopy] = useState('');
    const [description, setDescription] = useState('');
    const [proposedBy, setProposedBy] = useState('');
    const [files, setFiles] = useState([]);
    const [error, setError] = useState('');

    // Opciones para el multiselect de redes sociales
    const socialMediaOptions = [
        { value: 'IG', label: 'Instagram' },
        { value: 'FB', label: 'Facebook' },
        { value: 'YT', label: 'YouTube' }
    ];

    const handleTitleChange = (e) => setTitle(e.target.value);
    const handleTypeChange = (e) => setType(e.target.value);
    const handleSocialMediaChange = (selectedOptions) => {
        setSocialMedia(selectedOptions ? selectedOptions.map(option => option.value) : []);
    };
    const handleDescriptionChange = (e) => setDescription(e.target.value);
    const handleCopyChange = (e) => setCopy(e.target.value);
    const handleProposedByChange = (e) => setProposedBy(e.target.value);
    const handleFilesChange = (e) => setFiles(e.target.files);

    // Función de validación
    const validateForm = () => {
        if (socialMedia.includes('YT') && type === 'IMG') {
            setError('YouTube no permite subir imágenes. Por favor, selecciona otro tipo de contenido o redes sociales.');
            return false;
        }
        setError(''); // Resetea el error si todo está bien
        return true;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Verificar que el token esté presente
        if (!token) {
            alert('Token no disponible. Por favor, inicia sesión nuevamente.');
            navigate('/login'); // Redirige a la página de login si no hay token
            return;
        }

        // Validar el formulario
        if (!validateForm()) {
            return; // Si la validación falla, no envía el formulario
        }

        const formData = new FormData();
        formData.append('title', title);
        formData.append('type', type);
        formData.append('social_media', socialMedia.join(', ')); // Agrega las redes sociales seleccionadas
        formData.append('copy', copy);
        formData.append('description', description);
        formData.append('proposed_by', proposedBy);

        for (let i = 0; i < files.length; i++) {
            formData.append('files', files[i]);
        }

        // Depuración: imprimir el contenido de formData
        for (let [key, value] of formData.entries()) {
            console.log('Token:', token);

            console.log(key, value);
        }

        try {
            const response = await axios.post('https://django-tester.onrender.com/content_proposal/', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'Authorization': `Bearer ${token}`, 
                },
            });

            console.log('Respuesta del servidor:', response.data);
            alert('Propuesta enviada con éxito');
            navigate('/'); // Redirige a la página deseada después de enviar la propuesta
        } catch (error) {
            console.error('Error al enviar la propuesta:', error.response ? error.response.data : error.message);
            alert('Hubo un error al enviar la propuesta: ' + (error.response ? error.response.data : error.message));
        }
    };

    return (
        <div className="container-f">
            <Header />
            <center>
                <div className="form-c">
                    <form onSubmit={handleSubmit}>
                        <div className="form-container"><center>
                            <strong className="title-p">Propuestas de contenido</strong>
                            <div className="title-container">
                                <label>Título:</label><br />
                                <input className="input-form-p" type="text" value={title} onChange={handleTitleChange} required />
                            </div>
                            <div className="type-container">
                                <label>Tipo:</label>
                                <select className="select-form-p" value={type} onChange={handleTypeChange} required>
                                    <option value="">---------</option>
                                    <option value="VID">Video</option>
                                    <option value="IMG">Imagen</option>
                                    <option value="STI">Storie_Image</option>
                                    <option value="STV">Storie_Video</option>
                                </select>
                            </div>
                            <div className="sm-container">
                                <label>Redes Sociales:</label>
                                <Select
                                    isMulti
                                    options={socialMediaOptions}
                                    onChange={handleSocialMediaChange}
                                    className="select-form-p"
                                />
                            </div>

                            {error && <p style={{ color: 'red' }}>{error}</p>}

                            <div className="copy-container">
                                <label>Copy:</label>
                                <textarea className="copy" value={copy} onChange={handleCopyChange} required ></textarea>
                            </div>
                            <div className="description-container">
                                <label>Descripción:</label>
                                <textarea className="description-form" value={description} onChange={handleDescriptionChange} required ></textarea>
                            </div>
                            <div className="pb-container">
                                <label>Propuesto por:</label>
                                <select value={proposedBy} onChange={handleProposedByChange} required>
                                    <option value="">---------</option>
                                    <option value="wavy">wavy</option>
                                    <option value="salo">salo</option>
                                </select>
                            </div>
                            <div className="file-container">
                                <label>Archivos:</label>
                                <input type="file" multiple onChange={handleFilesChange} />
                            </div>
                            <button className="btn-pform" type="submit">Enviar Propuesta</button>
                        </center>
                        </div>
                    </form>
                </div>
            </center>
        </div>
    );
};

export default ProposalsForms;
