import React, { useState, useEffect } from "react";
import '../css/linkAccount.css';
import { useLocation, useNavigate } from "react-router-dom";
import Swal from 'sweetalert2';

const LinkAccount = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [error, setError] = useState(null);
    const [hasCheckedGoogle, setHasCheckedGoogle] = useState(false);
    const [token, setToken] = useState(localStorage.getItem('token'));
    const [isGoogleLinked, setIsGoogleLinked] = useState(localStorage.getItem('isGoogleLinked') === 'true');

    useEffect(() => {
        if (!token) {
            console.error('No se encontró el token de autenticación');
            setError('No se encontró el token de autenticación. Por favor, inicia sesión nuevamente.');
            return;
        }

        const queryString = location.search;
        if (!hasCheckedGoogle && queryString) {
            const params = new URLSearchParams(queryString);
            const code = params.get('code');
            const state = params.get('state');

            if (code && state) {
                handleOauthCallback(queryString);
                setHasCheckedGoogle(true);
            }
        }
    }, [hasCheckedGoogle, location.search, token]);

    const handleLinkGoogle = async () => {
        try {
            const token = localStorage.getItem('token');

            const response = await fetch('https://django-tester.onrender.com/auth/google/', {
                method: 'GET',
                headers: {
                    'Authorization': `Token ${token}`,
                    'Content-Type': 'application/json',
                },
            });

            const data = await response.json();
            console.log('Respuesta del servidor (link):', data);

            if (data) {
                window.location.href = data;
            } else {
                setError('Error al obtener la URL de autenticación de Google');
            }
        } catch (error) {
            setError('Error al iniciar el proceso de vinculación con Google');
        }
    };

    const handleUnlinkGoogle = async () => {
        try {
            const token = localStorage.getItem('token');
    
            const response = await fetch('https://django-tester.onrender.com/auth/google/unlink', { // Cambiar a la URL correcta
                method: 'GET',  // Cambia a 'GET' si es lo que acepta el endpoint
                headers: {
                    'Authorization': `Token ${token}`,
                    'Content-Type': 'application/json',
                },
            });
    
            if (response.ok) {
                localStorage.removeItem('isGoogleLinked'); // Eliminar del localStorage
                setIsGoogleLinked(false); // Actualizar estado
    
                Swal.fire({
                    title: 'Desvinculación exitosa!',
                    text: 'La cuenta de Google ha sido desvinculada con éxito',
                    icon: 'success',
                    confirmButtonText: 'Aceptar'
                }).then(() => {
                    navigate('/link_account');
                });
            } else {
                const errorData = await response.json();
                setError(`Error al desvincular la cuenta de Google: ${errorData.message}`);
            }
        } catch (error) {
            setError('Error al procesar la solicitud de desvinculación');
        }
    };
    

    const handleOauthCallback = async (queryString) => {
        console.log('Procesando callback con queryString:', queryString);

        const url = `https://django-tester.onrender.com/auth/google/oauth2callback${queryString}`;

        try {
            const response = await fetch(url, {
                method: 'GET',
                headers: {
                    'Authorization': `Token ${token}`,
                    'Content-Type': 'application/json',
                },
            });

            if (response.ok) {
                const result = await response.json();
                console.log('Resultado del servidor:', result);
                setIsGoogleLinked(true);
                localStorage.setItem('isGoogleLinked', 'true');

                Swal.fire({
                    title: 'Vinculación exitosa!',
                    text: 'La cuenta de Google ha sido vinculada con éxito',
                    icon: 'success',
                    confirmButtonText: 'Aceptar'
                }).then(() => {
                    navigate('/link_account');
                });
            } else {
                const errorData = await response.json();
                setError(`Error al procesar el callback de Google: ${errorData.message}`);
            }
        } catch (error) {
            setError('Error en la solicitud al servidor');
        }
    };

    useEffect(() => {
        const storedIsGoogleLinked = localStorage.getItem('isGoogleLinked') === 'true';
        setIsGoogleLinked(storedIsGoogleLinked);
    }, []);

    return (
        <div className="link-container">
            <h1>Vinculación de cuentas</h1>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            <center>
                {isGoogleLinked ? (
                    <button onClick={handleUnlinkGoogle}>
                        Desvincular cuenta de Google
                    </button>
                ) : (
                    <button onClick={handleLinkGoogle}>
                        Iniciar Vinculación con Google
                    </button>
                )}
            </center>
        </div>
    );
};

export default LinkAccount;
