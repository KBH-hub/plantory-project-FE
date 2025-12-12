import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
// import Plantory from './Plantory'
import Header from './components/Header'
// import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    {/* <App /> */}
    <Header me={null} />
    {/* <Plantory /> */}
  </StrictMode>,
)
