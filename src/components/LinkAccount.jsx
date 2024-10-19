import React, { useState } from "react";
import '../css/linkAccount.css'
import { useLocation } from "react-router-dom";

const LinkAccount = () => {
    const location = useLocation();
    const [message, setMessage] = useState("");
    const [error, setError] = useState(null);
    const [hasChecked, setHasChecked] = useState(false); 

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
                    'Content-Type': 'application/json',
                },
            });

            if (response.ok) {
                const result = await response.json();
                console.log('Resultado del servidor:', result);
                setMessage(`Vinculación exitosa: ${JSON.stringify(result)}`);
            } else {
                const errorData = await response.json();
                setError(`Error al procesar el callback de Google: ${errorData.message}`);
            }
        } catch (error) {
            setError('Error en la solicitud al servidor');
        }
    };

    // Verifica si hay parámetros en la URL y ejecuta el callback
    const queryString = location.search;

    // Llama al callback solo si se ha cambiado el estado y no se ha hecho antes
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

    return (
        <div>
            <h1>Vinculación de Google</h1>
            {error ? (
                <p style={{ color: 'red' }}>{error}</p>
            ) : (
                <p>{message}</p>
            )}
            <button onClick={handleLinkGoogle}>Iniciar Vinculación con Google</button>
        </div>
    );
};

export default LinkAccount;
