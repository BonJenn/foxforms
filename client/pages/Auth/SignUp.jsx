import React, { useState, useRef, useEffect } from 'react';
import styles from './SignUp.module.css'; // Import your styles
import { useDispatch } from 'react-redux'; // Import useDispatch

const SignUp = ({ onClose }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const modalRef = useRef(null);
  const dispatch = useDispatch(); // Initialize useDispatch

  const handleClose = (e) => {
    if (modalRef.current && !modalRef.current.contains(e.target)) {
      onClose();
    }
  };

  useEffect(() => {
    document.addEventListener('click', handleClose);
    return () => document.removeEventListener('click', handleClose);
  }, []);

  const handleSignUp = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:5174/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      if (!response.ok) {
        if (response.status === 409) {
          setError('User already exists. Please login.');
        } else {
          throw new Error('Failed to sign up');
        }
      }

      const data = await response.json();
      console.log('Signed up successfully:', data);
      localStorage.setItem('authToken', data.token); // Assuming the token is returned from your API
      localStorage.setItem('username', data.username); // Store username in localStorage
      dispatch({ type: 'SET_LOGIN_STATUS', payload: true }); // Update login status
      onClose(); // Call onClose() after successful sign-up
    } catch (error) {
      console.error('Error during sign-up:', error);
    }
  };

  return (
    <div className={styles.modalBackground}>
      <div className={styles.modalContent} ref={modalRef}>
        <button onClick={onClose} className={styles.closeButton}>X</button>
        <h2>Sign Up</h2>
        {error && <p>{error}</p>}
        <form onSubmit={handleSignUp}>
          <label>
            <input type="text" placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} required />
          </label>
          <label>
            <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
          </label>
          <label>
            <input type="password" placeholder="Confirm Password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required />
          </label>
          <button type="submit" className={styles.signUpButton}>Sign Up</button>
        </form>
      </div>
    </div>
  );
};

export default SignUp;
