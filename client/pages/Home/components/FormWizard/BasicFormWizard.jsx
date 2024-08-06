import React, { useState } from 'react';
import BasicInfoForm from '../BasicInfoForm/BasicInfoForm';
import BasicInfoFormFields from '../BasicInfoForm/BasicInfoFormFields';
import BasicInfoFormReview from '../BasicInfoForm/BasicInfoFormReview';

const BasicFormWizard = ({ authToken }) => {
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
                return <BasicInfoForm onNext={nextStep} updateFormId={setFormId} globalPayload={globalPayload} updateGlobalPayloadState={updateGlobalPayloadState} />;
            case 1:
                return <BasicInfoFormFields onNext={nextStep} onBack={prevStep} formId={formId} globalPayload={globalPayload} updateGlobalPayloadState={updateGlobalPayloadState} />;
            case 2:
                return <BasicInfoFormReview onNext={() => console.log('Form completed')} onBack={prevStep} formId={formId} globalPayload={globalPayload} />;
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

export default BasicFormWizard;