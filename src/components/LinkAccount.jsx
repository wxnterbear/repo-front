import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import '../css/linkAccount.css';
import Header from './header';

const LinkAccount = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [loading, setLoading] = useState(true);
    const [linked, setLinked] = useState(false);
    const [error, setError] = useState('');

    const handleLinkGoogle = async () => {
        try {
            const response = await fetch('https://django-tester.onrender.com/auth/google/');
            const data = await response.json();
            console.log('Respuesta del servidor:', data);
            
            if (data) {
                window.location.href = data; 
            } else {
                setError('Error al obtener la URL de autenticación de Google');
            }
        } catch (error) {
            setError('Error al iniciar el proceso de vinculación con Google');
        }
    };

    const handleOauthCallback = async () => {
        const params = new URLSearchParams(location.search);
        const code = params.get('code');
        const state = params.get('state');
        const scope = params.get('scope');

        console.log('code:', code, 'state:', state, 'scope:', scope);

        if (code && state && scope) {
            const url = `https://django-tester.onrender.com/auth/google/oauth2callback/?state=${state}&code=${code}&scope=${scope}`;
            console.log('olo')
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
                    if (result.message === 'Credenciales creadas') {
                        setLinked(true);
                        navigate('/link_account'); 
                    } else {
                        setError(result.message);
                    }
                } else {
                    const errorData = await response.json();
                    setError(`Error al procesar el callback de Google: ${errorData.message}`);
                }
            } catch (error) {
                setError('Error en la solicitud al servidor');
            } finally {
                setLoading(false);
            }
        } else {
            console.log('Faltan parámetros para la vinculación.');
            setLoading(false);
        }
    };

    const handleUnlinkGoogle = async () => {
        try {
            const response = await fetch('https://django-tester.onrender.com/auth/unlink/google/', {
                method: 'POST', 
                headers: {
                    'Authorization': `Token ${localStorage.getItem('token')}`, 
                },
            });

            if (response.ok) {
                setLinked(false); 
            } else {
                const errorData = await response.json();
                setError(`Error al desvincular: ${errorData.message}`);
            }
        } catch (error) {
            setError('Error en la solicitud al servidor');
        }
    };

    useEffect(() => {
        handleOauthCallback();
    }, []);

    if (loading) {
        return <p>Cargando...</p>;
    }

    return (
        <div className="l-container">
            <Header />
            <div className="link-container">
                <h1>Vinculación de Cuentas</h1>
                {linked ? (
                    <div>
                        <center>
                            <p>Tu cuenta está vinculada.</p>
                            <button onClick={handleUnlinkGoogle}>Desvincular Cuenta de Google</button>
                        </center>
                    </div>
                ) : (
                    <center>
                        <button onClick={handleLinkGoogle}>Vincular Cuenta de Google</button>
                    </center>
                )}
                {error && <p style={{ color: 'red' }}>{error}</p>}
            </div>
        </div>
    );
};

export default LinkAccount;
