import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import AccountSetupForm from '../01-AccountSetupForm';
import BasicInfoForm from '../02-BasicInfoForm';
import AdditionalDetailsForm from '../03-AdditionalDetailsForm';
import DateSelectionForm from '../04-DateSelectionForm';
import TimeSlotForm from '../05-TimeSlotForm';
import AddItemsForm from '../06-AddItemsForm';
import OptionsForm from '../07-OptionsForm';

const FormWizard = ({ userId, skipAccountSetup }) => {
    const location = useLocation();
    const [currentStep, setCurrentStep] = useState(skipAccountSetup ? 2 : 1);
    const [formId, setFormId] = useState(null); 
    const [additionalFields, setAdditionalFields] = useState([]);
    const [infoType, setInfoType] = useState('');
    const [username, setUsername] = useState(''); 
    const [password, setPassword] = useState(''); 
    const [formName, setFormName] = useState(''); 
    const [userIdState, setUserId] = useState(userId || '');
    const [customDomain, setCustomDomain] = useState(''); 
    const [lastStep, setLastStep] = useState(null); 
    const [hasSignedUp, setHasSignedUp] = useState(false); 
    const [hasTimeSlots, setHasTimeSlots] = useState(false); 
    const [timeSlots, setTimeSlots] = useState([
        { _id: '1', date: '2023-04-10', startTime: '10:00', endTime: '11:00', isBooked: false },
        { _id: '2', date: '2023-04-11', startTime: '11:00', endTime: '12:00', isBooked: true },
    ]); 
    const [selectedDates, setSelectedDates] = useState({}); 
    const [usingDates, setUsingDates] = useState(false); 
    const [timeSlotsForDates, setTimeSlotsForDates] = useState({}); 
    const [globalPayload, setGlobalPayload] = useState({});

    const updateGlobalPayloadState = (updates) => {
        setGlobalPayload(prevState => ({ ...prevState, ...updates }));
    };

    const updateSelectedDates = (dates) => {
        setSelectedDates(dates);
    };

    const nextStep = () => {
        console.log('Current Step:', currentStep, 'Using Dates:', usingDates);
        if (currentStep === 4) { 
            console.log('Before setting next step, Using Dates:', usingDates); 
            if (usingDates === false) {
                console.log('Skipping to AddItemsForm');
                setCurrentStep(6); 
            } else {
                console.log('Proceeding to TimeSlotForm');
                setCurrentStep(5); 
            }
        } else {
            setCurrentStep(currentStep + 1);
        }
    };
    const prevStep = () => {
        if (currentStep > 2) {
            setLastStep(currentStep - 1);
        }
        setCurrentStep(currentStep - 1);
    };

    const updateFormId = (id) => {
        setFormId(id);
    };

    const updateAdditionalFields = (fields) => {
        setAdditionalFields(fields);
    };

    const renderStep = () => {
        
        switch (currentStep) {
            case 1:
                return <AccountSetupForm onNext={() => { setHasSignedUp(true); nextStep(); }} onBack={prevStep} username={username} setUsername={setUsername} password={password} setPassword={setPassword} globalPayload={globalPayload} updateGlobalPayloadState={updateGlobalPayloadState} />;
            case 2:
                console.log('Current userId:', userIdState);
                return <BasicInfoForm onNext={nextStep} updateFormId={updateFormId} formId={formId} formName={formName} setFormName={setFormName} customDomain={customDomain} setCustomDomain={setCustomDomain} globalPayload={globalPayload} updateGlobalPayloadState={updateGlobalPayloadState} userId={userIdState} />;
            case 3:
                return <AdditionalDetailsForm onNext={nextStep} onBack={() => { setLastStep(3); setCurrentStep(1); }} formId={formId} additionalFields={additionalFields} updateAdditionalFields={updateAdditionalFields} infoType={infoType} setInfoType={setInfoType} globalPayload={globalPayload} updateGlobalPayloadState={updateGlobalPayloadState} />;
            case 4:
                return <DateSelectionForm onNext={() => { console.log(selectedDates); nextStep(); }} onBack={prevStep} formId={formId} updateSelectedDates={updateSelectedDates} setUsingDates={setUsingDates} usingDates={usingDates} globalPayload={globalPayload} updateGlobalPayloadState={updateGlobalPayloadState} />;
            case 5:
                return <TimeSlotForm onNext={nextStep} onBack={prevStep} setHasTimeSlots={setHasTimeSlots} selectedDates={selectedDates} formId={formId} globalPayload={globalPayload} updateGlobalPayloadState={updateGlobalPayloadState} />;
            case 6:
                return <AddItemsForm onNext={nextStep} onBack={prevStep} selectedDates={selectedDates} timeSlotsForDates={timeSlotsForDates} formId={formId} globalPayload={globalPayload} updateGlobalPayloadState={updateGlobalPayloadState} />;
            case 7:
                return <OptionsForm onNext={nextStep} onBack={prevStep} formId={formId} globalPayload={globalPayload} updateGlobalPayloadState={updateGlobalPayloadState} />;
            default: 
                return <div>Form Completed</div>;

        }
    
    };

    useEffect(() => {
        setUserId(globalPayload.userId); // Update userId from globalPayload when it changes
    }, [globalPayload.userId]);

    return (
        <div>
            {renderStep()}
        </div>
    );  
};

export default FormWizard;