import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Solicitud from './pages/Solicitud.jsx'
import DJ from './pages/DJ.jsx'
import QRs from './pages/QRs.jsx'
import './styles.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/mesa/:num" element={<Solicitud />} />
        <Route path="/dj" element={<DJ />} />
        <Route path="/qr" element={<QRs />} />
        <Route path="*" element={<Navigate to="/mesa/0" replace />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
)
