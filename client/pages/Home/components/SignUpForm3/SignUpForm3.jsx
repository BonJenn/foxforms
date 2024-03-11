import { useState } from 'react';
import styles from './SignUpForm3.module.css';

{/* Form Capture Field Options */}
const SignUpForm3 = ({ onBack, onNext, formId }) => {
    const [infoType, setInfoType] = useState('');

    const handleSubmit = async (type) => {
        setInfoType(type);
        console.log(`Updating form with ID: ${formId}`); // Added line to log formId
        try {
            const response = await fetch(`http://localhost:5174/forms/${formId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    infoType: type,
                }),
            });
            if (!response.ok) {
                throw new Error('Failed to update form infoType');
            }
            onNext();
        } catch (error) {
            console.error('Error updating form infoType:', error);
        }
    };

    return (
        <div className={styles.signUpForm3}>
            <h1>For each person who signs up, I want to capture - </h1>
                <div className={styles.signUpForm3Buttons}>
                    <button type="button" onClick={() => handleSubmit('basic')}>Just name and email</button>
                    <button type="button" onClick={() => handleSubmit('extended')}>Name, email, and some additional fields</button>
                
                </div>

            <button type="button" onClick={onBack}>Back</button>
        </div>
    );
};

export default SignUpForm3;
