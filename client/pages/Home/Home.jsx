import styles from './Home.module.css'
import Header from './Header.jsx'
import FormWizard from './components/FormWizard/index.jsx'; // Import FormWizard
import { useState } from 'react'


const Home = () => {
    return (
        <div className={styles.home}>
     
            <Header />
            <FormWizard />  
        
        </div>
    )

}

export default Home;