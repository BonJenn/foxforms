import React, { useState } from 'react';
import AIFormInput from '../AIForm/01-AIFormInput/AIFormInput';
import AIFormSuggestions from '../AIForm/02-AIFormSuggestions/AIFormSuggestions';
import AIFormReview from '../AIForm/03-AIFormReview/AIFormReview';
import { useAuth } from '../../../../../src/context/AuthContext';

const AIFormWizard = ({ authToken, userId, globalPayload, updateGlobalPayloadState, currentStep, setCurrentStep, formId, setFormId }) => {
    const { authState } = useAuth();

    const nextStep = () => setCurrentStep(currentStep + 1);
    const prevStep = () => setCurrentStep(currentStep - 1);

    const renderStep = () => {
        console.log('AIFormWizard Current Step:', currentStep); // Debugging log
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