import React, { useState, useEffect } from 'react';
import styles from './AddItemsForm.module.css';

// Helper function to format time
const formatTime = (time) => {
    const [hours, minutes] = time.split(':');
    const hoursInt = parseInt(hours, 10);
    const period = hoursInt >= 12 ? 'PM' : 'AM';
    const formattedHours = ((hoursInt + 11) % 12 + 1);
    return `${formattedHours}:${minutes} ${period}`;
};

const AddItemsForm = ({ onNext, onBack, formId }) => {
    console.log('Form ID:', formId);
    const [timeSlotsForDates, setTimeSlotsForDates] = useState({});
    const [newItem, setNewItem] = useState({}); // Object to manage item descriptions independently
    const [numberOfSlots, setNumberOfSlots] = useState({}); // Changed from single value to object

    // Fetch form data on component mount or formId change
    useEffect(() => {
        const fetchFormData = async () => {
            if (!formId) return;
            try {
                const response = await fetch(`http://localhost:5174/forms/${formId}`);
                if (!response.ok) {
                    throw new Error('Failed to fetch form data');
                }
                const formData = await response.json();
                setTimeSlotsForDates(formData.timeSlotsForDates || {});
            } catch (error) {
                console.error('Error fetching form data:', error);
            }
        };

        fetchFormData();
    }, [formId]);

    useEffect(() => {
        console.log('newItem:', newItem);
    }, [newItem]);

    // Adjust the input handlers to manage each slot's input independently
    const handleNewItemChange = (date, slotIndex, value) => {
        setNewItem(prev => ({
            ...prev,
            [`${date}-${slotIndex}`]: value
        }));
    };

    const handleNumberOfSlotsChange = (date, slotIndex, value) => {
        setNumberOfSlots(prev => ({
            ...prev,
            [`${date}-${slotIndex}`]: value
        }));
    };

    const addItemToSlot = (date, slotIndex, description) => {
        const slots = numberOfSlots[`${date}-${slotIndex}`] || 1; // Default to 1 if not specified
        if (!description) {
            console.error('Description is empty');
            return; // Early return if description is empty
        }
        setTimeSlotsForDates(prev => {
            const updatedSlots = (prev[date] || []).map((slot, index) => 
                index === slotIndex ? { ...slot, items: [...(slot.items || []), { description, slots }] } : slot
            );
            // Reset the input for the current slot after adding the item
            setNewItem(prev => ({ ...prev, [`${date}-${slotIndex}`]: '' }));
            setNumberOfSlots(prev => ({ ...prev, [`${date}-${slotIndex}`]: '' })); // Reset number of slots input
            return { ...prev, [date]: updatedSlots };
        });
    };

    const removeItemFromSlot = (date, slotIndex, itemIndex) => {
        setTimeSlotsForDates(prev => {
            const updatedSlots = prev[date].map((slot, index) => {
                if (index === slotIndex) {
                    const updatedItems = slot.items.filter((_, i) => i !== itemIndex);
                    return { ...slot, items: updatedItems };
                }
                return slot;
            });
            return { ...prev, [date]: updatedSlots };
        });
    };

    const saveItemsToBackend = async () => {
        try {
            const response = await fetch(`http://localhost:5174/forms/${formId}/items`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ 
                    items: [newItem],
                    slots: [numberOfSlots] 
                }), // Adjusted to send newItem as an array of items
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
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {Object.entries(timeSlotsForDates).map(([date, slots]) =>
                        slots?.map((slot, slotIndex) => (
                            <tr key={`${date}-${slotIndex}`}>
                                <td>{date}</td>
                                <td>{`${formatTime(slot.startTime)} - ${formatTime(slot.endTime)}`}</td>
                                <td>
                                    {slot.items?.map((item, itemIndex) => (
                                        <div key={itemIndex}>
                                            <span>{item.description} - {item.slots} slots</span>
                                            <button onClick={() => removeItemFromSlot(date, slotIndex, itemIndex)}>Delete Item</button>
                                        </div>
                                    ))}
                                    <input 
                                        value={newItem[`${date}-${slotIndex}`] || ''} 
                                        onChange={(e) => handleNewItemChange(date, slotIndex, e.target.value)} 
                                        placeholder="Add New Item" 
                                    />
                                    <input 
                                        type="number"
                                        value={numberOfSlots[`${date}-${slotIndex}`] || ''} 
                                        onChange={(e) => handleNumberOfSlotsChange(date, slotIndex, e.target.value)} 
                                        placeholder="Number of Slots" 
                                    />
                                    <button onClick={() => { addItemToSlot(date, slotIndex, newItem[`${date}-${slotIndex}`]); }}>Add New Item</button>
                                </td>
                                <td>
                                    <button onClick={() => saveItemsToBackend()}>Save</button>
                                </td>
                            </tr>
                        ))
                    )}
                </tbody>
            </table>
            <button onClick={onBack}>Back</button>
            <button onClick={onNext}>Next</button>
        </div>
    );
};

export default AddItemsForm;
