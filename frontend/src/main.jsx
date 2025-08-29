import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
// import AppRoutes from './routes.jsx'
// import SignupForm from './pages/Login.jsx'
// import LoginForm from './pages/Login.jsx'
// import CreateEventForm from './pages/CreateEvent.jsx'


createRoot(document.getElementById('root')).render(
  <StrictMode>
      <App />
  </StrictMode>,
)
