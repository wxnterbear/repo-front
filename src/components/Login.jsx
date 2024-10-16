import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext'; // Importar el contexto
import '../css/login.css';
import imagen from '../images/logologin.png';

const Login = () => {
    const navigate = useNavigate();
    const { login } = useContext(AuthContext); // Usar login del contexto
    const [formData, setFormData] = useState({
        username: '',
        password: ''
    });

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
    
        const data = new FormData();
        data.append('username', formData.username);
        data.append('password', formData.password);
    
        try {
            const response = await fetch('https://django-tester.onrender.com/auth/login/', {
                method: 'POST',
                body: data,
                credentials: 'include',
            });
    
            const contentType = response.headers.get('content-type');
    
            if (contentType && contentType.includes('application/json')) {
                const result = await response.json();
                
                if (response.ok) {
                    console.log('Login exitoso:', result);
                    const token = result.token;
                    
                    // Usar la función login del contexto
                    login(token);

                    // Redirigir después del login exitoso
                    navigate('/calendar');
                } else {
                    const errorMessage = result.message || 'Error desconocido';
                    alert('Error en la autenticación: ' + errorMessage);
                }
            } else {
                const htmlText = await response.text();
                console.error('El servidor devolvió HTML en lugar de JSON:', htmlText);
                alert('Error: El servidor devolvió una respuesta inesperada.');
            }
        } catch (error) {
            console.error('Error al intentar iniciar sesión:', error);
            alert('Error de red: no se pudo conectar al servidor.');
        }
    };

    return (
        <div className='container-l'>
            
            <div className='login-container'>
                <div className='image-container'>
                    <img src={imagen} alt='Imagen' className='image' />
                </div>
                <div className='form-container-login'>
                    <h1 className='title-login'>Inicio de sesión</h1>
                    <center>
                        <form onSubmit={handleSubmit}>
                            <input
                                type='text'
                                name='username'
                                placeholder='Username'
                                value={formData.username}
                                onChange={handleChange}
                                className='input-field-login'
                                required
                            />
                            <input
                                type='password'
                                name='password'
                                placeholder='Contraseña'
                                value={formData.password}
                                onChange={handleChange}
                                className='input-field-login'
                                required
                            />
                            <button type='submit' className='submit-button-l'>
                                Ingresar
                            </button>
                        </form> 
                    </center>
                </div>
            </div>
        </div>
    );
};

export default Login;
