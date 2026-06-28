import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  User, 
  Shield, 
  Bell, 
  Lock, 
  Mail, 
  Camera, 
  CheckCircle2, 
  AlertCircle,
  Loader2,
  ChevronRight
} from 'lucide-react';
import api from '../utils/api'; 

// --- Framer Motion Variants ---
const pageVariants = {
  initial: { opacity: 0, y: 15 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.4, ease: 'easeOut' } },
  exit: { opacity: 0, y: -15 }
};

const tabContentVariants = {
  initial: { opacity: 0, x: 10 },
  animate: { opacity: 1, x: 0, transition: { duration: 0.3, ease: 'easeOut' } }
};

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState('profile');
  const [isLoading, setIsLoading] = useState(false);
  const [toast, setToast] = useState(null);

  const [profileForm, setProfileForm] = useState({
    name: '',
    email: '',
    role: 'user', 
    phone: '',    
    organization: ''
  });

  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const [notifications, setNotifications] = useState({
    emailAlerts: true,
    donationReceipts: true,
    animalRescueUpdates: false,
    securityAlerts: true
  });

  const showToast = (type, message) => {
    setToast({ type, message });
    setTimeout(() => setToast(null), 4000);
  };

  // --- GET USER PROFILE ---
  useEffect(() => {
    const fetchUserData = async () => {
      setIsLoading(true);
      try {
        const response = await api.get('/api/auth/me');
        const data = response.data;

        setProfileForm({
          name: data.name || '',
          email: data.email || '',
          role: data.role || 'user',
          phone: data.phone || '',
          organization: data.organization || ''
        });
      } catch (err) {
        // Dynamically pull error from backend response payload
        const errorMsg = err.response?.data?.msg || err.response?.data?.message || 'Failed to load profile data.';
        showToast('error', errorMsg);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserData();
  }, []);

  // --- UPDATE PROFILE ---
  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await api.put('/api/auth/update-profile', {
        name: profileForm.name,
        phone: profileForm.phone,
        organization: profileForm.organization
      });
      
      showToast('success', 'Profile settings updated successfully.');
    } catch (err) {
      const errorMsg = err.response?.data?.msg || err.response?.data?.message || 'Failed to update profile.';
      showToast('error', errorMsg);
    } finally {
      setIsLoading(false);
    }
  };

  // --- CHANGE PASSWORD (FRONTEND BACKEND-ADAPTIVE LAYER) ---
  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      showToast('error', 'New passwords do not match.');
      return;
    }

    setIsLoading(true);
    try {
      // Sending all common naming variations to satisfy your backend controller without changing it
      await api.put('/api/auth/change-password', {
        currentPassword: passwordForm.currentPassword, 
        oldPassword: passwordForm.currentPassword,     
        password: passwordForm.currentPassword,        
        newPassword: passwordForm.newPassword
      });
      
      showToast('success', 'Password updated successfully.');
      setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (err) {
      // Reads the exact rejection message directly from your backend error handling
      const errorMsg = err.response?.data?.msg || err.response?.data?.message || 'Password update rejected.';
      showToast('error', errorMsg);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleNotification = (key) => {
    setNotifications(prev => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <motion.div 
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      className="min-h-screen bg-[#FDFBF7] p-6 lg:p-10 text-neutral-800"
    >
      {/* Toast System */}
      <AnimatePresence>
        {toast && (
          <motion.div 
            initial={{ opacity: 0, y: -50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.9 }}
            className={`fixed top-6 right-6 z-50 flex items-center gap-3 px-5 py-4 rounded-xl shadow-xl border backdrop-blur-md ${
              toast.type === 'success' 
                ? 'bg-emerald-50/90 border-emerald-200 text-emerald-800' 
                : 'bg-rose-50/90 border-rose-200 text-rose-800'
            }`}
          >
            {toast.type === 'success' ? <CheckCircle2 className="w-5 h-5 text-emerald-600" /> : <AlertCircle className="w-5 h-5 text-rose-600" />}
            <span className="text-sm font-medium">{toast.message}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header */}
      <div className="mb-8 border-b border-neutral-200/60 pb-6">
        <div className="flex items-center gap-3 text-xs font-semibold uppercase tracking-wider text-neutral-400 mb-2">
          <span>Dashboard</span>
          <ChevronRight className="w-3 h-3" />
          <span className="text-[#800020] font-medium">Account Settings</span>
        </div>
        <h1 className="text-3xl font-bold tracking-tight text-neutral-900 font-serif">Settings</h1>
        <p className="text-neutral-500 mt-1 text-sm">Manage your profile properties, platform credentials, and notification settings.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Navigation Sidebar */}
        <nav className="lg:col-span-3 flex flex-col gap-1.5 bg-white p-3 rounded-2xl border border-neutral-200/50 shadow-sm">
          {[
            { id: 'profile', label: 'Profile Account', icon: User },
            { id: 'security', label: 'Security & Access', icon: Shield },
            { id: 'notifications', label: 'Notification Vectors', icon: Bell },
          ].map((tab) => {
            const IconComponent = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`relative flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 text-left ${
                  isActive 
                    ? 'text-[#800020] font-semibold' 
                    : 'text-neutral-500 hover:text-neutral-900 hover:bg-neutral-50'
                }`}
              >
                {isActive && (
                  <motion.div 
                    layoutId="activeSettingsTabIndicator"
                    className="absolute inset-0 bg-[#800020]/5 border-l-4 border-[#800020] rounded-xl"
                    transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                  />
                )}
                <IconComponent className={`w-4 h-4 relative z-10 ${isActive ? 'text-[#800020]' : 'text-neutral-400'}`} />
                <span className="relative z-10">{tab.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Workspace Panel */}
        <div className="lg:col-span-9 bg-white rounded-2xl border border-neutral-200/50 shadow-sm relative overflow-hidden min-h-[400px]">
          {isLoading && (
            <div className="absolute inset-0 bg-white/60 backdrop-blur-[1px] flex items-center justify-center z-40">
              <Loader2 className="w-8 h-8 animate-spin text-[#800020]" />
            </div>
          )}

          <div className="p-6 lg:p-8">
            <AnimatePresence mode="wait">
              {/* Profile View */}
              {activeTab === 'profile' && (
                <motion.div
                  key="profile-tab"
                  variants={tabContentVariants}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                  className="space-y-6"
                >
                  <div>
                    <h3 className="text-xl font-semibold text-neutral-900">Profile Parameters</h3>
                    <p className="text-sm text-neutral-500">Update identification details synced with database profile structures.</p>
                  </div>

                  <div className="flex items-center gap-6 p-4 bg-[#FDFBF7] rounded-xl border border-neutral-100">
                    <div className="relative group cursor-pointer">
                      <div className="w-20 h-20 rounded-full bg-neutral-200 flex items-center justify-center border-2 border-[#800020]/20 overflow-hidden font-serif text-2xl font-bold text-[#800020]">
                        {profileForm.name ? profileForm.name.charAt(0).toUpperCase() : '?'}
                      </div>
                      <div className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                        <Camera className="w-5 h-5 text-white" />
                      </div>
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold text-neutral-800">Profile Identifier</h4>
                      <p className="text-xs text-neutral-400 mt-0.5">Automated image placeholder generated via account parameters.</p>
                      <span className="inline-block px-2 py-0.5 mt-2 bg-[#800020]/10 text-[#800020] text-xs font-mono font-medium rounded capitalize">
                        Role Group: {profileForm.role}
                      </span>
                    </div>
                  </div>

                  <form onSubmit={handleProfileSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-neutral-600 uppercase tracking-wider">Full Identity Handle</label>
                        <input 
                          type="text" 
                          value={profileForm.name}
                          onChange={(e) => setProfileForm({...profileForm, name: e.target.value})}
                          className="w-full px-4 py-2.5 rounded-xl border border-neutral-200 focus:outline-none focus:ring-2 focus:ring-[#800020]/20 focus:border-[#800020] transition-all bg-neutral-50/50 text-sm" 
                          required
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-neutral-600 uppercase tracking-wider">Communication Endpoint (Email)</label>
                        <div className="relative">
                          <Mail className="absolute left-3.5 top-3.5 w-4 h-4 text-neutral-400" />
                          <input 
                            type="email" 
                            value={profileForm.email}
                            disabled
                            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-neutral-200 bg-neutral-100 text-neutral-500 cursor-not-allowed font-medium text-sm" 
                          />
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-neutral-600 uppercase tracking-wider">Primary Mobile Array</label>
                        <input 
                          type="text" 
                          value={profileForm.phone}
                          onChange={(e) => setProfileForm({...profileForm, phone: e.target.value})}
                          className="w-full px-4 py-2.5 rounded-xl border border-neutral-200 focus:outline-none focus:ring-2 focus:ring-[#800020]/20 focus:border-[#800020] transition-all bg-neutral-50/50 text-sm" 
                          placeholder="+92 000 0000000"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-neutral-600 uppercase tracking-wider">Affiliated Entity Namespace</label>
                        <input 
                          type="text" 
                          value={profileForm.organization}
                          onChange={(e) => setProfileForm({...profileForm, organization: e.target.value})}
                          className="w-full px-4 py-2.5 rounded-xl border border-neutral-200 focus:outline-none focus:ring-2 focus:ring-[#800020]/20 focus:border-[#800020] transition-all bg-neutral-50/50 text-sm" 
                          placeholder="AidAlign Hub"
                        />
                      </div>
                    </div>

                    <div className="pt-4 border-t border-neutral-100 flex justify-end">
                      <motion.button
                        whileHover={{ scale: 1.01 }}
                        whileTap={{ scale: 0.99 }}
                        type="submit"
                        className="px-6 py-2.5 rounded-xl bg-[#800020] hover:bg-[#66001A] text-white text-sm font-medium shadow-sm transition-colors duration-200"
                      >
                        Commit Schema Updates
                      </motion.button>
                    </div>
                  </form>
                </motion.div>
              )}

              {/* Password Security View */}
              {activeTab === 'security' && (
                <motion.div
                  key="security-tab"
                  variants={tabContentVariants}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                  className="space-y-6"
                >
                  <div>
                    <h3 className="text-xl font-semibold text-neutral-900">Security & Authentication Access</h3>
                    <p className="text-sm text-neutral-500">Rotate access criteria credentials handled directly through backend hash validations.</p>
                  </div>

                  <form onSubmit={handlePasswordSubmit} className="space-y-4 max-w-xl">
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-neutral-600 uppercase tracking-wider">Current Passphrase Verification</label>
                      <div className="relative">
                        <Lock className="absolute left-3.5 top-3.5 w-4 h-4 text-neutral-400" />
                        <input 
                          type="password" 
                          value={passwordForm.currentPassword}
                          onChange={(e) => setPasswordForm({...passwordForm, currentPassword: e.target.value})}
                          className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-neutral-200 focus:outline-none focus:ring-2 focus:ring-[#800020]/20 focus:border-[#800020] transition-all bg-neutral-50/50 text-sm" 
                          required
                        />
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-neutral-600 uppercase tracking-wider">Target Mutation Passphrase</label>
                      <div className="relative">
                        <Lock className="absolute left-3.5 top-3.5 w-4 h-4 text-neutral-400" />
                        <input 
                          type="password" 
                          value={passwordForm.newPassword}
                          onChange={(e) => setPasswordForm({...passwordForm, newPassword: e.target.value})}
                          className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-neutral-200 focus:outline-none focus:ring-2 focus:ring-[#800020]/20 focus:border-[#800020] transition-all bg-neutral-50/50 text-sm" 
                          required
                        />
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-neutral-600 uppercase tracking-wider">Confirm Target Passphrase</label>
                      <div className="relative">
                        <Lock className="absolute left-3.5 top-3.5 w-4 h-4 text-neutral-400" />
                        <input 
                          type="password" 
                          value={passwordForm.confirmPassword}
                          onChange={(e) => setPasswordForm({...passwordForm, confirmPassword: e.target.value})}
                          className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-neutral-200 focus:outline-none focus:ring-2 focus:ring-[#800020]/20 focus:border-[#800020] transition-all bg-neutral-50/50 text-sm" 
                          required
                        />
                      </div>
                    </div>

                    <div className="pt-4 border-t border-neutral-100 flex justify-end">
                      <motion.button
                        whileHover={{ scale: 1.01 }}
                        whileTap={{ scale: 0.99 }}
                        type="submit"
                        className="px-6 py-2.5 rounded-xl bg-[#800020] hover:bg-[#66001A] text-white text-sm font-medium shadow-sm transition-colors duration-200"
                      >
                        Rotate Access Phrase
                      </motion.button>
                    </div>
                  </form>
                </motion.div>
              )}

              {/* Notifications View */}
              {activeTab === 'notifications' && (
                <motion.div
                  key="notifications-tab"
                  variants={tabContentVariants}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                  className="space-y-6"
                >
                  <div>
                    <h3 className="text-xl font-semibold text-neutral-900">Communication Alerts Mapping</h3>
                    <p className="text-sm text-neutral-500">Configure application interface notification preferences for live telemetry updates.</p>
                  </div>

                  <div className="space-y-3">
                    {[
                      { key: 'emailAlerts', title: 'Global System Summary', desc: 'Outbound messaging updates for ledger changes and general updates.' },
                      { key: 'donationReceipts', title: 'Real-Time Donation Receipts', desc: 'System triggers tracking logs instantly upon verified transaction handshakes.' },
                      { key: 'animalRescueUpdates', title: 'Animal Shelter Telemetry Alerts', desc: 'Receive instant pushes when local animal hub capacities change.' },
                      { key: 'securityAlerts', title: 'Cryptographic Audit Flags', desc: 'Instant transmission logs dispatched on critical middleware status warnings.' }
                    ].map((item) => (
                      <div 
                        key={item.key}
                        className="flex items-center justify-between p-4 bg-neutral-50/50 rounded-xl border border-neutral-200/40 hover:bg-neutral-50 transition-colors duration-150"
                      >
                        <div className="pr-4">
                          <h4 className="text-sm font-semibold text-neutral-900">{item.title}</h4>
                          <p className="text-xs text-neutral-500 mt-0.5 max-w-xl">{item.desc}</p>
                        </div>
                        
                        <button
                          type="button"
                          onClick={() => toggleNotification(item.key)}
                          className={`w-11 h-6 flex items-center rounded-full p-0.5 transition-colors duration-300 focus:outline-none ${
                            notifications[item.key] ? 'bg-[#800020] justify-end' : 'bg-neutral-200 justify-start'
                          }`}
                        >
                          <motion.div 
                            layout
                            transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                            className="bg-white w-5 h-5 rounded-full shadow-md"
                          />
                        </button>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </motion.div>
  );
}