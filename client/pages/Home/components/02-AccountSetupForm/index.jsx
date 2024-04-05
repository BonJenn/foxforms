import { useState } from 'react';
import styles from './AccountSetupForm.module.css';

{/* User Sign Up */}
const AccountSetupForm = ({ onBack, onNext, email, setEmail, password, setPassword, updateGlobalPayloadState }) => {
    const [formData, setFormData] = useState({
        confirmPassword: '',
    });
    const [passwordError, setPasswordError] = useState('');

    const handleChange = (e) => {
        const { name, value } = e.target;
        if (name === 'email') setEmail(value);
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
            const response = await fetch('http://localhost:5174/signup', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password }),
            });

            if (!response.ok) {
                throw new Error('Failed to sign up');
            }

            const data = await response.json();
            console.log('User signed up successfully:', data);
            // Update the global payload with email
            updateGlobalPayloadState({
                email: email, // Directly using the email state
            });
            onNext(); // Proceed to the next form or action
        } catch (error) {
            console.error('Signup error:', error);
            setPasswordError('Failed to sign up. Please try again.');
        }
    };

    return (
        <div className={styles.signUpForm2}>
            <h1>Sign Up</h1>
            <form onSubmit={handleSubmit}>
                <input type="email" id="email" name="email" value={email} required onChange={handleChange} placeholder="Email" />
                <input type="password" id="password" name="password" value={password} required onChange={handleChange} placeholder="Password" />
                <input type="password" id="confirmPassword" name="confirmPassword" required onChange={handleChange} placeholder="Confirm Password" />
                {passwordError && <div className={styles.passwordError}>{passwordError}</div>}
                <button type="submit">Sign Up</button>
                <button type="button" onClick={onBack}>Back</button>
            </form>
        </div>
    );
};

export default AccountSetupForm;

