import React, { useState, useEffect } from "react";
import '../css/linkAccount.css';
import { useLocation, useNavigate } from "react-router-dom"; // Importar useNavigate
import Swal from 'sweetalert2'; // Importar SweetAlert

const LinkAccount = () => {
    const location = useLocation();
    const navigate = useNavigate(); // Para manejar la redirección
    const [error, setError] = useState(null);
    const [hasCheckedGoogle, setHasCheckedGoogle] = useState(false);
    const [token, setToken] = useState(localStorage.getItem('token')); // Obtener el token del localStorage
    const [isGoogleLinked, setIsGoogleLinked] = useState(localStorage.getItem('isGoogleLinked') === 'true'); // Estado de vinculación de Google

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
                handleOauthCallback(queryString); // Llama a la función de callback para Google
                setHasCheckedGoogle(true); // Marca que ya se ha ejecutado el callback de Google
            }
        }
    }, [hasCheckedGoogle, location.search, token]); // Dependencias de useEffect

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
        setIsGoogleLinked(storedIsGoogleLinked);
    }, []); // Solo se ejecuta una vez al montar el componente

    return (
        <div className="link-container">
            <h1>Vinculación de cuentas</h1>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            <center>
                <button onClick={handleLinkGoogle} disabled={isGoogleLinked}>
                    {isGoogleLinked ? "Cuenta de Google Vinculada" : "Iniciar Vinculación con Google"}
                </button>
            </center>
        </div>
    );
};

export default LinkAccount;
