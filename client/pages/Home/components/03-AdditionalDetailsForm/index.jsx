import { useState, useEffect } from 'react';
import styles from './AdditionalDetailsForm.module.css';

const AdditionalDetailsForm = ({ onBack, onNext, formId, additionalFields: initialAdditionalFields, infoType, setInfoType, updateAdditionalFields, updateGlobalPayloadState }) => {
    const [additionalFields, setAdditionalFields] = useState(initialAdditionalFields);
    const [newField, setNewField] = useState('');
    const [showButtons, setShowButtons] = useState(!infoType);

    useEffect(() => {
        updateAdditionalFields(additionalFields);
    }, [additionalFields, updateAdditionalFields]);

    useEffect(() => {
        if (infoType) {
            updateGlobalPayloadState({ infoType });
        }
    }, [infoType, updateGlobalPayloadState]);

    const handleBack = () => {
        if (infoType === 'extended') {
            setInfoType(null);
            setShowButtons(true);
        } else {
            onBack();
        }
    };

    const handleSubmit = async (type) => {
        setInfoType(type);
        setShowButtons(false);

        try {
            const response = await fetch(`http://localhost:3000/forms/${formId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ infoType: type }),
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
    };

    const handleSubmitAdditionalFields = async () => {
        try {
            const response = await fetch(`http://localhost:3000/forms/${formId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ additionalFields }),
            });
            if (!response.ok) {
                throw new Error('Failed to update form');
            }
            onNext();
            updateGlobalPayloadState({ additionalFields });
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
            {showButtons && <h1>For each person who signs up, I want to capture - </h1>}
            {showButtons && (
                <div className={styles.signUpForm3Buttons}>
                    <button type="button" className={styles.additionalFieldBasicButton} onClick={() => handleSubmit('basic')}>Just name and email</button>
                    <button type="button" className={styles.additionalFieldExtendedButton} onClick={() => handleSubmit('extended')}>Name, email, and some additional fields</button>
                </div>
            )}

            {infoType === 'extended' && !showButtons && (
                <div className={styles.signUpForm3Extended}>
                    <h1>What information do you want to capture?</h1>
                    <div className={`${styles.fieldsListContainer} ${additionalFields.length === 0 ? styles.emptyList : ''}`}>
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
                        <button type="button" onClick={handleBack}>Back</button>
                        <button onClick={handleSubmitAdditionalFields}>Next</button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdditionalDetailsForm;
