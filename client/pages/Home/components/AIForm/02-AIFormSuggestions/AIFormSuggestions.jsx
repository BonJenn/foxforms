import React from 'react';
import styles from './AIFormSuggestions.module.css';

const AIFormSuggestions = ({ onNext, onBack, formId, globalPayload, updateGlobalPayloadState }) => {
    const handleNext = () => {
        // Handle form submission and call onNext
        onNext();
    };

    const handleBack = () => {
        // Handle going back to the previous step
        onBack();
    };

    return (
        <div className={styles.container}>
            <div className={styles.suggestion}>
                {/* Render suggestions here */}
            </div>
            <button className={styles.button} onClick={handleBack}>
                Back
            </button>
            <button className={styles.button} onClick={handleNext}>
                Next
            </button>
        </div>
    );
};

export default AIFormSuggestions;