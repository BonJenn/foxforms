import React, { useState } from 'react';
import SignUpForm1 from './SignUpForm1/SignUpForm1';
import SignUpForm2 from './SignUpForm2/SignUpForm2';
import SignUpForm3 from './SignUpForm3/SignUpForm3';
import SignUpForm4 from './SignUpForm4/SignUpForm4';
import SignUpForm5 from './SignUpForm5/SignUpForm5';
import SignUpForm6 from './SignUpForm6/SignUpForm6';

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

    const nextStep = () => {
        if (currentStep === 1 && lastStep) {
            setCurrentStep(lastStep);
            setLastStep(null); // Reset lastStep after navigating
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
                return <SignUpForm1 onNext={nextStep} updateFormId={updateFormId} formId={formId} formName={formName} setFormName={setFormName} customDomain={customDomain} setCustomDomain={setCustomDomain} />;
            case 2:
                if (hasSignedUp) {
                    return <SignUpForm3 onNext={nextStep} onBack={() => setCurrentStep(1)} formId={formId} additionalFields={additionalFields} updateAdditionalFields={updateAdditionalFields} infoType={infoType} setInfoType={setInfoType} />;
                } else {
                    return <SignUpForm2 onNext={() => { setHasSignedUp(true); nextStep(); }} onBack={prevStep} email={email} setEmail={setEmail} password={password} setPassword={setPassword} />;
                }
            case 3:
                return <SignUpForm3 onNext={nextStep} onBack={() => { setLastStep(3); setCurrentStep(1); }} formId={formId} additionalFields={additionalFields} updateAdditionalFields={updateAdditionalFields} infoType={infoType} setInfoType={setInfoType} />;
            case 4:
                return <SignUpForm4 onNext={nextStep} onBack={prevStep} formId={formId} updateAdditionalFields={updateAdditionalFields} />;
            case 5:
                return <SignUpForm5 onNext={nextStep} onBack={prevStep} />;
            case 6:
                return <SignUpForm6 onNext={nextStep} onBack={prevStep} />;
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