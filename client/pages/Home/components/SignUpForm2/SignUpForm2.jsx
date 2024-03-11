import { useState } from 'react';
import styles from './SignUpForm2.module.css';

{/* User Sign Up */}
const SignUpForm2 = ({ onBack, onNext }) => {
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        confirmPassword: '',
    });
    const [passwordError, setPasswordError] = useState('');

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (formData.password !== formData.confirmPassword) {
            setPasswordError('Passwords do not match');
            return;
        }

        try {
            const response = await fetch('http://localhost:5174/signup', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email: formData.email,
                    password: formData.password,
                }),
            });

            if (!response.ok) {
                throw new Error('Failed to sign up');
            }

            const data = await response.json();
            console.log('User signed up successfully', data);
            onNext();
        } catch (error) {
            console.error('Error signing up user:', error);
        }
    };

    return (
        <div className={styles.signUpForm2}>
            <h1>Sign Up</h1>
            <form onSubmit={handleSubmit}>
                <input type="email" id="email" name="email" required onChange={handleChange} placeholder="Email" />
                <input type="password" id="password" name="password" required onChange={handleChange} placeholder="Password" />
                <input type="password" id="confirmPassword" name="confirmPassword" required onChange={handleChange} placeholder="Confirm Password" />
                {passwordError && <div className={styles.passwordError}>{passwordError}</div>}
                <button type="submit">Sign Up</button>
                <button type="button" onClick={onBack}>Back</button>
            </form>
        </div>
    );
};

export default SignUpForm2;
