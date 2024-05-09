import { useState, useEffect, useRef } from 'react';
import styles from './AdditionalDetailsForm.module.css';

const AdditionalDetailsForm = ({ onBack, onNext, formId, additionalFields: initialAdditionalFields, infoType, setInfoType, updateAdditionalFields, updateGlobalPayloadState }) => {
    const [additionalFields, setAdditionalFields] = useState(initialAdditionalFields);
    const [newField, setNewField] = useState('');
    const infoTypeSetRef = useRef(false);

    // Set infoType when the conditions are met and mark as set with a ref to avoid repeat setting
    useEffect(() => {
      if (additionalFields.length > 0 && !infoType && !infoTypeSetRef.current) {
        setInfoType('extended');
        infoTypeSetRef.current = true;
      }
    }, [additionalFields.length, infoType]); // Only depend on the length to avoid unnecessary updates

    // Handles updates to additionalFields when the component unmounts or additionalFields changes
    useEffect(() => {
        return () => {
            updateAdditionalFields(additionalFields);
        };
    }, [additionalFields]); // Removed updateAdditionalFields from dependencies to avoid potential loop

    // Update global state when infoType changes
    useEffect(() => {
        if (infoType) {
            updateGlobalPayloadState({
                infoType: infoType,
            });
        }
    }, [infoType]); // Kept dependency array simple

    const handleSubmit = async (type) => {
        console.log(`infoType before setting: ${infoType}`);
        setInfoType(type);
        console.log(`infoType after setting: ${type}`);

        if (type === 'basic' || type === 'extended') {
            try {
                const response = await fetch(`http://localhost:5173/forms/${formId}`, {
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
                console.log(`infoType ${type} successfully written to the backend for formId: ${formId}`);
                if (type === 'basic') {
                    onNext();
                }
            } catch (error) {
                console.error('Error updating form infoType:', error);
            }
        }
    };

    const handleSubmitAdditionalFields = async () => {
        console.log(additionalFields);
        try {
            const response = await fetch(`http://localhost:5173/forms/${formId}`, {
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
            console.log('Successfully written to the backend');
            onNext(); // Assumes onNext navigates to the next form component
            updateGlobalPayloadState({
                additionalFields: additionalFields,
            });
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