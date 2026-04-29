import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './styles/index.css'
import { VoterProvider } from './context/VoterContext'
import ErrorBoundary from './components/common/ErrorBoundary.jsx'
import { GoogleOAuthProvider } from '@react-oauth/google'

const CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID || '';

if (!CLIENT_ID) {
  console.warn('VITE_GOOGLE_CLIENT_ID is not set — Google Sign-In will not work.');
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <GoogleOAuthProvider clientId={CLIENT_ID}>
      <ErrorBoundary>
        <VoterProvider>
          <App />
        </VoterProvider>
      </ErrorBoundary>
    </GoogleOAuthProvider>
  </React.StrictMode>,
)
