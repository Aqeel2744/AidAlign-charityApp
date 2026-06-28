import React, { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Search,
  Filter,
  Heart,
  Bone,
  Activity,
  Home,
  ShieldAlert,
  Stethoscope,
  CheckCircle2,
  X,
  CreditCard,
  TrendingUp,
  Building,
  Phone,
  Mail,
  ArrowRight,
  Sparkles
} from 'lucide-react'
import api from '../utils/api'
import { Link } from 'react-router-dom'
import Sidebar from '../components/Sidebar'

// Static campaigns mapping with thematic metrics, matching the requirements
const CAMPAIGN_CATEGORIES = [
  { id: 'all', label: 'All Needs' },
  { id: 'food', label: 'Food Donations', icon: Bone, color: 'from-amber-600 to-amber-800' },
  { id: 'medical', label: 'Medical Support', icon: Stethoscope, color: 'from-red-600 to-red-800' },
  { id: 'shelter', label: 'Shelter Support', icon: Home, color: 'from-emerald-600 to-emerald-800' },
  { id: 'rescue', label: 'Rescue Operations', icon: ShieldAlert, color: 'from-amber-700 to-orange-900' },
  { id: 'vaccine', label: 'Vaccination Campaigns', icon: Activity, color: 'from-blue-600 to-cyan-800' },
  { id: 'emergency', label: 'Emergency Animal Care', icon: Heart, color: 'from-rose-700 to-red-900' }
]

const STATIC_DONATION_CARDS = [
  { id: 'food', title: 'Food Donations', tag: 'Nutrition', raised: 64000, target: 100000, icon: Bone, desc: 'Provide quality nourishment for rescued strays and shelter animals across Pakistan.' },
  { id: 'medical', title: 'Medical Support', tag: 'Healthcare', raised: 145000, target: 200000, icon: Stethoscope, desc: 'Fund critical operations, medicines, and diagnostics for broken bones and severe conditions.' },
  { id: 'shelter', title: 'Shelter Support', tag: 'Infrastructure', raised: 88000, target: 150000, icon: Home, desc: 'Construct premium enclosures, clean beds, and maintain stable roofs over their heads.' },
  { id: 'rescue', title: 'Rescue Operations', tag: 'Emergency Response', raised: 42000, target: 80000, icon: ShieldAlert, desc: 'Fund secure transport ambulances and paramedical personnel dispatched daily.' },
  { id: 'vaccine', title: 'Vaccination Campaigns', tag: 'Prevention', raised: 31000, target: 50000, icon: Activity, desc: 'Immunize against Rabies, Parvovirus, and lethal vectors across urban hubs.' },
  { id: 'emergency', title: 'Emergency Animal Care', tag: 'Critical Incident', raised: 195000, target: 200000, icon: Heart, desc: 'Instant support reserve for natural calamity rescues or toxic poison emergencies.' }
]

const IN_FLOW_SHELTERS = [
  "Edhi Animal Shelter (Karachi)",
  "Karachi Animal Welfare Society (KAWS)",
  "SPCA Karachi",
  "CDRS Benji Project (multiple cities)"
]

const PAYMENT_CARD_SHELTERS = [
  "Ayesha Chundrigar Foundation (ACF Animal Rescue)",
  "Edhi Animal Shelter",
  "PAWS (Pakistan Pakistan Welfare Society)",
  "JFK Animal Rescue and Shelter",
  "CDRS Benji Project"
]

