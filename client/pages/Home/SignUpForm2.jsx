import { useState } from 'react';
import styles from './SignUpForm2.module.css';

const SignUpForm2 = () => {
    const [formData, setFormData] = useState({
        email: '',
        password: '',
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch('http://localhost:5174/signup', { // Adjust the URL as needed
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
                throw new Error('Network response was not ok');
            }
            const data = await response.json();
            console.log('Signup successful', data);
            // Handle successful signup (e.g., redirect to login or dashboard)
        } catch (error) {
            console.error('Error submitting form', error);
        }
    };

    return ( 
        <div className={styles.signUpForm2}>
            <h1>Create a super fast sign up form now!</h1>
            <form onSubmit={handleSubmit}>
            
                <input type="email" id="email" name="email" required onChange={handleChange} placeholder="Email" />

                <input type="password" id="password" name="password" required onChange={handleChange} placeholder="password" />

                <button type="submit">Sign Up</button>
            </form>
        </div>
    );
}

export default SignUpForm2;