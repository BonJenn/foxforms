import React from 'react';
import styles from './TimeSlotForm.module.css';

{/* Available Time Slots */}
const SignUpForm5 = ({ onBack, onNext, setHasTimeSlots }) => {
    return (
        <div className={styles.signUpForm5}>
          <form>
                    <h1>Will your form use time slots?</h1>
                    <button onClick={() => { setHasTimeSlots(true); onNext(); }}>Yes</button>
                    <button onClick={() => { setHasTimeSlots(false); onNext(); }}>No</button>
                </form>
        </div>
    );
};

export default SignUpForm5;

