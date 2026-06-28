import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Heart, Calculator, ShieldCheck, DollarSign, Calendar, Info,
  Search, CheckCircle2, AlertCircle, Sparkles, TrendingUp,
  Layers, Clock, ArrowRight, Wallet, HelpCircle, X 
} from 'lucide-react';
import Sidebar from '../components/Sidebar';
import api from '../utils/api';

const DONATION_CATEGORIES = [
  // Obligatory Donations
  { id: 'zakat', title: 'Zakat', type: 'Obligatory', due: 'Annual', description: 'Mandatory 2.5% alms on wealth exceeding the Nisab threshold.', isZakat: true, baseAmount: 0 },
  { id: 'fitrah', title: 'Zakat al-Fitr (Fitrah)', type: 'Obligatory', due: 'Before Eid-ul-Fitr', description: 'Mandatory charity paid before the Eid prayer to feed the poor.', baseAmount: 350 },
  { id: 'ushr', title: 'Ushr', type: 'Obligatory', due: 'Harvest Time', description: 'Mandatory 5% or 10% tax on agricultural produce.', baseAmount: 0 },
  { id: 'kaffarah', title: 'Kaffarah', type: 'Obligatory', due: 'As Needed', description: 'Expiation for deliberately broken fasts or broken oaths.', baseAmount: 3000 },
  { id: 'fidya', title: 'Fidya', type: 'Obligatory', due: 'During Ramadan', description: 'Compensation for missing fasts due to permanent illness or old age.', baseAmount: 300 },

  // Voluntary Donations
  { id: 'sadaqah', title: 'Sadaqah', type: 'Voluntary', due: 'Flexible', description: 'Voluntary general charity given at any time to remove hardships.', baseAmount: 500 },
  { id: 'sadaqah_jariyah', title: 'Sadaqah Jariyah', type: 'Voluntary', due: 'Flexible', description: 'Continuous charity that benefits people long-term (wells, schools).', baseAmount: 2500 },
  { id: 'waqf', title: 'Waqf', type: 'Voluntary', due: 'Flexible', description: 'Endowment of assets or property for communal or Islamic welfare.', baseAmount: 5000 },
  { id: 'hadiyah', title: 'Hadiyah', type: 'Voluntary', due: 'Flexible', description: 'Gifts given voluntarily to show respect, kindness, or affection.', baseAmount: 1000 },
  { id: 'qurbani', title: 'Qurbani / Udhiyah', type: 'Voluntary', due: 'Dhul Hijjah 10-12', description: 'Sacrificial animal donation during Eid-ul-Adha for distribution.', baseAmount: 22000 },
];

const CHARITY_ORGANIZATIONS = [
  { id: '1', name: 'Al-Khidmat Foundation' },
  { id: '2', name: 'Edhi Foundation' },
  { id: '3', name: 'Saylani Welfare Trust' },
  { id: '4', name: 'Islamic Relief International' },
  { id: '5', name: 'Muslim Hands' },
];

