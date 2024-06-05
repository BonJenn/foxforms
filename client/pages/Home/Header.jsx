import React, { useState, useEffect } from 'react';
import styles from './Header.module.css';
import { Link, useNavigate } from 'react-router-dom';
import SignUp from '../Auth/SignUp';
import Login from '../Auth/Login';
import { useAuth } from '../../../src/context/AuthContext.jsx';

const Header = ({ cookieAuthToken }) => {
    const navigate = useNavigate();
    const [showComponent, setShowComponent] = useState('');
    const [username, setUsername] = useState(localStorage.getItem('username'));
    const { authState, login, logout } = useAuth();
    const { isLoggedIn } = authState;
    const [isNavVisible, setIsNavVisible] = useState(false);

    console.log('Header component prop:', cookieAuthToken);

    useEffect(() => {
        try {
            if (isLoggedIn) {
                fetchUsername();
            }
        } catch (error) {
            console.error('Error in Header component:', error);
        }
    }, [cookieAuthToken, isLoggedIn]);

    useEffect(() => {
        if (cookieAuthToken) {
            console.log('authToken:', cookieAuthToken);
        } else {
            console.log('Warning: authToken is undefined.');
        }
    }, [cookieAuthToken]);

    useEffect(() => {
        console.log('Initial authToken:', cookieAuthToken);
    }, []);

    useEffect(() => {
        const token = localStorage.getItem('authToken');
        if (token) {
            login(token, navigate);
            navigate('/dashboard');
        } else {
            console.log('No authToken found in localStorage');
        }
    }, [cookieAuthToken]);

    useEffect(() => {
        if (isLoggedIn) {
            fetchUsername();
        } else {
            setUsername('');
        }
    }, [isLoggedIn]);

    const handleCloseModal = () => {
        setShowComponent('');
    };

    console.log('Current showComponent state:', showComponent);

    const fetchUsername = async () => {
        const token = localStorage.getItem('authToken');
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
        logout();
        navigate('/');
    };
    console.log('login function:', login);

    const toggleNav = () => {
        if (window.innerWidth <= 768) {
            setIsNavVisible(prev => !prev);
        }
    };

    return (
        <div className={styles.headerStyle}>
            <h1>Fox<span>Forms</span></h1>
            <div className={styles.headerRightSide}>
                {(isNavVisible || window.innerWidth > 768) && (
                    <ul className={`${styles.navList} ${isNavVisible ? styles.visible : ''}`}>
                        <li><Link to="/about">About</Link></li>
                        <li><Link to="/features">Features</Link></li>
                        <li><Link to="/pricing">Pricing</Link></li>
                    </ul>
                )}
                <div className={styles.authButtons}>
                    {!isLoggedIn ? (
                        <>
                            <button onClick={(e) => { e.stopPropagation(); setShowComponent('login'); }}>Login</button>
                        </>
                    ) : (
                        <div style={{ float: 'right' }}>
                            <span>{username}</span>
                            <button onClick={handleLogout}>Logout</button>
                        </div>
                    )}
                </div>
                <div className={styles.hamburger} onClick={toggleNav}>
                    {/* Icon or Hamburger Menu */}
                </div>
            </div>

            {showComponent === 'signup' && <SignUp setShowComponent={setShowComponent} />}
            {showComponent === 'login' && <Login setShowComponent={setShowComponent} />}
        </div>
    );
}

export default Header;
