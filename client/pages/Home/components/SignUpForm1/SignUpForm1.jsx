import { useState, useEffect } from 'react';
import styles from './SignUpForm1.module.css';

const SignUpForm1 = ({ updateFormId, onNext, formName, setFormName, customDomain, setCustomDomain, formId }) => { // Modified to accept onBack, onNext props
    // Removed the useState for formData

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
                throw new Error('Network response was not ok');
            }
            const data = await response.json();
            console.log('Form data saved', data);
            if (!formId) updateFormId(data._id); // Only update formId if it's a new form
            onNext(); // Modified to use onNext instead of setShowForm2(true)
        } catch (error) {
            console.error('Error submitting form', error);
        }
    };

    return ( 
        <>
            {/* Form Name and Custom Domain */}
            <div className={styles.signUpForm1}>
                <h1>What is the name of your Sign Up Form?</h1>
                <form onSubmit={(e) => handleSubmit(e)}>
                    <input type="text" id="formName" name="formName" required onChange={handleChange} value={formName} placeholder="Name of your Form" />
                    <div className={styles.customDomain}>
                        <h1>FoxForms.io/</h1>
                        <input type="text" id="customDomain" name="customDomain" required onChange={handleChange} value={customDomain} placeholder="Food-Truck-Fridays" />
                    </div>
                    <button type="submit">Next</button>
                </form>
            </div>
        </>
    );
}

export default SignUpForm1;

