import React, { useState, useRef, useEffect } from 'react';
import styles from './Login.module.css'; // Ensure styles match the necessary updates

const Login = ({ onClose }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const modalRef = useRef(null);

  const handleClose = (e) => {
    console.log('Document clicked');
    if (modalRef.current && !modalRef.current.contains(e.target)) {
      console.log('Click outside modal detected');
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
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });
      const data = await response.json();
      if (data.success) {
        onClose();
      } else {
        setError(data.message);
      }
    } catch (error) {
      setError('An error occurred. Please try again later.');
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
            <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
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
