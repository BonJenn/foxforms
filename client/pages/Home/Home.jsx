import { useState, useContext } from 'react';
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

    return (
        <div className={styles.home}>
            {authState.isLoggedIn ? (
                <>
                    <FormWizard type="ai" authToken={authState.token} skipAccountSetup={false} setShowComponent={setShowComponent} />
                    {showComponent === 'signup' && <SignUp showComponent={showComponent} setShowComponent={setShowComponent} />}
                    {showComponent === 'login' && <Login setShowComponent={setShowComponent} />}
                </>
            ) : (
                <LandingPage />
            )}
            <Footer />
        </div>
    );
}

export default Home;