import React from 'react'
import { Link } from 'react-router-dom'
import Hero from '../components/Hero'
import Partners from '../components/Partners'

const stats = [
  { label: 'Trusted Partners', value: '14+' },
  { label: 'Charity Causes', value: '7' },
  { label: 'Active Donors', value: '1.2K' },
  { label: 'Cities Reached', value: '12' },
]

const causes = [
  { title: 'Education', description: 'Sponsor tuition, uniforms and school supplies for children.' },
  { title: 'Healthcare', description: 'Support urgent treatments, medicines and mobile clinics.' },
  { title: 'Animal Welfare', description: 'Help rescue animals, shelters and veterinary care.' },
  { title: 'Disaster Relief', description: 'Provide immediate cash, food and shelter after crises.' },
]

const futureGoals = [
  { 
    phase: 'Phase 01', 
    title: 'Automated Real-Time Auditing', 
    description: 'Integrating cryptographic receipts for every single rupee donated to establish a zero-leakage pipeline across municipal shelters and local NGOs.' 
  },
  { 
    phase: 'Phase 02', 
    title: 'Instant Blood Hub Synchronization', 
    description: 'Launching a cross-city emergency routing engine to match blood requests with nearby verified donors within a sub-10 minute window.' 
  },
  { 
    phase: 'Phase 03', 
    title: 'Rural Micro-Donation Networks', 
    description: 'Expanding localized physical drop-off hubs into tier-2 and tier-3 districts across Pakistan for personal item validation and distribution.' 
  }
]

