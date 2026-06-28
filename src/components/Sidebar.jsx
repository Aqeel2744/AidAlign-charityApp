import React, { useContext, useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { AuthContext } from '../context/AuthProvider'
import { 
  Settings, 
  LogOut, 
  LogIn, 
  LayoutDashboard, 
  HeartHandshake, 
  History, 
  PawPrint, 
  Moon, 
  Droplet, 
  Gift,
  Heart,
  Menu, 
  X     
} from 'lucide-react'

export default function Sidebar() {
  const { user, logout } = useContext(AuthContext)
  const navigate = useNavigate()
  const location = useLocation()
  
  // State to manage mobile sidebar slide-out display
  const [isOpen, setIsOpen] = useState(false)

  const handleLogout = () => {
    logout()
    navigate('/')
    setIsOpen(false) 
  }

  // Grouped link configuration to render split categories dynamically
  const navigationSections = [
    {
      title: 'Overview',
      items: [
        { label: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
        { label: 'Contributions', path: '/contributions', icon: History }
      ]
    },
    {
      title: 'Active Contributions',
      items: [
        { label: 'Donate Now', path: '/donatenow', icon: HeartHandshake },
        { label: 'Animal Welfare', path: '/animal', icon: PawPrint },
        { label: 'Islamic Donations', path: '/islamic', icon: Moon },
        { label: 'Blood Donation Hub', path: '/blood', icon: Droplet },
        { label: 'Personal Item Donation', path: '/items', icon: Gift }
      ]
    }
  ]

  return (
    <>
      {/* RESPONSIVE HAMBURGER BUTTON (Matches soft background tone) */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="fixed top-4 left-4 z-50 inline-flex items-center justify-center rounded-xl border border-slate-200/80 bg-[#FAF8F5] p-2.5 text-slate-600 shadow-xl backdrop-blur-md transition-all hover:bg-stone-100 hover:text-slate-900 active:scale-95 lg:hidden"
      >
        {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
      </button>

      {/* BACKDROP DIM LAYER (Visible only on mobile/tablets) */}
      {isOpen && (
        <div 
          onClick={() => setIsOpen(false)}
          className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm transition-opacity duration-300 lg:hidden"
        />
      )}

      {/* SIDEBAR PANEL (Now uses the itemdonation page background colour) */}
      <aside className={`fixed lg:relative top-0 left-0 z-40 lg:z-auto flex h-screen lg:h-full w-72 flex-col border-r border-slate-200/60 bg-[#FAF8F5] p-6 transition-all duration-300
        ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        
        {/* BRAND LOGO / HEADER */}
        <div className="group/logo mb-8 flex items-center gap-3 px-2 cursor-pointer mt-12 lg:mt-0">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-red-800 via-red-900 to-red-950 shadow-md shadow-red-900/20 transition-all duration-500 group-hover/logo:scale-105">
            <Heart className="h-5 w-5 text-amber-50 animate-[pulse_2s_infinite] transition-transform duration-500 ease-out group-hover/logo:scale-110 group-hover/logo:rotate-12" fill="currentColor" />
          </div>
          <div>
            <h1 className="text-lg font-bold tracking-tight text-slate-900 transition-all duration-300">
              AidAlign
            </h1>
            <p className="text-[10px] font-bold uppercase tracking-widest text-red-800 transition-all duration-300">
              Charity Platform
            </p>
          </div>
        </div>

        {/* NAVIGATION */}
        <nav className="flex-1 space-y-6 overflow-y-auto pr-1 select-none">
          {navigationSections.map((section) => (
            <div key={section.title} className="space-y-1.5">
              {/* Section Heading */}
              <h2 className="px-4 text-[11px] font-bold uppercase tracking-wider text-slate-400">
                {section.title}
              </h2>
              
              {/* Section Items */}
              <div className="space-y-1">
                {section.items.map((l) => {
                  const Icon = l.icon
                  const isActive = location.pathname === l.path

                  return (
                    <button
                      key={l.path}
                      onClick={() => {
                        navigate(l.path);
                        setIsOpen(false); 
                      }}
                      className={`group relative flex w-full items-center gap-3 rounded-xl px-4 py-2.5 text-sm font-semibold transition-all duration-200 active:scale-[0.98]
                        ${isActive 
                          ? 'bg-amber-100/60 text-red-900 shadow-inner' 
                          : 'text-slate-600 hover:bg-stone-200/40 hover:text-slate-900'
                        }`}
                    >
                      {/* Left side accent indicator */}
                      {isActive && (
                        <div className="absolute left-0 top-1/4 h-1/2 w-1 rounded-r-full bg-red-800 animate-[pulse_1.5s_infinite]" />
                      )}
                      
                      <Icon className={`h-4 w-4 transition-all duration-300 ease-out group-hover:scale-110 group-hover:-translate-y-0.5 group-hover:rotate-3
                        ${isActive ? 'text-red-800' : 'text-slate-400 group-hover:text-slate-600'}`} 
                      />
                      
                      <span className="truncate">{l.label}</span>
                    </button>
                  )
                })}
              </div>
            </div>
          ))}
        </nav>

        {/* FOOTER */}
        <div className="mt-6 space-y-3 border-t border-slate-200/60 pt-5">
          
          {/* SETTINGS */}
          <button
            onClick={() => {
              navigate('/settings');
              setIsOpen(false);
            }}
            className={`group flex w-full items-center gap-3 rounded-xl px-4 py-2.5 text-sm font-semibold transition-all duration-200 active:scale-[0.98]
              ${location.pathname === '/settings'
                ? 'bg-amber-100/60 text-red-900'
                : 'text-slate-600 hover:bg-stone-200/40 hover:text-slate-900'
              }`}
          >
            <Settings className="h-4 w-4 text-slate-400 transition-transform duration-700 ease-out group-hover:rotate-90 group-hover:text-slate-600" />
            <span>Settings</span>
          </button>

          {/* AUTH BUTTON */}
          {!user ? (
            <button
              onClick={() => {
                navigate('/login');
                setIsOpen(false);
              }}
              className="group flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-red-800 to-red-950 px-4 py-2.5 text-sm font-bold text-white shadow-lg shadow-red-900/10 transition-all duration-200 hover:opacity-95 active:scale-[0.98]"
            >
              <LogIn className="h-4 w-4 opacity-90 transition-transform duration-300 ease-out group-hover:translate-x-1 group-hover:scale-110" />
              <span>Sign In</span>
            </button>
          ) : (
            <button
              onClick={handleLogout}
              className="group flex w-full items-center justify-center gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-2.5 text-sm font-bold text-red-800 transition-all duration-200 hover:bg-red-100/60 active:scale-[0.98]"
            >
              <LogOut className="h-4 w-4 opacity-90 transition-transform duration-300 ease-out group-hover:-translate-x-1 group-hover:scale-110 group-hover:-rotate-12" />
              <span>Logout</span>
            </button>
          )}

          {/* PLATFORM METADATA */}
          <div className="pt-2 text-center">
            <p className="text-[10px] font-medium tracking-wide text-slate-400">
              © {new Date().getFullYear()} AidAlign Organization
            </p>
          </div>
        </div>
      </aside>
    </>
  )
}