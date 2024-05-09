import React, { useState, useRef, useEffect } from 'react';
import styles from './SignUp.module.css'; // Import your styles
import { useDispatch } from 'react-redux'; // Import useDispatch
import { useAuth } from '../../../src/context/AuthContext.jsx'; // Adjust the import path as necessary
import { useNavigate } from 'react-router-dom'; // Import useNavigate

const SignUp = ({ onClose }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const modalRef = useRef(null);
  const dispatch = useDispatch(); // Initialize useDispatch
  const { login } = useAuth(); // Get login method from useAuth
  const navigate = useNavigate(); // Initialize useNavigate

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
      const response = await fetch('http://localhost:3000/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      if (response.status === 409) {
        setError('Username or email already exists. Please try another.');
        return;
      }

      if (!response.ok) {
        if (response.status === 409) {
          setError('User already exists. Please login.');
        } else {
          throw new Error('Failed to sign up');
        }
      }

      const data = await response.json();
      console.log('Response data:', data); // Log the entire response object
      if (data.authToken) {
        localStorage.setItem('authToken', data.authToken); // Store authToken in local storage
        login(); // Update authentication state
        navigate(`/dashboard/${data.authToken}`); // Navigate to the dashboard
        onClose(); // Close the signup modal or form
      } else {
        console.error('SignUp successful, but the authToken is missing in the response');
      }
    } catch (error) {
      console.error('Error during sign-up:', error);
      setError(error.message || 'An unexpected error occurred during sign-up.');
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