export default function Home() {
  return (
    <main className="bg-white min-h-screen selection:bg-red-950 selection:text-white">
      {/* 1. Hero Showcase */}
      <Hero />

      {/* ==================== SECTION ONE: OUR WORK ==================== */}
      {/* OPTIMIZED: Changed py-24 to pt-4 pb-20 to pull content right below Hero */}
      <section className="pt-4 pb-20 bg-white relative" id="about">
        <div className="container mx-auto px-6">
          
          {/* Section Header */}
          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6 border-b border-red-950/10 pb-10">
            <div className="max-w-2xl">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-red-50 border border-red-100 mb-4">
                <span className="text-xs font-bold uppercase tracking-wider text-red-900">Current Footprint</span>
              </div>
              <h2 className="text-3xl sm:text-5xl font-black tracking-tight text-red-950">
                Our Work: Transforming Relief Ecosystems
              </h2>
              <p className="mt-4 text-lg text-red-900/70 font-medium">
                AidAlign unifies fragmented local operations into a high-transparency engine. Here is what we are achieving today.
              </p>
            </div>
            <Link 
              to="/donatenow" 
              className="inline-flex items-center justify-center rounded-xl bg-red-950 px-8 py-4 text-sm font-bold text-white shadow-xl transition-all duration-300 hover:bg-red-900 hover:-translate-y-0.5 whitespace-nowrap self-start lg:self-end"
            >
              Support Active Causes
            </Link>
          </div>

          {/* Core Stats Row */}
          {/* OPTIMIZED: Cleared erratic negative margin offsets */}
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4 pt-12">
            {stats.map((item) => (
              <div key={item.label} className="bg-white rounded-2xl p-6 border border-red-950/10 shadow-sm transition-all duration-300 hover:border-red-950/30">
                <div className="text-4xl font-black text-red-950 tracking-tight">{item.value}</div>
                <div className="mt-2 text-sm font-semibold uppercase tracking-wider text-red-900/60">{item.label}</div>
              </div>
            ))}
          </div>

          {/* Active Sector Sub-grid */}
          <div className="mt-12 grid gap-6 md:grid-cols-2">
            {causes.map((cause) => (
              <article key={cause.title} className="group rounded-[2rem] border border-red-950/10 bg-white p-8 shadow-sm transition-all duration-300 hover:shadow-md hover:border-red-950/20 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between">
                    <h3 className="text-2xl font-bold text-red-950 tracking-tight">{cause.title}</h3>
                    <span className="rounded-full bg-red-50 border border-red-100 px-4 py-1.5 text-xs font-bold text-red-900 uppercase tracking-wider">
                      High Impact
                    </span>
                  </div>
                  <p className="mt-4 text-red-900/70 font-medium leading-relaxed">{cause.description}</p>
                </div>
                <div className="mt-8 pt-4 border-t border-red-50 flex items-center justify-end">
                  <Link to="/donatenow" className="text-sm font-bold text-red-950 group-hover:text-red-800 flex items-center gap-1 transition-colors">
                    Support Sector <span className="transition-transform group-hover:translate-x-1">→</span>
                  </Link>
                </div>
              </article>
            ))}
          </div>

          {/* Process Walkthrough Dashboard Row */}
          <div className="mt-16 bg-red-950 rounded-[2.5rem] p-8 sm:p-12 text-white grid gap-8 lg:grid-cols-3 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 rounded-full bg-red-900 blur-3xl opacity-30 pointer-events-none" />
            
            <div className="space-y-2">
              <span className="text-xs font-bold uppercase tracking-widest text-red-200/60">01. Choose Segment</span>
              <h4 className="text-xl font-bold tracking-tight">Select Verified Recipients</h4>
              <p className="text-sm text-red-100/70 font-medium leading-relaxed">Filter across validated local NGOs, public healthcare centers, stray animal micro-shelters, or individual item drives.</p>
            </div>
            
            <div className="space-y-2 lg:border-l lg:border-white/10 lg:pl-8">
              <span className="text-xs font-bold uppercase tracking-widest text-red-200/60">02. Direct Safe Processing</span>
              <h4 className="text-xl font-bold tracking-tight">Secured Instant Channels</h4>
              <p className="text-sm text-red-100/70 font-medium leading-relaxed">Fulfill requests safely utilizing direct processing frameworks like EasyPaisa, JazzCash, Nayapay, or localized pickup logistics.</p>
            </div>

            <div className="space-y-2 lg:border-l lg:border-white/10 lg:pl-8">
              <span className="text-xs font-bold uppercase tracking-widest text-red-200/60">03. Trace & Verify</span>
              <h4 className="text-xl font-bold tracking-tight">Real-Time Audits</h4>
              <p className="text-sm text-red-100/70 font-medium leading-relaxed">Follow every distribution pathway straight from your interactive user interface with transparent audit trail confirmations.</p>
            </div>
          </div>

        </div>
      </section>

      {/* ==================== SECTION TWO: FUTURE GOALS ==================== */}
      <section className="py-20 bg-red-50/40 border-t border-b border-red-950/5 relative" id="future">
        <div className="container mx-auto px-6">
          
          {/* Section Header */}
          <div className="max-w-3xl mx-auto text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-red-50 border border-red-100 mb-4">
              <span className="text-xs font-bold uppercase tracking-wider text-red-900">Roadmap Milestone</span>
            </div>
            <h2 className="text-3xl sm:text-5xl font-black tracking-tight text-red-950">
              Future Goals: Architectural Vision
            </h2>
            <p className="mt-4 text-base sm:text-lg text-red-900/70 font-medium">
              We aren't just building a portal; we are building an infrastructure. Here is how AidAlign is evolving to future-proof grassroots philanthropy.
            </p>
          </div>

          {/* Strategic Milestone Matrix Grid */}
          <div className="grid gap-8 lg:grid-cols-3">
            {futureGoals.map((goal) => (
              <div 
                key={goal.phase} 
                className="bg-white rounded-3xl border border-red-950/10 p-8 shadow-sm transition-all duration-300 hover:border-red-950/20 hover:shadow-md flex flex-col justify-between relative overflow-hidden"
              >
                <div>
                  <span className="text-xs font-extrabold uppercase tracking-widest text-red-800 bg-red-50 px-3 py-1 rounded-md inline-block">
                    {goal.phase}
                  </span>
                  <h3 className="text-xl font-extrabold text-red-950 tracking-tight mt-6 mb-3">
                    {goal.title}
                  </h3>
                  <p className="text-sm text-red-900/70 font-medium leading-relaxed">
                    {goal.description}
                  </p>
                </div>
                
                <div className="mt-8 pt-4 border-t border-stone-50 flex items-center gap-2 text-xs font-bold text-red-950/40 uppercase tracking-widest">
                  <span className="w-1.5 h-1.5 rounded-full bg-red-950/30" />
                  System Pipeline Expansion
                </div>
              </div>
            ))}
          </div>

          {/* Call to Action Container Card */}
          <div className="mt-16 max-w-4xl mx-auto rounded-[2rem] border border-red-950/10 bg-white p-8 sm:p-12 text-center shadow-sm relative">
            <h3 className="text-2xl sm:text-3xl font-black text-red-950 tracking-tight">Become an Early Foundation Catalyst</h3>
            <p className="mt-3 max-w-xl mx-auto text-red-900/70 font-medium text-sm sm:text-base">
              Establish your verified profile today to maintain an immutable dashboard track record as our framework scales nationwide.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-4">
              <Link to="/register" className="rounded-xl bg-red-950 px-8 py-4 text-sm font-bold text-white shadow-md transition-all duration-300 hover:bg-red-900 hover:-translate-y-0.5">
                Create Account
              </Link>
              <Link to="/donatenow" className="rounded-xl border-2 border-red-950/10 bg-white px-8 py-3.5 text-sm font-bold text-red-950 transition-all duration-300 hover:bg-red-50 hover:border-red-950">
                Browse Causes
              </Link>
            </div>
          </div>

        </div>
      </section>

      {/* 4. Infinite Moving Carousel Footer Showcase */}
      <Partners />
    </main>
  )
}