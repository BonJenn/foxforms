import React, { useState, useRef, useEffect } from 'react';
import styles from './Login.module.css';
import { useDispatch } from 'react-redux';
import { useAuth } from '../../../src/context/AuthContext.jsx';
import { useNavigate } from 'react-router-dom';

const Login = ({ onClose }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const modalRef = useRef(null);
  const dispatch = useDispatch();
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(''); // Clear any previous errors
    try {
      console.log('Sending login request with:', { username, password }); // Add this line for debugging
      const response = await fetch('https://u6n71jw2d7.execute-api.us-east-1.amazonaws.com/dev/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || `HTTP error! status: ${response.status}`);
      }
      
      localStorage.setItem('authToken', data.authToken);
      localStorage.setItem('userId', data.userId);
      login(data.authToken, data.userId);
      navigate('/dashboard'); // Navigate to dashboard after successful login
    } catch (error) {
      console.error('An error occurred during login:', error);
      setError(error.message || 'An error occurred during login. Please try again.');
    }
  };

  const handleClose = (e) => {
    if (modalRef.current && !modalRef.current.contains(e.target)) {
      onClose();
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClose);
    return () => {
      document.removeEventListener('mousedown', handleClose);
    };
  }, []);

  return (
    <div className={styles.modalBackground}>
      <div className={styles.modalContent} ref={modalRef}>
        <button onClick={onClose} className={styles.closeButton}>X</button>
        <h2>Login</h2>
        {error && <p className={styles.errorMessage}>{error}</p>}
        <form onSubmit={handleLogin}>
          <label>
            <input 
              type="email" 
              placeholder="Email" 
              value={username} 
              onChange={(e) => setUsername(e.target.value)} 
              required 
            />
          </label>
          <label>
            <input 
              type="password" 
              placeholder="Password" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              required 
            />
          </label>
          <button type="submit" className={styles.actionButton}>Login</button>
        </form>
      </div>
    </div>
  );
};

export default Login;