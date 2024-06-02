import styles from './Home.module.css'
import Header from './Header.jsx'
import Footer from './Footer/index.jsx'
import FormWizard from './components/FormWizard/index.jsx' // Import FormWizard
import { useState } from 'react'
import SignUp from '../Auth/SignUp.jsx';
import Login from '..//Auth/Login.jsx';



const Home = () => {
    const [showComponent, setShowComponent] = useState('');

    return (
        <div className={styles.home}>
            <Header setShowComponent={setShowComponent} />
            <FormWizard setShowComponent={setShowComponent} />
            {showComponent === 'signup' && <SignUp />}
            {showComponent === 'login' && <Login />}
            <Footer />
        </div>
    )
}

export default Home;
