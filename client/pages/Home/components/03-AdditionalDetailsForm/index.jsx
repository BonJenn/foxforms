import { useState, useEffect, useRef } from 'react';
import styles from './AdditionalDetailsForm.module.css';

const AdditionalDetailsForm = ({ onBack, onNext, formId, additionalFields: initialAdditionalFields, infoType, setInfoType, updateAdditionalFields, updateGlobalPayloadState }) => {
    const [additionalFields, setAdditionalFields] = useState(initialAdditionalFields);
    const [newField, setNewField] = useState('');
    const [showButtons, setShowButtons] = useState(true);
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
        setInfoType(type);
        setShowButtons(false);

        if (type === 'basic' || type === 'extended') {
            try {
                const response = await fetch(`http://localhost:3000/forms/${formId}`, {
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
                if (type === 'basic') {
                    onNext();
                }
            } catch (error) {
                console.error('Error updating form infoType:', error);
            }
        }
    };

    const handleSubmitAdditionalFields = async () => {
        try {
            const response = await fetch(`http://localhost:3000/forms/${formId}`, {
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
        <div className={styles.additionalDetailsForm}>
            {showButtons && (
                <h1>For each person who signs up, I want to capture - </h1>
            )}
            {showButtons && (
                <>
                    <div className={styles.signUpForm3Buttons}>
                        <button type="button" className={styles.additionalFieldBasicButton} onClick={() => handleSubmit('basic')}>Just name and email</button>
                        <button type="button" className={styles.additionalFieldExtendedButton} onClick={() => handleSubmit('extended')}>Name, email, and some additional fields</button>
                    </div>
                </>
            )}
    
            {infoType === 'extended' && (
                <div className={styles.signUpForm3Extended}>
                    <h1>What information do you want to capture?</h1>
                   
                    <div className={styles.fieldsListContainer}>
                        <ul>
                            {additionalFields.map((field, index) => (
                                <li key={index} className={styles.listItem}>
                                    <div className={styles.fieldContainer}>
                                        <span className={styles.fieldText}>{field}</span>
                                        <button className={styles.removeButton} onClick={() => removeField(index)}>x</button>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </div>
                    <div className={styles.inputAndButtons}>
                        <div className={styles.fieldAddContainer}>
                            <input type="text" value={newField} onChange={(e) => setNewField(e.target.value)} onKeyPress={(e) => {
                                if (e.key === 'Enter' && newField.trim()) {
                                    addField();
                                }
                            }} />
                            <button onClick={addField}>+</button>
                        </div>
                      
                    </div>
                    <div className={styles.buttonContainer}>
                            <button type="button" onClick={onBack}>Back</button>
                            {!showButtons && infoType === 'extended' && (
                                <button onClick={handleSubmitAdditionalFields}>Next</button>
                            )}
                    </div>
                </div>
            )}
        </div>
    );
    
};

export default AdditionalDetailsForm;
