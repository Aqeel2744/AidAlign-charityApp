import React from 'react'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import { Routes, Route, useLocation} from 'react-router-dom'
import 'aos/dist/aos.css';
import ProtectedRoute from './components/ProtectedRoute'

import Home from './pages/Home'
import Dashboard from './pages/Dashboard'
import DonateNow from './pages/DonateNow'
import Login from './pages/Login'
import Register from './pages/Register'
// import Analytics from './pages/Analytics'
import Contributions from './pages/Contributions'
import AnimalShelters from './pages/AnimalShelters'
import BloodHub from './pages/BloodHub'
import ItemDonations from './pages/ItemDonations'
import IslamicDonations from './pages/IslamicDonations'
import Settings from './pages/Settings'

function App() {
  // Initialize the location hook to track the current URL path
  const location = useLocation()

  // Updated: Only include the home route so Navbar/Footer stay hidden on Auth pages
  const publicPages = ['/']

  const showLayout = publicPages.includes(location.pathname)

  return (
    <div className="min-h-screen bg-slate-50">
      
      {showLayout && <Navbar />}

      <Routes>
        <Route path="/" element={<Home />} />

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/donatenow"
          element={
            <ProtectedRoute>
              <DonateNow />
            </ProtectedRoute>
          }
        />

        <Route
          path="/items"
          element={
            <ProtectedRoute>
              <ItemDonations />
            </ProtectedRoute>
          }
        />
{/* 
        <Route
          path="/analytics"
          element={
            <ProtectedRoute>
              <Analytics />
            </ProtectedRoute>
          }
        /> */}


        <Route
          path="/contributions"
          element={
            <ProtectedRoute>
              <Contributions />
            </ProtectedRoute>
          }
        />


        <Route
          path="/animal"
          element={
            <ProtectedRoute>
              <AnimalShelters />
            </ProtectedRoute>
          }
        />

        <Route
          path="/blood"
          element={
            <ProtectedRoute>
              <BloodHub />
            </ProtectedRoute>
          }
        />

        <Route
          path="/islamic"
          element={
            <ProtectedRoute>
              <IslamicDonations />
            </ProtectedRoute>
          }
        />

        <Route
          path="/settings"
          element={
            <ProtectedRoute>
              <Settings />
            </ProtectedRoute>
          }
        />

        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route path="*" element={<Home />} />
      </Routes>

      {showLayout && <Footer />}
    </div>
  )
}

export default App