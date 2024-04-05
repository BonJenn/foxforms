import React, { useState } from 'react';
import styles from './DateSelectionForm.module.css';

const DateSelectionForm = ({ onBack, onNext, formId, updateSelectedDates, setUsingDates, usingDates, updateGlobalPayloadState }) => {
    const [formDateOption, setFormDateOption] = useState('');
    const [additionalFields, setAdditionalFields] = useState([]);
    const [newField, setNewField] = useState('');
    const [showDateForm, setShowDateForm] = useState(false);
    const [dates, setDates] = useState([]);

    const handleCheckboxChange = (event) => {
        const { checked } = event.target;
        setUsingDates(checked);
        setShowDateForm(checked);
        if (checked && dates.length === 0) {
            addDate();
        }
    };

    const handleNotUsingDatesChange = (event) => {
        const { checked } = event.target;
        setUsingDates(!checked);
        setShowDateForm(false);
    };

    const handleSubmit = async (dateOption = '') => {
        if (dateOption === 'noDates') {
            setUsingDates(false); // Indicate that dates are not being used
            console.log('Using Dates:', false);
            onNext(); // Navigate to the next form
        } else if (dateOption === 'specificDates') {
            setUsingDates(true); // Indicate that specific dates are being used
            console.log('Using Dates:', true);
            setShowDateForm(true);
            onNext();
        }
    };

    const handleNoDatesSelected = () => {
        setUsingDates(false); // Indicate that dates are not being used
        onNext(); // Navigate to the next form, which should be configured to go to AddItemsForm if usingDates is false
    };

    const addDate = () => {
        setDates([...dates, '']); // Add an empty string as a placeholder for a new date
    };

    const removeDate = (index) => {
        setDates(dates.filter((_, i) => i !== index));
    };

    const handleDateFormSubmit = async (event) => {
        event.preventDefault();
        try {
            const response = await fetch(`http://localhost:5174/forms/${formId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    dates: dates.filter(date => date !== ''), // Filter out any empty strings
                }),
            });
            if (!response.ok) {
                throw new Error('Failed to update form with dates');
            }
            updateSelectedDates(dates.filter(date => date !== '')); // Update selectedDates in FormWizard
            updateGlobalPayloadState({
                dates: dates.filter(date => date !== ''),
            });
            onNext(); // Optionally navigate to the next form or show a confirmation
        } catch (error) {
            console.error('Error updating form with dates:', error);
        }
    };

    const handleBack = () => {
        onBack(); // Call the onBack function passed as a prop
    };

    return (
        <>
          <div className={styles.signUpForm4}>
            <h1>My form is for</h1>
            <label>
                <span className={styles.checkboxLabel}>
                    <input
                        type="checkbox"
                        checked={showDateForm}
                        onChange={handleCheckboxChange}
                    />
                    <h3>Using specific dates</h3>
                </span>
            </label>
            <label>
                <span className={styles.checkboxLabel}>
                    <input
                        type="checkbox"
                        checked={!usingDates}
                        onChange={handleNotUsingDatesChange}
                    />
                    <h3>Not using any dates</h3>
                </span>
            </label>
            {showDateForm && (
                <div className={styles.datePicker}>
                    {dates.map((date, index) => (
                        <div key={index}>
                            <input 
                                type="date" 
                                value={date} 
                                onChange={(e) => {
                                    const newDates = [...dates];
                                                                       newDates[index] = e.target.value;
                                                                       setDates(newDates);
                                }} 
                            />
                            <button type="button" onClick={() => removeDate(index)}>x</button>
                        </div>
                    ))}
                    <button type="button" className={styles.moreDatesButton} onClick={addDate}>+</button>
                    <button type="button" onClick={handleDateFormSubmit}>Done Adding Dates</button>
                </div>
            )}
            <div className={styles.buttonContainer}>
                <button type="button" onClick={handleBack}>Back</button>
            
            </div>
          </div>
        </>
    );
};

export default DateSelectionForm;
