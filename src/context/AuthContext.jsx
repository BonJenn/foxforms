import React, { createContext, useContext, useState } from 'react';

const AuthContext = createContext({
    isLoggedIn: false,  // Ensure default state includes all necessary fields
    authToken: null,
    userId: null
});

export const AuthProvider = ({ children }) => {
    const [authState, setAuthState] = useState({
        isLoggedIn: false,
        authToken: null,
        userId: null
    });

    const login = (token, userId, navigate) => { // Ensure navigate is passed here
        setAuthState({ isLoggedIn: true, authToken: token, userId: userId });
        if (navigate) {
            navigate(`/dashboard/${token}`); // Use navigate only if it's provided
        }
    };

    const logout = () => {
        setAuthState({ isLoggedIn: false, authToken: null, userId: null });
    };

    return (
        <AuthContext.Provider value={{ authState, setAuthState, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
