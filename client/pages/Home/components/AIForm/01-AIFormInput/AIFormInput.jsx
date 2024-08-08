import React from 'react';
import styles from './AIFormInput.module.css';

const AIFormInput = ({ onNext, updateFormId, globalPayload, updateGlobalPayloadState }) => {
    console.log('AIFormInput component rendered');
    const handleNext = () => {
        // Handle form submission and call onNext
        onNext();
    };

    return (
        <div>
            <div className={styles.test}>
                <h1>Test</h1>
            </div>
            
            <div className={styles.container}>
                <h1 style={{ color: 'red' }}>AI Form Input</h1>
                <input
                    type="text"
                    className={styles.inputField}
                    placeholder="Enter your input"
                    // Add other necessary props and handlers
                />
                <button className={styles.button} onClick={handleNext}>
                    Next
                </button>
            </div>
        </div>
    );
};

export default AIFormInput;