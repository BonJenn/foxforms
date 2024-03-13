import { useState } from 'react';
import styles from './SignUpForm4.module.css';


  {/* Form Dates */}
const SignUpForm4 = ({ onBack, onNext, formId }) => {
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

    const addField = () => {
        if (newField) {
            setAdditionalFields([...additionalFields, newField]);
            setNewField('');
        }
    };

    const removeField = (index) => {
        setAdditionalFields(additionalFields.filter((_, i) => i !== index));
    };

    return (

        <>
          <div className={styles.signUpForm4}>
            <h1>My form is for</h1>
            <div className={styles.signUpForm4Buttons}>
                <button type="button" onClick={() => handleSubmit('noDates')}>No particular dates</button>
                <button type="button" onClick={() => handleSubmit('specificDates')}>One or more specific dates</button>
            </div>
            <button type="button" onClick={onBack}>Back</button>
        </div>

        <div className={styles.signUpForm4Extended}>
            <h1>What information do you want to capture?</h1>
            <ul>
                {additionalFields.map((field, index) => (
                    <li key={index}>{field} <button onClick={() => removeField(index)}>x</button></li>
                ))}
            </ul>
            <input type="text" value={newField} onChange={(e) => setNewField(e.target.value)} />
            <button onClick={addField}>+</button>
            <button onClick={handleSubmit}>Next</button>
        </div>        
        </>
      
    );
};

export default SignUpForm4;
