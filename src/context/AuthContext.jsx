import React, { useState, createContext } from "react";

export const authContext = createContext(); //Crea el contexto

const AuthContext = ({ children }) => {

    const [isAuthenticated, setisAuthenticated] = useState(false);

    const login = () => setisAuthenticated(true);
    const logout = () => setisAuthenticated(true);


    return (
        <authContext.Provider
            value={
                {
                    isAuthenticated,
                    login,
                    logout
                }
            }
        >
            {children}

        </authContext.Provider>
    )
}
export default AuthContext;