import React from 'react'
import ReactDOM from 'react-dom/client'
import { Provider } from 'react-redux'; // Import Provider
import store from './store'; // Import the store you created
import { AuthProvider } from './context/AuthContext.jsx'; // Adjust the import path as necessary
import App from './App.jsx'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Provider store={store}> {/* Wrap App component with Provider and pass the store */}
      <AuthProvider> {/* Wrap App component with AuthProvider */}
        <App />
      </AuthProvider>
    </Provider>
  </React.StrictMode>,
)
