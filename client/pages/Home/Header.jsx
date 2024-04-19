import React, { useState, useEffect } from 'react';
import styles from './Header.module.css';
import { Link } from 'react-router-dom';
import SignUp from '../Auth/SignUp';
import Login from '../Auth/Login';
import { useCookies } from 'react-cookie'; // Added for cookie management

const Header = ({ authToken }) => { // Removed userEmail prop
    const [showComponent, setShowComponent] = useState('');
    const [username, setUsername] = useState(localStorage.getItem('username')); // Use state for username
    const [cookies, setCookie, removeCookie] = useCookies(['authToken']); // Added for cookie management

    useEffect(() => {
        // This effect runs whenever authToken changes
        setUsername(localStorage.getItem('username')); // Update username from local storage
    }, [authToken]); // Dependency array, re-run effect when authToken changes

    useEffect(() => {
        if (authToken) {
            console.log('authToken:', authToken);
        } else {
            console.log('Warning: authToken is undefined.');
        }
    }, [authToken]); // This effect will run whenever authToken changes

    useEffect(() => {
        console.log('Initial authToken:', authToken);
    }, []); // Empty dependency array, runs only on component mount

    const handleCloseModal = () => {
        setShowComponent('');
    };

    const handleLogout = () => {
        removeCookie('authToken', { path: '/' }); // Remove authToken cookie
        // Redirect to home or update the state to reflect the logout
    };

    console.log('Current showComponent state:', showComponent);

    return (
        <div className={styles.headerStyle}>
            <h1>Fox<span>Forms</span></h1>
            <div className={styles.authButtons}>
                {!authToken ? (
                    <>
                        <button onClick={(e) => { e.stopPropagation(); setShowComponent('signup'); }}>Sign Up</button>
                        <button onClick={(e) => { e.stopPropagation(); setShowComponent('login'); }}>Login</button>
                    </>
                ) : (
                    <div style={{ float: 'right' }}> {/* Adjusted for username display */}
                        <span>{username}</span> {/* Display username */}
                        <Link to="/logout" onClick={handleLogout}>Logout</Link>
                    </div>
                )}
            </div>
            {showComponent === 'signup' && <SignUp onClose={handleCloseModal} />}
            {showComponent === 'login' && <Login onClose={handleCloseModal} />}
        </div>
    );
}

export default Header;
