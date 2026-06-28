import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Heart, 
  Sparkles, 
  Flame, 
  ArrowRight, 
  Droplet,
  Users,
  Globe,
  AlertTriangle
} from 'lucide-react'
import Sidebar from '../components/Sidebar'

// Framer motion orchestration variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08, delayChildren: 0.1 }
  }
}

const itemVariants = {
  hidden: { opacity: 0, y: 25 },
  visible: { 
    opacity: 1, 
    y: 0, 
    transition: { type: "spring", stiffness: 100, damping: 15 } 
  }
}

/* ==========================================================================
    INTERNATIONAL OCCASIONS REGISTRY CONFIGURATION
   ========================================================================== */
const OCCASIONS_REGISTRY = [
  {
    name: "World Women's Day",
    month: 2, 
    date: 8,
    themeClass: "from-stone-950 via-stone-900 to-stone-900/90 border-stone-800 shadow-xl",
    accentColor: "text-red-500",
    progressColor: "bg-gradient-to-r from-red-950 via-red-800 to-red-600",
    bgOverlay: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=1200",
    headline: "Invest in Women: Accelerate Growth & Equal Rights",
    description: "Allocating micro-grants to female-led agricultural initiatives and medical sponsorships for maternal wellness facilities across developing sectors.",
    urgencyText: "Matching Multiplier Active: All donations 2x'ed today",
    isUrgent: true,
    defaultProgress: 74
  },
  {
    name: "World Water Day",
    month: 2, // March
    date: 22,
    themeClass: "from-stone-950 via-stone-900 to-stone-900/90 border-stone-800 shadow-xl",
    accentColor: "text-red-500",
    progressColor: "bg-gradient-to-r from-red-950 via-red-800 to-red-600",
    bgOverlay: "https://images.unsplash.com/photo-1509099836639-18ba1795216d?auto=format&fit=crop&q=80&w=1200",
    headline: "Clean Water Infrastructure & Filtration Units",
    description: "Funding rapid installation of industrial solar-powered water filtration plants with the Edhi foundation across drought-impacted regions.",
    urgencyText: "3 pipeline projects awaiting immediate capital deployment",
    isUrgent: true,
    defaultProgress: 61
  },
  {
    name: "Earth Day",
    month: 3, // April
    date: 22,
    themeClass: "from-stone-950 via-stone-900 to-stone-900/90 border-stone-800 shadow-xl",
    accentColor: "text-red-500",
    progressColor: "bg-gradient-to-r from-red-950 via-red-800 to-red-600",
    bgOverlay: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&q=80&w=1200",
    headline: "Restore Our Planet: Stray Habitats & Urban Greening",
    description: "Direct capital distribution to local dynamic reforestation teams, community garden setups, and veterinary medical kits for ecosystem resilience.",
    urgencyText: "Seasonal planting allocation window closing tonight",
    isUrgent: false,
    defaultProgress: 82
  },
  {
    name: "International Children's Day",
    month: 5, // June
    date: 1,
    themeClass: "from-stone-950 via-stone-900 to-stone-900/90 border-stone-800 shadow-xl",
    accentColor: "text-red-500",
    progressColor: "bg-gradient-to-r from-red-950 via-red-800 to-red-600",
    bgOverlay: "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&q=80&w=1200",
    headline: "Nutritional Support & Primary Education Access",
    description: "Sponsoring essential primary learning modules, infrastructure expansion for regional orphanages, and pediatric nutritional drops.",
    urgencyText: "Urgent nutrition gaps reported at Sector-C Orphanage",
    isUrgent: true,
    defaultProgress: 89
  },
  {
    name: "World Refugee Day",
    month: 5, // June
    date: 20,
    themeClass: "from-stone-950 via-stone-900 to-stone-900/90 border-stone-800 shadow-xl",
    accentColor: "text-red-500",
    progressColor: "bg-gradient-to-r from-red-950 via-red-800 to-red-600",
    bgOverlay: "https://images.unsplash.com/photo-1469571486040-af250c5522dd?auto=format&fit=crop&q=80&w=1200",
    headline: "Emergency Shelter Kits & Basic Medical Deployments",
    description: "Coordinating clean emergency shelter networks, distribution of thermal winter blankets, and tactical deployment of first-responder medicine packages.",
    urgencyText: "Critical capacity constraints at Suburban Transit Camps",
    isUrgent: true,
    defaultProgress: 45
  },
  {
    name: "International Charity Day",
    month: 8, // September
    date: 5,
    themeClass: "from-stone-950 via-stone-900 to-stone-900/90 border-stone-800 shadow-xl",
    accentColor: "text-red-500",
    progressColor: "bg-gradient-to-r from-red-950 via-red-800 to-red-600",
    bgOverlay: "https://images.unsplash.com/photo-1532629345422-7515f3d16bb6?auto=format&fit=crop&q=80&w=1200",
    headline: "Empower Global Actions, Shelters & Emergency Initiatives",
    description: "Our comprehensive multi-pipeline alignment platform highlight. Your unified capital allocation funds urgent blood procurement drives, orphan nutrition, and animal shelter frameworks.",
    urgencyText: "High volume processing: 0% transactional platform fees today",
    isUrgent: false,
    defaultProgress: 78
  },
  {
    name: "Int. Day of Persons with Disabilities",
    month: 11, // December
    date: 3,
    themeClass: "from-stone-950 via-stone-900 to-stone-900/90 border-stone-800 shadow-xl",
    accentColor: "text-red-500",
    progressColor: "bg-gradient-to-r from-red-950 via-red-800 to-red-600",
    bgOverlay: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&q=80&w=1200",
    headline: "Accessible Technology & Orthopedic Rehabilitation Funds",
    description: "Financing modern prosthetic distributions, audio-assisted learning labs, and functional mobile clinical setups for localized rehabilitation.",
    urgencyText: "Backlog of 142 localized orthopedic fittings pending allocation",
    isUrgent: true,
    defaultProgress: 68
  }
]

