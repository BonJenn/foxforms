import React from 'react';
import { useNavigate } from 'react-router-dom';
import SignUpFormWizard from './SignUpFormWizard';
import BasicFormWizard from './BasicFormWizard';
import AIFormWizard from './AIFormWizard';

const FormWizard = ({ type, authToken, skipAccountSetup }) => {
    const navigate = useNavigate();

    const renderWizard = () => {
        switch (type) {
            case 'signup':
                return <SignUpFormWizard authToken={authToken} skipAccountSetup={skipAccountSetup} />;
            case 'basic':
                return <BasicFormWizard authToken={authToken} />;
            case 'ai':
                return <AIFormWizard authToken={authToken} />;
            default:
                navigate(`/dashboard/${authToken}`);
                return null;
        }
    };

    return (
        <div>
            {renderWizard()}
        </div>
    );
};

export default FormWizard;