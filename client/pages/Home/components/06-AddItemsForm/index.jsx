import React, { useState, useEffect } from 'react'; // Ensure useEffect is imported
import styles from './AddItemsForm.module.css';

// Function to format time (assuming time is in 'HH:mm' format)
const formatTime = (time) => {
    // Example: Convert '14:00' to '2:00 PM'
    const [hours, minutes] = time.split(':');
    const hoursInt = parseInt(hours, 10);
    const period = hoursInt >= 12 ? 'PM' : 'AM';
    const formattedHours = ((hoursInt + 11) % 12 + 1); // Convert 24h to 12h format
    return `${formattedHours}:${minutes} ${period}`;
};

const AddItemsForm = ({ onNext, onBack, formId }) => {
    console.log('Form ID:', formId);
    const [timeSlotsForDates, setTimeSlotsForDates] = useState({}); // State to store fetched time slots

    useEffect(() => {
        if (formId) { // Only proceed if formId is not undefined
            const fetchFormData = async () => {
                try {
                    const response = await fetch(`http://localhost:5174/forms/${formId}`);
                    if (!response.ok) {
                        throw new Error('Failed to fetch form data');
                    }
                    const formData = await response.json();
                    setTimeSlotsForDates(formData.timeSlotsForDates || {}); // Update state with fetched time slots
                } catch (error) {
                    console.error('Error fetching form data:', error);
                }
            };

            fetchFormData();
        }
    }, [formId]); // Dependency array includes formId to refetch if it changes

    const [items, setItems] = useState({});

    const addItem = (date, slotIndex) => {
        const newItem = { description: '', slots: 1 };
        setItems({
            ...items,
            [date]: {
                ...items[date],
                [slotIndex]: [...(items[date]?.[slotIndex] || []), newItem]
            }
        });
    };

    const removeItem = (date, slotIndex, itemIndex) => {
        const updatedSlotItems = [...items[date][slotIndex]];
        updatedSlotItems.splice(itemIndex, 1);
        setItems({
            ...items,
            [date]: {
                ...items[date],
                [slotIndex]: updatedSlotItems
            }
        });
    };

    const updateItem = (date, slotIndex, itemIndex, field, value) => {
        const updatedItems = { ...items };
        updatedItems[date][slotIndex][itemIndex][field] = value;
        setItems(updatedItems);
    };

    return (
        <div className={styles.formContainer}>
            <h1>Add Items Here</h1>
            <div>
                <h2>Time Slots for Selected Dates</h2>
                {Object.entries(timeSlotsForDates).length > 0 ? (
                Object.entries(timeSlotsForDates).map(([date, slots]) => (
                    <div key={date}>
                    <h3>{date}</h3>
                    <ul>
                        {slots.map((slot, index) => (
                        <li key={index}>
                            Start Time: {slot.startTime || 'N/A'}, End Time: {slot.endTime || 'N/A'}
                        </li>
                        ))}
                    </ul>
                    </div>
                ))
                ) : (
                <p>No time slots available.</p>
                )}
            </div>
            <button onClick={onBack}>Back</button>
            <button onClick={onNext}>Next</button>
        </div>
    );
};

export default AddItemsForm
