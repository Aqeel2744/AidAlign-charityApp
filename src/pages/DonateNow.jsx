import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  GraduationCap, Heart, Home, Users, Flame, Shield, 
  Droplet, Utensils, Hand, Baby, Accessibility, TreePine, 
  Building2, Coins, HelpCircle, CheckCircle2, X, CreditCard, 
  DollarSign, Activity, Globe, Award, Search, Check, 
  ChevronsUpDown, ArrowRight, Wallet, ArrowUpRight, TrendingUp, Calendar, Filter,
  Menu
} from 'lucide-react';
import api from '../utils/api';
import Sidebar from '../components/Sidebar';

// Constants kept perfectly matching original data structures
const STATS_CARDS = [
  { id: 1, label: 'Total Donations', value: 'Rs. 45M+', icon: DollarSign, color: 'from-amber-500/10 to-orange-500/10' },
  { id: 2, label: 'People Helped', value: '120,000+', icon: Users, color: 'from-emerald-500/10 to-teal-500/10' },
  { id: 3, label: 'Active Campaigns', value: '15 Zones', icon: Activity, color: 'from-blue-500/10 to-indigo-500/10' },
  { id: 4, label: 'Partner Orgs', value: '9 Trusted', icon: Award, color: 'from-purple-500/10 to-pink-500/10' },
];

const DONATION_CATEGORIES = [
  { id: 'education', title: 'Education', icon: GraduationCap, description: 'Empower minds through textbooks, student scholarships, and institutional resources.', progress: 78 },
  { id: 'healthcare', title: 'Healthcare', icon: Heart, description: 'Provide life-saving emergency medical equipment, testing kits, and critical operational support.', progress: 92 },
  { id: 'orphanage', title: 'Orphanage Support', icon: Home, description: 'Secure warm meals, premium education, safe shelters, and protection uniforms.', progress: 64 },
  { id: 'oldage', title: 'Old Age Homes', icon: Shield, description: 'Offer specialized geriatric therapy packages, structural nursing assets, and hot meals.', progress: 45 },
  { id: 'disaster', title: 'Disaster Relief & Emergency Response', icon: Flame, description: 'Deploy immediate flash-flood relief operations, medical tents, and essential food items.', progress: 95 },
  { id: 'community', title: 'Community Services', icon: Globe, description: 'Develop infrastructure upgrades, low-cost microfinance avenues, and shared public spaces.', progress: 51 },
  { id: 'water', title: 'Water Projects', icon: Droplet, description: 'Construct deep-well clean solar extraction points and water treatment pipelines.', progress: 87 },
  { id: 'food', title: 'Food Distribution', icon: Utensils, description: 'Finance immediate grocery rashan packs and daily community kitchen programs.', progress: 83 },
  { id: "women", title: "Women's Empowerment", icon: Hand, description: 'Fund tailored technical micro-grants, training equipment, and legal counseling networks.', progress: 60 },
  { id: 'child', title: 'Child Welfare', icon: Baby, description: 'Eliminate juvenile street labor through strict nourishment stipends and healthcare initiatives.', progress: 72 },
  { id: 'disability', title: 'Disability Support', icon: Accessibility, description: 'Provide customized mechanical wheelchairs, speech-therapy infrastructure, and job assistance.', progress: 39 },
  { id: 'environmental', title: 'Environmental Projects', icon: TreePine, description: 'Expand metropolitan tree plantation initiatives and modern recycling centers.', progress: 55 },
  { id: 'mosque', title: 'Mosque & Community Development', icon: Building2, description: 'Facilitate standard maintenance upgrades, water supplies, and operational utility needs.', progress: 68 },
  { id: 'zakat', title: 'Zakat & Sadaqah Programs', icon: Coins, description: 'Ensure full operational transparency across vetted global standard distributions.', progress: 100 },
  { id: 'other', title: 'Other Causes', icon: HelpCircle, description: 'Address ad-hoc survival situations needing urgent operational support.', progress: 40 },
];

