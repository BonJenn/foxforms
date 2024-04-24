import React, { useState, useEffect } from 'react';
import styles from './Header.module.css';
import { Link, useNavigate } from 'react-router-dom';
import SignUp from '../Auth/SignUp';
import Login from '../Auth/Login';
import { useAuth } from '../../../src/context/AuthContext.jsx'; // Corrected import path

const Header = ({ authToken, userEmail, onLogout }) => { // Add userEmail prop
    const [showComponent, setShowComponent] = useState('');
    const [username, setUsername] = useState(localStorage.getItem('username')); // Use state for username
    // const [isLoggedIn, setIsLoggedIn] = useState('false'); // Define isLoggedIn state and its updater function setIsLoggedIn
    const navigate = useNavigate();
    const { isLoggedIn, login, logout } = useAuth(); // Corrected useAuth usage

    useEffect(() => {
        // This effect runs whenever authToken changes
        if (isLoggedIn) {
            fetchUsername(); // Call fetchUsername when the component mounts if the user is logged in
        }
    }, [authToken, isLoggedIn]); // Dependency array, re-run effect when authToken or isLoggedIn changes

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

    useEffect(() => {
      console.log('isLoggedIn state:', isLoggedIn);
    }, [isLoggedIn]);

    useEffect(() => {
      const token = localStorage.getItem('token');
      // setIsLoggedIn(!!token);
      if (!!token) login(); // Adjusted to use login function from useAuth
    }, [authToken]); // Add authToken as a dependency to re-run the effect when it changes

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
        const token = localStorage.getItem('token'); // Ensure this matches how you set the token on login
        if (!token) {
            console.log('No token found in localStorage');
            return;
        }
        const response = await fetch('http://localhost:5174/get-username', {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        if (response.ok) {
            const data = await response.json();
            console.log('Fetched username:', data.username);
            setUsername(data.username);
        } else {
            console.error('Failed to fetch username');
        }
    };

    const handleLogout = () => {
        console.log('Token before removal:', localStorage.getItem('token'));
        localStorage.removeItem('token');
        console.log('Token removed');
        // setIsLoggedIn(false); // Add this line to update isLoggedIn state
        logout(); // Adjusted to use logout function from useAuth
        if (typeof onLogout === 'function') {
            onLogout();
        }
        navigate('/');
    };
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
