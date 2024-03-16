import React, { useState } from 'react'; // Combine import statements
import styles from './SignUpForm4.module.css';

const SignUpForm4 = ({ onBack, onNext, formId }) => {
    const [formDateOption, setFormDateOption] = useState('');
    const [additionalFields, setAdditionalFields] = useState([]);
    const [newField, setNewField] = useState('');
    const [showDateForm, setShowDateForm] = useState(false);
    const [dates, setDates] = useState({ startDate: '', endDate: '' });

    const handleSubmit = async (dateOption = '') => {
        if (dateOption === 'noDates') {
            onNext(); // Navigate to SignUpForm5
        } else if (dateOption === 'specificDates') {
            setShowDateForm(true); // Show the date form
        }
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
                    dates: dates,
                }),
            });
            if (!response.ok) {
                throw new Error('Failed to update form with dates');
            }
            onNext(); // Optionally navigate to the next form or show a confirmation
        } catch (error) {
            console.error('Error updating form with dates:', error);
        }
    };

    // Define the handleBack function
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
            {showDateForm && (
                <form onSubmit={handleDateFormSubmit}>
                    <input 
                        type="date" 
                        value={dates.startDate} 
                        onChange={(e) => setDates({ ...dates, startDate: e.target.value })} 
                        placeholder="Start Date"
                    />
                    <input 
                        type="date" 
                        value={dates.endDate} 
                        onChange={(e) => setDates({ ...dates, endDate: e.target.value })} 
                        placeholder="End Date"
                    />
                    <button type="submit">Submit Dates</button>
                </form>
            )}
            <div className={styles.buttonContainer}>
                <button type="button" onClick={handleBack}>Back</button>
                <button type="button" onClick={() => handleSubmit()}>Next</button>
            </div>
          </div>
        </>
    );
};

export default SignUpForm4;
