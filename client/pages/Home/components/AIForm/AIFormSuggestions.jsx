import React, { useState, useEffect } from 'react';

const AIFormSuggestions = ({ onNext, onBack, formId, globalPayload, updateGlobalPayloadState }) => {
    const [suggestions, setSuggestions] = useState([]);

    useEffect(() => {
        // Here you would typically fetch suggestions from your AI service
        // based on the description provided in the previous step
        const mockSuggestions = [
            { id: 1, fieldName: 'Name', fieldType: 'text' },
            { id: 2, fieldName: 'Email', fieldType: 'email' },
            { id: 3, fieldName: 'Age', fieldType: 'number' },
        ];
        setSuggestions(mockSuggestions);
    }, []);

    const handleNext = () => {
        updateGlobalPayloadState({ finalFields: suggestions });
        onNext();
    };

    return (
        <div>
            <h2>Suggested Form Fields</h2>
            <ul>
                {suggestions.map(suggestion => (
                    <li key={suggestion.id}>
                        {suggestion.fieldName} - {suggestion.fieldType}
                    </li>
                ))}
            </ul>
            <button onClick={onBack}>Back</button>
            <button onClick={handleNext}>Next</button>
        </div>
    );
};

export default AIFormSuggestions;