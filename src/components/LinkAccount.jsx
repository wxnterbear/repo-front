import React, { useState, useEffect } from "react";
import '../css/linkAccount.css';
import { useLocation, useNavigate } from "react-router-dom";
import Swal from 'sweetalert2';

const LinkAccount = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [error, setError] = useState(null);
    const [token, setToken] = useState(localStorage.getItem('token'));

    // Estado para Google
    const [hasCheckedGoogle, setHasCheckedGoogle] = useState(false);
    const [isGoogleLinked, setIsGoogleLinked] = useState(localStorage.getItem('isGoogleLinked') === 'true');

    // Estado para Meta
    const [hasCheckedMeta, setHasCheckedMeta] = useState(false);
    const [isMetaLinked, setIsMetaLinked] = useState(localStorage.getItem('isMetaLinked') === 'true');

    useEffect(() => {
        if (!token) {
            setError('No se encontró el token de autenticación. Por favor, inicia sesión nuevamente.');
            return;
        }

        const queryString = location.search;

        // Verificar el callback de Google
        if (!hasCheckedGoogle && queryString) {
            const params = new URLSearchParams(queryString);
            const code = params.get('code');
            const state = params.get('state');
            if (code && state) {
                handleOauthCallbackGoogle(queryString);
                setHasCheckedGoogle(true);
            }
        }

        // Verificar el callback de Meta
        if (!hasCheckedMeta && queryString) {
            const params = new URLSearchParams(queryString);
            const code = params.get('code');
            const state = params.get('state');
            if (code && state) {
                handleOauthCallbackMeta(queryString);
                setHasCheckedMeta(true);
            }
        }
    }, [hasCheckedGoogle, hasCheckedMeta, location.search, token]);

    const handleLinkGoogle = async () => {
        try {
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
                window.location.href = data; // Redirige a la autenticación de Google
            } else {
                setError('Error al obtener la URL de autenticación de Google');
            }
        } catch (error) {
            setError('Error al iniciar el proceso de vinculación con Google');
        }
    };

    const handleLinkMeta = async () => {
        window.location.href = 'https://www.facebook.com/v17.0/dialog/oauth?client_id=1360414881319473&redirect_uri=https%3A%2F%2Frepo-front-o1hw.onrender.com%2Fauth%2Fmeta%2F&scope=email%2Cpages_manage_cta%2Cpages_manage_instant_articles%2Cpages_manage_engagement%2Cpages_manage_posts%2Cpages_read_engagement%2Cpublish_video%2Cinstagram_basic%2Cinstagram_shopping_tag_products%2Cinstagram_content_publish&response_type=code&ret=login&fbapp_pres=0&logger_id=41cf9ed8-b228-4b0f-af1e-a2806bd3a321&tp=unspecified&cbt=1725916819679&ext=1725920435&hash=AeZAyJGld3iQbPmNgr4';
    };

    const handleUnlinkGoogle = async () => {
        try {
            const response = await fetch('https://django-tester.onrender.com/auth/google/unlink', {
                method: 'GET',
                headers: {
                    'Authorization': `Token ${token}`,
                    'Content-Type': 'application/json',
                },
            });

            if (response.ok) {
                localStorage.removeItem('isGoogleLinked');
                setIsGoogleLinked(false);
                Swal.fire({
                    title: 'Desvinculación exitosa!',
                    text: 'La cuenta de Google ha sido desvinculada con éxito',
                    icon: 'success',
                    confirmButtonText: 'Aceptar'
                }).then(() => navigate('/link_account'));
            } else {
                const errorData = await response.json();
                setError(`Error al desvincular la cuenta de Google: ${errorData.message}`);
            }
        } catch (error) {
            setError('Error al procesar la solicitud de desvinculación');
        }
    };

    const handleUnlinkMeta = async () => {
        try {
            const response = await fetch('https://django-tester.onrender.com/auth/meta/unlink', {
                method: 'GET',
                headers: {
                    'Authorization': `Token ${token}`,
                    'Content-Type': 'application/json',
                },
            });

            if (response.ok) {
                localStorage.removeItem('isMetaLinked');
                setIsMetaLinked(false);
                Swal.fire({
                    title: 'Desvinculación exitosa!',
                    text: 'La cuenta de Meta ha sido desvinculada con éxito',
                    icon: 'success',
                    confirmButtonText: 'Aceptar'
                }).then(() => navigate('/link_account'));
            } else {
                const errorData = await response.json();
                setError(`Error al desvincular la cuenta de Meta: ${errorData.message}`);
            }
        } catch (error) {
            setError('Error al procesar la solicitud de desvinculación');
        }
    };

    const handleOauthCallbackGoogle = async (queryString) => {
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
                setIsGoogleLinked(true);
                localStorage.setItem('isGoogleLinked', 'true');
                Swal.fire('Vinculación exitosa!', 'La cuenta de Google ha sido vinculada', 'success');
            } else {
                const errorData = await response.json();
                setError(`Error al procesar el callback de Google: ${errorData.message}`);
            }
        } catch (error) {
            setError('Error en la solicitud al servidor');
        }
    };

    const handleOauthCallbackMeta = async (queryString) => {
        const url = `https://django-tester.onrender.com/auth/meta/oauth2callback${queryString}`;

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
                setIsMetaLinked(true);
                localStorage.setItem('isMetaLinked', 'true');
                Swal.fire('Vinculación exitosa!', 'La cuenta de Meta ha sido vinculada', 'success');
            } else {
                const errorData = await response.json();
                setError(`Error al procesar el callback de Meta: ${errorData.message}`);
            }
        } catch (error) {
            setError('Error en la solicitud al servidor');
        }
    };

    useEffect(() => {
        setIsGoogleLinked(localStorage.getItem('isGoogleLinked') === 'true');
        setIsMetaLinked(localStorage.getItem('isMetaLinked') === 'true');
    }, []);

    return (
        <div className="link-container">
            <h1>Vinculación de cuentas</h1>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            <center>
                {isGoogleLinked ? (
                    <button onClick={handleUnlinkGoogle}>Desvincular cuenta de Google</button>
                ) : (
                    <button onClick={handleLinkGoogle}>Iniciar Vinculación con Google</button>
                )}
                {isMetaLinked ? (
                    <button onClick={handleUnlinkMeta}>Desvincular cuenta de Meta</button>
                ) : (
                    <button onClick={handleLinkMeta}>Iniciar Vinculación con Meta</button>
                )}
            </center>
        </div>
    );
};

export default LinkAccount;