export default function IslamicDonations() {
  // --- UI & Modal States ---
  const [successPopup, setSuccessPopup] = useState(false);
  const [selectedCard, setSelectedCard] = useState(null);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [isZakatSelectorOpen, setIsZakatSelectorOpen] = useState(false);
  const [isCalculatorOpen, setIsCalculatorOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);

  // --- Dynamic Payment State ---
  const [amount, setAmount] = useState('');
  const [currency, setCurrency] = useState('PKR');
  const [selectedOrg, setSelectedOrg] = useState('');
  const [searchOrgTerm, setSearchOrgTerm] = useState('');
  const [isOrgDropdownOpen, setIsOrgDropdownOpen] = useState(false);
  const [notes, setNotes] = useState('');

  // --- Zakat Calculator Form State ---
  const [calcCash, setCalcCash] = useState('');
  const [calcGold, setCalcGold] = useState('');
  const [calcSilver, setCalcSilver] = useState('');
  const [calcInvestments, setCalcInvestments] = useState('');
  const [calcAssets, setCalcAssets] = useState('');
  const [calcDebts, setCalcDebts] = useState('');
  const [calculatedZakat, setCalculatedZakat] = useState(null);

  // --- Payment History Database Emulation State ---
  // const [paymentHistory, setPaymentHistory] = useState([
  //   { id: 'TXN-982134', type: 'Sadaqah', amount: 5000, currency: 'PKR', org: 'Edhi Foundation', date: '2026-05-15', status: 'Success' },
  //   { id: 'TXN-432109', type: 'Fidya', amount: 4500, currency: 'PKR', org: 'Saylani Welfare Trust', date: '2026-04-10', status: 'Success' }
  // ]);
  const [paymentHistory, setPaymentHistory] = useState([]);
  // --- Notification Trigger Helper ---
  const triggerNotification = (message, type = 'success') => {
    const id = Date.now();
    setNotifications((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setNotifications((prev) => prev.filter((n) => n.id !== id));
    }, 4000);
  };

  // --- Filtered Organization Search ---
  const filteredOrganizations = useMemo(() => {
    return CHARITY_ORGANIZATIONS.filter(org =>
      org.name.toLowerCase().includes(searchOrgTerm.toLowerCase())
    );
  }, [searchOrgTerm]);

  // --- Dashboard Metrics Aggregations ---
  const metrics = useMemo(() => {
    const total = paymentHistory.reduce((acc, curr) => acc + curr.amount, 0);
    const zakat = paymentHistory.filter(p => p.type.toLowerCase().includes('zakat')).reduce((acc, curr) => acc + curr.amount, 0);
    const sadaqah = paymentHistory.filter(p => p.type.toLowerCase().includes('sadaqah')).reduce((acc, curr) => acc + curr.amount, 0);
    return { total, zakat, sadaqah };
  }, [paymentHistory]);


  const fetchDonations = async () => {
    try {
      const res = await api.get('/api/islamicdonation');

      const formatted = res.data.data.map((item) => ({
        id: item.transactionId,
        type: item.donationType,
        amount: item.amount,
        currency: item.currency,
        org: item.organization,
        date: new Date(item.createdAt).toISOString().split('T')[0],
        status: item.status,
      }));

      setPaymentHistory(formatted);
    } catch (err) {
      console.error(err);
      triggerNotification('Failed to load donation history', 'failed');
    }
  };

  useEffect(() => {
    fetchDonations();
  }, []);
  // --- Zakat Calculator Engine ---
  const handleCalculateZakat = (e) => {
    e.preventDefault();
    const cash = parseFloat(calcCash) || 0;
    const gold = parseFloat(calcGold) || 0;
    const silver = parseFloat(calcSilver) || 0;
    const investments = parseFloat(calcInvestments) || 0;
    const assets = parseFloat(calcAssets) || 0;
    const debts = parseFloat(calcDebts) || 0;

    const totalWealth = (cash + gold + silver + investments + assets) - debts;

    // Hardcoded estimated silver Nisab monetary equivalent threshold for illustration (~612g silver value)
    const NISAB_THRESHOLD = 150000;
    const isEligible = totalWealth >= NISAB_THRESHOLD;
    const dueZakat = isEligible ? totalWealth * 0.025 : 0;

    setCalculatedZakat({
      totalWealth,
      isEligible,
      dueZakat
    });
    triggerNotification("Zakat calculated dynamically against Nisab standards.", "info");
  };

  // --- Finalize and Save Payment to Log ---
  const handleExecutePayment = async (e) => {
    e.preventDefault();

    if (!amount || parseFloat(amount) <= 0 || !selectedOrg) {
      triggerNotification(
        'Please fill in the required payment amount and select an organization.',
        'failed'
      );
      return;
    }

    try {
      await api.post('/api/islamicdonation', {
        donationType: selectedCard?.title || 'General Donation',
        amount: Number(amount),
        currency,
        organization: selectedOrg,
        notes,
      });

      await fetchDonations();

      setIsPaymentModalOpen(false);
      setAmount('');
      setSelectedOrg('');
      setSearchOrgTerm('');
      setNotes('');

      // triggerNotification(
      //   `${currency} ${Number(amount).toLocaleString()} donated successfully.`,
      //   'success'
      // );
      setSuccessPopup(true);
    } catch (err) {
      console.error(err);

      triggerNotification(
        'Failed to process donation.',
        'failed'
      );
    }
  };

  return (
    <div className="w-full min-h-screen bg-[#FDFBF7] text-stone-900 font-sans selection:bg-[#800020]/10 selection:text-[#800020]">

      {/* GLOBAL TOAST NOTIFICATION CONTAINER */}
      <div className="fixed top-5 right-5 z-[100] flex flex-col gap-3 max-w-sm w-full">
        <AnimatePresence>
          {notifications.map((n) => (
            <motion.div
              key={n.id}
              initial={{ opacity: 0, x: 50, scale: 0.9 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 50, scale: 0.95 }}
              className={`p-4 rounded-2xl shadow-xl flex items-start gap-3 border ${n.type === 'success' ? 'bg-emerald-50 border-emerald-200 text-emerald-900' :
                  n.type === 'failed' ? 'bg-rose-50 border-rose-200 text-rose-900' :
                    'bg-amber-50 border-amber-200 text-amber-900'
                }`}
            >
              {n.type === 'success' && <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />}
              {n.type === 'failed' && <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />}
              {n.type === 'info' && <Info className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />}
              <p className="text-sm font-medium leading-snug">{n.message}</p>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      <div className="grid items-start gap-6 lg:gap-8 grid-cols-1 xl:grid-cols-[280px_1fr] p-4 sm:p-6 lg:p-8">

        {/* SIDEBAR PANEL */}

        <Sidebar />


        {/* MAIN CONTROLS PANEL */}
        <main className="space-y-10">




          {/* HERO SECTION WITH GEOMETRIC UNDERLAY BACKGROUND */}
          <section className="rounded-[2.5rem] border border-stone-200/80 bg-white p-8 sm:p-12 shadow-sm relative overflow-hidden">
            {/* Islamic Geometric SVG Pattern Background */}
            <div className="absolute inset-0 opacity-[0.03] pointer-events-none mix-blend-multiply bg-[url('data:image/svg+xml;utf8,<svg xmlns=%22http://www.w3.org/2000/svg%22 width=%2260%22 height=%2260%22 viewBox=%220 0 60 60%22><path d=%22M30 0 L60 30 L30 60 L0 30 Z M30 10 L50 30 L30 50 L10 30 Z%22 fill=%22%23800020%22/></svg>')] bg-repeat"></div>

            <div className="relative z-10 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8">
              <div className="max-w-3xl space-y-4">
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#800020]/5 rounded-full border border-[#800020]/10">
                  <Sparkles className="w-4 h-4 text-[#800020]" />
                  <span className="text-xs font-semibold uppercase tracking-wider text-[#800020]">Faith-Driven Financial Platform</span>
                </div>
                <motion.h1
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  className="text-4xl sm:text-5xl font-serif font-medium text-stone-900 tracking-tight leading-tight"
                >
                  Fulfill Your <span className="text-[#800020] italic font-normal">Islamic Obligations</span> with Ease
                </motion.h1>
                <p className="text-base sm:text-lg text-stone-600 font-normal leading-relaxed max-w-2xl">
                  Automate, compute, and disperse your mandatory Zakat, Ushr, and voluntary Sadaqah assets across verified global humanitarian networks with mathematical clarity.
                </p>
              </div>
              <div className="flex sm:flex-row flex-col items-stretch lg:items-center gap-3 shrink-0">
                <button
                  onClick={() => {
                    setSelectedCard(DONATION_CATEGORIES.find(c => c.id === 'zakat'));
                    setIsZakatSelectorOpen(true);
                  }}
                  className="px-6 py-4 rounded-2xl bg-[#800020] text-white font-semibold text-sm hover:bg-[#660014] transition-all shadow-md shadow-[#800020]/10 flex items-center justify-center gap-2 group"
                >
                  <span>Quick Zakat Calculator</span>
                  <Calculator className="w-4 h-4 group-hover:rotate-12 transition-transform" />
                </button>
              </div>
            </div>

            {/* INTEGRATED QUICK STATS DASHBOARD GRID */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-12 pt-8 border-t border-stone-100">
              <div className="p-5 rounded-2xl bg-[#FDFBF7] border border-stone-200/60 shadow-inner">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold uppercase text-stone-500 tracking-wider">Aggregated Giving</span>
                  <Wallet className="w-4 h-4 text-[#800020]" />
                </div>
                <div className="text-2xl font-semibold tracking-tight text-stone-900">PKR {metrics.total.toLocaleString()}</div>
                <div className="text-xs text-stone-500 mt-1 flex items-center gap-1">
                  <TrendingUp className="w-3 h-3 text-emerald-600" /> Fully Verified Disbursals
                </div>
              </div>
              <div className="p-5 rounded-2xl bg-[#FDFBF7] border border-stone-200/60 shadow-inner">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold uppercase text-stone-500 tracking-wider">Total Zakat Settled</span>
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                </div>
                <div className="text-2xl font-semibold tracking-tight text-stone-900">PKR {metrics.zakat.toLocaleString()}</div>
                <div className="text-xs text-stone-500 mt-1">Calculated via Nisab thresholds</div>
              </div>
              <div className="p-5 rounded-2xl bg-[#FDFBF7] border border-stone-200/60 shadow-inner">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold uppercase text-stone-500 tracking-wider">Voluntary Sadaqah</span>
                  <Heart className="w-4 h-4 text-rose-600" />
                </div>
                <div className="text-2xl font-semibold tracking-tight text-stone-900">PKR {metrics.sadaqah.toLocaleString()}</div>
                <div className="text-xs text-stone-500 mt-1">Continuous social relief welfare</div>
              </div>

            </div>
          </section>

          {/* DYNAMIC COMPREHENSIVE ISLAMIC DONATIONS MAIN GRID */}
          <section className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
              <div>
                <h2 className="text-2xl font-serif font-medium text-stone-900">Structured Islamic Giving Grid</h2>
                <p className="text-sm text-stone-500 mt-1">Select from either systemic liturgical obligations or voluntary community developmental funds.</p>
              </div>
              <div className="flex items-center gap-2 text-xs font-medium text-stone-500 bg-stone-100 p-1 rounded-xl">
                <span className="px-3 py-1.5 bg-white rounded-lg shadow-xs text-stone-800">All Modules</span>
              </div>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {DONATION_CATEGORIES.map((card, idx) => (
                <motion.div
                  key={card.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.04 }}
                  whileHover={{ y: -6, transition: { duration: 0.2 } }}
                  className="bg-white rounded-3xl border border-stone-200/80 shadow-xs hover:shadow-xl transition-all p-6 relative flex flex-col justify-between group"
                >
                  <div>
                    {/* Badge / Metadata Header */}
                    <div className="flex items-center justify-between gap-2 mb-4">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${card.type === 'Obligatory'
                          ? 'bg-[#800020]/10 text-[#800020] border border-[#800020]/20'
                          : 'bg-amber-100 text-amber-900 border border-amber-200'
                        }`}>
                        {card.type}
                      </span>
                      <span className="text-xs text-stone-400 font-medium flex items-center gap-1">
                        <Clock className="w-3 h-3" /> {card.due}
                      </span>
                    </div>

                    {/* Card Branding */}
                    <h3 className="text-lg font-semibold text-stone-900 group-hover:text-[#800020] transition-colors flex items-center gap-2">
                      {card.title}
                    </h3>
                    <p className="mt-2 text-xs text-stone-600 leading-relaxed min-h-[3.5rem]">
                      {card.description}
                    </p>

                    {/* Mock Progress Bars Indicator for Structural Completeness */}
                    <div className="mt-4 space-y-1">
                      <div className="flex justify-between text-[10px] font-medium text-stone-400">
                        <span>Community Allocation Demand</span>
                        <span>{card.type === 'Obligatory' ? '92%' : '65%'}</span>
                      </div>
                      <div className="w-full bg-stone-100 h-1.5 rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          whileInView={{ width: card.type === 'Obligatory' ? '92%' : '65%' }}
                          transition={{ duration: 1 }}
                          className={`h-full ${card.type === 'Obligatory' ? 'bg-[#800020]' : 'bg-amber-700'}`}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Call to Actions */}
                  <div className="mt-6 pt-4 border-t border-stone-100 flex items-center justify-between gap-2">
                    <span className="text-[11px] font-medium text-stone-500">
                      {card.baseAmount > 0 ? `Starts at PKR ${card.baseAmount.toLocaleString()}` : 'Variable Amount'}
                    </span>
                    <button
                      onClick={() => {
                        setSelectedCard(card);
                        if (card.isZakat) {
                          setIsZakatSelectorOpen(true);
                        } else {
                          setAmount(card.baseAmount > 0 ? card.baseAmount.toString() : '');
                          setIsPaymentModalOpen(true);
                        }
                      }}
                      className="px-4 py-2 bg-stone-50 hover:bg-[#800020] text-stone-800 hover:text-white border border-stone-200 hover:border-[#800020] rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 group-hover:shadow-sm"
                    >
                      <span>Contribute</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          </section>

          {/* HISTORICAL DISBURSAL LOGS & METRICS COMPONENT */}
          <section className="bg-white border border-stone-200/80 rounded-[2rem] p-6 sm:p-8 shadow-sm">
            <div className="mb-6">
              <h2 className="text-xl font-serif font-medium text-stone-900">Auditable Giving Records</h2>
              <p className="text-xs text-stone-500 mt-0.5">Real-time ledger of verified transactions executing onto the MongoDB cluster architecture.</p>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-stone-100 bg-stone-50 text-stone-500 font-bold uppercase tracking-wider">
                    <th className="p-4 rounded-l-xl">Reference ID</th>
                    <th className="p-4">Classification</th>
                    <th className="p-4">Beneficiary Entity</th>
                    <th className="p-4">Timestamp</th>
                    <th className="p-4">Transacted Value</th>
                    <th className="p-4 rounded-r-xl text-right">Status Ledger</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100 font-medium text-stone-700">
                  {paymentHistory.map((history) => (
                    <tr key={history.id} className="hover:bg-stone-50/80 transition-colors">
                      <td className="p-4 font-mono text-stone-900 font-semibold">{history.id}</td>
                      <td className="p-4">
                        <span className="px-2 py-0.5 bg-stone-100 text-stone-800 rounded-md font-semibold">
                          {history.type}
                        </span>
                      </td>
                      <td className="p-4 text-stone-600">{history.org}</td>
                      <td className="p-4 text-stone-400">{history.date}</td>
                      <td className="p-4 font-bold text-stone-900">{history.currency} {history.amount.toLocaleString()}</td>
                      <td className="p-4 text-right">
                        <span className="inline-flex items-center gap-1 text-emerald-700 font-bold bg-emerald-50 border border-emerald-100 px-2 py-0.5 rounded-md">
                          <span className="w-1.5 h-1.5 bg-emerald-600 rounded-full"></span> Secure
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        </main>
      </div>

      {/* ==========================================
          MODALS / DIALOG SYSTEMS 
          ========================================== */}

      {/* SHADCN-LIKE DRAWER: ZAKAT ENTRY GATEWAY */}
      <AnimatePresence>
        {isZakatSelectorOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsZakatSelectorOpen(false)}
              className="absolute inset-0 bg-stone-900/60 backdrop-blur-sm"
            />
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 15 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 15 }}
              className="bg-white w-full max-w-md rounded-[2rem] shadow-2xl border border-stone-200 overflow-hidden relative z-10 p-6 space-y-6"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-[#800020]">
                  <Layers className="w-5 h-5" />
                  <h3 className="font-serif text-xl font-medium text-stone-900">Zakat Fulfillment Panel</h3>
                </div>
                <button onClick={() => setIsZakatSelectorOpen(false)} className="p-1.5 rounded-full hover:bg-stone-100 text-stone-400">
                  <X className="w-5 h-5" />
                </button>
              </div>
              <p className="text-xs text-stone-500 leading-relaxed">
                Choose to route an explicit immediate donation figure, or execute our unified calculation terminal tool to process gold, silver, liquid funds, and outstanding systemic debts.
              </p>
              <div className="grid grid-cols-1 gap-3">
                <button
                  onClick={() => {
                    setIsZakatSelectorOpen(false);
                    setAmount('');
                    setIsPaymentModalOpen(true);
                  }}
                  className="p-4 rounded-2xl border border-stone-200 hover:border-[#800020] bg-stone-50/50 hover:bg-[#800020]/5 text-left transition-all flex items-start gap-4 group"
                >
                  <div className="p-2 bg-white rounded-xl border border-stone-200 text-[#800020] shadow-2xs group-hover:bg-[#800020] group-hover:text-white transition-colors">
                    <DollarSign className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-stone-900">Option 1: Direct Payment</h4>
                    <p className="text-xs text-stone-500 mt-0.5">I am cognizant of my calculated value and wish to pay instantly.</p>
                  </div>
                </button>

                <button
                  onClick={() => {
                    setIsZakatSelectorOpen(false);
                    setIsCalculatorOpen(true);
                  }}
                  className="p-4 rounded-2xl border border-stone-200 hover:border-amber-600 bg-stone-50/50 hover:bg-amber-50/30 text-left transition-all flex items-start gap-4 group"
                >
                  <div className="p-2 bg-white rounded-xl border border-stone-200 text-amber-700 shadow-2xs group-hover:bg-amber-700 group-hover:text-white transition-colors">
                    <Calculator className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-stone-900">Option 2: Calculate Zakat</h4>
                    <p className="text-xs text-stone-500 mt-0.5">Open ledger workbook to tally physical assets, bullion, and write-offs.</p>
                  </div>
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* SHADCN-LIKE MODAL: SHARIAH ZAKAT CALCULATOR MODULE */}
      <AnimatePresence>
        {isCalculatorOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsCalculatorOpen(false)}
              className="absolute inset-0 bg-stone-900/60 backdrop-blur-sm"
            />
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white w-full max-w-2xl rounded-[2.5rem] shadow-2xl border border-stone-200 overflow-hidden relative z-10 max-h-[90vh] flex flex-col"
            >
              {/* Sticky Header */}
              <div className="p-6 border-b border-stone-100 flex items-center justify-between bg-stone-50/50">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-amber-100 rounded-xl text-amber-900 border border-amber-200">
                    <Calculator className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-serif text-xl font-medium text-stone-900">Unified Shariah Wealth Matrix</h3>
                    <p className="text-[11px] text-stone-500">All fields automatically computed at a standard 2.5% rate criteria.</p>
                  </div>
                </div>
                <button onClick={() => setIsCalculatorOpen(false)} className="p-1.5 rounded-full hover:bg-stone-100 text-stone-400">
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Form Body - Scrollable */}
              <form onSubmit={handleCalculateZakat} className="p-6 overflow-y-auto space-y-6 flex-1">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase text-stone-600 mb-1.5">Liquid Cash & Bank Reserves</label>
                    <div className="relative">
                      <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-xs font-bold text-stone-400">PKR</span>
                      <input
                        type="number" placeholder="0.00" value={calcCash} onChange={(e) => setCalcCash(e.target.value)}
                        className="w-full pl-12 pr-4 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-sm focus:outline-hidden focus:border-[#800020] focus:bg-white font-medium"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase text-stone-600 mb-1.5">Gold Market Value Equivalent</label>
                    <div className="relative">
                      <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-xs font-bold text-stone-400">PKR</span>
                      <input
                        type="number" placeholder="0.00" value={calcGold} onChange={(e) => setCalcGold(e.target.value)}
                        className="w-full pl-12 pr-4 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-sm focus:outline-hidden focus:border-[#800020] focus:bg-white font-medium"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase text-stone-600 mb-1.5">Silver Market Value Equivalent</label>
                    <div className="relative">
                      <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-xs font-bold text-stone-400">PKR</span>
                      <input
                        type="number" placeholder="0.00" value={calcSilver} onChange={(e) => setCalcSilver(e.target.value)}
                        className="w-full pl-12 pr-4 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-sm focus:outline-hidden focus:border-[#800020] focus:bg-white font-medium"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase text-stone-600 mb-1.5">Investments & Stocks Equity</label>
                    <div className="relative">
                      <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-xs font-bold text-stone-400">PKR</span>
                      <input
                        type="number" placeholder="0.00" value={calcInvestments} onChange={(e) => setCalcInvestments(e.target.value)}
                        className="w-full pl-12 pr-4 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-sm focus:outline-hidden focus:border-[#800020] focus:bg-white font-medium"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase text-stone-600 mb-1.5">Business / Merchandise Assets</label>
                    <div className="relative">
                      <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-xs font-bold text-stone-400">PKR</span>
                      <input
                        type="number" placeholder="0.00" value={calcAssets} onChange={(e) => setCalcAssets(e.target.value)}
                        className="w-full pl-12 pr-4 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-sm focus:outline-hidden focus:border-[#800020] focus:bg-white font-medium"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase text-stone-600 mb-1.5">Deductible Liabilities & Debts</label>
                    <div className="relative">
                      <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-xs font-bold text-stone-400">PKR</span>
                      <input
                        type="number" placeholder="0.00" value={calcDebts} onChange={(e) => setCalcDebts(e.target.value)}
                        className="w-full pl-12 pr-4 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-sm focus:outline-hidden focus:border-[#800020] focus:bg-white font-medium"
                      />
                    </div>
                  </div>
                </div>

                <div className="pt-2">
                  <button type="submit" className="w-full py-3 rounded-xl bg-amber-700 hover:bg-amber-800 text-white font-semibold text-sm transition-colors shadow-md">
                    Evaluate Dynamic Wealth
                  </button>
                </div>
              </form>

              {/* Dynamic Engine Evaluation Output Section */}
              {calculatedZakat && (
                <div className="p-6 bg-stone-50 border-t border-stone-100 space-y-4">
                  <div className="grid grid-cols-2 gap-4 text-xs">
                    <div>
                      <span className="text-stone-400 font-bold block uppercase">Net Wealth Pool:</span>
                      <span className="text-base font-semibold text-stone-900">PKR {calculatedZakat.totalWealth.toLocaleString()}</span>
                    </div>
                    <div>
                      <span className="text-stone-400 font-bold block uppercase">Threshold Standard Status:</span>
                      <span className={`inline-flex items-center gap-1 text-xs font-bold mt-1 ${calculatedZakat.isEligible ? 'text-emerald-700' : 'text-stone-500'}`}>
                        {calculatedZakat.isEligible ? 'Nisab Exceeded' : 'Below Nisab'}
                      </span>
                    </div>
                  </div>

                  {calculatedZakat.isEligible ? (
                    <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-between">
                      <div>
                        <span className="text-[10px] font-bold text-emerald-800 uppercase block">Total Due Obligation</span>
                        <span className="text-xl font-bold text-emerald-900">PKR {calculatedZakat.dueZakat.toLocaleString()}</span>
                      </div>
                      <button
                        onClick={() => {
                          setAmount(calculatedZakat.dueZakat.toString());
                          setIsCalculatorOpen(false);
                          setIsPaymentModalOpen(true);
                        }}
                        className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold shadow-sm transition-colors"
                      >
                        Push to Checkout
                      </button>
                    </div>
                  ) : (
                    <div className="p-4 rounded-xl bg-stone-100 text-stone-600 text-xs leading-relaxed">
                      Your total computed wealth resides beneath the established legal Nisab value limit. No mandatory seasonal distribution is systematically owed on this configuration balance.
                    </div>
                  )}
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* DYNAMIC DISBURSAL CHECKOUT GATEWAY MODAL */}
      <AnimatePresence>
        {isPaymentModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsPaymentModalOpen(false)}
              className="absolute inset-0 bg-stone-900/60 backdrop-blur-sm"
            />
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 15 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 15 }}
              className="bg-white w-full max-w-md rounded-[2rem] shadow-2xl border border-stone-200 overflow-hidden relative z-10"
            >
              <div className="p-6 border-b border-stone-100 flex items-center justify-between bg-stone-50/50">
                <div className="flex items-center gap-2">
                  <Heart className="w-5 h-5 text-[#800020]" />
                  <h3 className="font-serif text-lg font-medium text-stone-900">
                    Disburse {selectedCard ? selectedCard.title : 'Charity'}
                  </h3>
                </div>
                <button onClick={() => setIsPaymentModalOpen(false)} className="p-1.5 rounded-full hover:bg-stone-100 text-stone-400">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleExecutePayment} className="p-6 space-y-5">
                <div>
                  <label className="block text-xs font-bold uppercase text-stone-600 mb-1.5">Target Value Allocation</label>
                  <div className="relative">
                    <select
                      value={currency}
                      onChange={(e) => setCurrency(e.target.value)}
                      className="absolute left-2 top-1/2 -translate-y-1/2 bg-transparent text-xs font-bold border-none focus:outline-hidden text-stone-700"
                    >
                      <option value="PKR">PKR</option>
                      <option value="USD">USD</option>
                      <option value="GBP">GBP</option>
                    </select>
                    <input
                      type="number" required placeholder="0" value={amount} onChange={(e) => setAmount(e.target.value)}
                      className="w-full pl-20 pr-4 py-3 bg-stone-50 border border-stone-200 rounded-xl text-sm focus:outline-hidden focus:border-[#800020] focus:bg-white font-semibold"
                    />
                  </div>
                </div>

                {/* Custom Autocomplete / Select Organization Combo Box */}
                <div className="relative">
                  <label className="block text-xs font-bold uppercase text-stone-600 mb-1.5">Endorsement Recipient Body</label>
                  <div className="relative">
                    <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
                    <input
                      type="text"
                      placeholder="Search partner organizations..."
                      value={selectedOrg || searchOrgTerm}
                      onFocus={() => { setIsOrgDropdownOpen(true); if (selectedOrg) { setSearchOrgTerm(''); setSelectedOrg(''); } }}
                      onChange={(e) => setSearchOrgTerm(e.target.value)}
                      className="w-full pl-10 pr-4 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-sm focus:outline-hidden focus:border-[#800020] focus:bg-white font-medium"
                    />
                  </div>

                  {isOrgDropdownOpen && (
                    <div className="absolute left-0 right-0 mt-1 bg-white border border-stone-200 shadow-xl rounded-xl max-h-48 overflow-y-auto z-20 divide-y divide-stone-50">
                      {filteredOrganizations.length > 0 ? (
                        filteredOrganizations.map(org => (
                          <div
                            key={org.id}
                            onClick={() => {
                              setSelectedOrg(org.name);
                              setSearchOrgTerm(org.name);
                              setIsOrgDropdownOpen(false);
                            }}
                            className="p-3 text-xs font-medium text-stone-700 hover:bg-[#800020]/5 hover:text-[#800020] cursor-pointer transition-colors"
                          >
                            {org.name}
                          </div>
                        ))
                      ) : (
                        <div className="p-3 text-xs text-stone-400 italic">No matching verified groups found</div>
                      )}
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-stone-600 mb-1.5">Audit Ledger Memo Notes (Optional)</label>
                  <textarea
                    rows="2" placeholder="Intention logs or allocation earmarks..." value={notes} onChange={(e) => setNotes(e.target.value)}
                    className="w-full p-3 bg-stone-50 border border-stone-200 rounded-xl text-xs focus:outline-hidden focus:border-[#800020] focus:bg-white font-medium"
                  />
                </div>


                {/* Gateway Procurement Network */}
                <div className="space-y-1.5 mt-4">
                  <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500 block">
                    Gateway Procurement Network
                  </label>
                  <div className="grid grid-cols-3 gap-2.5">

                    {/* Option 1: Credit Card */}
                    <label className="relative p-3 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 text-left flex flex-col justify-between transition-all cursor-pointer has-[:checked]:border-[#6B1F2A] has-[:checked]:bg-[#6B1F2A]/5 has-[:checked]:text-[#6B1F2A]">
                      <input type="radio" name="payment_ui_only" className="sr-only" defaultChecked />
                      <span className="text-xs font-bold tracking-tight block">Credit Card</span>
                      <span className="text-[9px] font-medium text-slate-400 mt-1">Global</span>
                    </label>

                    {/* Option 2: Direct Wire */}
                    <label className="relative p-3 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 text-left flex flex-col justify-between transition-all cursor-pointer has-[:checked]:border-[#6B1F2A] has-[:checked]:bg-[#6B1F2A]/5 has-[:checked]:text-[#6B1F2A]">
                      <input type="radio" name="payment_ui_only" className="sr-only" />
                      <span className="text-xs font-bold tracking-tight block">Direct Wire</span>
                      <span className="text-[9px] font-medium text-slate-400 mt-1">Swift</span>
                    </label>

                    {/* Option 3: Mobile Wallet */}
                    <label className="relative p-3 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 text-left flex flex-col justify-between transition-all cursor-pointer has-[:checked]:border-[#6B1F2A] has-[:checked]:bg-[#6B1F2A]/5 has-[:checked]:text-[#6B1F2A]">
                      <input type="radio" name="payment_ui_only" className="sr-only" />
                      <span className="text-xs font-bold tracking-tight block">Mobile Wallet</span>
                      <span className="text-[9px] font-medium text-slate-400 mt-1">Instant</span>
                    </label>

                  </div>
                </div>


                <div className="pt-2">
                  <button type="submit" className="w-full py-3 rounded-xl bg-[#800020] hover:bg-[#660014] text-white font-semibold text-sm transition-colors shadow-lg">
                    Confirm Secure Allocation Disbursal
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
          
        )}
        
      </AnimatePresence>
    <AnimatePresence>
  {successPopup && (
    <div className="fixed inset-0 bg-slate-950/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      {/* Backdrop Fade */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={() => setSuccessPopup(false)}
        className="absolute inset-0"
      />

      {/* Modal Content Card */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 12 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.98, y: 8 }}
        transition={{ type: "spring", duration: 0.45 }}
        className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-2xl border border-slate-200/60 text-center relative overflow-hidden flex flex-col items-center z-10"
      >
        {/* Decorative Top Accent Stripe */}
        <div className="absolute top-0 inset-x-0 h-1.5 bg-gradient-to-r from-emerald-400 via-teal-500 to-emerald-500" />

        {/* Animated Icon Ring */}
        <div className="w-14 h-14 bg-emerald-50 rounded-full flex items-center justify-center border border-emerald-100 shadow-sm mb-4 mt-2">
          <CheckCircle2 className="w-7 h-7 text-emerald-600 animate-[pulse_2s_infinite]" />
        </div>

        {/* Clean & Professional Messaging */}
        <div className="space-y-1.5 mb-6">
          <h3 className="text-xl font-bold tracking-tight text-slate-900">
            Thank You for Your Donation!
          </h3>
          <p className="text-xs font-medium leading-relaxed text-slate-500 px-2">
            Your payment has been processed safely and securely. Your generosity will go directly toward helping those in need.
          </p>
        </div>

        {/* Action Button */}
        <button
          onClick={() => setSuccessPopup(false)}
          className="w-full py-2.5 px-4 rounded-xl text-xs font-bold uppercase tracking-wider text-center bg-[#6B1F2A] text-white hover:bg-[#541820] transition-all duration-200 shadow-sm shadow-[#6B1F2A]/10 active:scale-[0.98]"
        >
          Close
        </button>
      </motion.div>
    </div>
  )}
</AnimatePresence>
    </div>
  );
}