import React from 'react';
import { GoogleLogin } from '@react-oauth/google';
import { jwtDecode } from "jwt-decode";
import '../css/login.css';
import imagen from '../images/logologin.png';

const Login = () => {
    return (
        <div className='container'>
            <div className='login-container'>
                <div className='image-container'>
                    <img src={imagen} alt='Imagen' className='image' />
                </div>
                <div className='form-container'>

                    <h1 className='title'>Inicio de sesión</h1>

                    <GoogleLogin
                        onSuccess={credentialResponse => {
                            const decoded = jwtDecode(credentialResponse.credential);
                            console.log(decoded);
                        }}
                        onError={() => {
                            console.log('Login Failed');
                        }}
                    />
                    
                </div>
            </div>
        </div>

    );
};

export default Login;