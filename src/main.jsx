import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'

// Global Styles
import './index.css'

// Top Level App Component
import App from './App.jsx'

// Page Components used in Routing
import SignIn from './Pages/SignIn.jsx'
import SignUp from './Pages/SignUp.jsx'
import TourDetails from './Pages/TourDetails.jsx'
import AdminDashboard from './Pages/AdminDashboard.jsx'
import Dashboard from './Pages/Dashboard.jsx'

/**
 * Main Application Entry Point
 * 
 * Sets up the React Root directory and renders the application wrapped in:
 * - StrictMode: For additional checks and warnings during development.
 * - BrowserRouter: To enable client-side routing.
 * 
 * Defines the primary Route structure of the application.
 */
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        {/* Main Landing Page with all sections (Home, Tours, Services, etc.) */}
        <Route path="/" element={<App />} />

        {/* Authentication Routes */}
        <Route path="/signin" element={<SignIn />} />
        <Route path="/signup" element={<SignUp />} />

        {/* Dynamic User Routes */}
        {/* Displays specific tour details based on the ID parameter */}
        <Route path="/tour/:id" element={<TourDetails />} />

        {/* User Account Dashboard */}
        <Route path="/dashboard" element={<Dashboard />} />

        {/* Administrative Routes */}
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/admindashboard" element={<AdminDashboard />} />

        {/* 404 Error Page - Catch-all for undefined routes */}
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