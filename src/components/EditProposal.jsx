import React, { useEffect, useState, useContext } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import Select from 'react-select';
import { AuthContext } from "../context/AuthContext";
import '../css/proposalsForm.css';
import Header from './header';

const EditProposal = () => {
    const navigate = useNavigate();
    const { token } = useContext(AuthContext);
    const { id } = useParams();

    const [title, setTitle] = useState('');
    const [type, setType] = useState('');
    const [socialMedia, setSocialMedia] = useState([]);
    const [copy, setCopy] = useState('');
    const [description, setDescription] = useState('');
    const [proposedBy, setProposedBy] = useState('');
    const [files, setFiles] = useState([]);
    const [error, setError] = useState('');

    const socialMediaOptions = [
        { value: 'IG', label: 'Instagram' },
        { value: 'FB', label: 'Facebook' },
        { value: 'YT', label: 'YouTube' }
    ];

    useEffect(() => {
        const fetchProposal = async () => {
            try {
                const response = await axios.get(`https://django-tester.onrender.com/content_proposal/${id}/`, {
                    headers: {
                        'Authorization': `Token ${token}`,
                    }
                });
                const proposal = response.data;

                // Verifica que los datos se carguen correctamente
                console.log(proposal);

                // Cargar los valores en el estado
                setTitle(proposal.title || '');
                setType(proposal.type || '');
                setSocialMedia(proposal.social_media ? proposal.social_media.split(', ').map(sm => ({ value: sm, label: sm })) : []);
                setCopy(proposal.copy || '');
                setDescription(proposal.description || '');
                setProposedBy(proposal.proposed_by || '');
            } catch (error) {
                console.error('Error fetching proposal:', error);
                setError('Error al cargar la propuesta.');
            }
        };

        fetchProposal();
    }, [id, token]);

    const handleSocialMediaChange = (selectedOptions) => {
        setSocialMedia(selectedOptions || []);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!token) {
            alert('Token no disponible. Por favor, inicia sesión nuevamente.');
            navigate('/login');
            return;
        }

        const formData = new FormData();
        formData.append('title', title);
        formData.append('type', type);
        formData.append('social_media', socialMedia.map(sm => sm.value).join(', '));
        formData.append('copy', copy);
        formData.append('description', description);
        formData.append('proposed_by', proposedBy);

        for (let i = 0; i < files.length; i++) {
            formData.append('files', files[i]);
        }

        try {
            await axios.put(`https://django-tester.onrender.com/content_proposal/${id}/`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'Authorization': `Token ${token}`,
                },
            });

            alert('Propuesta actualizada con éxito');
            navigate('/'); // Redirige después de actualizar
        } catch (error) {
            console.error('Error al actualizar la propuesta:', error);
            alert('Hubo un error al actualizar la propuesta: ' + (error.response ? error.response.data : error.message));
        }
    };

    return (
        <div className="container-f">
            <Header />
            <center>
                <div className="form-c">
                    <form onSubmit={handleSubmit}>
                        <div className="form-container"><center>
                            <strong className="title-p">Editar Propuesta</strong>
                            <div className="title-container">
                                <label>Título:</label><br />
                                <input 
                                    className="input-form-p" 
                                    type="text" 
                                    value={title || ''} 
                                    onChange={e => setTitle(e.target.value)} 
                                    required 
                                />
                            </div>
                            <div className="type-container">
                                <label>Tipo:</label>
                                <select 
                                    className="select-form-p" 
                                    value={type || ''} 
                                    onChange={e => setType(e.target.value)} 
                                    required
                                >
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
                                    value={socialMedia.length > 0 ? socialMedia : []} 
                                    onChange={handleSocialMediaChange}
                                    className="select-form-p"
                                />
                            </div>

                            {error && <p style={{ color: 'red' }}>{error}</p>}

                            <div className="copy-container">
                                <label>Copy:</label>
                                <textarea 
                                    className="copy" 
                                    value={copy || ''} 
                                    onChange={e => setCopy(e.target.value)} 
                                    required 
                                ></textarea>
                            </div>
                            <div className="description-container">
                                <label>Descripción:</label>
                                <textarea 
                                    className="description-form" 
                                    value={description || ''} 
                                    onChange={e => setDescription(e.target.value)} 
                                    required 
                                ></textarea>
                            </div>
                            <div className="pb-container">
                                <label>Propuesto por:</label>
                                <select 
                                    value={proposedBy || ''} 
                                    onChange={e => setProposedBy(e.target.value)} 
                                    required
                                >
                                    <option value="">---------</option>
                                    <option value="wavy">wavy</option>
                                    <option value="salo">salo</option>
                                </select>
                            </div>
                            <div className="file-container">
                                <label>Archivos:</label>
                                <input 
                                    type="file" 
                                    multiple 
                                    onChange={e => setFiles(e.target.files)} 
                                />
                            </div>
                            <button className="btn-pform" type="submit">Actualizar Propuesta</button>
                        </center>
                        </div>
                    </form>
                </div>
            </center>
        </div>
    );
};

export default EditProposal;
