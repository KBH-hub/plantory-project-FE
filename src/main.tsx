import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import Plantory from './Plantory'
import './index.css'
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
)
