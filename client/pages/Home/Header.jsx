import React, { useState, useEffect } from 'react';
import styles from './Header.module.css';
import { Link } from 'react-router-dom';
import SignUp from '../Auth/SignUp';
import Login from '../Auth/Login';

const Header = ({ authToken, userEmail }) => { // Add userEmail prop
    const [showComponent, setShowComponent] = useState('');
    const [username, setUsername] = useState(localStorage.getItem('username')); // Use state for username
    const isLoggedIn = !!authToken; // Define isLoggedIn based on authToken

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
