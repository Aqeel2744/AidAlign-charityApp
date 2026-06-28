import React from 'react'
import { Link } from 'react-router-dom'

export default function Footer() {
  return (
    <footer className="border-t border-red-950/10 bg-white pt-16 pb-12">
      <div className="container mx-auto px-6 grid gap-12 lg:grid-cols-12">
        
        {/* Brand/Description Column */}
        <div className="lg:col-span-5 space-y-4">
          <div className="text-2xl font-black tracking-tight text-red-950">
            AidAlign
          </div>
          <p className="text-red-900/70 font-medium max-w-sm leading-relaxed">
            A next-gen charity platform connecting donors with verified causes across Pakistan.
          </p>
        </div>

        {/* Quick Links Navigation Column */}
        <div className="lg:col-span-4">
          <div className="text-xs font-bold uppercase tracking-widest text-red-950/40">
            Quick links
          </div>
          <div className="mt-4 space-y-3 text-sm font-semibold text-red-900/70">
            <Link to="/donatenow" className="block transition-colors hover:text-red-950">
              Donate Now
            </Link>
            <Link to="/items" className="block transition-colors hover:text-red-950">
              Personal Item Donation
            </Link>
            <Link to="/blood" className="block transition-colors hover:text-red-950">
              Blood Donation Hub
            </Link>
            <Link to="/animal" className="block transition-colors hover:text-red-950">
              Animal Welfare
            </Link>
          </div>
        </div>

        {/* Social / Connect Column */}
        <div className="lg:col-span-3">
          <div className="text-xs font-bold uppercase tracking-widest text-red-950/40">
            Connect
          </div>
          <div className="mt-4 space-y-3 text-sm font-semibold text-red-900/70">
            <a href="#" className="block transition-colors hover:text-red-950">Twitter</a>
            <a href="#" className="block transition-colors hover:text-red-950">Facebook</a>
            <a href="#" className="block transition-colors hover:text-red-950">Instagram</a>
          </div>
        </div>

      </div>

      {/* Sub-Footer Copyright & Origin Banner */}
      <div className="container mx-auto px-6 mt-16 pt-8 border-t border-red-950/5 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-bold uppercase tracking-wider text-red-950/40">
        <div>
          &copy; {new Date().getFullYear()} AidAlign. All rights reserved.
        </div>
        <div className="flex items-center gap-1">
          Made with <span className="text-red-700 animate-pulse">❤️</span> in Pakistan.
        </div>
      </div>
    </footer>
  )
}