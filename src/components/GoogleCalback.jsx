import React from "react";
import { useLocation } from "react-router-dom";

const GoogleCallback = () => {
    let token ="as"
    const location = useLocation();
    const queryString = location.search; // Esto incluye todo lo que está después del '?'
    console.log(queryString)
    fetch(`https://django-tester.onrender.com/auth/google/oauth2callback/${queryString}`, {
        method: 'GET',
        headers: {
            'Authorization': `Token ${token}`,
            'Content-Type': 'application/json'
        }
    })
        .then(response => {
            console.log(response)
            return response.json()
        })
        .then(res => {
            console.log(res)

        })
        .catch(error => {
            console.error(error);
        });
    return (
        <div>
            <h1>Ruta Dinámica</h1>
            <p>Parámetros: {queryString}</p>
        </div>
    );
};

export default GoogleCallback;