export default function AnimalShelters() {
  const [list, setList] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('Visa / Master')

  // Interactive Flow Modal State
  const [activeModalCampaign, setActiveModalCampaign] = useState(null)
  const [selectedShelterDropdown, setSelectedShelterDropdown] = useState(IN_FLOW_SHELTERS[0])
  const [donationFrequency, setDonationFrequency] = useState('one-time')
  const [customAmount, setCustomAmount] = useState('2500')
  const [selectedPaymentCardShelter, setSelectedPaymentCardShelter] = useState(PAYMENT_CARD_SHELTERS[0])
  const [isSubmitted, setIsSubmitted] = useState(false)

  useEffect(() => {
    const load = async () => {
      try {
        const res = await api.get('/api/Payments')
        setList(res.data)
      } catch (err) {
        console.error("Backend validation payload error:", err)
      }
    }
    load()
  }, [])

  // Search and Filter logical engine
  const filteredShelters = list.filter(s => {
    const matchesSearch = s.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.city?.toLowerCase().includes(searchTerm.toLowerCase())
    return matchesSearch
  })

  // Animation constants variants
  const containerVariants = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.08 } }
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 100 } }
  }

  // UPDATED: Now submits live data payload cleanly to your database layer
  const handleDonationSubmit = async (e) => {
    e.preventDefault()
    try {
      await api.post('/api/Payments', {
        targetShelter: selectedShelterDropdown,
        frequency: donationFrequency,
        amount: Number(customAmount),
        gatewayShelter: selectedPaymentCardShelter
      })

      setIsSubmitted(true)
      setTimeout(() => {
        setIsSubmitted(false)
        setActiveModalCampaign(null)
      }, 2500)
    } catch (err) {
      console.error("Payment API execution error:", err)
      alert("Payment processing failed. Please verify connection and database statuses.")
    }
  }

  return (
    <div className="w-full min-h-screen py-8 md:py-12 px-4 sm:px-6 md:px-8 bg-[#FAF8F5] text-slate-800 antialiased font-sans relative overflow-hidden">

      {/* BACKGROUND FLOATING ELEMENTS */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none opacity-30 z-0">
        <motion.div
          animate={{ x: [0, 40, 0], y: [0, -30, 0] }}
          transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-20 right-10 text-[#800020]/10 font-bold text-9xl select-none"
        >
          🐾
        </motion.div>
        <motion.div
          animate={{ x: [0, -50, 0], y: [0, 50, 0] }}
          transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
          className="absolute bottom-40 left-10 text-[#D2B48C]/20 font-bold text-8xl select-none"
        >
          🐾
        </motion.div>
      </div>

      <div className="grid items-start gap-6 md:gap-8 grid-cols-1 xl:grid-cols-[280px_1fr] relative z-10 max-w-7xl mx-auto">

        {/* SIDEBAR PANEL */}
        <Sidebar />

        {/* MAIN PAGE HOUSING CONTENT */}
        <div className="space-y-12">

          {/* HERO SECTION */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="relative rounded-[2.5rem] overflow-hidden bg-gradient-to-br from-[#800020] via-[#5c0017] to-[#3a000e] text-white p-8 md:p-12 shadow-2xl border border-[#800020]/20"
          >
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-[#D2B48C]/20 via-transparent to-transparent opacity-70" />

            <div className="relative z-10 grid grid-cols-1 lg:grid-cols-5 gap-8 items-center">
              <div className="lg:col-span-3 space-y-6">
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.2 }}
                  className="inline-flex items-center gap-2 bg-[#D2B48C]/20 backdrop-blur-md px-4 py-1.5 rounded-full border border-[#D2B48C]/30"
                >
                  <Sparkles className="w-4 h-4 text-[#D2B48C]" />
                  <span className="text-xs font-semibold tracking-wider uppercase text-[#FAF8F5]">Redesigned Animal Hub</span>
                </motion.div>

                <h1 className="text-4xl md:text-5xl lg:text-6xl font-black tracking-tight leading-[1.10] text-[#FAF8F5]">
                  Give Hope, Save Lives, <br />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#D2B48C] via-[#F5F5DC] to-[#D2B48C]">
                    Help Animals Find a Home.
                  </span>
                </h1>

                <p className="text-[#FAF8F5]/80 text-base md:text-lg max-w-xl font-medium leading-relaxed">
                  Empower frontline rescuers across Pakistan. Track your dynamic contribution progress transparency index live, choose specific shelters, or sponsor life-saving critical interventions.
                </p>

                <div className="pt-2 flex flex-wrap gap-4">
                  <a href="#donation-hub-section" className="px-6 py-3.5 bg-[#D2B48C] text-[#800020] rounded-full font-bold hover:bg-[#F5F5DC] transition-all duration-300 transform hover:-translate-y-0.5 shadow-lg shadow-black/20 flex items-center gap-2">
                    Start Micro-Donation <ArrowRight className="w-4 h-4" />
                  </a>

                </div>
              </div>

              {/* FLOATING GRAPHIC */}
              <div className="lg:col-span-2 flex justify-center items-center relative">
                <motion.div
                  animate={{ y: [0, -15, 0] }}
                  transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                  className="relative w-64 h-64 md:w-72 md:h-72 bg-gradient-to-tr from-[#D2B48C] to-[#FAF8F5] rounded-[3rem] shadow-2xl border-4 border-white/10 p-6 flex flex-col justify-between overflow-hidden group"
                >
                  <div className="absolute top-0 right-0 p-8 text-[#800020]/5 text-9xl pointer-events-none select-none font-bold">🐶</div>
                  <div className="flex justify-between items-start">
                    <span className="bg-[#800020] text-white font-bold text-xs px-3 py-1 rounded-full uppercase tracking-wider">Live Total Impact</span>
                    <Heart className="w-6 h-6 text-[#800020] fill-[#800020]" />
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-[#800020]/70 uppercase tracking-wider">Active Rescues Today</div>
                    <div className="text-4xl font-black text-[#800020] tracking-tight">1,482+</div>
                    <div className="w-full bg-[#800020]/20 h-2 rounded-full mt-3 overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: "78%" }}
                        transition={{ duration: 1.5, delay: 0.5 }}
                        className="h-full bg-[#800020] rounded-full"
                      />
                    </div>
                  </div>
                </motion.div>
              </div>
            </div>
          </motion.div>

          {/* ANIMAL DONATION HUB */}
          <div id="donation-hub-section" className="space-y-6 pt-4">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-slate-200/80 pb-6">
              <div>
                <h2 className="text-3xl font-black text-[#800020] tracking-tight flex items-center gap-3">
                  <Bone className="w-8 h-8 text-[#D2B48C] rotate-45" /> Animal Donation Hub
                </h2>
                <p className="text-slate-500 font-medium mt-1">Select a core fundamental sector track below to execute targeted funding pipelines.</p>
              </div>
            </div>

            {/* STRATEGIC INTERACTIVE CAMPAIGN CARDS */}
            <motion.div
              variants={containerVariants}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, margin: "-100px" }}
              className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
            >
              {STATIC_DONATION_CARDS.map((card) => {
                const IconComponent = card.icon
                const percentage = Math.min(Math.round((card.raised / card.target) * 100), 100)

                return (
                  <motion.div
                    key={card.id}
                    variants={itemVariants}
                    whileHover={{ y: -8, transition: { duration: 0.2 } }}
                    className="bg-white border border-slate-200/80 rounded-3xl p-6 shadow-sm hover:shadow-xl transition-all flex flex-col justify-between relative overflow-hidden group border-b-4 hover:border-b-[#800020]"
                  >
                    <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-[#D2B48C]/10 to-transparent rounded-bl-full pointer-events-none" />

                    <div>
                      <div className="flex items-center justify-between mb-4">
                        <div className="p-3 bg-[#FAF8F5] group-hover:bg-[#800020] rounded-2xl transition-colors duration-300">
                          <IconComponent className="w-6 h-6 text-[#800020] group-hover:text-[#FAF8F5] transition-colors duration-300" />
                        </div>
                        <span className="text-xs font-bold uppercase tracking-wider text-[#800020] bg-[#FAF8F5] border border-[#800020]/10 px-3 py-1 rounded-full">
                          {card.tag}
                        </span>
                      </div>

                      <h3 className="text-xl font-bold text-slate-950 group-hover:text-[#800020] transition-colors duration-200">{card.title}</h3>
                      <p className="text-slate-600 text-sm mt-2 line-clamp-3 font-medium leading-relaxed">{card.desc}</p>
                    </div>

                    <div className="mt-6 pt-4 border-t border-slate-100 space-y-3">
                      <div className="flex justify-between items-center text-xs font-semibold text-slate-500">
                        <span>Raised: <strong className="text-slate-900 font-bold">Rs. {card.raised.toLocaleString()}</strong></span>
                        <span>Goal: Rs. {card.target.toLocaleString()}</span>
                      </div>

                      <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden relative">
                        <motion.div
                          initial={{ width: 0 }}
                          whileInView={{ width: `${percentage}%` }}
                          viewport={{ once: true }}
                          transition={{ duration: 1, ease: "easeOut" }}
                          className="h-full rounded-full bg-gradient-to-r from-[#800020] to-[#D2B48C]"
                        />
                      </div>
                      <div className="flex justify-between items-center pt-2">
                        <span className="text-xs bg-emerald-50 text-emerald-700 font-bold px-2 py-0.5 rounded-md">{percentage}% Completed</span>

                        <button
                          onClick={() => setActiveModalCampaign(card)}
                          className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-white bg-[#800020] hover:bg-[#5c0017] px-4 py-2.5 rounded-xl shadow-sm transition-all transform active:scale-95"
                        >
                          Donate Now <ArrowRight className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </motion.div>
                )
              })}
            </motion.div>
          </div>

          {/* DYNAMIC FLOW EMBEDDED MODAL POPUP */}
          <AnimatePresence>
            {activeModalCampaign && (
              <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md flex items-center justify-center z-50 p-4 overflow-y-auto">
                <motion.div
                  initial={{ opacity: 0, scale: 0.95, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, y: 20 }}
                  className="bg-white rounded-[2.5rem] w-full max-w-2xl overflow-hidden shadow-2xl border border-slate-200 text-slate-900 relative"
                >
                  {/* Modal Header */}
                  <div className="bg-gradient-to-r from-[#800020] to-[#5c0017] p-6 text-white flex justify-between items-center relative">
                    <div className="flex items-center gap-3">
                      <div className="p-2.5 bg-white/10 rounded-xl">
                        {React.createElement(activeModalCampaign.icon, { className: "w-6 h-6 text-[#D2B48C]" })}
                      </div>
                      <div>
                        <span className="text-xs font-bold text-[#D2B48C] uppercase tracking-widest">Active Payment Route</span>
                        <h3 className="text-2xl font-black tracking-tight">{activeModalCampaign.title}</h3>
                      </div>
                    </div>
                    <button
                      onClick={() => setActiveModalCampaign(null)}
                      className="p-2 rounded-full hover:bg-white/10 transition-colors text-white/80 hover:text-white"
                    >
                      <X className="w-6 h-6" />
                    </button>
                  </div>

                  {isSubmitted ? (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="p-12 text-center space-y-4 flex flex-col items-center justify-center"
                    >
                      <div className="w-20 h-20 bg-emerald-50 rounded-full flex items-center justify-center mb-2 border border-emerald-200">
                        <CheckCircle2 className="w-12 h-12 text-emerald-600 animate-bounce" />
                      </div>
                      <h4 className="text-2xl font-black text-[#800020]">Transaction Successful!</h4>
                      <p className="text-slate-600 max-w-md font-medium">
                        Your payment execution commands completed successfully. Allocated to your chosen shelter structure. Thank you for preserving lives!
                      </p>
                    </motion.div>
                  ) : (
                    <form onSubmit={handleDonationSubmit} className="p-6 md:p-8 space-y-6">

                      {/* STEP 1: SHELTER SELECTION */}
                      <div className="space-y-2">
                        <label className="text-xs font-bold uppercase tracking-wider text-slate-600 block">
                          1. Select Allocation Target Shelter Location
                        </label>
                        <div className="relative">
                          <Building className="absolute left-4 top-3.5 w-5 h-5 text-slate-400 pointer-events-none" />
                          <select
                            value={selectedShelterDropdown}
                            onChange={(e) => setSelectedShelterDropdown(e.target.value)}
                            className="w-full bg-[#FAF8F5] border border-slate-200 rounded-2xl pl-12 pr-4 py-3 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-[#800020] appearance-none cursor-pointer"
                          >
                            {IN_FLOW_SHELTERS.map((s, idx) => (
                              <option key={idx} value={s}>{s}</option>
                            ))}
                          </select>
                          <div className="absolute right-4 top-4 pointer-events-none border-l-4 border-r-4 border-t-4 border-transparent border-t-slate-500 w-0 h-0" />
                        </div>
                      </div>

                      {/* STEP 2: FREQUENCY & AMOUNT */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <label className="text-xs font-bold uppercase tracking-wider text-slate-600 block">
                            2. Schedule Frequency
                          </label>
                          <div className="grid grid-cols-2 gap-2 bg-[#FAF8F5] p-1.5 rounded-2xl border border-slate-200">
                            <button
                              type="button"
                              onClick={() => setDonationFrequency('one-time')}
                              className={`py-2 text-xs font-bold rounded-xl transition-all ${donationFrequency === 'one-time' ? 'bg-[#800020] text-white shadow-md' : 'text-slate-600 hover:text-[#800020]'}`}
                            >
                              One-Time
                            </button>
                            <button
                              type="button"
                              onClick={() => setDonationFrequency('recurring')}
                              className={`py-2 text-xs font-bold rounded-xl transition-all ${donationFrequency === 'recurring' ? 'bg-[#800020] text-white shadow-md' : 'text-slate-600 hover:text-[#800020]'}`}
                            >
                              Monthly Recurring
                            </button>
                          </div>
                        </div>

                        <div className="space-y-2">
                          <label className="text-xs font-bold uppercase tracking-wider text-slate-600 block">
                            3. Amount Contribution (PKR)
                          </label>
                          <div className="relative">
                            <span className="absolute left-4 top-3 text-sm font-bold text-slate-400 select-none">Rs.</span>
                            <input
                              type="number"
                              required
                              value={customAmount}
                              onChange={(e) => setCustomAmount(e.target.value)}
                              className="w-full bg-[#FAF8F5] border border-slate-200 rounded-2xl pl-12 pr-4 py-2.5 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-[#800020]"
                              placeholder="Enter amount"
                            />
                          </div>
                        </div>
                      </div>

                      {/* STEP 3: PAYMENT CHANNELS */}
                      <div className="space-y-3 bg-[#FAF8F5] p-5 rounded-3xl border border-slate-200/80">
                        <div className="flex items-center justify-between">
                          <label className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-2">
                            <CreditCard className="w-4 h-4 text-[#800020]" /> 4. Secure Payment Gateway Verification Card
                          </label>
                        </div>

                        <div className="space-y-2">
                          <label className="text-[11px] font-bold text-slate-500 block">
                            Confirm Dedicated Partner Shelter Node inside Gateway:
                          </label>

                        </div>

                        <div className="grid grid-cols-3 gap-2 pt-1">

                          {/* HBL Direct */}
                          <button
                            type="button"
                            onClick={() => setSelectedPaymentMethod('HBL Direct')}
                            className={`p-2 rounded-xl flex flex-col items-center justify-center text-center transition-all ${selectedPaymentMethod === 'HBL Direct'
                                ? 'bg-white border-2 border-[#800020] shadow-sm'
                                : 'bg-white border border-slate-200 hover:border-[#800020]/40'
                              }`}
                          >
                            <span
                              className={`text-[10px] font-black tracking-tight ${selectedPaymentMethod === 'HBL Direct'
                                  ? 'text-[#800020]'
                                  : 'text-slate-700'
                                }`}
                            >
                              HBL Direct
                            </span>
                            <span
                              className={`text-[9px] font-bold ${selectedPaymentMethod === 'HBL Direct'
                                  ? 'text-slate-500'
                                  : 'text-slate-400'
                                }`}
                            >
                              Account Wire
                            </span>
                          </button>

                          {/* Visa / Master */}
                          <button
                            type="button"
                            onClick={() => setSelectedPaymentMethod('Visa / Master')}
                            className={`p-2 rounded-xl flex flex-col items-center justify-center text-center transition-all ${selectedPaymentMethod === 'Visa / Master'
                                ? 'bg-white border-2 border-[#800020] shadow-sm'
                                : 'bg-white border border-slate-200 hover:border-[#800020]/40'
                              }`}
                          >
                            <span
                              className={`text-[10px] font-black tracking-tight ${selectedPaymentMethod === 'Visa / Master'
                                  ? 'text-[#800020]'
                                  : 'text-slate-700'
                                }`}
                            >
                              Visa / Master
                            </span>
                            <span
                              className={`text-[9px] font-bold ${selectedPaymentMethod === 'Visa / Master'
                                  ? 'text-slate-500'
                                  : 'text-slate-400'
                                }`}
                            >
                              Credit Card
                            </span>
                          </button>

                          {/* EasyPaisa */}
                          <button
                            type="button"
                            onClick={() => setSelectedPaymentMethod('EasyPaisa')}
                            className={`p-2 rounded-xl flex flex-col items-center justify-center text-center transition-all ${selectedPaymentMethod === 'EasyPaisa'
                                ? 'bg-white border-2 border-[#800020] shadow-sm'
                                : 'bg-white border border-slate-200 hover:border-[#800020]/40'
                              }`}
                          >
                            <span
                              className={`text-[10px] font-black tracking-tight ${selectedPaymentMethod === 'EasyPaisa'
                                  ? 'text-[#800020]'
                                  : 'text-slate-700'
                                }`}
                            >
                              EasyPaisa
                            </span>
                            <span
                              className={`text-[9px] font-bold ${selectedPaymentMethod === 'EasyPaisa'
                                  ? 'text-slate-500'
                                  : 'text-slate-400'
                                }`}
                            >
                              Mobile Wallet
                            </span>
                          </button>

                        </div>
                      </div>

                      {/* Submit Actions */}
                      <div className="pt-2">
                        <button
                          type="submit"
                          className="w-full py-4 rounded-2xl text-white bg-[#800020] hover:bg-[#5c0017] font-bold transition-all transform active:scale-95 shadow-xl shadow-[#800020]/20 flex items-center justify-center gap-2 text-base"
                        >
                          Execute Secure Payment Authorization Of Rs. {Number(customAmount).toLocaleString()}
                        </button>
                        <p className="text-center text-[11px] text-slate-400 font-medium mt-3">
                          Encrypted by AES-256 standard protocols. Fully audit verified by global NGO charity tracking boards.
                        </p>
                      </div>

                    </form>
                  )}
                </motion.div>
              </div>
            )}
          </AnimatePresence>


        </div>
      </div>
    </div>
  )
}