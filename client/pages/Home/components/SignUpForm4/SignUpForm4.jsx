import { useState } from 'react';
import styles from './SignUpForm4.module.css';


  {/* Form Dates */}
const SignUpForm4 = ({ onBack, onNext }) => {
    const [formDateOption, setFormDateOption] = useState('');

    const handleSubmit = (option) => {
        setFormDateOption(option);
        onNext(); // Assuming onNext is a prop function to move to the next form
    };

    return (
        <div className={styles.signUpForm4}>
            <h1>My form is for</h1>
            <div className={styles.signUpForm4Buttons}>
                <button type="button" onClick={() => handleSubmit('noDates')}>No particular dates</button>
                <button type="button" onClick={() => handleSubmit('specificDates')}>One or more specific dates</button>
            </div>
            <button type="button" onClick={onBack}>Back</button>
        </div>
    );
};

export default SignUpForm4;
