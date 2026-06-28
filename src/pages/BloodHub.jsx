import React, { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Sidebar from '../components/Sidebar'
import BloodMap from '../components/BloodMap'
import {
  Droplet,
  MapPin,
  Building2,
  AlertCircle,
  HeartPulse,
  ShieldAlert,
  Sparkles,
  Search,
  SlidersHorizontal,
  Bell,
  Calendar,
  Map,
  List,
  Navigation,
  Clock,
  ChevronDown,
  X,
  CheckCircle2
} from 'lucide-react'

// --- MOCK EXTENDED DATA (Simulating MongoDB Population for Pakistan Network) ---
const mockRequests = [
  {
    _id: "req_001",
    hospital: "Jinnah Postgraduate Medical Centre (JPMC)",
    city: "Karachi",
    bloodType: "O-",
    details: "Emergency thalassemia transfusion needed immediately for a pediatric case. Family on site but matching units unavailable in the local bank.",
    urgency: "Critical",
    timestamp: "2 mins ago",
    coordinates: "24.8524,67.0426"
  },
  {
    _id: "req_002",
    hospital: "Mayo Hospital",
    city: "Lahore",
    bloodType: "A+",
    details: "Scheduled open-heart surgery requires 3 units of A+ blood. Donors requested to report to the surgical ward blood bank floor.",
    urgency: "Medium",
    timestamp: "24 mins ago",
    coordinates: "31.5794,74.3121"
  },
  {
    _id: "req_003",
    hospital: "Pakistan Institute of Medical Sciences (PIMS)",
    city: "Islamabad",
    bloodType: "B-",
    details: "Trauma unit request following an highway accident scenario. Blood cross-matching ready, urgent donors highly appreciated.",
    urgency: "Critical",
    timestamp: "40 mins ago",
    coordinates: "33.7027,73.0450"
  },
  {
    _id: "req_004",
    hospital: "Lady Reading Hospital",
    city: "Peshawar",
    bloodType: "AB+",
    details: "Platelet apheresis donation needed for an oncology patient undergoing active chemotherapy processing.",
    urgency: "Low",
    timestamp: "2 hours ago",
    coordinates: "34.0150,71.5731"
  },
  // --- NEW ADDITIONS FOR KARACHI ONLY ---
  {
    _id: "req_005",
    hospital: "Aga Khan University Hospital (AKUH)",
    city: "Karachi",
    bloodType: "O+",
    details: "Urgent request for 4 whole blood O-Positive units ahead of a complex neonatal cardiac corrective procedure.",
    urgency: "Critical",
    timestamp: "5 mins ago",
    coordinates: "24.8922,67.0747"
  },
  {
    _id: "req_006",
    hospital: "The Indus Hospital (Korangi Campus)",
    city: "Karachi",
    bloodType: "B+",
    details: "Ongoing therapeutic exchange support program. Pediatric ward reports immediate inventory depleted for regular therapeutic intervals.",
    urgency: "Medium",
    timestamp: "12 mins ago",
    coordinates: "24.8213,67.1234"
  },
  {
    _id: "req_007",
    hospital: "Liaquat National Hospital",
    city: "Karachi",
    bloodType: "A-",
    details: "Oncology ward emergency dispatch. Platelet replacement units needed by early evening for an active chemo patient.",
    urgency: "Critical",
    timestamp: "55 mins ago",
    coordinates: "24.8935,67.0694"
  },
  {
    _id: "req_008",
    hospital: "Dr. Ruth K.M. Pfau Civil Hospital",
    city: "Karachi",
    bloodType: "AB-",
    details: "Gynaecology ICU triage requires rare negative-match cross pool units for maternal emergency complications.",
    urgency: "Critical",
    timestamp: "1 hour ago",
    coordinates: "24.8585,67.0104"
  }
];

const mockCampaigns = [
  {
    id: "cam_001",
    name: "Mega Youth Blood Drive",
    organizer: "Indus Hospital Network",
    city: "Karachi",
    locationName: "NED University Campus",
    requiredTypes: "All Groups",
    duration: "May 31 - June 02, 09:00 AM - 05:00 PM",
    embedMapUrl: "https://maps.google.com/maps?q=NED%20University%20Karachi&t=&z=13&ie=UTF8&iwloc=&output=embed"
  },
  {
    id: "cam_002",
    name: "Ramadan & Post-Eid Life Save Camp",
    organizer: "Sundas Foundation",
    city: "Lahore",
    locationName: "Gulberg III Center",
    requiredTypes: "O+, O-, B-",
    duration: "June 05, 11:00 AM - 09:00 PM",
    embedMapUrl: "https://maps.google.com/maps?q=Gulberg%20III%20Lahore&t=&z=13&ie=UTF8&iwloc=&output=embed"
  },
  // --- NEW ADDITIONS FOR KARACHI ONLY ---
  {
    id: "cam_003",
    name: "Corporate Emergency Response Drive",
    organizer: "Fatimid Foundation",
    city: "Karachi",
    locationName: "Karachi Gymkhana, Civil Lines",
    requiredTypes: "A-, B-, O-, AB-",
    duration: "June 03, 10:00 AM - 06:00 PM",
    embedMapUrl: "https://maps.google.com/?q=$$$"
  },
  {
    id: "cam_004",
    name: "Coastal Defense Community Camp",
    organizer: "Aman Health Initiative",
    city: "Karachi",
    locationName: "DHA Phase 6 Community Hall",
    requiredTypes: "All Groups",
    duration: "June 08, 09:00 AM - 04:00 PM",
    embedMapUrl: "http://googleusercontent.com/maps.google.com/6"
  }
];

export default function BloodHub() {
  // Application UI State
  const [activeTab, setActiveTab] = useState('requests') // 'requests' | 'campaigns' | 'network'
  const [viewMode, setViewMode] = useState('list') // 'list' | 'map'
  const [requestsList, setRequestsList] = useState(mockRequests)
  const [expandedRequest, setExpandedRequest] = useState(null)

  // Filtering system
  const [searchCity, setSearchCity] = useState('')
  const [filterBlood, setFilterBlood] = useState('All')
  const [filterUrgency, setFilterUrgency] = useState('All')

  // Geolocation states
  const [userCoords, setUserCoords] = useState(null)
  const [geoTracking, setGeoTracking] = useState(false)

  // Interactive Donation Commitment Registries
  const [committedRequests, setCommittedRequests] = useState([])

  // System Notification Toast System
  const [toasts, setToasts] = useState([])

  // Live Emergency Simulation Hook
  useEffect(() => {
    const triggerSimulatedEmergency = () => {
      const emergencyAlerts = [
        { id: Date.now(), hospital: "Shaukat Khanum Memorial", type: "B+", city: "Lahore", msg: "Critical Emergency Shortage detected in blood bank inventory.", isSuccess: false },
        { id: Date.now() + 1, hospital: "Civil Hospital", type: "O-", city: "Karachi", msg: "Urgent O-Negative requirement flagged for ICU Ward 4.", isSuccess: false }
      ];
      const randomAlert = emergencyAlerts[Math.floor(Math.random() * emergencyAlerts.length)];

      setToasts(prev => [...prev, randomAlert]);
      // Remove automatically after 6 seconds
      setTimeout(() => {
        setToasts(prev => prev.filter(t => t.id !== randomAlert.id));
      }, 6000);
    };

    const interval = setTimeout(triggerSimulatedEmergency, 5000);
    return () => clearTimeout(interval);
  }, []);

  // Request browser location Access
  const enableLocation = () => {
    if (navigator.geolocation) {
      setGeoTracking(true);
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserCoords({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
          setGeoTracking(false);
        },
        () => {
          setGeoTracking(false);
          alert("Could not pull location variables automatically. Using central routing fallback.");
        }
      );
    }
  };

  // Commit Donation Interactive Execution Logic
  const handleCommitDonation = (id, hospitalName, bloodType) => {
    if (committedRequests.includes(id)) return;

    setCommittedRequests(prev => [...prev, id]);

    // Dispatch a Success Toast payload directly to the responsive layout stack
    const successToast = {
      id: Date.now(),
      hospital: hospitalName,
      type: bloodType,
      city: "Karachi",
      msg: `Commitment processing registered! The tracking desk is reserving tracking variables for your arrival.`,
      isSuccess: true
    };

    setToasts(prev => [...prev, successToast]);

    // Automatic visual garbage cleanup clearing after 6 seconds
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== successToast.id));
    }, 6000);
  };

  // Static/dynamic calculation helper proxy for Pakistan regions
  const calculateDistanceProxy = (city) => {
    if (!userCoords) return null;
    switch (city) {
      case 'Karachi': return userCoords.lat > 28 ? "1,140 km" : "12.4 km";
      case 'Lahore': return userCoords.lat > 28 ? "42 km" : "1,210 km";
      case 'Islamabad': return userCoords.lat > 32 ? "15.1 km" : "1,490 km";
      default: return "Nearby";
    }
  };

  // Filter Pipeline Processing
  const filteredRequests = requestsList.filter(item => {
    const matchCity = item.city.toLowerCase().includes(searchCity.toLowerCase());
    const matchBlood = filterBlood === 'All' || item.bloodType === filterBlood;
    const matchUrgency = filterUrgency === 'All' || item.urgency === filterUrgency;
    return matchCity && matchBlood && matchUrgency;
  });

  return (
    <div className="w-full min-h-screen py-6 md:py-10 px-4 sm:px-6 md:px-8 bg-[#FAF9F6] text-slate-800 font-sans relative antialiased">

      {/* REAL-TIME TOAST NOTIFICATION STACK */}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-3 max-w-sm w-full pointer-events-none">
        <AnimatePresence>
          {toasts.map((toast) => (
            <motion.div
              key={toast.id}
              initial={{ opacity: 0, y: 50, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8, transition: { duration: 0.2 } }}
              className={`pointer-events-auto w-full bg-slate-900 border text-white rounded-xl p-4 shadow-2xl flex items-start gap-3 ${toast.isSuccess ? 'border-emerald-500/40' : 'border-red-500/30'
                }`}
            >
              <div className={`h-9 w-9 rounded-lg flex items-center justify-center shrink-0 ${toast.isSuccess ? 'bg-emerald-600' : 'bg-red-600 animate-pulse'
                }`}>
                {toast.isSuccess ? <CheckCircle2 size={18} className="text-white" /> : <Bell size={18} className="text-white" />}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <span className={`text-xs font-bold tracking-wider uppercase ${toast.isSuccess ? 'text-emerald-400' : 'text-red-400'
                    }`}>
                    {toast.isSuccess ? "🎉 Commitment Logged" : "🚨 Live Critical Match"}
                  </span>
                  <button onClick={() => setToasts(prev => prev.filter(t => t.id !== toast.id))} className="text-slate-400 hover:text-white">
                    <X size={14} />
                  </button>
                </div>
                <h4 className="text-xs font-extrabold mt-0.5 text-white truncate">{toast.hospital} ({toast.city})</h4>
                <p className="text-[11px] text-slate-300 mt-1 line-clamp-2">{toast.msg}</p>
                <div className={`mt-2 inline-flex items-center gap-1 rounded px-2 py-0.5 text-[10px] font-black border ${toast.isSuccess
                    ? 'bg-emerald-950 text-emerald-400 border-emerald-900'
                    : 'bg-red-950 text-red-400 border-red-900'
                  }`}>
                  {toast.isSuccess ? 'Desk State: Confirmed' : `Required: ${toast.type}`}
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      <div className="grid items-start gap-6 md:gap-8 grid-cols-1 xl:grid-cols-[280px_1fr]">

        {/* SIDEBAR PANEL */}
        <Sidebar />

        {/* MAIN PAGE CONTENT */}
        <div className="rounded-[24px] md:rounded-[32px] bg-white border border-slate-200/60 p-3 sm:p-5 shadow-sm">

          {/* HERO BANNER SECTION */}
          <div className="relative overflow-hidden rounded-[20px] md:rounded-[24px] border border-red-100 bg-gradient-to-br from-rose-50/40 via-white to-amber-50/20 shadow-sm">
            <div className="absolute inset-0 bg-gradient-to-r from-red-600/[0.02] via-transparent to-amber-500/[0.02]" />
            <div className="relative p-6 sm:p-8 md:p-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">

              <div className="max-w-2xl">
                <div className="mb-4 flex w-fit items-center gap-2 rounded-full border border-red-200 bg-red-50/60 px-3 py-1 text-[11px] font-bold text-red-800 tracking-wide uppercase">
                  <Sparkles size={13} className="animate-pulse text-red-600" />
                  National Emergency Feed • Live Across Pakistan
                </div>
                <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-slate-900">
                  Blood Donation <span className="text-red-600">Hub</span>
                </h1>
                <p className="mt-2 text-sm md:text-base leading-relaxed text-slate-500 font-medium">
                  Central clearing network connecting immediate hospital critical demands, regional drives, and emergency volunteers. Verify tracking information directly to rescue active cases.
                </p>

                {/* Geolocation Hook Activator Banner */}
                <div className="mt-4 flex flex-wrap gap-2">
                  <button
                    onClick={enableLocation}
                    className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-lg border transition ${userCoords
                        ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
                        : 'bg-white border-slate-200 hover:border-slate-300 text-slate-700 shadow-xs'
                      }`}
                  >
                    <Navigation size={13} className={geoTracking ? "animate-spin" : ""} />
                    {userCoords ? `Proximity Activated (${userCoords.lat.toFixed(2)}, ${userCoords.lng.toFixed(2)})` : "Detect My Location"}
                  </button>
                </div>
              </div>

              <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-red-600 to-rose-700 text-white shadow-lg shadow-red-600/20">
                <HeartPulse size={30} className="animate-[pulse_2s_infinite]" />
              </div>
            </div>
          </div>

          {/* APPLICATION MAIN ROUTING CONTROL SUB-HEADER */}
          <div className="mt-8 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 border-b border-slate-100 pb-5">
            <div className="flex p-1 bg-slate-100 rounded-xl w-fit gap-1">
              <button
                onClick={() => { setActiveTab('requests'); setViewMode('list'); }}
                className={`px-4 py-2 text-xs font-extrabold rounded-lg transition flex items-center gap-2 ${activeTab === 'requests' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500 hover:text-slate-800'}`}
              >
                <Droplet size={14} className="text-red-600" /> Live Requests
              </button>
              <button
                onClick={() => { setActiveTab('campaigns'); setViewMode('list'); }}
                className={`px-4 py-2 text-xs font-extrabold rounded-lg transition flex items-center gap-2 ${activeTab === 'campaigns' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500 hover:text-slate-800'}`}
              >
                <Calendar size={14} /> Donation Camps
              </button>
            </div>

            {/* List / Map toggle selector */}
            {activeTab !== 'campaigns' && (
              <div className="flex items-center border border-slate-200 rounded-xl p-1 bg-white gap-1 self-start sm:self-auto">
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-1.5 rounded-lg text-slate-600 transition ${viewMode === 'list' ? 'bg-slate-100 text-slate-900' : 'hover:bg-slate-50'}`}
                  title="List Matrix"
                >
                  <List size={16} />
                </button>
                <button
                  onClick={() => setViewMode('map')}
                  className={`p-1.5 rounded-lg text-slate-600 transition ${viewMode === 'map' ? 'bg-slate-100 text-slate-900' : 'hover:bg-slate-50'}`}
                  title="Map Network Matrix"
                >
                  <Map size={16} />
                </button>
              </div>
            )}
          </div>

          {/* DYNAMIC FILTERS TOOLBAR */}
          {activeTab === 'requests' && viewMode === 'list' && (
            <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-3 p-3 bg-slate-50/60 rounded-xl border border-slate-100">
              <div className="relative">
                <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="Filter City (e.g. Karachi, Lahore)..."
                  value={searchCity}
                  onChange={(e) => setSearchCity(e.target.value)}
                  className="w-full bg-white border border-slate-200 rounded-lg pl-9 pr-3 py-1.5 text-xs focus:outline-hidden focus:border-slate-300 font-medium"
                />
              </div>

              <div className="flex items-center gap-2 bg-white border border-slate-200 rounded-lg px-2.5 py-1.5">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Group:</span>
                <select
                  value={filterBlood}
                  onChange={(e) => setFilterBlood(e.target.value)}
                  className="bg-transparent border-0 text-xs font-bold text-slate-700 focus:outline-hidden w-full"
                >
                  <option value="All">All Groups</option>
                  <option value="O-">O-</option>
                  <option value="O+">O+</option>
                  <option value="A+">A+</option>
                  <option value="B-">B-</option>
                  <option value="AB+">AB+</option>
                </select>
              </div>

              <div className="flex items-center gap-2 bg-white border border-slate-200 rounded-lg px-2.5 py-1.5">
                <SlidersHorizontal size={13} className="text-slate-400" />
                <select
                  value={filterUrgency}
                  onChange={(e) => setFilterUrgency(e.target.value)}
                  className="bg-transparent border-0 text-xs font-bold text-slate-700 focus:outline-hidden w-full"
                >
                  <option value="All">All Urgency</option>
                  <option value="Critical">🚨 Critical</option>
                  <option value="Medium">Medium Priority</option>
                  <option value="Low">Low Priority</option>
                </select>
              </div>
            </div>
          )}

          {/* DUAL WORKSPACE LAYOUT CONTAINER */}
          <div className="mt-6 grid gap-6 grid-cols-1 lg:grid-cols-5 items-start">

            {/* LEFT COLUMN: PRIMARY WORKSPACE DISPLAY DATA */}
            <div className="lg:col-span-3 space-y-4">

              {/* INTERACTIVE WORKSPACE SECTION: 1. REQUEST FEED */}
              {activeTab === 'requests' && viewMode === 'list' && (
                <motion.div layout className="space-y-3">
                  {filteredRequests.length === 0 ? (
                    <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-200 bg-white py-14 text-center px-4 shadow-3xs">
                      <Droplet size={24} className="text-slate-300" />
                      <h3 className="mt-3 font-bold text-slate-700 text-sm">No Matching Active Feeds</h3>
                      <p className="mt-1 text-xs text-slate-400 max-w-xs">Try clearing filters or check neighboring city jurisdictions.</p>
                    </div>
                  ) : (
                    filteredRequests.map((b) => {
                      const computedDistance = calculateDistanceProxy(b.city);
                      const isCritical = b.urgency === 'Critical';
                      const isCommitted = committedRequests.includes(b._id);

                      return (
                        <motion.div
                          layout
                          key={b._id}
                          className={`group rounded-xl border p-5 bg-white transition shadow-3xs hover:shadow-xs flex flex-col justify-between ${isCritical ? 'border-red-100 hover:border-red-200 bg-gradient-to-r from-red-50/[0.15] to-transparent' : 'border-slate-100 hover:border-slate-200'
                            }`}
                        >
                          <div>
                            <div className="flex items-start justify-between gap-4">
                              <div className="min-w-0">
                                <div className="flex items-center gap-2 flex-wrap">
                                  <Building2 size={14} className="text-slate-400 shrink-0" />
                                  <h3 className="font-bold text-slate-900 text-sm md:text-base tracking-tight truncate">
                                    {b.hospital}
                                  </h3>
                                </div>
                                <div className="mt-1.5 flex items-center gap-3 flex-wrap text-xs text-slate-500 font-medium">
                                  <span className="flex items-center gap-1">
                                    <MapPin size={12} className="text-red-500 shrink-0" /> {b.city}
                                  </span>
                                  <span className="flex items-center gap-1 text-slate-400">
                                    <Clock size={12} /> {b.timestamp}
                                  </span>
                                  {computedDistance && (
                                    <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-slate-100 text-slate-700 text-[10px] font-bold">
                                      {computedDistance} away
                                    </span>
                                  )}
                                </div>
                              </div>

                              <span className={`shrink-0 flex items-center justify-center h-10 w-11 rounded-lg border text-xs font-black shadow-3xs ${isCritical ? 'bg-red-600 border-red-600 text-white' : 'bg-slate-50 border-slate-200 text-slate-800'
                                }`}>
                                {b.bloodType}
                              </span>
                            </div>

                            {/* Urgency Badge Array */}
                            <div className="mt-3">
                              <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold tracking-wide uppercase ${isCritical ? 'bg-red-100 text-red-800' : b.urgency === 'Medium' ? 'bg-amber-100 text-amber-800' : 'bg-slate-100 text-slate-700'
                                }`}>
                                {isCritical && <span className="h-1.5 w-1.5 rounded-full bg-red-600 animate-ping" />}
                                {b.urgency} Priority
                              </span>
                            </div>

                            <div className="mt-3 rounded-lg bg-slate-50/70 p-3 border border-slate-100/50">
                              <p className="text-xs font-medium leading-relaxed text-slate-600">
                                {expandedRequest === b._id ? b.details : `${b.details.substring(0, 100)}...`}
                              </p>
                              <button
                                onClick={() => setExpandedRequest(expandedRequest === b._id ? null : b._id)}
                                className="mt-2 text-[11px] font-bold text-slate-900 hover:text-red-600 transition inline-flex items-center gap-0.5"
                              >
                                {expandedRequest === b._id ? 'Collapse Case Log' : 'Expand Extended Case Metrics'}
                                <ChevronDown size={12} className={`transition-transform duration-200 ${expandedRequest === b._id ? 'rotate-180' : ''}`} />
                              </button>
                            </div>
                          </div>

                          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                            <a
                              href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(b.hospital + " " + b.city)}`}
                              target="_blank"
                              rel="noreferrer"
                              className="text-xs font-bold text-slate-500 hover:text-slate-800 transition flex items-center gap-1"
                            >
                              Open in Google Maps
                            </a>
                            <button
                              onClick={() => handleCommitDonation(b._id, b.hospital, b.bloodType)}
                              disabled={isCommitted}
                              className={`font-bold text-xs px-3 py-1.5 rounded-lg transition shadow-xs select-none ${isCommitted
                                  ? 'bg-emerald-600 text-white cursor-not-allowed'
                                  : 'bg-slate-950 hover:bg-slate-900 text-white'
                                }`}
                            >
                              {isCommitted ? '✓ Committed' : 'Commit Donation'}
                            </button>
                          </div>
                        </motion.div>
                      )
                    })
                  )}
                </motion.div>
              )}

              {/* INTERACTIVE WORKSPACE SECTION: 2. LIVE MAP MODE OVERVIEW */}
              {activeTab === 'requests' && viewMode === 'map' && (
                <div className="rounded-xl overflow-hidden border border-slate-200 h-[500px] bg-slate-100 relative">
                  {/* <iframe
                    title="Pakistan Emergency Matrix Tracker Map"
                    src="https://maps.google.com/maps?q=Pakistan%20Hospitals&t=&z=5&ie=UTF8&iwloc=&output=embed"
                    width="100%"
                    height="100%"
                    className="border-0"
                    allowFullScreen=""
                    loading="lazy"
                  /> */}
                  <BloodMap
                    requests={filteredRequests}
                    userCoords={userCoords}
                  />
                  <div className="absolute top-3 left-3 bg-white/95 backdrop-blur-xs p-3 rounded-xl border border-slate-200 shadow-xl max-w-xs pointer-events-none">
                    <h4 className="text-xs font-black text-slate-900 uppercase tracking-wider">Dynamic Feed Overlay</h4>
                    <p className="text-[11px] text-slate-500 mt-0.5 leading-normal">Pins display verified partner trauma hubs cross-matching urgent requests internally.</p>
                  </div>
                </div>
              )}

              {/* INTERACTIVE WORKSPACE SECTION: 3. CAMPAIGN DISCOVERY */}
              {activeTab === 'campaigns' && (
                <div className="space-y-4">
                  {mockCampaigns.map((camp) => (
                    <div key={camp.id} className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-3xs hover:border-slate-300 transition">
                      <div className="p-5">
                        <div className="flex flex-col sm:flex-row justify-between items-start gap-2">
                          <div>
                            <span className="text-[10px] font-bold text-red-600 bg-red-50 border border-red-100 px-2 py-0.5 rounded-md uppercase tracking-wider">Active Mobile Unit</span>
                            <h3 className="font-extrabold text-slate-900 text-base mt-1">{camp.name}</h3>
                            <p className="text-xs font-bold text-slate-500 mt-0.5">Organized by: <span className="text-slate-800">{camp.organizer}</span></p>
                          </div>
                          <div className="bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-200 text-right self-start sm:self-auto">
                            <span className="block text-[9px] uppercase font-black text-slate-400">Target Inventory</span>
                            <span className="text-xs font-black text-slate-800">{camp.requiredTypes}</span>
                          </div>
                        </div>

                        <div className="mt-3 flex items-center gap-4 text-xs font-semibold text-slate-500 border-t border-slate-50 pt-3 flex-wrap">
                          <span className="flex items-center gap-1"><MapPin size={13} className="text-slate-400" /> {camp.locationName}, {camp.city}</span>
                          <span className="flex items-center gap-1"><Clock size={13} className="text-slate-400" /> {camp.duration}</span>
                        </div>
                      </div>

                      {/* Embed Google Map Section Container per Campaign */}
                      <div className="h-44 border-t border-slate-100 bg-slate-50">
                        <iframe
                          title={camp.name}
                          src={camp.embedMapUrl}
                          width="100%"
                          height="100%"
                          className="border-0 opacity-80 group-hover:opacity-100 transition"
                          loading="lazy"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* MULTI-HOSPITAL NETWORK VIEW - MAP TARGET MODE */}
              {activeTab === 'network' && viewMode === 'map' && (
                <div className="rounded-xl overflow-hidden border border-slate-200 h-[480px]">
                  <iframe
                    title="Pakistan Full Hospital Network View Matrix"
                    src="https://maps.google.com/maps?q=Hospitals%20in%20Pakistan&t=&z=6&ie=UTF8&iwloc=&output=embed"
                    width="100%"
                    height="100%"
                    className="border-0"
                    loading="lazy"
                  />
                </div>
              )}
            </div>

            {/* RIGHT COLUMN: STICKY INFORMATION & PROTOCOL BAR PANEL */}
            <div className="lg:col-span-2">
              <aside className="sticky top-6 space-y-4">

                {/* SYSTEM ADVISORY BANNER */}
                <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-3xs">
                  <h2 className="text-sm font-black text-slate-900 tracking-tight uppercase">Emergency Coordinator Panel</h2>
                  <p className="mt-1 text-xs text-slate-500 font-medium leading-normal">
                    Direct access portals for regional medical handlers. Match validation processes run autonomously hourly.
                  </p>
                  <div className="mt-4 space-y-2">
                    <div className="p-3 rounded-lg bg-slate-50 border border-slate-100 text-xs flex justify-between items-center">
                      <span className="font-semibold text-slate-600">Total Live Requests</span>
                      <span className="font-extrabold text-red-600 bg-red-50 px-2 py-0.5 rounded border border-red-100">{requestsList.length} Network Wide</span>
                    </div>
                    <div className="p-3 rounded-lg bg-slate-50 border border-slate-100 text-xs flex justify-between items-center">
                      <span className="font-semibold text-slate-600">Active Field Campaigns</span>
                      <span className="font-extrabold text-slate-800 bg-slate-100 px-2 py-0.5 rounded">{mockCampaigns.length} Tracked</span>
                    </div>
                  </div>
                </div>

                {/* MEDICAL SAFETY LAWS */}
                <div className="rounded-xl border border-red-200 bg-gradient-to-br from-red-50/30 to-amber-50/10 p-5 space-y-3">
                  <div className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-red-900">
                    <ShieldAlert size={15} className="text-red-600" />
                    Crucial Safety Protocol
                  </div>
                  <p className="text-xs leading-relaxed font-medium text-slate-600">
                    Always request direct validation with the tracking desk nurse via official channel phone relays prior to physical departures for blood donation processing.
                  </p>
                  <div className="text-[11px] font-bold text-red-700/80 bg-red-100/50 p-2.5 rounded-lg border border-red-200/40">
                    ⚠️ Donors should keep a minimum 3-month separation window sequence between whole-blood donations.
                  </div>
                </div>

                {/* HELP COMPLIANCE DESK */}
                <div className="rounded-xl border border-slate-100 bg-slate-50/50 p-4 flex gap-3 items-start">
                  <AlertCircle size={16} className="text-slate-400 mt-0.5 shrink-0" />
                  <p className="text-[11px] leading-normal font-medium text-slate-500">
                    To connect an NGO or private clinic node infrastructure system setup to this automated network registry dashboard tier, submit routing queries directly through our central IT integration portal.
                  </p>
                </div>
              </aside>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}