const DEFAULT_CAMPAIGN = {
  name: "AidAlign Active Response Drive",
  themeClass: "from-stone-950 via-stone-900 to-stone-900/90 border-red-950/20 shadow-xl",
  accentColor: "text-red-500",
  progressColor: "bg-gradient-to-r from-red-950 via-red-800 to-red-600",
  bgOverlay: "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&q=80&w=1200",
  headline: "Continuous Resource Pipeline & Local NGO Support",
  description: "Ensuring stable, day-to-day capital pipelines for unexpected humanitarian overheads, shelter maintenance closures, and prompt blood transit operations.",
  urgencyText: "Real-time automated allocation active across 4 sectors",
  isUrgent: false,
  defaultProgress: 72
}

/* ==========================================================================
    MAIN DASHBOARD COMPONENT
   ========================================================================== */
export default function Dashboard() {
  const [stats, setStats] = useState({ bloodRequests: 12 })
  const [recentUpdates, setRecentUpdates] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const currentFeeds = [
      { 
        id: 1, 
        issue: "Urgent O-Negative Blood Needed for Edhi Trauma Center", 
        zone: "City Center Hub", 
        timestamp: "10 mins ago", 
        critical: true,
        image: "https://images.unsplash.com/photo-1615461066841-6116e61058f4?auto=format&fit=crop&q=80&w=300"
      },
      { 
        id: 2, 
        issue: "Food Supply Running Low at Sector-C Orphanage & Shelter", 
        zone: "Suburban Welfare Camp", 
        timestamp: "45 mins ago", 
        critical: true,
        image: "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&q=80&w=300"
      },
      { 
        id: 3, 
        issue: "Winter Blankets & Medical Kits Ready for Animal Rescue Shelter", 
        zone: "North Welfare Block", 
        timestamp: "2 hours ago", 
        critical: false,
        image: "https://images.unsplash.com/photo-1548767797-d8c844163c4c?auto=format&fit=crop&q=80&w=300"
      },
      { 
        id: 4, 
        issue: "New Clean Water Tank Setup Completed with Edhi Volunteers", 
        zone: "Green Valley Community", 
        timestamp: "4 hours ago", 
        critical: false,
        image: "https://images.unsplash.com/photo-1509099836639-18ba1795216d?auto=format&fit=crop&q=80&w=300"
      }
    ]
    
    setRecentUpdates(currentFeeds)
    
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 600)
    
    return () => clearTimeout(timer)
  }, [])

  if (isLoading) {
    return <DashboardSkeleton />
  }

  return (
    <div className="min-h-screen bg-white selection:bg-red-900/10 selection:text-red-950">
      <div className="mx-auto max-w-[1600px] px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid items-start gap-8 xl:grid-cols-[280px_1fr]">
          
          <aside className="sticky top-8 hidden xl:block z-20">
            <Sidebar />
          </aside>

          <motion.div 
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="space-y-8"
          >
            
            {/* SINGLE COMPACT DYNAMIC HERO CONTAINER */}
            <motion.div variants={itemVariants} className="w-full block">
              <FeaturedOccasionGrid />
            </motion.div>

            {/* THREE COLUMN / TWO COLUMN BOTTOM LAYOUT GRID */}
            <div className="grid gap-8 lg:grid-cols-2">
              
              {/* REMINDERS CARD */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Droplet className="h-5 w-5 text-red-900" />
                    <h2 className="text-lg font-bold text-stone-900 tracking-tight">Donation & Alert Reminders</h2>
                  </div>
                  <span className="text-[11px] font-bold bg-red-50 text-red-950 px-2.5 py-1 rounded-full border border-red-200/60 uppercase tracking-wider">
                    {stats.bloodRequests} Open Requests
                  </span>
                </div>
                <BloodRemindersCard activeCount={stats.bloodRequests} />
              </div>

              {/* LIVE ALERTS FEED */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Flame className="h-5 w-5 text-red-800 animate-pulse" />
                    <h2 className="text-lg font-bold text-stone-900 tracking-tight">Recent Live Help Alerts</h2>
                  </div>
                  <span className="text-[11px] font-bold bg-red-50 text-red-950 px-2.5 py-1 rounded-full border border-red-200/60 uppercase tracking-wider">Updates</span>
                </div>
                
                <div className="space-y-3">
                  {recentUpdates.map((item) => (
                    <div 
                      key={item.id} 
                      className="flex items-start gap-4 rounded-xl border border-red-900/10 bg-red-50/20 p-4 transition-colors hover:bg-red-50/50"
                    >
                      <img 
                        src={item.image} 
                        alt={item.issue} 
                        className="h-16 w-16 rounded-lg object-cover bg-stone-100 border border-red-900/10 shrink-0"
                      />
                      
                      <div className="flex-1 space-y-1 min-w-0">
                        <div className="text-sm font-bold text-stone-900 leading-tight block truncate sm:whitespace-normal">
                          {item.issue}
                        </div>
                        <div className="text-xs text-stone-500 font-medium flex items-center gap-2">
                          <span>{item.zone}</span>
                          <span className="w-1 h-1 bg-stone-300 rounded-full" />
                          <span>{item.timestamp}</span>
                        </div>
                        <div className="pt-1">
                          <span className={`text-[10px] font-extrabold px-2.5 py-0.5 rounded-md tracking-wide uppercase ${
                            item.critical 
                              ? 'bg-red-900/10 text-red-950 border border-red-900/20' 
                              : 'bg-stone-100 text-stone-600 border border-stone-200'
                          }`}>
                            {item.critical ? 'High Priority' : 'Normal Need'}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>

          </motion.div>
        </div>
      </div>
    </div>
  )
}

/* ==========================================================================
    SUB-COMPONENTS
   ========================================================================== */

function FeaturedOccasionGrid() {
  const [campaign, setCampaign] = useState(DEFAULT_CAMPAIGN)
  const [isHovered, setIsHovered] = useState(false)

  useEffect(() => {
    const today = new Date()
    const currentMonth = today.getMonth()
    const currentDate = today.getDate()

    // Automatic real-time calendar matching logic
    const activeOccasion = OCCASIONS_REGISTRY.find(
      (occ) => occ.month === currentMonth && occ.date === currentDate
    )

    if (activeOccasion) {
      setCampaign(activeOccasion)
    } else {
      setCampaign(DEFAULT_CAMPAIGN)
    }
  }, [])

  return (
    <div className={`relative min-h-[380px] w-full overflow-hidden rounded-3xl bg-stone-950 bg-gradient-to-br ${campaign.themeClass} text-white border block z-10 transition-all duration-700 ease-in-out flex items-center`}>
      
      {/* Decorative Interactive Blurred Ambient Light elements */}
      <div className="absolute -right-12 -top-12 h-64 w-64 rounded-full bg-red-900/20 blur-3xl pointer-events-none" />
      <div className="absolute -left-16 -bottom-16 h-64 w-64 rounded-full bg-stone-800/20 blur-3xl pointer-events-none" />

      {/* Structured Dynamic Banner Background Image */}
      {campaign.bgOverlay && (
        <div className="absolute inset-0 opacity-35 pointer-events-none mix-blend-luminosity">
          <img 
            src={campaign.bgOverlay} 
            alt={campaign.name} 
            className="w-full h-full object-cover object-center transform scale-100 transition-transform duration-700"
            onError={(e) => { e.target.style.display = 'none'; }}
          />
        </div>
      )}
      
      {/* Protective multi-gradient shade overlay layers */}
      <div className="absolute inset-0 bg-gradient-to-r from-stone-950 via-stone-900/90 to-stone-900/30 pointer-events-none" />
      <div className="absolute inset-0 bg-gradient-to-t from-stone-950/40 via-transparent to-transparent pointer-events-none" />
      
      {/* Card Content Grid Area */}
      <div className="relative z-20 p-6 md:p-8 lg:p-12 flex flex-col justify-between gap-8 lg:flex-row lg:items-center w-full">
        
        <div className="space-y-4 max-w-3xl flex-1">
          {/* Header Badges */}
          <div className="flex flex-wrap items-center gap-2">
            <div className="inline-flex items-center gap-1.5 rounded-full bg-red-950/40 px-3 py-1 text-xs font-semibold text-red-400 backdrop-blur-md border border-red-900/30">
              <Sparkles className="h-3.5 w-3.5 text-red-400 fill-red-500" /> Featured Active Campaign
            </div>
            
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="inline-flex items-center gap-1.5 rounded-full bg-stone-900/80 px-3 py-1 text-xs font-bold tracking-tight border border-stone-800 shadow-sm text-red-400/90 backdrop-blur-sm"
            >
              <Globe className="h-3.5 w-3.5 text-red-500" /> 
              <span>{campaign.name}</span>
            </motion.div>
          </div>
          
          {/* Dynamic Headline Text Display with Rich Maroon Accent */}
          <h2 className="text-2xl font-black tracking-tight sm:text-4xl text-white font-serif leading-tight">
            {campaign.headline.split(':')[0]}: 
            <br />
            <span className={`${campaign.accentColor} transition-colors duration-500`}>
              {campaign.headline.split(':')[1] || campaign.headline}
            </span>
          </h2>
          
          {/* Description Block */}
          <p className="text-sm leading-relaxed text-stone-300 sm:text-base max-w-2xl antialiased">
            {campaign.description}
          </p>

          {/* Conditional Urgency Indicator Row */}
          <div className="flex items-center gap-2 pt-1 text-xs">
            {campaign.isUrgent ? (
              <span className="flex items-center gap-1.5 font-bold text-red-400 bg-red-950/30 px-2.5 py-1 rounded-md border border-red-900/30 shadow-sm">
                <AlertTriangle className="h-3.5 w-3.5 animate-pulse text-red-500" />
                {campaign.urgencyText}
              </span>
            ) : (
              <span className="flex items-center gap-1.5 text-stone-300 bg-stone-900/60 px-2.5 py-1 rounded-md border border-stone-800 backdrop-blur-sm">
                <Sparkles className="h-3.5 w-3.5 text-red-500" />
                {campaign.urgencyText}
              </span>
            )}
          </div>

          {/* Donation Goal Progress Slider Bar */}
          <div className="space-y-2 max-w-md pt-2">
            <div className="flex justify-between text-xs font-medium text-stone-300">
              <span className="flex items-center gap-1"><Users className="h-3.5 w-3.5 text-red-400" /> Crowdfunded Pipeline Allocation Target</span>
              <span className={`font-mono ${campaign.accentColor} font-bold`}>Goal Progress: {campaign.defaultProgress}%</span>
            </div>
            <div className="h-2 w-full rounded-full bg-stone-900 overflow-hidden shadow-inner border border-stone-800">
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: `${campaign.defaultProgress}%` }}
                transition={{ duration: 1.5, ease: "easeInOut" }}
                className={`h-full rounded-full ${campaign.progressColor}`}
              />
            </div>
          </div>
        </div>

        {/* HIGHLY PROMINENT ANIMATED CTA BUTTON - MAROON PALETTE */}
        <div className="flex-shrink-0 mt-2 lg:mt-0 lg:pl-4 self-start lg:self-center w-full sm:w-auto">
          <div onClick={() => window.location.href = '/donatenow'} className="cursor-pointer">
            <motion.button 
              onHoverStart={() => setIsHovered(true)}
              onHoverEnd={() => setIsHovered(false)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.97 }}
              className="group relative flex w-full items-center justify-center gap-3 rounded-2xl bg-gradient-to-r from-red-950 via-red-900 to-red-850 px-8 py-5 text-base font-extrabold text-white shadow-xl transition-all duration-300 hover:from-red-900 hover:to-red-800 sm:w-auto md:min-w-[250px] tracking-tight border border-red-900/20"
            >
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-red-900 to-red-700 opacity-0 blur-xl transition-opacity duration-300 group-hover:opacity-30 -z-10" />

              <AnimatePresence>
                {isHovered && (
                  <>
                    <motion.span 
                      initial={{ opacity: 0, scale: 0 }}
                      animate={{ opacity: 1, scale: 1, x: -12, y: -22 }}
                      exit={{ opacity: 0, scale: 0 }}
                      className="absolute left-4 top-2 text-red-200 text-xs pointer-events-none"
                    >
                      ✦
                    </motion.span>
                    <motion.span 
                      initial={{ opacity: 0, scale: 0 }}
                      animate={{ opacity: 1, scale: 1, x: 18, y: 22 }}
                      exit={{ opacity: 0, scale: 0 }}
                      className="absolute right-6 bottom-1 text-red-200 text-xs pointer-events-none"
                    >
                      ♥️
                    </motion.span>
                  </>
                )}
              </AnimatePresence>

              <span className="relative z-10">Give Quick Donation</span>
              
              <motion.div
                animate={isHovered ? { x: 5 } : { x: 0 }}
                transition={{ type: "spring", stiffness: 300, damping: 10 }}
              >
                <ArrowRight className="h-5 w-5 stroke-[2.5px]" />
              </motion.div>
            </motion.button>
          </div>
        </div>

      </div>
    </div>
  )
}

function BloodRemindersCard({ activeCount }) {
  const complianceData = [
    { title: 'Edhi Core Blood Bank Requests', value: activeCount > 0 ? 'Urgent Need' : 'Stable', alert: activeCount > 0 },
    { title: 'Stray Animal Shelter Food Supplies', value: 'Low Stock', alert: true },
    { title: 'Weekly Community Food Drive Packets', value: 'Ready to Ship', alert: false, stable: true },
    { title: 'Volunteer Team Distribution Schedule', value: '4 Teams Active', alert: false, active: true },
  ]

  return (
    <div className="rounded-2xl border border-red-900/10 bg-white p-5 shadow-sm space-y-4">
      <img 
        src="https://images.unsplash.com/photo-1615461066841-6116e61058f4?auto=format&fit=crop&q=80&w=600" 
        alt="Hospital medical blood bank collection and screening unit setup" 
        className="h-44 w-full rounded-xl object-cover bg-stone-100 border border-stone-100 shadow-inner"
      />
      <div className="space-y-2.5">
        {complianceData.map((item, idx) => (
          <div key={idx} className="flex items-center justify-between rounded-xl border border-red-900/5 bg-red-50/20 p-3.5 text-xs">
            <span className="font-bold text-stone-700">{item.title}</span>
            <span className={`font-mono text-[10px] font-bold px-2.5 py-0.5 rounded border
              ${item.alert ? 'bg-red-900/10 text-red-950 border-red-900/20' : ''}
              ${item.stable ? 'bg-stone-100 text-stone-700 border-stone-200' : ''}
              ${item.active ? 'bg-red-50 text-red-950 border-red-200/50' : ''}
              ${!item.alert && !item.stable && !item.active ? 'bg-stone-100 text-stone-500 border-stone-200' : ''}
            `}>
              {item.value}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}

function DashboardSkeleton() {
  return (
    <div className="min-h-screen bg-white p-6 md:p-10 animate-pulse">
      <div className="mx-auto max-w-[1600px] grid gap-8 xl:grid-cols-[280px_1fr]">
        <div className="h-[500px] rounded-2xl bg-stone-100 hidden xl:block" />
        <div className="space-y-6">
          <div className="h-10 w-1/3 rounded-lg bg-stone-100" />
          <div className="h-64 rounded-3xl bg-stone-100/80" />
          <div className="grid gap-6 md:grid-cols-2">
            <div className="h-56 rounded-2xl bg-stone-100/60" />
            <div className="h-56 rounded-2xl bg-stone-100/60" />
          </div>
        </div>
      </div>
    </div>
  )
}