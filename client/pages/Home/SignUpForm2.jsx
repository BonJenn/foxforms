import { useState, useEffect } from 'react';
import styles from './SignUpForm2.module.css';

const SignUpForm2 = () => {
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        confirmPassword: '', // Add confirm password to the state
    });
    const [passwordError, setPasswordError] = useState(''); // Add state to track password error
    const [timeSlots, setTimeSlots] = useState([]);

    useEffect(() => {
        const fetchTimeSlots = async () => {
            const response = await fetch('http://localhost:5174/time-slots'); // Adjust the URL as needed
            const data = await response.json();
            setTimeSlots(data);
        };

        fetchTimeSlots();
    }, []);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        if (passwordError && (e.target.name === 'password' || e.target.name === 'confirmPassword')) {
            setPasswordError(''); // Clear password error when user starts correcting
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        // Add a check to ensure password and confirmPassword match
        if (formData.password !== formData.confirmPassword) {
            console.error('Passwords do not match');
            setPasswordError('Passwords do not match'); // Set password error
            return; // Prevent form submission if passwords don't match
        }
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

                <input type="password" id="password" name="password" required onChange={handleChange} placeholder="Password" />

                <input type="password" id="confirmPassword" name="confirmPassword" required onChange={handleChange} placeholder="Confirm Password" /> {/* Add confirm password input */}

                {passwordError && <div className={styles.passwordError}>{passwordError}</div>} {/* Display password error */}

                <button type="submit">Sign Up</button>
            </form>

            <form>
                <h1>For each person who signs up, I want to capture -  </h1>

                <button>Just name and email</button>
                <button>Name, email, and some additional fields</button>

            </form>

            <form>
                <h1>My form is for</h1>

                <button>No particular dates</button>
                <button>One or more specific dates</button>

            </form>

            <form>

                <h1>Does your sheet have time slots?</h1>

                <div className={styles.toggleContainer}>
                    <label htmlFor="hasTimeSlots">Does your sheet have time slots?</label>
                    <div className={styles.toggleButtons}>
                        <button type="button" id="hasTimeSlotsYes">Yes</button>
                        <button type="button" id="hasTimeSlotsNo">No</button>
                    </div>
                </div>
            </form>


            <form>

            <h1>Available Time Slots</h1>
            <table className={styles.timeSlotsTable}>
                <thead>
                    <tr>
                        <th>Date</th>
                        <th>Start Time</th>
                        <th>End Time</th>
                        <th>Availability</th>
                    </tr>
                </thead>
                <tbody>
                    {timeSlots.map((slot) => (
                        <tr key={slot._id}>
                            <td>{slot.date}</td>
                            <td>{slot.startTime}</td>
                            <td>{slot.endTime}</td>
                            <td>{slot.isBooked}</td>
                        
                        </tr>
                    ))}
                </tbody>
            </table>
            </form>
        </div>
    );
}

export default SignUpForm2;