import React, { useState } from 'react';
import AIFormInput from '../AIForm/AIFormInput';
import AIFormSuggestions from '../AIForm/AIFormSuggestions';
import AIFormReview from '../AIForm/AIFormReview';


const AIFormWizard = ({ authToken }) => {
    const [currentStep, setCurrentStep] = useState(0);
    const [formId, setFormId] = useState(null);
    const [globalPayload, setGlobalPayload] = useState({});

    const updateGlobalPayloadState = (updates) => {
        setGlobalPayload(prevState => ({ ...prevState, ...updates }));
    };

    const nextStep = () => setCurrentStep(currentStep + 1);
    const prevStep = () => setCurrentStep(currentStep - 1);

    const renderStep = () => {
        switch (currentStep) {
            case 0:
                return (
                    <AIFormInput 
                        onNext={nextStep} 
                        updateFormId={setFormId} 
                        globalPayload={globalPayload} 
                        updateGlobalPayloadState={updateGlobalPayloadState} 
                    />
                );
            case 1:
                return (
                    <AIFormSuggestions 
                        onNext={nextStep} 
                        onBack={prevStep} 
                        formId={formId} 
                        globalPayload={globalPayload} 
                        updateGlobalPayloadState={updateGlobalPayloadState} 
                    />
                );
            case 2:
                return (
                    <AIFormReview 
                        onNext={() => console.log('AI Form completed')} 
                        onBack={prevStep} 
                        formId={formId} 
                        globalPayload={globalPayload} 
                    />
                );
            default:
                return null;
        }
    };

    return (
        <div>
            {renderStep()}
        </div>
    );
};

export default AIFormWizard;