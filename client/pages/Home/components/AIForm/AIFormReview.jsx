import React from 'react';

const AIFormReview = ({ onNext, onBack, formId, globalPayload }) => {
    const handleSubmit = () => {
        // Here you would typically send the final form data to your backend
        console.log('Submitting form:', { formId, ...globalPayload });
        onNext();
    };

    return (
        <div>
            <h2>Review Your AI-Generated Form</h2>
            <p>Form ID: {formId}</p>
            <p>Description: {globalPayload.description}</p>
            <h3>Fields:</h3>
            <ul>
                {globalPayload.finalFields?.map(field => (
                    <li key={field.id}>
                        {field.fieldName} - {field.fieldType}
                    </li>
                ))}
            </ul>
            <button onClick={onBack}>Back</button>
            <button onClick={handleSubmit}>Create Form</button>
        </div>
    );
};

export default AIFormReview;