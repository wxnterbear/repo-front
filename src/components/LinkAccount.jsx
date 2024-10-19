import React, { useState, useEffect } from "react";
import '../css/linkAccount.css';
import { useLocation, useNavigate } from "react-router-dom"; // Importar useNavigate
import Swal from 'sweetalert2'; // Importar SweetAlert

const LinkAccount = () => {
    const location = useLocation();
    const navigate = useNavigate(); // Para manejar la redirección
    const [error, setError] = useState(null);
    const [hasCheckedGoogle, setHasCheckedGoogle] = useState(false);
    const [hasCheckedMeta, setHasCheckedMeta] = useState(false);
    const [token, setToken] = useState(localStorage.getItem('token')); // Obtener el token del localStorage
    const [isGoogleLinked, setIsGoogleLinked] = useState(localStorage.getItem('isGoogleLinked') === 'true'); // Estado de vinculación de Google
    const [isMetaLinked, setIsMetaLinked] = useState(localStorage.getItem('isMetaLinked') === 'true'); // Estado de vinculación de Meta

    useEffect(() => {
        // Verificar el token al cargar el componente
        if (!token) {
            console.error('No se encontró el token de autenticación');
            setError('No se encontró el token de autenticación. Por favor, inicia sesión nuevamente.');
            return; // Salir si no hay token
        }

        // Si hay parámetros en la URL, llamar a la función de callback para Google
        const queryString = location.search;
        if (!hasCheckedGoogle && queryString) {
            const params = new URLSearchParams(queryString);
            const code = params.get('code');
            const state = params.get('state');

            // Solo proceder si existen los parámetros de Google en la URL
            if (code && state) {
                handleOauthCallback(queryString, 'google'); // Llama a la función de callback para Google
                setHasCheckedGoogle(true); // Marca que ya se ha ejecutado el callback de Google
            }
        }

        // Si hay parámetros en la URL, llamar a la función de callback para Meta
        if (!hasCheckedMeta && queryString) {
            const params = new URLSearchParams(queryString);
            const code = params.get('code');
            const state = params.get('state');

            // Solo proceder si existen los parámetros de Meta en la URL
            if (code && state) {
                handleOauthMetaCallback(queryString); // Llama a la función de callback para Meta
                setHasCheckedMeta(true); // Marca que ya se ha ejecutado el callback de Meta
            }
        }
    }, [hasCheckedGoogle, hasCheckedMeta, location.search, token]); // Dependencias de useEffect

    const handleLinkGoogle = async () => {
        try {
            const response = await fetch('https://django-tester.onrender.com/auth/google/');
            const data = await response.json();
            console.log('Respuesta del servidor (link):', data);

            if (data) {
                window.location.href = data; // Redirige a la URL de autenticación de Google
            } else {
                setError('Error al obtener la URL de autenticación de Google');
            }
        } catch (error) {
            setError('Error al iniciar el proceso de vinculación con Google');
        }
    };

    const handleLinkMeta = () => {
        const clientId = '1360414881319473'; 
        const redirectUri = encodeURIComponent('https://repo-front-o1hw.onrender.com/auth/meta/');
        const scope = encodeURIComponent('email,pages_manage_cta,pages_manage_instant_articles,pages_manage_engagement,pages_manage_posts,pages_read_engagement,publish_video,instagram_basic,instagram_shopping_tag_products,instagram_content_publish');

        const authUrl = `https://www.facebook.com/v17.0/dialog/oauth?client_id=${clientId}&redirect_uri=${redirectUri}&scope=${scope}&response_type=code`;

        window.location.href = authUrl;
    };

    const handleOauthMetaCallback = async (queryString) => {
        console.log('Procesando callback de Meta con queryString:', queryString);

        const url = `https://django-tester.onrender.com/auth/meta/${queryString}`;

        try {
            const response = await fetch(url, {
                method: 'GET',
                headers: {
                    'Authorization': `Token ${token}`, // Agregar el token a la cabecera
                    'Content-Type': 'application/json',
                },
            });

            if (response.ok) {
                const result = await response.json();
                console.log('Resultado del servidor Meta:', result);
                setIsMetaLinked(true); // Cambiar estado a vinculado para Meta
                localStorage.setItem('isMetaLinked', 'true'); // Guardar en localStorage

                // Usar SweetAlert para mostrar la vinculación exitosa
                Swal.fire({
                    title: 'Vinculación exitosa!',
                    text: 'La cuenta de Meta ha sido vinculada con éxito',
                    icon: 'success',
                    confirmButtonText: 'Aceptar'
                }).then(() => {
                    navigate('/link_account'); // Redirigir al componente LinkAccount
                });
            } else {
                const errorData = await response.json();
                setError(`Error al procesar el callback de Meta: ${errorData.message}`);
            }
        } catch (error) {
            setError('Error en la solicitud al servidor');
        }
    };

    const handleOauthCallback = async (queryString) => {
        console.log('Procesando callback con queryString:', queryString);

        const url = `https://django-tester.onrender.com/auth/google/oauth2callback${queryString}`;

        try {
            const response = await fetch(url, {
                method: 'GET',
                headers: {
                    'Authorization': `Token ${token}`, // Agregar el token a la cabecera
                    'Content-Type': 'application/json',
                },
            });

            if (response.ok) {
                const result = await response.json();
                console.log('Resultado del servidor:', result);
                setIsGoogleLinked(true); // Cambiar estado a vinculado para Google
                localStorage.setItem('isGoogleLinked', 'true'); // Guardar en localStorage

                // Usar SweetAlert para mostrar la vinculación exitosa
                Swal.fire({
                    title: 'Vinculación exitosa!',
                    text: 'La cuenta de Google ha sido vinculada con éxito',
                    icon: 'success',
                    confirmButtonText: 'Aceptar'
                }).then(() => {
                    navigate('/link_account'); // Redirigir al componente LinkAccount
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
        // Actualizar el estado local basado en localStorage
        const storedIsGoogleLinked = localStorage.getItem('isGoogleLinked') === 'true';
        const storedIsMetaLinked = localStorage.getItem('isMetaLinked') === 'true';
        setIsGoogleLinked(storedIsGoogleLinked);
        setIsMetaLinked(storedIsMetaLinked);
    }, []); // Solo se ejecuta una vez al montar el componente

    return (
        <div className="link-container">
            <h1>Vinculación de cuentas</h1>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            <center>
                <button onClick={handleLinkGoogle} disabled={isGoogleLinked}>
                    {isGoogleLinked ? "Cuenta de Google Vinculada" : "Iniciar Vinculación con Google"}
                </button>
                <br />
                <button onClick={handleLinkMeta} disabled={isMetaLinked}>
                    {isMetaLinked ? "Cuenta de Meta Vinculada" : "Iniciar Vinculación con Meta"}
                </button>
            </center>
        </div>
    );
};

export default LinkAccount;
