import React, { useState, useRef, useEffect } from 'react';
import styles from './Login.module.css'; // Ensure styles match the necessary updates
import { useDispatch } from 'react-redux'; // Import useDispatch
import { useAuth } from '../../../src/context/AuthContext.jsx'; // Import useAuth
import { useNavigate } from 'react-router-dom'; // Import useNavigate

const Login = ({ onClose, handleLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const modalRef = useRef(null);
  const dispatch = useDispatch(); // Use useDispatch hook
  const { login } = useAuth(); // Get login method from useAuth
  const navigate = useNavigate(); // Initialize useNavigate

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