const ALL_ORGANIZATIONS = [
  'Edhi Foundation', 'Saylani Welfare International Trust', 'Chhipa Welfare Association',
  'Akhuwat Foundation', 'Al-Khidmat Foundation Pakistan', 'Alamgir Welfare Trust',
  'JDC Foundation', 'Shaukat Khanum Memorial Trust', 'The Citizens Foundation (TCF)'
];

const MAP_CATEGORY_TO_ORGS = {
  education: ['The Citizens Foundation (TCF)', 'Akhuwat Foundation', 'Saylani Welfare International Trust'],
  healthcare: ['Shaukat Khanum Memorial Trust', 'Edhi Foundation', 'Chhipa Welfare Association'],
  orphanage: ['Edhi Foundation', 'Saylani Welfare International Trust', 'Al-Khidmat Foundation Pakistan'],
  oldage: ['Edhi Foundation', 'Chhipa Welfare Association', 'Alamgir Welfare Trust'],
  disaster: ['Edhi Foundation', 'JDC Foundation', 'Al-Khidmat Foundation Pakistan'],
  community: ['JDC Foundation', 'Alamgir Welfare Trust', 'Saylani Welfare International Trust'],
  water: ['Al-Khidmat Foundation Pakistan', 'Saylani Welfare International Trust'],
  food: ['Saylani Welfare International Trust', 'JDC Foundation', 'Edhi Foundation'],
  women: ['Akhuwat Foundation', 'Al-Khidmat Foundation Pakistan'],
  child: ['Edhi Foundation', 'The Citizens Foundation (TCF)', 'Saylani Welfare International Trust'],
  disability: ['Edhi Foundation', 'Chhipa Welfare Association'],
  environmental: ['Al-Khidmat Foundation Pakistan', 'JDC Foundation'],
  mosque: ['Edhi Foundation', 'Saylani Welfare International Trust', 'Al-Khidmat Foundation Pakistan'],
  zakat: ['Edhi Foundation', 'Saylani Welfare International Trust', 'Akhuwat Foundation'],
  other: ALL_ORGANIZATIONS
};

