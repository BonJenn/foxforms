import styles from './Home.module.css'
import Header from './Header.jsx'
import SignUpForm1 from './SignUpForm1.jsx'
import SignUpForm from './SignUpForm2.jsx'
import { useState } from 'react'


const Home = () => {
    const [showForm2, setShowForm2] = useState(false);
    return (
        <div className={styles.home}>
     
            <Header />
            {!showForm2 && <SignUpForm1 setShowForm2={setShowForm2} />}
            {showForm2 && <SignUpForm />}
      
        
        
        
        
        
        </div>
    )

}

export default Home;