import React, { useState } from 'react';
import BasicInfoForm from '../01-BasicInfoForm';
import AccountSetupForm from '../02-AccountSetupForm';
import AdditionalDetailsForm from '../03-AdditionalDetailsForm';
import DateSelectionForm from '../04-DateSelectionForm';
import TimeSlotForm from '../05-TimeSlotForm';
import SignUpForm6 from '../SignUpForm6/SignUpForm6';
import AddItemsForm from '../06-AddItemsForm'; // Assuming SignUpForm7 is created

const FormWizard = () => {
    const [currentStep, setCurrentStep] = useState(1);
    const [formId, setFormId] = useState(null); 
    const [additionalFields, setAdditionalFields] = useState([]);
    const [infoType, setInfoType] = useState('');
    const [email, setEmail] = useState(''); 
    const [password, setPassword] = useState(''); 
    const [formName, setFormName] = useState(''); // Add this line
    const [customDomain, setCustomDomain] = useState(''); // Add this line
    const [lastStep, setLastStep] = useState(null); // Add this line
    const [hasSignedUp, setHasSignedUp] = useState(false); // Add this line
    const [hasTimeSlots, setHasTimeSlots] = useState(false); // Add this line
    const [timeSlots, setTimeSlots] = useState([
        { _id: '1', date: '2023-04-10', startTime: '10:00', endTime: '11:00', isBooked: false },
        { _id: '2', date: '2023-04-11', startTime: '11:00', endTime: '12:00', isBooked: true },
        // Add more sample time slots as needed
    ]); // Modified this line
    const [selectedDates, setSelectedDates] = useState([]); // Add this line
    const [usingDates, setUsingDates] = useState(true); // Add this line to track if dates are being used

    const updateSelectedDates = (dates) => {
        setSelectedDates(dates);
    };

    const nextStep = () => {
        if (currentStep === 4 && !usingDates) {
            setCurrentStep(7); // Directly move to AddItemsForm if coming from DateSelectionForm and dates are not being used
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
                return <BasicInfoForm onNext={nextStep} updateFormId={updateFormId} formId={formId} formName={formName} setFormName={setFormName} customDomain={customDomain} setCustomDomain={setCustomDomain} />;
            case 2:
                if (hasSignedUp) {
                    return <AdditionalDetailsForm onNext={nextStep} onBack={() => setCurrentStep(1)} formId={formId} additionalFields={additionalFields} updateAdditionalFields={updateAdditionalFields} infoType={infoType} setInfoType={setInfoType} />;
                } else {
                    return <AccountSetupForm onNext={() => { setHasSignedUp(true); nextStep(); }} onBack={prevStep} email={email} setEmail={setEmail} password={password} setPassword={setPassword} />;
                }
            case 3:
                return <AdditionalDetailsForm onNext={nextStep} onBack={() => { setLastStep(3); setCurrentStep(1); }} formId={formId} additionalFields={additionalFields} updateAdditionalFields={updateAdditionalFields} infoType={infoType} setInfoType={setInfoType} />;
            case 4:
                return <DateSelectionForm onNext={() => { console.log(selectedDates); nextStep(); }} onBack={prevStep} formId={formId} updateSelectedDates={updateSelectedDates} setUsingDates={setUsingDates} />;
            case 5:
                return <TimeSlotForm onNext={nextStep} onBack={prevStep} setHasTimeSlots={setHasTimeSlots} selectedDates={selectedDates} formId={formId} />;
            case 6:
                if (hasTimeSlots) {
                    const uniqueDates = [...new Set(timeSlots.map(slot => slot.date))];
                    return <TimeSlotForm onNext={nextStep} onBack={prevStep} dates={uniqueDates} />;
                } else {
                    return <AddItemsForm onNext={nextStep} onBack={prevStep} />;
                }
            default: 
                return <div>Form Completed</div>;

        }
    
    };


    return (
        <div>
            {renderStep()}
        </div>
    );  
};

export default FormWizard;