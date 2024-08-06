import React, { useState } from 'react';


const AIFormInput = ({ onNext, updateFormId, globalPayload, updateGlobalPayloadState, userId }) => {
    const [description, setDescription] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        // Here you would typically send the description to your AI service
        // and receive suggestions back. For now, we'll just move to the next step.
        updateGlobalPayloadState({ description });
        updateFormId('ai-form-' + Date.now()); // Placeholder ID
        onNext();
    };

    return (
        <div className={styles.aiFormInput}>
            <h1>Describe Your Form</h1>
            <form onSubmit={handleSubmit}>
                <textarea 
                    value={description} 
                    onChange={(e) => setDescription(e.target.value)} 
                    placeholder="Describe the form you want to create..." 
                    required 
                />
                <button type="submit">Generate Suggestions</button>
            </form>
        </div>
    );
};

export default AIFormInput;