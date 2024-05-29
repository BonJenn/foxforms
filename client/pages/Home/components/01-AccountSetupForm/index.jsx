import { useState } from 'react';
import styles from './AccountSetupForm.module.css';

{/* User Sign Up */}
const AccountSetupForm = ({ onBack, onNext, username, setUsername, password, setPassword, updateGlobalPayloadState }) => {
    const [formData, setFormData] = useState({
        confirmPassword: '',
    });
    const [passwordError, setPasswordError] = useState('');

    const handleChange = (e) => {
        const { name, value } = e.target;
        if (name === 'username') setUsername(value);
        else if (name === 'password') setPassword(value); // Add this line to update password
        else setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (password !== formData.confirmPassword) {
            setPasswordError('Passwords do not match');
            return;
        }
        try {
            const response = await fetch('http://localhost:3000/signup', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username, password }),
            });

            const data = response.ok ? await response.json() : { message: await response.text() };
            if (response.ok) {
                console.log('User signed up successfully:', data);
                localStorage.setItem('authToken', data.authToken); // Store authToken in local storage
                updateGlobalPayloadState({
                    username: username,
                    userId: data.userId
                });
                onNext(); // Proceed to the next form or action
            } else {
                throw new Error(data.message || 'Failed to sign up');
            }
        } catch (error) {
            console.error('Signup error:', error);
            setPasswordError(error.message || 'An unexpected error occurred during sign-up.');
        }
    };

    return (
        <>
            <div className={styles.AccountSetupForm}>
                <div className={styles.AccountSetupFormSect1}>
                    <div className={styles.AccountSetupFormHero}>
                        <h1><span className={styles.gradientText}>Effortless</span> form building.</h1>
                        <h1><span className={styles.gradientText}>Seamless</span> data collection.</h1>
                        <h3> Gather customer insights with precision and ease.</h3>
                    </div>

                   
                </div>

                <div className={styles.accountSetupFormSect2}>
                    <div className={styles.formExamples}>
                        <div className={styles.formExample}>
                            <h1>Forms Galore!</h1>
                            <h2>Contact Forms</h2>
                            <h2>Survey Forms</h2>
                            <h2>Order Forms</h2>
                            <h2>Feedback Forms</h2>
                            <h2>And more!</h2>
                            
                        </div>
                    </div>
                </div>
            </div> 
        </>
    );
};

export default AccountSetupForm;

