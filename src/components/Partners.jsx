import React from 'react'

const partners = [
  'Edhi Foundation','Saylani Welfare','Chhipa Welfare','Akhuwat','Al-Khidmat','Alamgir Welfare','JDC','Shaukat Khanum','TCF','Bait-ul-Sukoon','MALC','Aga Khan Foundation','Indus Hospital','Jinnah Hospital'
]

export default function Partners(){
  return (
    // FIXED: Changed pt-10 to pt-0 to remove the stacked top spacing entirely
    <section id="partners" className="pt-0 pb-12 bg-white relative overflow-hidden">
      
      {/* Section Header */}
      <div className="container mx-auto px-6 text-center mb-10">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-red-50 border border-red-100 mb-4">
          <span className="text-xs font-bold uppercase tracking-wider text-red-900">Our Network</span>
        </div>
        <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-red-950">
          Trusted Partners Across Pakistan
        </h2>
        <p className="mt-3 text-red-900/60 font-medium max-w-xl mx-auto text-sm sm:text-base">
          Collaborating with verified organizations to ensure absolute transparency and instant relief routing.
        </p>
      </div>

      {/* Infinite Marquee Container with High-End Fade Overlays */}
      <div className="relative w-full overflow-hidden before:absolute before:left-0 before:top-0 before:z-10 before:h-full before:w-16 sm:before:w-48 before:bg-gradient-to-r before:from-white before:to-transparent after:absolute after:right-0 after:top-0 after:z-10 after:h-full after:w-16 sm:after:w-48 after:bg-gradient-to-l after:from-white after:to-transparent">
        
        {/* The Animating Track */}
        <div className="flex gap-6 items-center animate-marquee py-4 whitespace-nowrap">
          
          {/* Primary List */}
          {partners.map((p) => (
            <div 
              key={p} 
              className="inline-block min-w-[180px] sm:min-w-[220px] bg-white border border-red-950/10 px-6 py-5 rounded-2xl shadow-sm hover:shadow-md hover:border-red-950/30 text-center font-bold text-red-950 transition-all duration-300 transform hover:-translate-y-1 cursor-default"
            >
              {p}
            </div>
          ))}

          {/* Duplicated List to guarantee a perfect, seamless loop at -50% width translation */}
          {partners.map((p) => (
            <div 
              key={`${p}-duplicate`} 
              className="inline-block min-w-[180px] sm:min-w-[220px] bg-white border border-red-950/10 px-6 py-5 rounded-2xl shadow-sm hover:shadow-md hover:border-red-950/30 text-center font-bold text-red-950 transition-all duration-300 transform hover:-translate-y-1 cursor-default"
            >
              {p}
            </div>
          ))}

        </div>
      </div>

      {/* Optimized Seamless CSS Marquee */}
      <style>{`
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-marquee {
          display: flex;
          width: max-content;
          animation: marquee 35s linear infinite;
        }
        /* Pauses sliding effect beautifully when user inspects/hovers card */
        .animate-marquee:hover {
          animation-play-state: paused;
        }
      `}</style>
    </section>
  )
}