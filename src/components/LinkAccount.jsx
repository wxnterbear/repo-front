import React, { useState, useEffect } from "react";
import '../css/linkAccount.css';
import { useLocation, useNavigate } from "react-router-dom"; // Importar useNavigate
import Swal from 'sweetalert2'; // Importar SweetAlert

const LinkAccount = () => {
    const location = useLocation();
    const navigate = useNavigate(); // Para manejar la redirección
    const [error, setError] = useState(null);
    const [hasChecked, setHasChecked] = useState(false);
    const [token, setToken] = useState(localStorage.getItem('token')); // Obtener el token del localStorage
    const [isLinked, setIsLinked] = useState(localStorage.getItem('isLinked') === 'true'); // Obtener el estado de vinculación desde localStorage

    useEffect(() => {
        // Verificar el token al cargar el componente
        if (!token) {
            console.error('No se encontró el token de autenticación');
            setError('No se encontró el token de autenticación. Por favor, inicia sesión nuevamente.');
            return; // Salir si no hay token
        }

        // Si hay parámetros en la URL, llamar a la función de callback
        const queryString = location.search;
        if (!hasChecked && queryString) {
            const params = new URLSearchParams(queryString);
            const code = params.get('code');
            const state = params.get('state');

            // Solo proceder si existen los parámetros de Google en la URL
            if (code && state) {
                handleOauthCallback(queryString); // Solo llama a la función si hay parámetros
                setHasChecked(true); // Marca que ya se ha ejecutado el callback
            } else {
                console.log('No se encontraron parámetros de Google en la URL.');
            }
        }
    }, [hasChecked, location.search, token]); // Dependencias de useEffect

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
                setIsLinked(true); // Cambiar estado a vinculado
                localStorage.setItem('isLinked', 'true'); // Guardar en localStorage

                // Usar SweetAlert para mostrar la vinculación exitosa
                Swal.fire({
                    title: 'Vinculación exitosa!',
                    text: 'La cuenta de Google ha sido vinculada con éxito',
                    icon: 'success',
                    confirmButtonText: 'Aceptar'
                }).then(() => {
                    navigate('/link-account'); // Redirigir al componente LinkAccount
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
        const storedIsLinked = localStorage.getItem('isLinked') === 'true';
        setIsLinked(storedIsLinked);
    }, []); // Solo se ejecuta una vez al montar el componente

    return (
        <div className="link-container">
            <h1>Vinculación de Google</h1>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            <center>
                <button onClick={handleLinkGoogle} disabled={isLinked}>
                    {isLinked ? "Cuenta Vinculada" : "Iniciar Vinculación con Google"}
                </button>
            </center>
        </div>
    );
};

export default LinkAccount;
