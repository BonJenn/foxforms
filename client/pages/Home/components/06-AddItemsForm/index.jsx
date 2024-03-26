import React from 'react';
import styles from './AddItemsForm.module.css';

const AddItemsForm = ({ onNext, onBack }) => {
    return (
        <div className={styles.formContainer}>
            {/* Form content here */}
            <h1>Add Items Here</h1>
            <button onClick={onBack}>Back</button>
            <button onClick={onNext}>Next</button>
        </div>
    );
};

export default AddItemsForm;