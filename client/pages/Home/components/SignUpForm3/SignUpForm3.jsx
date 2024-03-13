import { useState } from 'react';
import styles from './SignUpForm3.module.css';

{/* Form Capture Field Options */}
const SignUpForm3 = ({ onBack, onNext, formId }) => {
    const [infoType, setInfoType] = useState('');
    const [additionalFields, setAdditionalFields] = useState([]);
    const [newField, setNewField] = useState('');


    {/* Determine the infoType of the form */}
    const handleSubmit = async (type) => {
        setInfoType(type);
        if (type === 'basic') {
            onNext();
        } else if (type === 'extended') {
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
            } catch (error) {
                console.error('Error updating form infoType:', error);
            }
        }
    };

    {/* Adds Additional Fields to the Form and Pushes to next Sign Up Form */}
    const handleSubmitAdditionalFields = async () => {

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

    {/* Adds a Field to the Form */}
    const addField = () => {
        if (newField) {
            setAdditionalFields([...additionalFields, newField]);
            setNewField('');
        }
    };

    {/*Removes a Field from the Form */}
    const removeField = (index) => {
        setAdditionalFields(additionalFields.filter((_, i) => i !== index));
    };

    return (
        <div className={styles.signUpForm3}>
            <h1>For each person who signs up, I want to capture - </h1>
                <div className={styles.signUpForm3Buttons}>
                    <button type="button" onClick={() => handleSubmit('basic')}>Just name and email</button>
                    <button type="button" onClick={() => handleSubmit('extended')}>Name, email, and some additional fields</button>
                
                </div>

                {infoType === 'extended' && (
                    <div className={styles.signUpForm3Extended}>
                        <h1>What information do you want to capture?</h1>
                        <ul>
                            {additionalFields.map((field, index) => (
                                <li key={index}>{field} <button onClick={() => removeField(index)}>x</button></li>
                            ))}
                        </ul>
                        <input type="text" value={newField} onChange={(e) => setNewField(e.target.value)} />
                        <button onClick={addField}>+</button>
                        <button onClick={handleSubmitAdditionalFields}>Next</button>
                    </div>        
                )}

            <button type="button" onClick={onBack}>Back</button>
        </div>
    );
};

export default SignUpForm3;
