import React, { createContext, useContext, useState } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [authState, setAuthState] = useState({
        isLoggedIn: false,
        authToken: null,
        login: (token) => {
            setAuthState((prevState) => ({ ...prevState, isLoggedIn: true, authToken: token }));
            // Navigate to user-specific dashboard URL
        },
        logout: () => {
            setAuthState((prevState) => ({ ...prevState, isLoggedIn: false, authToken: null }));
            // Navigate to login or home page
        },
    });

    return (
        <AuthContext.Provider value={authState}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);