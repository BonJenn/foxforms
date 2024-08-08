import React from 'react';
import styles from './AIFormReview.module.css';

const AIFormReview = ({ onNext, onBack, formId, globalPayload }) => {
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
            <div className={styles.reviewItem}>
                {/* Render review items here */}
            </div>
            <button className={styles.button} onClick={handleBack}>
                Back
            </button>
            <button className={styles.button} onClick={handleNext}>
                Submit
            </button>
        </div>
    );
};

export default AIFormReview;