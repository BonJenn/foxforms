import React from 'react';

const AddItemsForm = ({ onNext, onBack }) => {
    return (
        <div>
            {/* Form content here */}
            <h1>Add Items Here</h1>
            <button onClick={onBack}>Back</button>
            <button onClick={onNext}>Next</button>
        </div>
    );
};

export default AddItemsForm;