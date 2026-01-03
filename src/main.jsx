import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import './index.css'
import App from './App.jsx'
import SignIn from './Pages/SignIn.jsx'
import SignUp from './Pages/SignUp.jsx'
import TourDetails from './Pages/TourDetails.jsx'
import AdminDashboard from './Pages/AdminDashboard.jsx'
import Dashboard from './Pages/Dashboard.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        {/* Main Landing Page with all sections */}
        <Route path="/" element={<App />} />

        {/* Authentication Pages */}
        <Route path="/signin" element={<SignIn />} />
        <Route path="/signup" element={<SignUp />} />

        {/* Dynamic Tour Details Page */}
        <Route path="/tour/:id" element={<TourDetails />} />

        {/* User Dashboard */}
        <Route path="/dashboard" element={<Dashboard />} />

        {/* Admin Dashboard to manage bookings */}
        <Route path="/admin" element={<AdminDashboard />} />

        {/* 404 - Catch all unmatched routes */}
        <Route path="*" element={
          <div className="min-h-screen bg-gradient-to-br from-bg-light via-white to-bg-light flex items-center justify-center p-6">
            <div className="text-center">
              <div className="w-24 h-24 bg-gradient-to-br from-nature-green to-nature-green-light rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-xl">
                <span className="text-5xl">🐼</span>
              </div>
              <h1 className="text-6xl font-black text-nature-black mb-4">404</h1>
              <p className="text-xl text-gray-500 font-medium mb-8">Oops! This page doesn't exist.</p>
              <a
                href="/"
                className="inline-block bg-gradient-to-r from-nature-green to-nature-green-light text-white font-bold px-8 py-4 rounded-2xl shadow-lg shadow-nature-green/30 hover:shadow-xl hover:scale-105 transition-all duration-300"
              >
                ← Back to Home
              </a>
            </div>
          </div>
        } />
      </Routes>
    </BrowserRouter>
  </StrictMode>,
)