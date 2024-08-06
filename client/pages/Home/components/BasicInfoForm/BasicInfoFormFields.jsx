import React, { useState } from 'react';


const BasicInfoFormFields = ({ onNext, onBack, formId, globalPayload, updateGlobalPayloadState }) => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [comments, setComments] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        const formData = { name, email, phone, comments };
        updateGlobalPayloadState(formData);

        try {
            const response = await fetch(`https://u6n71jw2d7.execute-api.us-east-1.amazonaws.com/dev/forms/${formId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });
            if (!response.ok) {
                throw new Error('Failed to update form');
            }
            onNext();
        } catch (error) {
            console.error('Error updating form:', error);
        }
    };

    return (
        <div className={styles.basicInfoFormFields}>
            <h1>Basic Form Fields</h1>
            <form onSubmit={handleSubmit}>
                <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Name" required />
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" required />
                <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="Phone" />
                <textarea value={comments} onChange={(e) => setComments(e.target.value)} placeholder="Comments" />
                <div className={styles.buttonContainer}>
                    <button type="button" onClick={onBack}>Back</button>
                    <button type="submit">Next</button>
                </div>
            </form>
        </div>
    );
};

export default BasicInfoFormFields;