import React from 'react';
import styles from './SignUpForm6.module.css';

{/* Available Time Slots */}
const SignUpForm6 = ({ onBack }) => {
    return (
        <div className={styles.signUpForm6}>
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
                                    <td>{slot.maxParticipants}</td>
                                    <td>{slot.startTime}</td>
                                    <td>{slot.endTime}</td>
                                    <td>{slot.isBooked ? 'Booked' : 'Available'}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </form>
        </div>
    );
};

export default SignUpForm6;
