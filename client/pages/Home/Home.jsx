import { useState, useContext, useEffect, useRef } from 'react';
import styles from './Home.module.css';
import Header from './Header.jsx';
import Footer from './Footer/index.jsx';
import FormWizard from './components/FormWizard/index.jsx';
import SignUp from '../Auth/SignUp.jsx';
import Login from '../Auth/Login.jsx';
import { AuthContext } from '../../../src/context/AuthContext.jsx'; // Adjusted the import path
import LandingPage from './LandingPage.jsx';

const Home = () => {
    const [showComponent, setShowComponent] = useState('');
    const { authState } = useContext(AuthContext);
    const modalRef = useRef(null);

    const handleClickOutside = (event) => {
        if (modalRef.current && !modalRef.current.contains(event.target)) {
            setShowComponent('');
        }
    };

    useEffect(() => {
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    return (
        <div className={styles.home}>
            {authState.isLoggedIn ? (
                <>
                    <FormWizard type="ai" authToken={authState.token} skipAccountSetup={false} setShowComponent={setShowComponent} />
                    {showComponent === 'signup' && <SignUp ref={modalRef} showComponent={showComponent} setShowComponent={setShowComponent} />}
                    {showComponent === 'login' && <Login ref={modalRef} setShowComponent={setShowComponent} />}
                </>
            ) : (
                <LandingPage />
            )}
            <Footer />
        </div>
    );
}

export default Home;