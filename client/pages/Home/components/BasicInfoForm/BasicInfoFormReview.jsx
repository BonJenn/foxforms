import React from 'react';


const BasicInfoFormReview = ({ onNext, onBack, formId, globalPayload }) => {
    const handleSubmit = async () => {
        try {
            const response = await fetch(`https://u6n71jw2d7.execute-api.us-east-1.amazonaws.com/dev/forms/${formId}/submit`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(globalPayload),
            });
            if (!response.ok) {
                throw new Error('Failed to submit form');
            }
            onNext();
        } catch (error) {
            console.error('Error submitting form:', error);
        }
    };

    return (
        <div className={styles.basicFormReview}>
            <h1>Review Your Form</h1>
            <div className={styles.formDetails}>
                <h2>Form Details</h2>
                <p><strong>Form Name:</strong> {globalPayload.formName}</p>
                <p><strong>Form Description:</strong> {globalPayload.formDescription}</p>
            </div>
            <div className={styles.formFields}>
                <h2>Form Fields</h2>
                <p><strong>Name:</strong> {globalPayload.name}</p>
                <p><strong>Email:</strong> {globalPayload.email}</p>
                <p><strong>Phone:</strong> {globalPayload.phone}</p>
                <p><strong>Comments:</strong> {globalPayload.comments}</p>
            </div>
            <div className={styles.buttonContainer}>
                <button onClick={onBack}>Back</button>
                <button onClick={handleSubmit}>Submit Form</button>
            </div>
        </div>
    );
};

export default BasicInfoFormReview;
