import { BrowserRouter, Routes, Route, useNavigate } from 'react-router-dom';
import { Analytics } from "@vercel/analytics/react";
import Home from '../client/pages/Home/Home.jsx';
import Onboarding from '../client/pages/Onboarding/Onboarding.jsx';
import Dashboard from '../client/pages/Dashboard/Dashboard.jsx';
import Header from '../client/pages/Home/Header.jsx';
import { useCookies } from 'react-cookie';
import React, { useState, useEffect } from 'react';
import './App.css';
import FormWizard from '../client/pages/Home/components/FormWizard'; // Adjust the path as necessary

function App() {
  const [cookies, setCookie, removeCookie] = useCookies(['AuthToken']);
  const [logoutMessage, setLogoutMessage] = useState('');
  const [cookieAuthToken, setCookieAuthToken] = useState(null);
  const navigate = useNavigate(); // Added useNavigate here

  React.useEffect(() => { // Added useEffect to check authToken and navigate
    console.log('Cookies object:', cookies); // Log the entire cookies object for debugging
    if (cookies.AuthToken) {
      console.log('Navigating to dashboard...');
      navigate(`/dashboard/${cookies.AuthToken}`); // Navigate to a user-specific dashboard
    } else {
      console.log('AuthToken not available:', cookies.AuthToken); // Log when AuthToken is not available
    }
  }, [cookies.AuthToken, navigate]); // Dependencies that trigger the effect

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (token) {
      setCookieAuthToken(token);
      navigate(`/dashboard/${token}`);
    }
  }, []);

  useEffect(() => {
    if (cookieAuthToken) {
      console.log('Navigating to dashboard...');
      navigate(`/dashboard/${cookieAuthToken}`);
    }
  }, [cookieAuthToken, navigate]);

  useEffect(() => {
    if (cookieAuthToken) {
      setLogoutMessage(''); // Clear logout message when authToken is present
    }
  }, [cookieAuthToken]);

  const handleLogout = () => {
    console.log('Removing token from localStorage');
    localStorage.removeItem('authToken');
    setCookieAuthToken(null);
    setLogoutMessage('Logged out successfully.');
    console.log('Navigating to home...');
    navigate('/');
    removeCookie('AuthToken');
    // Add any additional logout logic here
  };

  const handleLogin = async (username, password) => {
    setLogoutMessage(''); // Clear the logout message at the start of the login process
    console.log('Attempting login with:', username, password); // Added for debugging
    try {
      const response = await fetch('http://localhost:5174/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });
      const data = await response.json();
      console.log('Response status:', response.status, 'Data:', data); // Add this line for debugging
      if (response.ok) {
        localStorage.setItem('authToken', data.authToken);
        setCookieAuthToken(data.authToken, () => {
          navigate(`/dashboard/${data.authToken}`);
        });
        console.log('Youre in!');
      } else {
        console.error('Login failed:', data.message); // Improved error handling
      }
    } catch (error) {
      console.error('An error occurred during login:', error); // Improved error handling
    }
  };

  const userEmail = cookies.userEmail; // Assuming the user's email is stored in a cookie named userEmail

  console.log('authToken in App:', cookieAuthToken); // Log authToken for debugging
  return (
      <>
        <Analytics />
        <Header authToken={cookieAuthToken} userEmail={userEmail} onLogout={handleLogout} onLogin={handleLogin} />
        {logoutMessage && <div>{logoutMessage}</div>}
        <Routes>
          <Route path="/" element={<Home />} />
          {cookieAuthToken && <Route path={`/dashboard/${cookieAuthToken}`} element={<Dashboard />} />}
          {cookieAuthToken && <Route path="/onboarding" element={<Onboarding />} />}
          <Route path="/form-wizard/:authToken" element={<FormWizard />} />
        </Routes>
      </>
  );
}

export default App;
