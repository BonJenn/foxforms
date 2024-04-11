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
    const [newItem, setNewItem] = useState({}); // Now an object
    const [numberOfSlots, setNumberOfSlots] = useState({}); // Now an object
    const [selectedDate, setSelectedDate] = useState('');
    const [selectedSlotIndex, setSelectedSlotIndex] = useState(null);
    const [displayItemsAndSlots, setDisplayItemsAndSlots] = useState({});
    const [itemsAndSlots, setItemsAndSlots] = useState(null);
    const [isEditMode, setIsEditMode] = useState({});
    const [initialItem, setInitialItem] = useState({});
    const [currentItem, setCurrentItem] = useState({});

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

    const addItemToSlot = (date, slotIndex) => {
        const newItemName = currentItem[`${date}-${slotIndex}`] || '';
        const slots = numberOfSlots[`${date}-${slotIndex}`] || 0;
        if (!newItemName || slots <= 0) {
            console.error('Invalid item name or number of slots');
            return; // Early return if invalid input
        }
        setTimeSlotsForDates(prev => {
            const updatedSlots = { ...prev };
            // Ensure the date key maps to an array
            if (!updatedSlots[date]) {
                updatedSlots[date] = [];
            }
            // Ensure the slotIndex is initialized
            if (!updatedSlots[date][slotIndex]) {
                updatedSlots[date][slotIndex] = { items: [], isSaved: false };
            }
            const items = updatedSlots[date][slotIndex].items || [];
            items.push({ name: newItemName, slots: slots });
            updatedSlots[date][slotIndex] = { ...updatedSlots[date][slotIndex], items, isSaved: true };
            return updatedSlots;
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
        let isMounted = true;
        try {
            const response = await fetch(`http://localhost:5174/forms/${formId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ 
                    items: [currentItem[`${date}-${slotIndex}`]],
                    slots: [numberOfSlots[`${date}-${slotIndex}`]] 
                }), // Adjusted to send newItem as an array of items
            });
            if (!response.ok) {
                throw new Error('Failed to save items');
            }
            if (isMounted) {
                console.log('Items saved to backend');
                setTimeSlotsForDates(prev => {
                    const updatedSlots = { ...prev };
                    if (updatedSlots[date] && updatedSlots[date][slotIndex]) {
                        updatedSlots[date][slotIndex].isSaved = true;
                        updatedSlots[date][slotIndex].items = [{ name: currentItem[`${date}-${slotIndex}`], slots: numberOfSlots[`${date}-${slotIndex}`] }];
                    }
                    return updatedSlots;
                });
                setCurrentItem(prev => ({ ...prev, [`${date}-${slotIndex}`]: '' }));
                setNumberOfSlots(prev => ({ ...prev, [`${date}-${slotIndex}`]: 0 }));
                setIsEditMode(prev => ({ ...prev, [`${date}-${slotIndex}`]: false }));
            }
        } catch (error) {
            console.error('Error saving items:', error);
        } finally {
            if (isMounted) {
                // Clean-up actions if needed
            }
        }
        return () => {
            isMounted = false; // Set flag to false when component unmounts
        };
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

    const toggleEditMode = (date, slotIndex) => {
        const currentSlot = timeSlotsForDates[date]?.[slotIndex];
        if (currentSlot && currentSlot.items.length > 0) {
            const currentItem = currentSlot.items[0]; // Assuming you're editing the first item
            setInitialItem(prev => ({ ...prev, [`${date}-${slotIndex}`]: currentItem.name }));
            setCurrentItem(prev => ({ ...prev, [`${date}-${slotIndex}`]: currentItem.name }));
            setNumberOfSlots(prev => ({ ...prev, [`${date}-${slotIndex}`]: currentItem.slots }));
        }
        setIsEditMode(prev => ({ ...prev, [`${date}-${slotIndex}`]: !prev[`${date}-${slotIndex}`] }));
    };

    const handleInputChange = (event, key, isItem) => {
        const value = event.target.value;
        if (isItem) {
            setCurrentItem(prev => ({ ...prev, [key]: value }));
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
                                    {slot.isSaved && !isEditMode[`${date}-${slotIndex}`] ? (
                                        <>
                                            {slot.items.map((item, index) => (
                                                <div key={index}>
                                                    {item.name} - {item.slots} slots
                                                </div>
                                            ))}
                                            <button onClick={() => toggleEditMode(date, slotIndex)}>Edit</button>
                                        </>
                                    ) : (
                                        <>
                                            <input 
                                                value={currentItem[`${date}-${slotIndex}`] || ''} 
                                                onChange={(e) => handleInputChange(e, `${date}-${slotIndex}`, true)} 
                                            />
                                            <input 
                                                type="number"
                                                value={numberOfSlots[`${date}-${slotIndex}`] || ''} 
                                                onChange={(e) => handleInputChange(e, `${date}-${slotIndex}`, false)} 
                                            />
                                            <button onClick={() => { addItemToSlot(date, slotIndex); toggleEditMode(date, slotIndex); }}>Save</button>
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
