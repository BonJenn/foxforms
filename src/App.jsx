import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Analytics } from "@vercel/analytics/react"
import Home from '../client/pages/Home/Home.jsx'
import Onboarding from '../client/pages/Onboarding/Onboarding.jsx'
import Dashboard from '../client/pages/Dashboard/Dashboard.jsx'
import Header from '../client/pages/Home/Header.jsx';
import { useCookies } from 'react-cookie';
import './App.css';



function App() {
  const [ cookies, setCookie, removeCookie ] = useCookies(['user'])

  const authToken = cookies.AuthToken
  const userEmail = cookies.userEmail // Assuming the user's email is stored in a cookie named userEmail

  console.log('authToken in App:', authToken);

  return (
        <BrowserRouter>
      <>
        <Analytics />
        <Header authToken={authToken} userEmail={userEmail} />
        <Routes>
          <Route path="/" element={<Home />} />
          {authToken && <Route path="/dashboard" element={<Dashboard />} />}
          {authToken && <Route path="/onboarding" element={<Onboarding />} />}
        </Routes>
      </>
    </BrowserRouter>
  );
}

export default App;
