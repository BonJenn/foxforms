import React, { useState } from 'react';
import styles from './TimeSlotForm.module.css';

const TimeSlotForm = ({ onBack, onNext, setHasTimeSlots, selectedDates, formId }) => {
    const [showTimeSlotSection, setShowTimeSlotSection] = useState(false);
    const [datesWithTimeSlots, setDatesWithTimeSlots] = useState(new Set());

    const handleYesClick = async (event) => {
        event.preventDefault();
        try {
            const response = await fetch(`http://localhost:5174/forms/${formId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    hasTimeSlots: 'true',
                }),
            });
            
            if (!response.ok) {
                throw new Error('Failed to update time slots');
            }
            setHasTimeSlots(true);
            setShowTimeSlotSection(true);
        } catch (error) {
            console.error(error);
        }
    };

    const handleNoClick = async (event) => {
        event.preventDefault();
        try {
            const response = await fetch(`http://localhost:5174/forms/${formId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    hasTimeSlots: 'false',
                }),
            });
            
            if (!response.ok) {
                throw new Error('Failed to update time slots');
            }
            setHasTimeSlots(false);
            setShowTimeSlotSection(false); // Assuming you want to hide the section if "No" is clicked
        } catch (error) {
            console.error(error);
        }
    };

    const toggleDate = (date) => {
        const newDates = new Set(datesWithTimeSlots);
        if (newDates.has(date)) {
            newDates.delete(date);
        } else {
            newDates.add(date);
        }
        setDatesWithTimeSlots(newDates);
    };

    return (
        <div className={styles.signUpForm5}>
          <form>
            <h1>Will your form use time slots?</h1>
            <button type="button" onClick={handleYesClick}>Yes</button>
            {/* Removed incorrect syntax and added separate onClick and onNext handlers */}
            <button type="button" onClick={(event) => { handleNoClick(event); onNext(); }}>No</button>
            {showTimeSlotSection && (
                <div>
                    <h2>Which Dates Have Time Slots</h2>
                    {selectedDates.map((date, index) => (
                        <div key={index}>
                            <span>{date}</span>
                            <button type="button" onClick={() => toggleDate(date)}>Toggle</button>
                        </div>
                    ))}
                    {/* Additional UI for adding time slots will go here */}
                </div>
            )}
          </form>
        </div>
    );
};

export default TimeSlotForm;
