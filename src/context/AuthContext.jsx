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
        userId: null,  // Add userId to the state
        login: (token, userId) => {  // Accept userId as a parameter
            setAuthState((prevState) => ({ ...prevState, isLoggedIn: true, authToken: token, userId: userId }));
            // Navigate to user-specific dashboard URL
        },
        logout: () => {
            setAuthState((prevState) => ({ ...prevState, isLoggedIn: false, authToken: null, userId: null }));
            // Navigate to login or home page
        },
    });

    return (
        <AuthContext.Provider value={{ authState, setAuthState }}>
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
