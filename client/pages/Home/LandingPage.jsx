import React from 'react';
import styles from './LandingPage.module.css'; // Ensure correct import of CSS module

const LandingPage = () => {
    return (
        <div className={styles.landingPage}>
            <header className={styles.header}>
                Welcome to FoxForms
            </header>
            <main className={styles.mainContent}>
                <h1>Create and Manage Your Forms Easily</h1>
                <p>Sign up or log in to get started.</p>
                <button className={styles.button}>Get Started</button>
            </main>
        </div>
    );
}

export default LandingPage;