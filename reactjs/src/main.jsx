import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import Results from './Result.jsx'
import { BrowserRouter, Routes, Route } from 'react-router-dom' // ✅ FIXED
import RoadMap from './RoadMap.jsx'

createRoot(document.getElementById('root')).render(
  <BrowserRouter future={{v7_startTransition:true,v7_relativeSplatPath:true}}>
    <Routes>
      <Route path="/" element={<App />} />
      <Route path="/result" element={<Results />} />
      <Route path="/roadmap" element={<RoadMap/>}/>
    </Routes>
  </BrowserRouter>
)