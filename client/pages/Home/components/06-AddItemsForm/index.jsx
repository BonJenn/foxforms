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
        if (!updatedItems[date]) {
            updatedItems[date] = {};
        }
        if (!updatedItems[date][slotIndex]) {
            updatedItems[date][slotIndex] = [];
        }
        if (!updatedItems[date][slotIndex][itemIndex]) {
            updatedItems[date][slotIndex][itemIndex] = { description: '', slots: 1 }; // Default structure
        }
        updatedItems[date][slotIndex][itemIndex][field] = value;
        setItems(updatedItems);
    };

    const saveItemsToBackend = async () => {
        try {
            const response = await fetch(`http://localhost:5174/forms/${formId}/items`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(items),
            });
            if (!response.ok) {
                throw new Error('Failed to save items');
            }
            console.log('Items saved successfully');
        } catch (error) {
            console.error('Error saving items:', error);
        }
    };

    return (
        <div className={styles.formContainer}>
            <h1>Add Items Here</h1>
            <table>
                <thead>
                    <tr>
                        <th>Date</th>
                        <th>Time Slot</th>
                        <th>Items</th>
                        <th># of Slots</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {Object.entries(timeSlotsForDates).map(([date, slots]) => (
                        slots.map((slot, slotIndex) => (
                            <tr key={`${date}-${slotIndex}`}>
                                <td>{date}</td>
                                <td>{`${formatTime(slot.startTime)} - ${formatTime(slot.endTime)}`}</td>
                                <td>
                                    <input type="text" />
                                </td>
                                <td>
                                    <input type="number" />
                                </td>
                                <td>
                                    <button onClick={() => saveItemsToBackend()}>Save</button>
                                    <button onClick={() => removeItem(date, slotIndex, 0)}>Delete</button>
                               
                                </td>
                            </tr>
                        ))
                    ))}
                </tbody>
            </table>
            <button onClick={onBack}>Back</button>
            <button onClick={onNext}>Next</button>
        </div>
    );
};

export default AddItemsForm
