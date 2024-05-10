import React, { useState, useEffect } from 'react';
import styles from './Header.module.css';
import { Link, useNavigate } from 'react-router-dom';
import SignUp from '../Auth/SignUp';
import Login from '../Auth/Login';
import { useAuth } from '../../../src/context/AuthContext.jsx'; // Corrected import path

const Header = ({ cookieAuthToken }) => {
    const navigate = useNavigate();
    const [showComponent, setShowComponent] = useState('');
    const [username, setUsername] = useState(localStorage.getItem('username')); // Use state for username
    const { authState, login, logout } = useAuth(); // Corrected useAuth usage, ensure logout is destructured here
    const { isLoggedIn } = authState; // Access isLoggedIn from authState

    console.log('Header component prop:', cookieAuthToken); // Added console.log to trace prop changes

    useEffect(() => {
        try {
            // This effect runs whenever authToken changes
            if (isLoggedIn) {
                fetchUsername(); // Call fetchUsername when the component mounts if the user is logged in
            }
        } catch (error) {
            console.error('Error in Header component:', error);
        }
    }, [cookieAuthToken, isLoggedIn]); // Dependency array, re-run effect when authToken or isLoggedIn changes

    useEffect(() => {
        if (cookieAuthToken) {
            console.log('authToken:', cookieAuthToken);
        } else {
            console.log('Warning: authToken is undefined.');
        }
    }, [cookieAuthToken]); // This effect will run whenever authToken changes

    useEffect(() => {
        console.log('Initial authToken:', cookieAuthToken);
    }, []); // Empty dependency array, runs only on component mount

    useEffect(() => {
      const token = localStorage.getItem('authToken');
      if (token) {
        login(token, navigate); // Pass navigate here
        navigate('/dashboard'); // This line might be redundant if handled inside login
      } else {
        console.log('No authToken found in localStorage');
      }
    }, [cookieAuthToken]); // Consider if cookieAuthToken is necessary here or it should be another state

    useEffect(() => {
      if (isLoggedIn) {
        fetchUsername(); // Fetch username again if isLoggedIn changes
      } else {
        setUsername('');
      }
    }, [isLoggedIn]);

    const handleCloseModal = () => {
        setShowComponent('');
    };

    console.log('Current showComponent state:', showComponent);

    const fetchUsername = async () => {
        const token = localStorage.getItem('authToken'); // Ensure this matches how you set the token on login
        if (!token) {
            console.log('No token found in localStorage');
            return;
        }
        const response = await fetch('http://localhost:3000/get-username', {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const data = await response.json();
        console.log('Fetched username:', data.username);
        setUsername(data.username);
    };

    const handleLogout = () => {
        console.log('Token before removal:', localStorage.getItem('authToken'));
        localStorage.removeItem('authToken');
        console.log('Token removed');
        logout(); // Correctly call logout from useAuth
        if (typeof onLogout === 'function') {
            onLogout();
        }
        navigate('/');
    };
    console.log('login function:', login);
    return (
        <div className={styles.headerStyle}>
            <h1>Fox<span>Forms</span></h1>
            <div className={styles.authButtons}>
                {!isLoggedIn ? (
                    <>
                        <button onClick={(e) => { e.stopPropagation(); setShowComponent('signup'); }}>Sign Up</button>
                        <button onClick={(e) => { e.stopPropagation(); setShowComponent('login'); }}>Login</button>
                    </>
                ) : (
                    <div style={{ float: 'right' }}> {/* Adjusted for username display */}
                        <span>{username}</span> {/* Display username */}
                        <button onClick={handleLogout}>Logout</button>
                    </div>
                )}
            </div>
            {showComponent === 'signup' && <SignUp onClose={handleCloseModal} />}
            {showComponent === 'login' && <Login onClose={handleCloseModal} />}
        </div>
    );
}

export default Header;
