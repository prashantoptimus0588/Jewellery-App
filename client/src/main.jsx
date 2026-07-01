// src/main.jsx
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import useAuthStore from './store/useAuthStore.js'

// Rehydrate user from saved JWT before first render
useAuthStore.getState().rehydrate();

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)