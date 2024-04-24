import React, { createContext, useContext, useState } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [authState, setAuthState] = useState({
        isLoggedIn: false,
        login: () => setAuthState((prevState) => ({ ...prevState, isLoggedIn: true })),
        logout: () => setAuthState((prevState) => ({ ...prevState, isLoggedIn: false })),
    });

    return (
        <AuthContext.Provider value={authState}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);