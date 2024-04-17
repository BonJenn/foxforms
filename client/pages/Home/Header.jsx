import React, { useState } from 'react';
import styles from './Header.module.css';
import { Link } from 'react-router-dom';
import SignUp from '../Auth/SignUp';
import Login from '../Auth/Login';

const Header = ({ authToken }) => {
    const [showComponent, setShowComponent] = useState('');

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
            {showComponent === 'signup' && <SignUp onClose={() => setShowComponent('')} />}
            {showComponent === 'login' && <Login onClose={() => setShowComponent('')} />}
        </div>
    );
}

export default Header;
