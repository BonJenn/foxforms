import React from 'react'
import ReactDOM from 'react-dom/client'
import { Provider } from 'react-redux'; // Import Provider
import store from './store'; // Import the store you created
import { AuthProvider } from './context/AuthContext.jsx'; // Adjust the import path as necessary
import App from './App.jsx'
import './index.css'
import { BrowserRouter } from 'react-router-dom'; // Import BrowserRouter

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Provider store={store}> {/* Wrap App component with Provider and pass the store */}
      <BrowserRouter> {/* Ensure BrowserRouter wraps App */}
        <AuthProvider> {/* Wrap App component with AuthProvider */}
          <App />
        </AuthProvider>
      </BrowserRouter>
    </Provider>
  </React.StrictMode>,
)
