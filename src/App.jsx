import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Home from '../client/pages/Home/Home.jsx'
import Onboarding from '../client/pages/Onboarding/Onboarding.jsx'
import Dashboard from '../client/pages/Dashboard/Dashboard.jsx'
import { useCookies } from 'react-cookie';
import './App.css';



function App() {
  const [ cookies, setCookie, removeCookie ] = useCookies(['user'])

  const authToken = cookies.AuthToken

  return (
        <BrowserRouter>
      <>
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
