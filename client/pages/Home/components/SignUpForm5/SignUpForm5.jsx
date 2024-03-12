import { useState } from 'react';
import styles from './SignUpForm5.module.css';


{/* Does Your Sheet Have Time Slots? */}
const SignUpForm5 = ({ onBack, onNext }) => {
    const [confirmation, setConfirmation] = useState(false);

    const handleSubmit = () => {
        setConfirmation(true);
        onNext(); // Assuming onNext is a prop function to move to the next form or complete the process
    };

    return (
        <div className={styles.signUpForm5}>
            <h1>Confirmation</h1>
            <p>Please confirm that all the information you've entered is correct.</p>
            <div className={styles.SignUpForm5Buttons}>
                <button type="button" onClick={handleSubmit}>Confirm</button>
                <button type="button" onClick={onBack}>Back</button>
            </div>
            {confirmation && <p>Thank you for confirming. Your information has been submitted.</p>}
        </div>
    );
};

export default SignUpForm5;
