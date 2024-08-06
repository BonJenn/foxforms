import React, { useState } from 'react';
import styles from './OptionsForm.module.css';

const OptionsForm = ({ onNext, onBack }) => {
    const [limit, setLimit] = useState('unlimited');

    const handleChange = (event) => {
        setLimit(event.target.value);
    };

    return (
        <div className={styles.optionsForm}>
            <h1>Limit the number of signups per person to</h1>
            <select value={limit} onChange={handleChange}>
                <option value="unlimited">Unlimited</option>
                {[...Array(25).keys()].map(n => (
                    <option key={n + 1} value={n + 1}>{n + 1}</option>
                ))}
            </select>
            <div className={styles.buttonContainer}>
                <button type="button" onClick={onBack}>Back</button>
                <button type="button" onClick={onNext}>Next</button>
            </div>

        <div className={styles.publishingSettings}>
            <h2>Publishing Settings</h2>
            <div>
                <input type="checkbox" id="unpublished" name="unpublished" />
                <label htmlFor="unpublished">Unpublished</label>
            </div>
            <div>
                <input type="checkbox" id="published" name="published" />
                <label htmlFor="published">Published</label>
            </div>
        </div>


        </div>
    );
};

export default OptionsForm;
