import React, { useState } from 'react';
import styles from './AddItemsForm.module.css';

const AddItemsForm = ({ onNext, onBack, selectedDates, timeSlotsForDates }) => {
    console.log('Selected Dates:', selectedDates);
    console.log('Time Slots for Dates:', timeSlotsForDates);
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
                <h2>Selected Dates</h2>
                <ul>
                    {Object.values(selectedDates).map((value, index) => (
                        <li key={index}>{value}</li>
                    ))}
                </ul>
                <h2>Time Slots for Selected Dates</h2>
                {Object.entries(timeSlotsForDates).map(([date, slots]) => (
                    <div key={date}>
                        <h3>{date}</h3>
                        <ul>
                            {slots.map((slot, index) => (
                                <li key={index}>{slot}</li>
                            ))}
                        </ul>
                    </div>
                ))}
            </div>
            <button onClick={onBack}>Back</button>
            <button onClick={onNext}>Next</button>
        </div>
    );
};

export default AddItemsForm;