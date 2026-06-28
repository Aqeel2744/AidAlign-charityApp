import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Link } from 'react-router-dom'

const HERO_IMAGES = [
  {
    url: "https://images.unsplash.com/photo-1532629345422-7515f3d16bb6?auto=format&fit=crop&q=80&w=800",
    alt: "Charity and Donation"
  },
  {
    url: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&q=80&w=800", 
    alt: "Medical Support"
  },
  {
    url: "https://images.unsplash.com/photo-1541781774459-bb2af2f05b55?auto=format&fit=crop&q=80&w=800", 
    alt: "Animal Shelter"
  },
  {
    url: "https://images.unsplash.com/photo-1593113565214-80afcb4a45d7?auto=format&fit=crop&q=80&w=800", 
    alt: "Transparency"
  }
]

export default function Hero() {
  const [currentImgIndex, setCurrentImgIndex] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentImgIndex((prevIndex) => (prevIndex + 1) % HERO_IMAGES.length)
    }, 4000)
    return () => clearInterval(timer)
  }, [])

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.15, delayChildren: 0.1 }
    }
  }

  const itemVariants = {
    hidden: { y: 25, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { duration: 0.7, ease: "easeOut" } }
  }

  return (
    // OPTIMIZED: Adjusted min-height and tightened bottom padding
    <section className="relative min-h-[75vh] lg:min-h-[80vh] flex items-center justify-center bg-white overflow-hidden pt-20 pb-8">
      
      <div className="absolute top-0 right-0 -mr-40 -mt-40 w-96 h-96 rounded-full bg-red-50/50 blur-3xl opacity-60 pointer-events-none" />
      <div className="absolute bottom-0 left-0 -ml-40 -mb-40 w-96 h-96 rounded-full bg-stone-100 blur-3xl opacity-60 pointer-events-none" />

      <div className="container mx-auto px-6 grid gap-16 lg:grid-cols-12 items-center relative z-10">
        
        {/* Left Column: Content */}
        <motion.div 
          className="lg:col-span-7 space-y-8 text-center lg:text-left"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.div variants={itemVariants} className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-red-50 border border-red-100">
            <span className="w-2 h-2 rounded-full bg-amber-600 animate-pulse" />
            <span className="text-xs font-semibold uppercase tracking-wider text-red-900">Empowering Pakistan</span>
          </motion.div>

          <motion.h1 
            variants={itemVariants} 
            className="text-4xl sm:text-6xl font-black tracking-tight text-red-950 leading-[1.1]"
          >
            Your Small Act, <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-800 to-red-950">
              Their Big Hope.
            </span>
          </motion.h1>

          <motion.p 
            variants={itemVariants} 
            className="max-w-xl mx-auto lg:mx-0 text-lg leading-relaxed text-red-900/80 font-medium"
          >
            AidAlign digitizes and transparently tracks donations across Pakistan — bridging the gap for charities, hospitals, animal shelters, and personal aid.
          </motion.p>

          <motion.div 
            variants={itemVariants} 
            className="flex flex-wrap items-center justify-center lg:justify-start gap-4 pt-4"
          >
            <Link 
              to="/donatenow" 
              className="group relative inline-flex items-center justify-center rounded-xl bg-red-950 px-8 py-4 text-sm font-bold text-white shadow-xl transition-all duration-300 hover:bg-red-900 hover:-translate-y-0.5"
            >
              Start Donating
              <svg className="w-4 h-4 ml-2 transition-transform duration-300 group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </Link>
            
            <Link 
              to="/register" 
              className="inline-flex items-center justify-center rounded-xl border-2 border-red-950/20 bg-white px-8 py-4 text-sm font-bold text-red-950 transition-all duration-300 hover:border-red-950 hover:bg-red-50"
            >
              Join AidAlign
            </Link>
          </motion.div>
        </motion.div>

        {/* Right Column: Continuous Changing Showcase Frame */}
        <motion.div 
          className="lg:col-span-5 relative flex justify-center"
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
        >
          <div className="absolute -inset-1 bg-gradient-to-tr from-red-800 to-red-950 rounded-[2.5rem] opacity-20 blur-xl animate-pulse" />
          
          <div className="relative w-full max-w-[440px] aspect-[4/5] rounded-[2.5rem] border border-red-950/10 bg-stone-900 overflow-hidden shadow-2xl flex flex-col justify-end">
            
            <div className="absolute inset-0 z-0 bg-stone-950">
              <AnimatePresence mode="wait">
                <motion.img
                  key={currentImgIndex}
                  src={HERO_IMAGES[currentImgIndex].url}
                  alt={HERO_IMAGES[currentImgIndex].alt}
                  initial={{ opacity: 0, scale: 1.05 }}
                  animate={{ opacity: 0.45, scale: 1 }} 
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.9, ease: "easeInOut" }}
                  className="w-full h-full object-cover"
                />
              </AnimatePresence>
            </div>

            <div className="relative z-10 m-6 p-6 rounded-3xl bg-white/95 backdrop-blur-md shadow-xl border border-white/20">
              <div className="space-y-3">
                <div className="w-10 h-10 rounded-xl bg-red-50 flex items-center justify-center text-red-950 font-bold">
                  ✦
                </div>
                <h3 className="text-xl font-bold text-red-950 tracking-tight">Verified Impact Hub</h3>
                <p className="text-sm text-red-900/80 leading-relaxed font-medium">
                  Impact stories, live dashboards, shelter coordination, and instant verified blood hub routing.
                </p>
              </div>

              <div className="mt-5 pt-4 border-t border-red-950/5 grid grid-cols-2 gap-4">
                <div>
                  <span className="block text-[10px] font-bold uppercase tracking-wider text-red-950/50">Transparency</span>
                  <span className="text-sm font-extrabold text-red-950">100% Audited</span>
                </div>
                <div>
                  <span className="block text-[10px] font-bold uppercase tracking-wider text-red-950/50">Partners</span>
                  <span className="text-sm font-extrabold text-red-950">Verified NGOs</span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

      </div>
    </section>
  )
}