import React, { useState } from 'react';
import SignUpForm1 from './SignUpForm1/SignUpForm1';
import SignUpForm2 from './SignUpForm2/SignUpForm2';
import SignUpForm3 from './SignUpForm3/SignUpForm3';
import SignUpForm4 from './SignUpForm4/SignUpForm4';
import SignUpForm5 from './SignUpForm5/SignUpForm5';
import SignUpForm6 from './SignUpForm6/SignUpForm6';

const FormWizard = () => {
    const [currentStep, setCurrentStep] = useState(1);
    const [formId, setFormId] = useState(null); // Add this line

    const nextStep = () => setCurrentStep(currentStep + 1);
    const prevStep = () => setCurrentStep(currentStep - 1);

    const updateFormId = (id) => {
        setFormId(id);
    };

    const renderStep = () => {
        switch (currentStep) {
            case 1:
                return <SignUpForm1 onNext={nextStep} updateFormId={updateFormId} />;
            case 2:
                return <SignUpForm2 onNext={nextStep} onBack={prevStep} />;
            case 3:
                return <SignUpForm3 onNext={nextStep} onBack={prevStep} formId={formId} />;
            case 4:
                return <SignUpForm4 onNext={nextStep} onBack={prevStep} />;
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