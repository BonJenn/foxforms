import React, { useState } from 'react'; // Combine import statements
import styles from './DateSelectionForm.module.css';

const DateSelectionForm = ({ onBack, onNext, formId, updateSelectedDates }) => {
    const [formDateOption, setFormDateOption] = useState('');
    const [additionalFields, setAdditionalFields] = useState([]);
    const [newField, setNewField] = useState('');
    const [showDateForm, setShowDateForm] = useState(false);
    const [dates, setDates] = useState([]);

    const handleSubmit = async (dateOption = '') => {
        if (dateOption === 'noDates') {
            onNext(); // Assuming onNext will now navigate directly to AddItemsForm
        } else if (dateOption === 'specificDates') {
            setShowDateForm(true);
        }
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
            <div className={styles.signUpForm4Buttons}>
                <button type="button" onClick={() => handleSubmit('noDates')}>No particular dates</button>
                <button type="button" onClick={() => handleSubmit('specificDates')}>One or more specific dates</button>
            </div>
            <div className={styles.signUpForm4Extended}>

                </div>
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
                        <button type="button" onClick={addDate}>+</button>
                        <button type="button" onClick={handleDateFormSubmit}>Done Adding Dates</button>
                    </div>
                )}
                <div className={styles.buttonContainer}>
                    <button type="button" onClick={handleBack}>Back</button>
                    <button type="button" onClick={() => handleSubmit()}>Next</button>
                </div>
          </div>
        </>
    );
};

export default DateSelectionForm;
