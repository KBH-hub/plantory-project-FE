import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import Plantory from './Plantory'
import './index.css'
<<<<<<< HEAD
import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
=======
import './css/layout.css'
import './css/header.css'
import './css/modal.css'
import './css/alert.css'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <Plantory />
    </BrowserRouter>
  </StrictMode>
>>>>>>> 5746b746d172a65e0ee83d20985b2658b7c0a98a
)
