import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";

const LinkAccount = () => {
    const location = useLocation();
    const queryString = location.search; // Esto incluye todo lo que está después del '?'
    const token = localStorage.getItem('token'); // Obtener el token del localStorage
    const [data, setData] = useState(null); // Para almacenar los datos de respuesta del servidor
    const [error, setError] = useState(''); // Para manejar errores

    // Verificar si el token está presente
    if (!token) {
        console.error('No se encontró el token de autenticación');
        return (
            <div>
                <h1>Error</h1>
                <p>No se encontró el token de autenticación. Por favor, inicia sesión nuevamente.</p>
            </div>
        );
    }

    // Función para hacer la solicitud al backend
    const fetchGoogleCallback = async () => {
        try {
            const response = await fetch(`https://django-tester.onrender.com/auth/google/oauth2callback${queryString}`, {
                method: 'GET',
                headers: {
                    'Authorization': `Token ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                throw new Error(`Error: ${response.status} ${response.statusText}`);
            }

            const res = await response.json();
            console.log('Respuesta del servidor:', res);
            setData(res); // Almacenar los datos en el estado
        } catch (error) {
            console.error('Error al hacer la solicitud:', error);
            setError(error.message); // Almacenar el mensaje de error
        }
    };

    // Efecto para realizar la solicitud después de verificar el token
    useEffect(() => {
        fetchGoogleCallback();
    }, []);

    return (
        <div>
            <h1>Ruta Dinámica</h1>
            {error && <p style={{ color: 'red' }}>{error}</p>} {/* Mostrar errores si los hay */}
            {data ? (
                <div>
                    <h2>Datos de la respuesta:</h2>
                    <pre>{JSON.stringify(data, null, 2)}</pre> {/* Mostrar datos de respuesta */}
                </div>
            ) : (
                <p>Esperando respuesta del servidor...</p> // Mensaje de carga
            )}
            <p>Parámetros: {queryString}</p>
        </div>
    );
};

export default LinkAccount;
