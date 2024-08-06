import React, { useState } from 'react';


const BasicInfoForm = ({ onNext, updateFormId, globalPayload, updateGlobalPayloadState }) => {
    const [formName, setFormName] = useState('');
    const [formDescription, setFormDescription] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        const formData = { formName, formDescription };
        updateGlobalPayloadState(formData);

        try {
            const response = await fetch('https://u6n71jw2d7.execute-api.us-east-1.amazonaws.com/dev/forms', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });
            if (!response.ok) {
                throw new Error('Failed to create form');
            }
            const data = await response.json();
            updateFormId(data.formId);
            onNext();
        } catch (error) {
            console.error('Error creating form:', error);
        }
    };

    return (
        <div className={styles.basicInfoForm}>
            <h1>Create Basic Form</h1>
            <form onSubmit={handleSubmit}>
                <input 
                    type="text" 
                    value={formName} 
                    onChange={(e) => setFormName(e.target.value)} 
                    placeholder="Form Name" 
                    required 
                />
                <textarea 
                    value={formDescription} 
                    onChange={(e) => setFormDescription(e.target.value)} 
                    placeholder="Form Description" 
                    required 
                />
                <button type="submit">Next</button>
            </form>
        </div>
    );
};

export default BasicInfoForm;
