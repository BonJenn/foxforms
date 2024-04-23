import React, { useState, useEffect } from 'react';
import styles from './Header.module.css';
import { Link } from 'react-router-dom';
import SignUp from '../Auth/SignUp';
import Login from '../Auth/Login';
import { useCookies } from 'react-cookie'; // Added for cookie management
import { useDispatch, useSelector } from 'react-redux'; // Import useDispatch and useSelector

const Header = ({ authToken, userEmail }) => { // Add userEmail prop
    const [showComponent, setShowComponent] = useState('');
    const [username, setUsername] = useState(''); // Initialize username as empty
    const [cookies, setCookie, removeCookie] = useCookies(['authToken']); // Added for cookie management
    const dispatch = useDispatch(); // Use useDispatch hook
    const isLoggedIn = useSelector((state) => state.user.isLoggedIn); // Use useSelector to access login status

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

    const handleLogout = () => {
        removeCookie('authToken', { path: '/' }); // Remove authToken cookie
        removeCookie('userEmail', { path: '/' }); // Remove userEmail cookie
        dispatch({ type: 'SET_LOGIN_STATUS', payload: false }); // Dispatch logout action with correct action type and payload
        // Redirect to home or update the state to reflect the logout
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
                    <div style={{ float: 'right' }}>
                        <span>{username}</span> {/* Display username from state */}
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
