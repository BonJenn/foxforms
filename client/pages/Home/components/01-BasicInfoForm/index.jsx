import { useState, useEffect } from 'react';
import styles from './BasicInfoForm.module.css';

const BasicInfoForm = ({ updateFormId, onNext, formName, setFormName, customDomain, setCustomDomain, formId }) => { // Modified to accept onBack, onNext props
    // Removed the useState for formData
    const [errorMessage, setErrorMessage] = useState('');

    const handleChange = (e) => {
        if (e.target.name === 'formName') setFormName(e.target.value);
        else if (e.target.name === 'customDomain') setCustomDomain(e.target.value);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const url = formId ? `http://localhost:5174/forms/${formId}` : 'http://localhost:5174/forms';
        const method = formId ? 'PUT' : 'POST';

        try {
        
            const response = await fetch(url, {
                method: method,
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    title: formName,
                    customDomain: customDomain,
                }),
            });
            if (!response.ok) {
                if (response.status === 409) {
                    throw new Error('Custom domain is already taken. Please choose another one.');
                } else {
                    throw new Error('Network response was not ok');
                }
            }
            const data = await response.json();
            console.log('Form data saved', data);
            if (!formId) updateFormId(data._id); // Only update formId if it's a new form
            onNext(); // Proceed to the next step
        } catch (error) {
            console.error('Error submitting form', error);
            setErrorMessage(error.message); // Update the state with the error message
        }
    };

    return ( 
        <>
            <div className={styles.signUpForm1}>
                <h1>What is the name of your Sign Up Form?</h1>
                <form onSubmit={(e) => handleSubmit(e)}>
                    <input type="text" id="formName" name="formName" required onChange={handleChange} value={formName} placeholder="Name of your Form" />
                    <div className={styles.customDomain}>
                        <div className={styles.domainRow}> {/* New wrapper div for horizontal layout */}
                            <input type="text" id="customDomain" name="customDomain" required onChange={handleChange} value={customDomain} placeholder="Food-Truck-Fridays" />
                            <h1>.FoxForms.io</h1>
                        </div>
                        {errorMessage && errorMessage.includes('Custom domain') && <div className={styles.error}>{errorMessage}</div>}
                    </div>
                    <button type="submit">Next</button>
                </form>
            </div>
        </>
    );
}

export default BasicInfoForm;

