import React, { useState, useRef, useEffect } from 'react';
import styles from './Login.module.css'; // Ensure styles match the necessary updates
import { useDispatch } from 'react-redux'; // Import useDispatch

const Login = ({ onClose }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const modalRef = useRef(null);
  const dispatch = useDispatch(); // Use useDispatch hook

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
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    try {
      const response = await fetch('http://localhost:5174/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();
      if (response.ok) {
        console.log('Login was successful', data);
        if (data.username) {
          localStorage.setItem('username', data.username);
          localStorage.setItem('token', data.token); // Assuming data.token is your token
          dispatch({ type: 'SET_LOGIN_STATUS', payload: true }); // Dispatch login status action
          onClose();
        } else {
          console.error('Login successful, but the username is missing in the response');
          setError('Login successful, but the username is missing in the response');
        }
      } else {
        console.error('Login failed', data.message);
        setError(data.message || 'Unknown error occurred');
      }
    } catch (error) {
      console.error('An error occurred during login', error);
      setError('An error occurred during login');
    }
  };
  
  
  return (
    <div className={styles.modalBackground}>
      <div className={styles.modalContent} ref={modalRef}>
        <button onClick={onClose} className={styles.closeButton}>X</button>
        <h2>Login</h2>
        {error && <p>{error}</p>}
        <form onSubmit={handleLogin}>
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
