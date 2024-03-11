import { useState, useEffect } from 'react';
import styles from './SignUpForm1.module.css';

const SignUpForm1 = ({ updateFormId, onNext }) => { // Modified to accept onBack, onNext props
    const [formData, setFormData] = useState({
        formName: '',
        customDomain: '',
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
        
            const response = await fetch('http://localhost:5174/forms', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    title: formData.formName,
                    customDomain: formData.customDomain,
                }),
            });
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const data = await response.json();
            console.log('Form data saved', data);
            updateFormId(data._id);
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
                    <input type="text" id="formName" name="formName" required onChange={handleChange} placeholder="Name of your Form" />
                    <div className={styles.customDomain}>
                        <h1>FoxForms.io/</h1>
                        <input type="text" id="customDomain" name="customDomain" required onChange={handleChange} placeholder="Food-Truck-Fridays" />
                    </div>
                    <button type="submit">Next</button>
                </form>
            </div>
        </>
    );
}

export default SignUpForm1;

