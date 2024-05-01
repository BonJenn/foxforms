import React, { useState, useEffect } from 'react';
import styles from './Header.module.css';
import { Link, useNavigate } from 'react-router-dom';
import SignUp from '../Auth/SignUp';
import Login from '../Auth/Login';
import { useAuth } from '../../../src/context/AuthContext.jsx'; // Corrected import path

const Header = ({ cookieAuthToken, userEmail, onLogout }) => { // Removed onLogin from props
    const [showComponent, setShowComponent] = useState('');
    const [username, setUsername] = useState(localStorage.getItem('username')); // Use state for username
    // const [isLoggedIn, setIsLoggedIn] = useState('false'); // Define isLoggedIn state and its updater function setIsLoggedIn
    const navigate = useNavigate();
    const { isLoggedIn, login, logout } = useAuth(); // Corrected useAuth usage

    const onLogin = async (username, password) => {
        try {
            const response = await fetch('http://localhost:5174/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username, password }),
            });
            const data = await response.json();
            if (response.ok) {
                localStorage.setItem('authToken', data.authToken);
                login(data.authToken); // Pass authToken to login function
                navigate(`/dashboard/${data.authToken}`); // Navigate with authToken in URL
            } else {
                console.error('Login failed:', data.message);
            }
        } catch (error) {
            console.error('An error occurred during login:', error);
        }
    };

    useEffect(() => {
        // This effect runs whenever authToken changes
        if (isLoggedIn) {
            fetchUsername(); // Call fetchUsername when the component mounts if the user is logged in
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
      console.log('isLoggedIn state:', isLoggedIn);
    }, [isLoggedIn]);

    useEffect(() => {
      const token = localStorage.getItem('authToken'); // Ensure this key matches what you've used in `setItem`
      console.log('Retrieved token from localStorage:', token);
      if (token) {
        login(token); // Assuming login updates the isLoggedIn state
        navigate('/dashboard'); // Redirect to dashboard after login
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
        console.log('Token before removal:', localStorage.getItem('authToken'));
        localStorage.removeItem('authToken');
        console.log('Token removed');
        // setIsLoggedIn(false); // Add this line to update isLoggedIn state
        logout(); // Adjusted to use logout function from useAuth
        if (typeof onLogout === 'function') {
            onLogout();
        }
        navigate('/');
    };
    console.log('onLogin function:', onLogin);
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
            {showComponent === 'login' && <Login onClose={handleCloseModal} handleLogin={onLogin} />}
        </div>
    );
}

export default Header;
