import React, { useState, useRef, useEffect } from 'react';
import styles from './SignUp.module.css';
import { useDispatch } from 'react-redux';
import { useAuth } from '../../../src/context/AuthContext.jsx';
import { useNavigate } from 'react-router-dom';

const SignUp = ({ setShowComponent }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const modalRef = useRef(null);
  const dispatch = useDispatch();
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleClose = (e) => {
    if (modalRef.current && !modalRef.current.contains(e.target)) {
      setShowComponent('');
    }
  };

  useEffect(() => {
    document.addEventListener('click', handleClose);
    return () => document.removeEventListener('click', handleClose);
  }, []);

  const handleSignUp = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    try {
      const response = await fetch('https://u6n71jw2d7.execute-api.us-east-1.amazonaws.com/dev/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      const data = response.ok ? await response.json() : { message: await response.text() };
      if (response.ok) {
        localStorage.setItem('authToken', data.authToken);
        localStorage.setItem('userId', data.userId);
        login(data.authToken, data.userId, navigate);
        setShowComponent('');
      } else {
        throw new Error(data.message || 'Failed to sign up');
      }
    } catch (error) {
      console.error('Error during sign-up:', error);
      setError(error.message || 'An unexpected error occurred during sign-up.');
    }
  };

  return (
    <div className={styles.modalBackground}>
      <div className={styles.modalContent} ref={modalRef}>
        <button onClick={() => setShowComponent('')} className={styles.closeButton}>X</button>
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
