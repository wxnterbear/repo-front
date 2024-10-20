import React from "react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "./header";
import '../css/about.css'

const About = () => {

    const navigate = useNavigate();
    const token = localStorage.getItem('token');
    const [errorMessage, setErrorMessage] = useState('')

    const [formData, setFormData] = useState({
        subject: '',
        email: '',
        message: ''
    })

    useEffect(() => {
        // Verificar que el token esté presente al cargar el componente
        if (!token) {
            alert('Token no disponible. Por favor, inicia sesión nuevamente.');
            navigate('/login'); // Redirige a la página de login si no hay token
        }
    }, [token, navigate]); // Dependencias del useEffect

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        })
    }

    const handleSubmit = async (e) => {
        e.preventDetault();
        const data = new FormData();
        data.append('subject', formData.subject);
        data.append('email', formData.email);
        data.append('message', formData.message);

        try {
            const response = await fetch('https://django-tester.onrender.com/about', {
                method: 'POST',
                headers: {
                    Authorization: `Token ${token}`,
                },
                body: formData,

            })

            if (!response.ok) {
                // respuesta server
                const errorData = await response.json();
                setErrorMessage(errorData.detail || 'Error al enviar el mensaje.');
            } else {
                alert('Mensaje enviado con éxito.');
                console.log('Formulario enviado:', formData);
                setFormData({ email: '', subject: '', message: '' });
            }

        } catch (error) {
            console.error('Error en la solicitud:', error);
            alert('Hubo un error al enviar el mensaje. Intenta de nuevo más tarde.');

        }

    }

    return (
        <div className="main-container">
            <Header />
            <div className="about-container">
                <section className="about-header">
                    <h1 className="title-about">Sobre Nuestra Aplicación</h1>
                    <p className="p1-about">Descubre para qué hemos creado esta herramienta :o</p>
                </section>

                <section className="about-content">
                    <div className="about-objective">
                        <h2 className="subtitle-about">Nuestros Objetivos :D</h2>
                        <p className="p2-about">sdadadad</p>
                    </div>

                    <div className="about-goals">
                        <div className="goal-item">
                            <h3 className="goal-about">Objetivo 1</h3>
                            <p className="p-goal">sdadasdasdas</p>
                        </div>

                        <div className="goal-item">
                            <h3 className="goal-about">Objetivo 2</h3>
                            <p className="p-goal">dasdasdasdas</p>
                        </div>

                        <div className="goal-item">
                            <h3 className="goal-about">Objetivo 3</h3>
                            <p className="p-goal">dasdasdasd</p>
                        </div>

                        <div className="goal-item">
                            <h3 className="goal-about">Objetivo 4</h3>
                            <p className="p-goal">sdasdasdasd</p>
                        </div>
                        
                    </div>
                </section>

                <section className="about-contact">
                    <h2 className="title-contact">Contáctanos</h2>
                    <form className="contact-form" onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label htmlFor="email">Correo Electrónico</label>
                            <input
                                type="email"
                                name="email"
                                id="email"
                                value={formData.email}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="subject">Asunto</label>
                            <input
                                type="text"
                                name="subject"
                                id="subject"
                                value={formData.subject}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="message">Mensaje</label>
                            <textarea
                            className="textarea-about"
                                name="message"
                                id="message"
                                rows="5"
                                value={formData.message}
                                onChange={handleChange}
                                required
                            ></textarea>
                        </div>

                        {errorMessage && <p className="error-message">{errorMessage}</p>}

                        <button type="submit" className="send-btn">Enviar Mensaje</button>
                    </form>
                </section>
            </div>
        </div>
    );
}
export default About;