import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../../../src/context/AuthContext';
import SignUpFormWizard from './SignUpFormWizard';
import BasicFormWizard from './BasicFormWizard';
import AIFormWizard from './AIFormWizard';

const FormWizard = ({ type, authToken, skipAccountSetup }) => {
    const navigate = useNavigate();
    const { authState } = useAuth();
    const userId = authState.userId;
    const [currentStep, setCurrentStep] = useState(skipAccountSetup ? 1 : 0);
    const [formId, setFormId] = useState(null);
    const [globalPayload, setGlobalPayload] = useState({});

    useEffect(() => {
        console.log('FormWizard rendered with type:', type);
        console.log('Current Step:', currentStep);
    }, [type, currentStep]);

    const updateGlobalPayloadState = (updates) => {
        setGlobalPayload(prevState => ({ ...prevState, ...updates }));
    };

    const nextStep = () => {
        setCurrentStep(currentStep + 1);
    };

    const prevStep = () => {
        setCurrentStep(currentStep - 1);
    };

    const renderStep = () => {
        switch (type) {
            case 'signup':
                return <SignUpFormWizard authToken={authToken} skipAccountSetup={skipAccountSetup} />;
            case 'basic':
                return <BasicFormWizard authToken={authToken} userId={userId} globalPayload={globalPayload} updateGlobalPayloadState={updateGlobalPayloadState} currentStep={currentStep} setCurrentStep={setCurrentStep} formId={formId} setFormId={setFormId} />;
            case 'ai':
                return <AIFormWizard authToken={authToken} userId={userId} globalPayload={globalPayload} updateGlobalPayloadState={updateGlobalPayloadState} currentStep={currentStep} setCurrentStep={setCurrentStep} formId={formId} setFormId={setFormId} />;
            default:
                navigate(`/dashboard/${authToken}`);
                return null;
        }
    };

    return (
        <div>
            {renderStep()}
        </div>
    );
};

export default FormWizard;