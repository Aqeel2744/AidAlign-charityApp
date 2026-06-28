import React, { useContext } from 'react'
import { AuthContext } from '../context/AuthProvider'
import { useNavigate, useLocation } from 'react-router-dom'

export default function Navbar() {
  const { user, logout } = useContext(AuthContext)
  const navigate = useNavigate()
  const location = useLocation() // Tracks current route and hash changes

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  // Robust scrolling navigation that forces redirection to Home page if necessary
  const handleNav = (targetId) => {
    navigate(`/#${targetId}`)
    
    const element = document.getElementById(targetId)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' })
    } else {
      // If navigating back from /login or /register, wait for Home page to mount
      setTimeout(() => {
        const structuralElement = document.getElementById(targetId)
        if (structuralElement) {
          structuralElement.scrollIntoView({ behavior: 'smooth' })
        }
      }, 150)
    }
  }

  const handleHomeClick = () => {
    navigate('/')
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  // Dynamic CSS injector for active links
  const getLinkClass = (isActive) => {
    return isActive
      ? "bg-red-950 text-white font-bold px-5 py-2 rounded-full transition-all shadow-sm scale-105"
      : "transition-colors text-red-900/70 hover:text-red-950 font-medium px-4 py-2"
  }

  return (
    /* Changed 'sticky top-0' to 'relative' so it stays at the top of the page stream naturally */
    <header className="relative z-50 border-b border-red-950/10 bg-white/90 backdrop-blur-md shadow-sm">
      <div className="container mx-auto px-6 flex flex-col gap-4 py-4 md:flex-row md:items-center md:justify-between">

        {/* LOGO */}
        <button
          onClick={handleHomeClick}
          className="text-2xl font-black tracking-tight text-red-950 text-left transition-transform hover:scale-105"
        >
          AidAlign
        </button>

        {/* NAV LINKS */}
        <nav className="hidden items-center gap-4 font-medium md:flex">
          <button 
            onClick={handleHomeClick} 
            className={getLinkClass(location.pathname === '/' && !location.hash)}
          >
            Home
          </button>
          
          <button 
            onClick={() => handleNav('about')} 
            className={getLinkClass(location.pathname === '/' && location.hash === '#about')}
          >
            Our Work
          </button>
          
          <button 
            onClick={() => handleNav('partners')} 
            className={getLinkClass(location.pathname === '/' && location.hash === '#partners')}
          >
            Our Partners
          </button>
          
          <button 
            onClick={() => handleNav('future')} 
            className={getLinkClass(location.pathname === '/' && location.hash === '#future')}
          >
            About Us
          </button>
        </nav>

        {/* AUTH BUTTONS */}
        <div className="flex flex-wrap items-center gap-3">
          {user ? (
            <>
              <div className="hidden items-center gap-4 text-sm font-semibold text-red-950 md:flex px-2">
                Hello, {user.name}
              </div>
              <button
                onClick={handleLogout}
                className="rounded-full border border-red-950/20 bg-red-50 px-5 py-2 text-sm font-bold text-red-950 transition-all hover:bg-red-100 hover:border-red-950/30"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => navigate('/login')}
                className="rounded-full bg-red-950 px-6 py-2.5 text-sm font-bold text-white shadow-md transition-all hover:bg-red-900 hover:-translate-y-0.5"
              >
                Sign In
              </button>
              <button
                onClick={() => navigate('/register')}
                className="rounded-full border-2 border-red-950/20 bg-white px-6 py-2 text-sm font-bold text-red-950 transition-all hover:bg-red-50 hover:border-red-950"
              >
                Register
              </button>
            </>
          )}
        </div>
      </div>
    </header>
  )
}