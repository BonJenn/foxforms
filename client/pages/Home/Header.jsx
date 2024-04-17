import React, { useState, useEffect } from 'react';
import styles from './Header.module.css';
import { Link } from 'react-router-dom';
import SignUp from '../Auth/SignUp';
import Login from '../Auth/Login';

const Header = ({ authToken }) => { // Removed userEmail prop
    const [showComponent, setShowComponent] = useState('');
    const [username, setUsername] = useState(localStorage.getItem('username')); // Use state for username

    useEffect(() => {
        // This effect runs whenever authToken changes
        setUsername(localStorage.getItem('username')); // Update username from local storage
    }, [authToken]); // Dependency array, re-run effect when authToken changes

    useEffect(() => {
        console.log('authToken:', authToken);
    }, [authToken]); // This effect will run whenever authToken changes

    useEffect(() => {
        console.log('Initial authToken:', authToken);
    }, []); // Empty dependency array, runs only on component mount

    const handleCloseModal = () => {
        setShowComponent('');
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
                        <Link to="/logout">Logout</Link>
                    </div>
                )}
            </div>
            {showComponent === 'signup' && <SignUp onClose={handleCloseModal} />}
            {showComponent === 'login' && <Login onClose={handleCloseModal} />}
        </div>
    );
}

export default Header;