export default function DonateNowPage() {
  // Existing Hook Implementations
  const [activeModalCampaign, setActiveModalCampaign] = useState(null);
  const [selectedShelterDropdown, setSelectedShelterDropdown] = useState('');
  const [donationFrequency, setDonationFrequency] = useState('one-time');
  const [customAmount, setCustomAmount] = useState('');
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('Visa / Master');
  const [isSubmitted, setIsSubmitted] = useState(false);

  // New UX Control States
  const [searchQuery, setSearchQuery] = useState('');
  const [isComboOpen, setIsComboOpen] = useState(false);
  const [selectedCurrency, setSelectedCurrency] = useState('PKR');
  const [formNotes, setFormNotes] = useState('');
  const [txnId, setTxnId] = useState('');
  
  // Mobile Responsive Drawer Control
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  // Dynamic Organization Mapping Hook
  const activeOrganizations = useMemo(() => {
    if (!activeModalCampaign) return [];
    return MAP_CATEGORY_TO_ORGS[activeModalCampaign.id] || ALL_ORGANIZATIONS;
  }, [activeModalCampaign]);

  // Handle default selector assignment cleanly
  React.useEffect(() => {
    if (activeOrganizations.length > 0) {
      setSelectedShelterDropdown(activeOrganizations[0]);
    }
  }, [activeOrganizations]);

  // Filtered organizations list based on custom searchable criteria
  const filteredOrgs = useMemo(() => {
    return activeOrganizations.filter(org => 
      org.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [activeOrganizations, searchQuery]);

  // API submission keeping schema and hooks completely unaltered
  const handleDonationSubmit = async (e) => {
    e.preventDefault();
    if (!customAmount || Number(customAmount) <= 0) return;

    try {
      await api.post('/api/donations', {
        category: activeModalCampaign.title,
        organization: selectedShelterDropdown,
        amount: Number(customAmount),
        frequency: donationFrequency,
        paymentMethod: selectedPaymentMethod,
        status: 'Paid',
      });
      
      setTxnId(`TXN-${Math.floor(10000000 + Math.random() * 90000000)}`);
      setIsSubmitted(true);
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || 'Failed to complete processing donation route pipeline.');
    }
  };

  const closeDonationModal = () => {
    setActiveModalCampaign(null);
    setIsSubmitted(false);
    setCustomAmount('');
    setFormNotes('');
    setSearchQuery('');
  };

  return (
    <div className="flex min-h-screen bg-[#FDFBF7] text-slate-900 antialiased font-sans selection:bg-[#6B1F2A]/10 selection:text-[#6B1F2A] relative pt-16 lg:pt-0">
      
      {/* MOBILE DRAWER OVERLAY & SIDEBAR WRAPPER */}
      <AnimatePresence>
        {isMobileSidebarOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.4 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileSidebarOpen(false)}
              className="fixed inset-0 bg-slate-950 z-40 lg:hidden"
            />
            <motion.div 
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 220 }}
              className="fixed inset-y-0 left-0 w-[290px] bg-white z-50 p-6 shadow-2xl lg:hidden overflow-y-auto"
            >
              <div className="flex justify-end mb-4">
                <button onClick={() => setIsMobileSidebarOpen(false)} className="p-2 rounded-xl border border-slate-100 text-slate-700 hover:bg-slate-50">
                  <X size={18} />
                </button>
              </div>
              <Sidebar isMobile={true} />
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* FLOATING MOBILE MENU TRIGGER BUTTON */}
      <button 
        onClick={() => setIsMobileSidebarOpen(true)}
        className="fixed left-4 top-3.5 p-2 rounded-xl border border-slate-200/80 bg-white text-slate-700 lg:hidden hover:bg-slate-50 transition-colors z-30 shadow-sm"
      >
        <Menu size={18} />
      </button>

      {/* 1. SIDEBAR DESKTOP */}
      <div className="w-68 flex-shrink-0 hidden lg:block border-r border-amber-900/5 bg-white shadow-sm relative z-30">
        <Sidebar />
      </div>

      {/* Main Container */}
      <main className="flex-1 min-w-0 overflow-x-hidden pb-16">
        
        {/* 2. HERO BANNER SECTION */}
        <section className="relative overflow-hidden bg-gradient-to-b from-[#6B1F2A]/15 via-[#FAF6F0] to-[#FDFBF7] pt-12 pb-14 px-4 sm:px-8 lg:px-12">
          <div className="absolute inset-0 opacity-[0.02] mix-blend-overlay pointer-events-none bg-[radial-gradient(#6B1F2A_1px,transparent_1px)] [background-size:16px_16px]" />
          
          <div className="max-w-7xl mx-auto space-y-10 relative z-10">
            <div className="flex flex-col items-center text-center space-y-4">
              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }} 
                animate={{ opacity: 1, scale: 1 }} 
                transition={{ duration: 0.5 }}
                className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#6B1F2A]/10 border border-[#6B1F2A]/10 text-[#6B1F2A] text-xs font-semibold tracking-wide uppercase"
              >
                <span className="w-2 h-2 rounded-full bg-[#6B1F2A] animate-pulse" />
                International Transparency Standard Portal
              </motion.div>

              <motion.h1 
                initial={{ opacity: 0, y: 20 }} 
                animate={{ opacity: 1, y: 0 }} 
                transition={{ duration: 0.6, delay: 0.1 }}
                className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-slate-900 max-w-4xl leading-[1.15]"
              >
                Empower Communities, <br />
                <span className="text-[#6B1F2A] bg-gradient-to-r from-[#6B1F2A] to-[#8C2E3B] bg-clip-text text-transparent">Preserve Human Dignity</span>
              </motion.h1>

              <motion.p 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="text-slate-600 text-sm sm:text-base max-w-2xl font-medium"
              >
                Deploy real-time verified resources directly across secure tactical operational vectors to maximize societal change.
              </motion.p>
            </div>

            {/* Live Donation Statistics Component */}
            <motion.div 
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 max-w-6xl mx-auto pt-4"
            >
              {STATS_CARDS.map((stat) => (
                <motion.div 
                  key={stat.id} 
                  whileHover={{ y: -4, scale: 1.02 }}
                  className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex flex-col justify-between relative overflow-hidden group transition-all"
                >
                  <div className={`absolute inset-0 bg-gradient-to-br ${stat.color} opacity-40 group-hover:opacity-70 transition-opacity duration-300`} />
                  <div className="relative z-10 flex items-center justify-between w-full mb-3">
                    <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">{stat.label}</span>
                    <div className="w-8 h-8 rounded-lg bg-[#6B1F2A]/5 text-[#6B1F2A] flex items-center justify-center">
                      <stat.icon className="w-4 h-4" />
                    </div>
                  </div>
                  <div className="relative z-10">
                    <span className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">{stat.value}</span>
                    <div className="flex items-center gap-1 text-[11px] font-bold text-emerald-600 mt-1">
                      <TrendingUp className="w-3 h-3" />
                      <span>+14.2% verified increase</span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* 3. DONATION CAUSE CARDS SECTION */}
        <section className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-12 pt-8 pb-16">
          <div className="mb-8 flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-slate-100 pb-5">
            <div>
              <h2 className="text-2xl font-black tracking-tight text-slate-900">Select Strategic Sector</h2>
              <p className="text-xs sm:text-sm font-medium text-slate-500 mt-1">Direct targeted financial pipelines cleanly across active humanitarian goals.</p>
            </div>
            <div className="flex gap-2">
              <button className="px-4 py-2 text-xs font-bold bg-[#6B1F2A] text-white rounded-xl transition-all shadow-sm shadow-[#6B1F2A]/10">Active Causes</button>
              <button className="px-4 py-2 text-xs font-bold bg-white text-slate-600 border border-slate-200 rounded-xl hover:bg-slate-50 transition-all">Emergency Relief</button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {DONATION_CATEGORIES.map((category) => (
              <motion.div 
                key={category.id} 
                whileHover={{ y: -6, boxShadow: "0 20px 25px -5px rgb(107 31 42 / 0.04), 0 8px 10px -6px rgb(107 31 42 / 0.04)" }} 
                className="bg-white rounded-2xl border border-slate-200/60 shadow-sm hover:border-[#6B1F2A]/30 transition-all flex flex-col justify-between overflow-hidden relative group"
              >
                <div className="p-6 space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="w-11 h-11 rounded-xl bg-[#6B1F2A]/5 text-[#6B1F2A] flex items-center justify-center group-hover:bg-[#6B1F2A] group-hover:text-white transition-all duration-300 shadow-inner">
                      <category.icon className="w-5 h-5" />
                    </div>
                    <span className="text-[11px] font-bold px-2.5 py-1 rounded-md bg-amber-50 text-amber-800 border border-amber-100">Highly Critical</span>
                  </div>
                  
                  <div className="space-y-1">
                    <h3 className="text-lg font-bold tracking-tight text-slate-900 group-hover:text-[#6B1F2A] transition-colors">{category.title}</h3>
                    <p className="text-xs leading-relaxed text-slate-500 font-medium line-clamp-2">{category.description}</p>
                  </div>

                  {/* Core Progress Architecture Integration */}
                  <div className="space-y-1.5 pt-2">
                    <div className="flex justify-between text-[11px] font-bold text-slate-600">
                      <span>Fundraising Capacity</span>
                      <span className="text-[#6B1F2A]">{category.progress}%</span>
                    </div>
                    <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                      <motion.div 
                        initial={{ width: 0 }} 
                        animate={{ width: `${category.progress}%` }} 
                        transition={{ duration: 1, ease: "easeOut" }}
                        className="h-full bg-gradient-to-r from-[#6B1F2A] to-[#A63C4B] rounded-full" 
                      />
                    </div>
                  </div>
                </div>

                <div className="px-6 pb-6 pt-0">
                  <button 
                    onClick={() => setActiveModalCampaign(category)} 
                    className="w-full py-2.5 px-4 rounded-xl text-xs font-bold uppercase tracking-wider text-center bg-slate-50 text-slate-800 border border-slate-200 group-hover:bg-[#6B1F2A] group-hover:text-white group-hover:border-[#6B1F2A] transition-all duration-200 flex items-center justify-center gap-2"
                  >
                    <span>Initiate Donation</span>
                    <ArrowRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-all transform group-hover:translate-x-0.5" />
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* 4. METRICS ANALYTICS & RECENT FEED */}
        <section className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-12 pb-16 grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm lg:col-span-2 space-y-4">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">Metrics Analytics Track</h3>
                <p className="text-xs text-slate-500 font-medium">Monthly continuous aggregate giving flow indexes.</p>
              </div>
              <div className="flex gap-1.5 bg-slate-50 p-1 rounded-lg border border-slate-100">
                <button className="text-[10px] px-2 py-1 font-bold rounded bg-white text-[#6B1F2A] shadow-sm">6M</button>
                <button className="text-[10px] px-2 py-1 font-bold rounded text-slate-500">1Y</button>
              </div>
            </div>
            <div className="h-44 bg-gradient-to-b from-[#FAF6F0]/60 to-transparent rounded-xl border border-dashed border-slate-200 flex items-end justify-between p-4 relative overflow-hidden">
              <div className="absolute inset-0 flex items-center justify-center text-xs text-slate-400 font-medium gap-2">
                <Activity className="w-4 h-4 text-[#6B1F2A] animate-pulse" /> Live Verification Pipeline Active
              </div>
              {[40, 55, 48, 70, 85, 65, 95, 75, 110, 80, 90, 125].map((h, i) => (
                <div key={i} className="w-[6%] space-y-2 flex flex-col items-center group relative z-10">
                  <div style={{ height: `${h / 1.5}px` }} className="w-full bg-gradient-to-t from-[#6B1F2A] to-[#A63C4B] rounded-md opacity-85 group-hover:opacity-100 transition-opacity" />
                  <span className="text-[9px] font-bold text-slate-400">M{i+1}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm space-y-4">
            <div>
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">Live Activity Feed</h3>
              <p className="text-xs text-slate-500 font-medium">Real-time block stream metrics.</p>
            </div>
            <div className="space-y-3">
              {[
                { label: 'Anonymous', category: 'Healthcare', amount: 'Rs. 25,000', time: '2 mins ago' },
                { label: 'Zainab B.', category: 'Education Fund', amount: 'Rs. 5,000', time: '14 mins ago' },
                { label: 'K. Ahmed', category: 'Water Projects', amount: 'Rs. 150,000', time: '1 hr ago' },
              ].map((item, idx) => (
                <div key={idx} className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 border border-slate-100 text-xs">
                  <div className="flex items-center gap-2.5">
                    <div className="w-2 h-2 rounded-full bg-[#6B1F2A]" />
                    <div>
                      <p className="font-bold text-slate-800">{item.label}</p>
                      <p className="text-[10px] text-slate-500 font-medium">{item.category}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-black text-[#6B1F2A]">{item.amount}</p>
                    <p className="text-[10px] text-slate-400 font-medium">{item.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      {/* 5. REDESIGNED SHADCN STYLE INTERACTIVE MODAL OVERLAY */}
      <AnimatePresence>
        {activeModalCampaign && (
          <div className="fixed inset-0 bg-slate-950/40 backdrop-blur-sm flex items-center justify-center z-50 p-4 overflow-y-auto">
            <motion.div 
              initial={{ opacity: 0, scale: 0.98, y: 8 }} 
              animate={{ opacity: 1, scale: 1, y: 0 }} 
              exit={{ opacity: 0, scale: 0.98, y: 8 }} 
              transition={{ type: "spring", duration: 0.4 }}
              className="bg-white rounded-2xl w-full max-w-xl overflow-hidden shadow-2xl border border-slate-200 text-slate-900 relative"
            >
              {/* Modal Head Banner */}
              <div className="bg-gradient-to-r from-[#6B1F2A] to-[#4A131B] p-5 text-white flex justify-between items-center relative">
                <div className="space-y-0.5">
                  <span className="text-[10px] uppercase font-bold tracking-widest text-beige-300 opacity-70">Secure Sector Pipeline</span>
                  <h3 className="text-xl font-black tracking-tight flex items-center gap-2">
                    {activeModalCampaign.title} Support
                  </h3>
                </div>
                <button 
                  onClick={closeDonationModal} 
                  className="p-1.5 rounded-xl bg-white/5 hover:bg-white/10 transition-colors text-white/80 hover:text-white border border-white/10 shadow-sm"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {isSubmitted ? (
                /* Success Receipt UI Component */
                <motion.div 
                  initial={{ opacity: 0, scale: 0.95 }} 
                  animate={{ opacity: 1, scale: 1 }} 
                  className="p-8 text-center space-y-6 flex flex-col items-center justify-center bg-gradient-to-b from-amber-50/[0.15] to-transparent"
                >
                  <div className="w-16 h-16 bg-emerald-50 rounded-full flex items-center justify-center border border-emerald-100 shadow-sm">
                    <CheckCircle2 className="w-8 h-8 text-emerald-600" />
                  </div>
                  <div className="space-y-1">
                    <h4 className="text-xl font-black text-[#6B1F2A]">Secure Transaction Executed</h4>
                    <p className="text-xs text-slate-500 font-medium">Your global contribution routing profile record has updated cleanly.</p>
                  </div>

                  <div className="w-full bg-[#FAF6F0] rounded-xl border border-slate-200 p-5 text-left text-xs font-medium space-y-2.5 relative">
                    <div className="absolute top-0 inset-x-0 h-1 bg-[radial-gradient(#e2e8f0_1px,transparent_1px)] [background-size:4px_4px]" />
                    <div className="flex justify-between border-b border-dashed border-slate-200 pb-2">
                      <span className="text-slate-500">TRANSACTION ID</span>
                      <span className="font-mono font-bold text-slate-800 tracking-wider">{txnId}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">ALLOCATED CAUSE</span>
                      <span className="font-bold text-slate-800">{activeModalCampaign.title}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">BENEFICIARY VECTOR</span>
                      <span className="font-bold text-slate-800">{selectedShelterDropdown}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">ROUTING FREQUENCY</span>
                      <span className="font-bold capitalize text-slate-800">{donationFrequency}</span>
                    </div>
                    <div className="flex justify-between pt-2 border-t border-slate-200 text-sm">
                      <span className="font-bold text-slate-900">NET ROUTED AMOUNT</span>
                      <span className="font-black text-[#6B1F2A]">{selectedCurrency} {Number(customAmount).toLocaleString()}</span>
                    </div>
                  </div>

                  <button 
                    onClick={closeDonationModal} 
                    className="w-full py-2.5 rounded-xl text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 transition-all border border-slate-200"
                  >
                    Dismiss Transaction Receipt
                  </button>
                </motion.div>
              ) : (
                /* Primary Interactive Submission Form Layout */
                <form onSubmit={handleDonationSubmit} className="p-6 space-y-5">
                  
                  {/* Frequency Selector Row */}
                  <div className="space-y-2">
                    <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500 block">Donation Strategy Configuration</label>
                    <div className="grid grid-cols-3 gap-2 bg-slate-50 p-1 rounded-xl border border-slate-200">
                      {['one-time', 'monthly', 'annually'].map((type) => (
                        <button
                          key={type}
                          type="button"
                          onClick={() => setDonationFrequency(type)}
                          className={`py-1.5 px-3 rounded-lg text-xs font-bold capitalize transition-all ${
                            donationFrequency === type 
                              ? 'bg-[#6B1F2A] text-white shadow-sm' 
                              : 'text-slate-600 hover:bg-slate-200/50'
                          }`}
                        >
                          {type.replace('-', ' ')}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Searchable Combobox Integration */}
                  <div className="space-y-1.5 relative">
                    <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500 block">Target Organization Partner</label>
                    <button
                      type="button"
                      onClick={() => setIsComboOpen(!isComboOpen)}
                      className="w-full bg-[#FAF6F0]/50 border border-slate-200 rounded-xl p-3 text-xs font-bold flex items-center justify-between shadow-sm hover:bg-[#FAF6F0] transition-all text-left"
                    >
                      <span className="truncate">{selectedShelterDropdown || "Select dynamic vendor asset..."}</span>
                      <Check className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                    </button>

                    {isComboOpen && (
                      <div className="absolute w-full mt-1 bg-white border border-slate-200 rounded-xl shadow-xl z-50 max-h-48 overflow-y-auto overflow-x-hidden p-1.5 space-y-1">
                        <div className="flex items-center gap-2 px-2.5 py-1.5 bg-slate-50 border border-slate-100 rounded-lg mb-1">
                          <Search className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                          <input 
                            type="text" 
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Search vector pool database..." 
                            className="w-full bg-transparent outline-none border-none text-xs text-slate-800 placeholder-slate-400 font-medium"
                          />
                        </div>
                        {filteredOrgs.length === 0 ? (
                          <div className="text-[11px] text-slate-400 py-3 text-center font-medium">No valid organization index resolved.</div>
                        ) : (
                          filteredOrgs.map((org, idx) => (
                            <button
                              key={idx}
                              type="button"
                              onClick={() => {
                                setSelectedShelterDropdown(org);
                                setIsComboOpen(false);
                              }}
                              className="w-full text-left px-2.5 py-2 rounded-lg text-xs font-medium text-slate-700 hover:bg-[#6B1F2A]/5 hover:text-[#6B1F2A] transition-all flex items-center justify-between"
                            >
                              <span className="truncate">{org}</span>
                              {selectedShelterDropdown === org && <Check className="w-3.5 h-3.5 text-[#6B1F2A]" />}
                            </button>
                          ))
                        )}
                      </div>
                    )}
                  </div>

                  {/* Dual Currency & Custom Amount Inputs */}
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500 block">Strategic Injection Quantum</label>
                    <div className="relative flex items-stretch rounded-xl shadow-sm border border-slate-200 overflow-hidden bg-white">
                      <select 
                        value={selectedCurrency}
                        onChange={(e) => setSelectedCurrency(e.target.value)}
                        className="bg-slate-50 border-r border-slate-200 px-3 text-xs font-bold text-slate-700 outline-none select-none"
                      >
                        <option>PKR</option>
                        <option>USD</option>
                        <option>EUR</option>
                        <option>GBP</option>
                      </select>
                      <input 
                        type="number" 
                        required 
                        min="1"
                        value={customAmount} 
                        onChange={(e) => setCustomAmount(e.target.value)} 
                        className="w-full px-3 py-2.5 text-sm font-bold tracking-wide outline-none text-slate-900 placeholder-slate-300" 
                        placeholder="Enter verified value amount" 
                      />
                    </div>
                    {customAmount && Number(customAmount) <= 0 && (
                      <span className="text-[10px] font-bold text-rose-600 block transition-all">Quantum input amount parameter must exceed 0 limits.</span>
                    )}
                  </div>

                  {/* Interactive Gateway Array Framework */}
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500 block">Gateway Procurement Network</label>
                    <div className="grid grid-cols-3 gap-2.5">
                      {[
                        { id: 'Visa / Master', title: 'Credit Card', sub: 'Global' },
                        { id: 'Bank Transfer', title: 'Direct Wire', sub: 'Swift' },
                        { id: 'EasyPaisa / JazzCash', title: 'Mobile Wallet', sub: 'Instant' }
                      ].map((gateway) => (
                        <button
                          key={gateway.id}
                          type="button"
                          onClick={() => setSelectedPaymentMethod(gateway.id)}
                          className={`p-3 rounded-xl border text-left flex flex-col justify-between transition-all relative overflow-hidden ${
                            selectedPaymentMethod === gateway.id
                              ? 'border-[#6B1F2A] bg-[#6B1F2A]/5 text-[#6B1F2A]'
                              : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                          }`}
                        >
                          <span className="text-[11px] font-bold block truncate">{gateway.title}</span>
                          <span className="text-[9px] font-medium text-slate-400 block tracking-wider uppercase mt-1">{gateway.sub}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  <button 
                    type="submit" 
                    className="w-full py-3 rounded-xl text-xs font-bold uppercase tracking-wider text-center text-white bg-gradient-to-r from-[#6B1F2A] to-[#8C2E3B] hover:from-[#571922] hover:to-[#732530] transition-all shadow-md shadow-[#6B1F2A]/10 mt-2"
                  >
                    Confirm Strategic Pipeline Dispatch
                  </button>
                </form>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}