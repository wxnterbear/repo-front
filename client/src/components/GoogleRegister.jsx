import React, {useState} from "react";
import { GoogleLogin } from "@react-oauth/google";
import { jwtDecode } from "jwt-decode";
import '../css/register.css';
import imagen from '../images/logologin.png';

const Register = () => {

    const [formData, setFormData] = useState({

        name: '',
        email: '',
        password: '',
    });

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // eviar los datos al back !!!
        console.log('Form Data:', formData);
    };

    return (
        <div className='main-container'>
            <div className='register-container'>
                <div className='image-container'>
                    <img src={imagen} alt='Imagen' className='image' />
                </div>
                <div className='form-container-register'>
                    <h1 className='title-register'>Registro</h1>
                    <center>
                        <form onSubmit={handleSubmit}>
                        <input
                            type='text'
                            name='name'
                            placeholder='Nombre'
                            value={formData.name}
                            onChange={handleChange}
                            className='name-register'
                            required
                            
                        />
                        <input
                            type='email'
                            name='email'
                            placeholder='Correo Electrónico'
                            value={formData.email}
                            onChange={handleChange}
                            className='input-field-register'
                            required
                        />
                        <input
                            type='password'
                            name='password'
                            placeholder='Contraseña'
                            value={formData.password}
                            onChange={handleChange}
                            className='input-field-register'
                            required
                        />
                        <button type='submit' className='submit-button-r'>
                            Registrarse
                        </button>
                    </form> </center>

                    <h3 className='subtitle-login'>O regístrate con Google</h3>

                    <GoogleLogin
                        onSuccess={credentialResponse => {
                            const decoded = jwtDecode(credentialResponse.credential);
                            console.log(decoded);
                            // Aquí puedes manejar el registro usando la cuenta de Google
                        }}
                        onError={() => {
                            console.log('Register Failed');
                        }}
                    />
                </div>
            </div>
        </div>
    );

}

export default Register;