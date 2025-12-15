import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import Plantory from './Plantory'
import './styles/layout.css'
import './styles/header.css'
import './styles/modal.css'
import './styles/alert.css'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <Plantory />
    </BrowserRouter>
  </StrictMode>
)
