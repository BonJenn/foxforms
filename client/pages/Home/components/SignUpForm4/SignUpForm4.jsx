import { useState } from 'react';
import styles from './SignUpForm4.module.css';


  {/* Form Dates */}
const SignUpForm4 = ({ onBack, onNext, formId, updateAdditionalFields }) => {
    const [formDateOption, setFormDateOption] = useState('');
    const [additionalFields, setAdditionalFields] = useState([]);
    const [newField, setNewField] = useState('');

    const handleSubmit = async () => {

        try {
            const response = await fetch(`http://localhost:5174/forms/${formId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    additionalFields: additionalFields,
                }),
            });
            if (!response.ok) {
                throw new Error('Failed to update form');
            }
            onNext(); // Assuming onNext navigates to the next form component
        } catch (error) {
            console.error('Error updating form:', error);
        }
    };


    const handleBack = () => {
        updateAdditionalFields(additionalFields); // Update the parent's state
        onBack(); // Navigate back
    };

    return (

        <>
          <div className={styles.signUpForm4}>
            <h1>My form is for</h1>
            <div className={styles.signUpForm4Buttons}>
                <button type="button" onClick={() => handleSubmit('noDates')}>No particular dates</button>
                <button type="button" onClick={() => handleSubmit('specificDates')}>One or more specific dates</button>
            </div>
            <div className={styles.buttonContainer}>
                <button type="button" onClick={handleBack}>Back</button>
                <button onClick={handleSubmit}>Next</button>
            </div>
           
        </div>        
          
        </>
      
    );
};

export default SignUpForm4;
