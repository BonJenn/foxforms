import React, { useState, useEffect } from 'react';
import styles from './TimeSlotForm.module.css';

const TimeSlotForm = ({ onBack, onNext, setHasTimeSlots, selectedDates, formId }) => {
    const [showTimeSlotSection, setShowTimeSlotSection] = useState(false);
    const [datesWithTimeSlots, setDatesWithTimeSlots] = useState(new Set());
    const [showTimeSlotPicker, setShowTimeSlotPicker] = useState(false);
    const [timeSlotsForDates, setTimeSlotsForDates] = useState({});

    useEffect(() => {
        setTimeSlotsForDates(prevState => {
            const initialTimeSlots = { ...prevState };
            selectedDates.forEach(date => {
                if (!prevState[date]) {
                    initialTimeSlots[date] = [{ startTime: '', endTime: '' }];
                }
            });
            return initialTimeSlots;
        });
    }, [selectedDates]);

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

    const addTimeSlotForDate = (date) => {
        const newTimeSlotsForDate = [...(timeSlotsForDates[date] || []), { startTime: '', endTime: '' }];
        setTimeSlotsForDates(prevState => ({
            ...prevState,
            [date]: newTimeSlotsForDate,
        }));
    };

    const handleStartTimeChange = (date, index, newStartTime) => {
        const updatedTimeSlots = timeSlotsForDates[date].map((slot, slotIndex) => {
            if (slotIndex === index) {
                return { ...slot, startTime: newStartTime };
            }
            return slot;
        });
        setTimeSlotsForDates({ ...timeSlotsForDates, [date]: updatedTimeSlots });
    };

    const handleEndTimeChange = (date, index, newEndTime) => {
        const updatedTimeSlots = timeSlotsForDates[date].map((slot, slotIndex) => {
            if (slotIndex === index) {
                return { ...slot, endTime: newEndTime };
            }
            return slot;
        });
        setTimeSlotsForDates({ ...timeSlotsForDates, [date]: updatedTimeSlots });
    };

    const saveTimeSlots = async () => {
      const updatedForm = {
        dates: Array.from(selectedDates).map(date => ({
          date,
          timeSlots: timeSlotsForDates[date] || [],
        })),
        // Include the timeSlotsForDates data
        timeSlotsForDates: timeSlotsForDates,
      };

      try {
        const response = await fetch(`http://localhost:5174/forms/${formId}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(updatedForm),
        });

        if (!response.ok) {
          throw new Error('Failed to save time slots');
        }

        console.log('Time slots saved successfully');
        // Optionally, navigate to the next form or show a success message
      } catch (error) {
        console.error('Error saving time slots:', error);
      }
    };

    const goToNextForm = () => {
        saveTimeSlots().then(() => {
            onNext(); // Assuming onNext will navigate to 06-AddItemsForm/index.jsx
        });
    };

    return (
        <div className={styles.timeSlotForm}>
          <form>
            <h1>Will your form use time slots?</h1>
            <div className={styles.buttonContainer}>
                <button type="button" onClick={handleYesClick}>Yes</button>
                <button type="button" onClick={(event) => { event.preventDefault(); handleNoClick(event); onNext(); }}>No</button>
            </div>
            {showTimeSlotSection && (
                <div>
                    <h2 className={styles.timeSlotText}>Which Dates Have Time Slots</h2>
                    {selectedDates.map((date, index) => (
                        <div key={index} className={styles.dateSwitch}>
                            <span>{date}</span>
                            <label className={styles.switch}>
                                <input type="checkbox" checked={datesWithTimeSlots.has(date)} onChange={() => toggleDate(date)} />
                                <span className={styles.slider}></span>
                            </label>
                        </div>
                    ))}
                    <div className={styles.dateExpandButton}>
                        <button type="button" onClick={(event) => { event.preventDefault(); setShowTimeSlotPicker(true); }}>Choose time slots for selected dates</button>
                    </div>
                </div>
            )}
            {showTimeSlotPicker && selectedDates.map((date, index) => {
                if (datesWithTimeSlots.has(date)) {
                    return (
                        <div key={index} className={styles.timeSlotPickerContainer}>
                            <h3>Time slots for {date}</h3>
                            {timeSlotsForDates[date] && timeSlotsForDates[date].map((slot, slotIndex) => (
                                <div key={slotIndex}>
                                    <input type="time" value={slot.startTime} onChange={(e) => handleStartTimeChange(date, slotIndex, e.target.value)} className={styles.timeInput} /> to 
                                    <input type="time" value={slot.endTime} onChange={(e) => handleEndTimeChange(date, slotIndex, e.target.value)} className={styles.timeInput} />
                                  
                                         <button type="button" onClick={(event) => { event.preventDefault(); addTimeSlotForDate(date); }}>Add Time Slot</button>
                                    
                                </div>
                            ))}
                        </div>
                    );
                }
                return null;
            })}
              
            <div className={styles.nextButtonContainer}>
                {showTimeSlotPicker && <button type="button" onClick={goToNextForm}>Next</button>}
            </div>
          </form>
        </div>
    );
};

export default TimeSlotForm;
