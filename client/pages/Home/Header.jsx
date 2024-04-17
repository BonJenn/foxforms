import React, { useState } from 'react';
import styles from './Header.module.css';
import { Link } from 'react-router-dom';
import SignUp from '../Auth/SignUp';
import Login from '../Auth/Login';

const Header = ({ authToken }) => {
    const [showComponent, setShowComponent] = useState('');

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
                    <Link to="/logout">Logout</Link>
                )}
            </div>
            {showComponent === 'signup' && <SignUp onClose={handleCloseModal} />}
            {showComponent === 'login' && <Login onClose={handleCloseModal} />}
        </div>
    );
}

export default Header;
