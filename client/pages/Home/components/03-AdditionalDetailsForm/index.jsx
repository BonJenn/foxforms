import { useState, useEffect } from 'react';
import styles from './AdditionalDetailsForm.module.css';

{/* Form Capture Field Options */}
const AdditionalDetailsForm = ({ onBack, onNext, formId, additionalFields: initialAdditionalFields, infoType, setInfoType, updateAdditionalFields, updateGlobalPayloadState }) => {
    const [additionalFields, setAdditionalFields] = useState(initialAdditionalFields);
    const [newField, setNewField] = useState('');

    useEffect(() => {
      if (additionalFields.length > 0 && !infoType) {
        setInfoType('extended');
      }
    }, [additionalFields, infoType, setInfoType]);

    useEffect(() => {
        return () => {
            updateAdditionalFields(additionalFields);
        };
    }, [additionalFields, updateAdditionalFields]);



    {/* Determine the infoType of the form */}
    const handleSubmit = async (type) => {
        setInfoType(type);
        // Add a fetch request here for 'basic' similar to 'extended'
        if (type === 'basic') {
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
                onNext(); // Move this inside the try block after checking response.ok
            } catch (error) {
                console.error('Error updating form infoType:', error);
            }
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
        // Update the global payload with infoType
        updateGlobalPayloadState({
            infoType: type,
        });
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
        // Update the global payload with additionalFields
        updateGlobalPayloadState({
            additionalFields: additionalFields,
        });
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
                                <li key={index}>{field} <div className="remove-field-container"><button onClick={() => removeField(index)}>x</button></div></li>
                            ))}
                        </ul>
                        <div className={styles.fieldAddContainer}>
                            <input type="text" value={newField} onChange={(e) => setNewField(e.target.value)} />
                            <button onClick={addField}>+</button>
                        </div>
                        <div className={styles.buttonContainer}>
                            <button type="button" onClick={onBack}>Back</button>
                            <button onClick={handleSubmitAdditionalFields}>Next</button>
                        </div>
                    </div>        

                    
                )}

                <button type="button" onClick={onBack}>Back</button>
                <button onClick={handleSubmitAdditionalFields}>Next</button>


        </div>


    );
};

export default AdditionalDetailsForm;
