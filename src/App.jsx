import { BrowserRouter, Routes, Route, useNavigate } from 'react-router-dom'
import { Analytics } from "@vercel/analytics/react"
import Home from '../client/pages/Home/Home.jsx'
import Onboarding from '../client/pages/Onboarding/Onboarding.jsx'
import Dashboard from '../client/pages/Dashboard/Dashboard.jsx'
import Header from '../client/pages/Home/Header.jsx';
import { useCookies } from 'react-cookie';
import React, { useState } from 'react';
import './App.css';
import FormWizard from '../client/pages/Home/components/FormWizard'; // Adjust the path as necessary

function App() {
  const [ cookies, setCookie, removeCookie ] = useCookies(['AuthToken'])
  const [logoutMessage, setLogoutMessage] = useState('');
  const navigate = useNavigate(); // Added useNavigate here

  React.useEffect(() => { // Added useEffect to check authToken and navigate
    console.log('Cookies AuthToken:', cookies.AuthToken); // Check if `cookies.AuthToken` is defined
    if (cookies.AuthToken) {
      console.log('Navigating to dashboard...'); // Confirm this line is reached
      navigate(`/dashboard/${cookies.AuthToken}`); // Navigate to a user-specific dashboard
    }
  }, [cookies.AuthToken, navigate]);

  const handleLogout = () => {
    removeCookie('AuthToken');
   
    // Add any additional logout logic here
  };

  const authToken = cookies.AuthToken
  const userEmail = cookies.userEmail // Assuming the user's email is stored in a cookie named userEmail

  console.log('authToken in App:', authToken);
  return (
      <>
        <Analytics />
        <Header authToken={authToken} userEmail={userEmail} onLogout={handleLogout} />
        {logoutMessage && <div>{logoutMessage}</div>}
        <Routes>
          <Route path="/" element={<Home />} />
          {authToken && <Route path="/dashboard/:authToken" element={<Dashboard />} />}
          {authToken && <Route path="/onboarding" element={<Onboarding />} />}
          <Route path="/form-wizard" element={<FormWizard />} />
        </Routes>
      </>
  );
}

export default App;
