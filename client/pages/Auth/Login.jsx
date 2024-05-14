import React, { useState, useRef, useEffect } from 'react';
import styles from './Login.module.css'; // Ensure styles match the necessary updates
import { useDispatch } from 'react-redux'; // Import useDispatch
import { useAuth } from '../../../src/context/AuthContext.jsx'; // Import useAuth
import { useNavigate } from 'react-router-dom'; // Import useNavigate

const Login = ({ onClose }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const modalRef = useRef(null);
  const dispatch = useDispatch(); // Use useDispatch hook
  const { login } = useAuth(); // Get login method from useAuth
  const navigate = useNavigate(); // Initialize useNavigate

  const handleLogin = async (username, password) => {
    try {
      const response = await fetch('http://localhost:3000/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      localStorage.setItem('authToken', data.authToken);
      localStorage.setItem('userId', data.userId);
      login(data.authToken, data.userId, navigate); // Navigate immediately after setting the auth state
    } catch (error) {
      console.error('An error occurred during login:', error);
    }
  };

  const handleClose = (e) => {
    console.log('Click detected at:', e.target);
    if (modalRef.current && !modalRef.current.contains(e.target)) {
      console.log('Outside click detected');
      onClose();
    } else {
      console.log('Click inside modal or modalRef not set');
    }
  };

  useEffect(() => {
    console.log('Adding click event listener');
    document.addEventListener('click', handleClose);
    return () => {
      console.log('Removing click event listener');
      document.removeEventListener('click', handleClose);
    };
  }, []); // Also added dependency array to ensure the effect runs only once after the initial render

  return (
    <div className={styles.modalBackground}>
      <div className={styles.modalContent} ref={modalRef}>
        <button onClick={onClose} className={styles.closeButton}>X</button>
        <h2>Login</h2>
        {error && <p>{error}</p>}
        <form onSubmit={(e) => { e.preventDefault(); handleLogin(username, password); }}>
          <label>
            <input type="text" placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} required />
          </label>
          <label>
            <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
          </label>
          <button type="submit" className={styles.actionButton}>Login</button>
        </form>
      </div>
    </div>
  );
};

export default Login;
