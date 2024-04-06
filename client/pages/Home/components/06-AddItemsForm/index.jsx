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

const AddItemsForm = ({ onNext, onBack, formId, updateGlobalPayloadState }) => {
    console.log('Form ID:', formId);
    const [timeSlotsForDates, setTimeSlotsForDates] = useState({});
    const [newItem, setNewItem] = useState({}); // Now an object
    const [numberOfSlots, setNumberOfSlots] = useState({}); // Now an object
    const [selectedDate, setSelectedDate] = useState('');
    const [selectedSlotIndex, setSelectedSlotIndex] = useState(null);
    const [displayItemsAndSlots, setDisplayItemsAndSlots] = useState({});
    const [itemsAndSlots, setItemsAndSlots] = useState(null);

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
                // Assuming formData contains a dates array with nested timeSlots
                // Adjust this according to your actual data structure
                const timeSlotsMapping = {};
                formData.dates.forEach(dateObj => {
                    timeSlotsMapping[dateObj.date] = dateObj.timeSlots || [];
                });
                setTimeSlotsForDates(timeSlotsMapping);
            } catch (error) {
                console.error('Error fetching form data:', error);
            }
        };

        fetchFormData();
    }, [formId]);

    useEffect(() => {
        console.log('newItem:', newItem);
    }, [newItem]);

    const addItemToSlot = (date, slotIndex, itemName, numberOfSlots) => {
        updateGlobalPayloadState(prevState => {
            let updatedState = { ...prevState };
            if (!updatedState.dates[date].timeSlots[slotIndex].items) {
                updatedState.dates[date].timeSlots[slotIndex].items = [];
            }
            updatedState.dates[date].timeSlots[slotIndex].items.push({ name: itemName, slots: numberOfSlots });
            return updatedState;
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

    const saveItemsToBackend = async (date, slotIndex) => {
        const timeSlot = timeSlotsForDates[date][slotIndex];
        if (!timeSlot || !timeSlot.items) return;

        timeSlot.items.forEach(async (item) => {
            try {
                const response = await fetch(`http://localhost:5174/forms/${formId}/time-slots/items`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        date,
                        timeSlot: `${formatTime(timeSlot.startTime)}-${formatTime(timeSlot.endTime)}`,
                        itemName: item.name,
                        slots: item.slots,
                    }),
                });
                if (!response.ok) {
                    throw new Error('Failed to save item');
                }
                console.log('Item saved to backend');
            } catch (error) {
                console.error('Error saving item:', error);
            }
        });
    };

    const displayData = async () => {
        try {
            const response = await fetch(`http://localhost:5174/forms/${formId}`);
            if (!response.ok) {
                throw new Error('Failed to fetch form data');
            }
            const formData = await response.json();
            // Assuming the items and slots are part of an 'items' array in the form data
            // and each item in this array has 'slots' properties
            const itemsData = formData.items || [];
            const slotsData = formData.slots || [];
            // Now, itemsData contains the array of items and slots
            // You can set this to state, or process it as needed
            setDisplayItemsAndSlots({itemsData, slotsData}); // Corrected to set an object
        } catch (error) {
            console.error('Error fetching form data:', error);
        }
    };

    useEffect(() => {
        if (timeSlotsForDates) {
            Object.values(timeSlotsForDates).forEach(slots => {
                slots.forEach(slot => {
                    if (slot.isSaved) {
                        displayData().then(data => {
                            setItemsAndSlots(data);
                        });
                    }
                });
            });
        }
    }, [timeSlotsForDates]);

    const handleInputChange = (event, key, isItem) => {
        const value = event.target.value;
        if (isItem) {
            setNewItem(prev => ({ ...prev, [key]: value }));
        } else {
            setNumberOfSlots(prev => ({ ...prev, [key]: parseInt(value, 10) || 0 }));
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
                    {Object.entries(timeSlotsForDates || {}).map(([date, slots]) =>
                        (slots || []).map((slot, slotIndex) => (
                            <tr key={`${date}-${slotIndex}`}>
                                <td>{date}</td>
                                <td>{`${formatTime(slot.startTime)} - ${formatTime(slot.endTime)}`}</td>
                                <td>
                                    {slot.isSaved ? (
                                        slot.items.map((item, index) => (
                                            <div key={index}>
                                                {item.name} - {item.slots} slots
                                            </div>
                                        ))
                                    ) : (
                                        <>
                                            <input 
                                                value={newItem[`${date}-${slotIndex}`] || ''} 
                                                onChange={(e) => handleInputChange(e, `${date}-${slotIndex}`, true)} 
                                                placeholder="Add New Item" 
                                            />
                                            <input 
                                                type="number"
                                                value={numberOfSlots[`${date}-${slotIndex}`] || ''} 
                                                onChange={(e) => handleInputChange(e, `${date}-${slotIndex}`, false)} 
                                                placeholder="Number of Slots" 
                                            />
                                            <button onClick={() => addItemToSlot(date, slotIndex, newItem[`${date}-${slotIndex}`], numberOfSlots[`${date}-${slotIndex}`])}>Add New Item</button>
                                        </>
                                    )}
                                </td>
                                <td>
                                    {!slot.isSaved && (
                                        <button onClick={() => saveItemsToBackend(date, slotIndex)}>Save</button>
                                    )}
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
