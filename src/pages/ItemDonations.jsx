import React, { useEffect, useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import api from '../utils/api'
import Sidebar from '../components/Sidebar'
import {
  Package,
  MapPin,
  HeartHandshake,
  Sparkles,
  ClipboardList,
  Plus,
  Trash2,
  CheckCircle2,
  AlertCircle,
  Search,
  ChevronDown,
  FileText,
  X,
  Check
} from 'lucide-react'

// International Standard Categories
const categories = [
  'Clothes',
  'Food',
  'Books',
  'Electronics',
  'Furniture',
  'Toys',
  'Medical Supplies',
  'School Supplies',
  'Other'
]

const conditions = ['New', 'Like New', 'Good', 'Fair']

// Mock list of organizations for the searchable dropdown
const mockOrganizations = [
  'Red Cross International',
  'Doctors Without Borders',
  'United Nations Children’s Fund (UNICEF)',
  'Save the Children',
  'Edhi Foundation',
  'Saylani Welfare Trust',
  'Direct Relief',
  'Habitat for Humanity'
]

export default function ItemDonations() {
  const [list, setList] = useState([])
  const [items, setItems] = useState([{ name: categories[0], condition: 'Good', quantity: 1, description: '' }])
  const [pickupAddress, setPickupAddress] = useState('')
  const [organization, setOrganization] = useState('')
  const [statusMessage, setStatusMessage] = useState({ type: '', text: '' })
  const [loading, setLoading] = useState(false)

  // Searchable Dropdown States
  const [searchQuery, setSearchQuery] = useState('')
  const [isOpenOrgDropdown, setIsOpenOrgDropdown] = useState(false)
  const dropdownRef = useRef(null)

  // Fetch past donations on mount
  useEffect(() => {
    const loadDonations = async () => {
      try {
        const res = await api.get('/api/items')
        setList(res.data)
      } catch (err) {
        console.error('Error loading donations:', err)
      }
    }
    loadDonations()
  }, [])

  // Auto-dismiss status message toast after 4 seconds
  useEffect(() => {
    if (statusMessage.text) {
      const timer = setTimeout(() => {
        setStatusMessage({ type: '', text: '' })
      }, 4000)
      return () => clearTimeout(timer)
    }
  }, [statusMessage.text])

  // Close searchable dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpenOrgDropdown(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // Dynamic Multi-Item Handlers
  const handleAddItem = () => {
    setItems([...items, { name: categories[0], condition: 'Good', quantity: 1, description: '' }])
  }

  const handleRemoveItem = (index) => {
    if (items.length > 1) {
      setItems(items.filter((_, i) => i !== index))
    }
  }

  const handleItemChange = (index, field, value) => {
    const updatedItems = [...items]
    updatedItems[index][field] = value
    setItems(updatedItems)
  }

  // Filter organizations based on user search string
  const filteredOrganizations = mockOrganizations.filter((org) =>
    org.toLowerCase().includes(searchQuery.toLowerCase())
  )

  // Submit Handler mapped perfectly to your Mongoose Schema
  const submitDonation = async (e) => {
    e.preventDefault()
    setLoading(true)
    setStatusMessage({ type: '', text: '' })

    // Build items structural mapping (incorporating custom description text safely if 'Other' is checked)
    const submittedItems = items.map(item => ({
      name: item.name === 'Other' && item.description ? `Other: ${item.description}` : item.name,
      condition: item.condition,
      quantity: item.quantity
    }))

    try {
      await api.post('/api/items', {
        items: submittedItems,
        pickupAddress,
        organization: organization || 'Nearest Charity Hub'
      })

      setStatusMessage({ 
        type: 'success', 
        text: 'Request submitted successfully! A rider will arrive shortly to pick up your donation.' 
      })

      // Reset Form State
      setItems([{ name: categories[0], condition: 'Good', quantity: 1, description: '' }])
      setPickupAddress('')
      setOrganization('')
      setSearchQuery('')

      // Refresh list
      const res = await api.get('/api/items')
      setList(res.data)
    } catch (err) {
      setStatusMessage({ 
        type: 'error', 
        text: 'Could not submit donation request. Please verify details and try again.' 
      })
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="w-full min-h-screen py-6 md:py-10 px-4 sm:px-6 md:px-8 bg-[#FAF8F5]">
      
      {/* EASYPAISA STYLE - MID-SCREEN TOP POPUP NOTIFICATION */}
      <div className="fixed top-8 left-1/2 -translate-x-1/2 z-50 w-[90%] max-w-sm px-0">
        <AnimatePresence>
          {statusMessage.text && (
            <motion.div
              initial={{ opacity: 0, y: -30, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.95, transition: { duration: 0.15 } }}
              className="flex items-center gap-3.5 rounded-full bg-red-950/95 pl-4 pr-3 py-2.5 text-white shadow-2xl backdrop-blur-md border border-white/10"
            >
              {/* Status Circle & Tick Icon */}
              <div className="shrink-0">
                {statusMessage.type === 'success' ? (
                  <div className="flex h-6 w-6 items-center justify-center rounded-full bg-red-700 text-white">
                    <Check size={14} strokeWidth={3} />
                  </div>
                ) : (
                  <div className="flex h-6 w-6 items-center justify-center rounded-full bg-rose-700 text-white">
                    <AlertCircle size={14} />
                  </div>
                )}
              </div>

              {/* Message Text */}
              <div className="flex-1 text-[11px] sm:text-xs font-semibold tracking-wide text-amber-50 pr-1 leading-tight">
                {statusMessage.text}
              </div>

              {/* Close Action */}
              <button 
                type="button"
                onClick={() => setStatusMessage({ type: '', text: '' })}
                className="shrink-0 rounded-full p-1 text-amber-200/60 hover:bg-white/10 hover:text-white transition"
              >
                <X size={14} />
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="grid items-start gap-6 md:gap-8 grid-cols-1 xl:grid-cols-[280px_1fr]">
        
        {/* SIDEBAR */}
        <Sidebar />

        {/* PAGE CONTENT */}
        <div className="rounded-[24px] md:rounded-[32px] bg-gradient-to-br from-stone-50 via-white to-amber-50/40 p-2 sm:p-3">
          
          {/* ORIGINAL HERO BANNER & TEXT RESTORED */}
          <div className="relative overflow-hidden rounded-[20px] md:rounded-[32px] border border-red-900/10 bg-white shadow-xl shadow-amber-100/30">
            <div className="absolute inset-0 bg-gradient-to-r from-red-900/5 via-transparent to-amber-500/5" />
            <div className="relative grid gap-8 px-5 py-8 md:px-6 md:py-10 lg:grid-cols-2 lg:px-12">
              
              <div className="flex flex-col justify-center">
                <div className="mb-4 flex w-fit items-center gap-2 rounded-full border border-red-900/20 bg-amber-50 px-3 py-1.5 md:px-4 text-[10px] md:text-xs font-semibold text-red-900 tracking-wide uppercase">
                  <Sparkles size={14} className="animate-pulse text-red-700" />
                  Rider Pickup Service
                </div>
                <h1 className="text-3xl sm:text-4xl font-black leading-tight text-slate-900 md:text-5xl">
                  Give Your Unused Items a
                  <span className="bg-gradient-to-r from-red-800 to-red-950 bg-clip-text text-transparent block sm:inline">
                    {' '}New Purpose
                  </span>
                </h1>
                <p className="mt-4 max-w-xl text-sm md:text-base leading-relaxed text-slate-600">
                  Fill details, pin your pickup location, and a dedicated rider will deliver your generosity right to verified community hubs.
                </p>
                
                <div className="mt-6 flex flex-wrap gap-3 md:gap-4">
                  <div className="rounded-2xl border border-slate-100 bg-slate-50/80 px-4 py-2.5 md:px-5 md:py-3 backdrop-blur-sm">
                    <div className="text-lg md:text-xl font-extrabold text-slate-900">{categories.length}+ Categories</div>
                    <div className="text-[10px] md:text-xs text-slate-500">Essential goods supported</div>
                  </div>
                  <div className="rounded-2xl border border-slate-100 bg-slate-50/80 px-4 py-2.5 md:px-5 md:py-3 backdrop-blur-sm">
                    <div className="text-lg md:text-xl font-extrabold text-slate-900">Free Pickup</div>
                    <div className="text-[10px] md:text-xs text-slate-500">Directly from your doorstep</div>
                  </div>
                </div>
              </div>

              {/* STATS / VISUAL GRID */}
              <div className="grid gap-4 grid-cols-1 sm:grid-cols-2">
                {categories.slice(0, 4).map((cat) => (
                  <div key={cat} className="group rounded-2xl border border-slate-100 bg-white p-4 md:p-5 transition-all duration-300 hover:border-red-900/20 hover:shadow-md">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-red-800 to-red-900 text-white shadow-sm">
                      <Package size={18} />
                    </div>
                    <h3 className="mt-3 font-bold text-slate-800 text-sm">{cat} Donations</h3>
                    <p className="mt-1 text-xs text-slate-500 leading-normal">Help shelters by providing standard everyday essentials.</p>
                  </div>
                ))}
              </div>

            </div>
          </div>

          {/* MAIN WRAPPER: Form & List */}
          <div className="mt-6 md:mt-8 grid gap-6 md:gap-8 grid-cols-1 xl:grid-cols-5">
            
            {/* LEFT SIDE: DONATION REQUEST FORM */}
            <div className="xl:col-span-3">
              <div className="rounded-[24px] md:rounded-[32px] border border-slate-200/80 bg-white p-5 md:p-6 shadow-xl shadow-slate-100/50">
                <div className="flex flex-col sm:flex-row sm:items-center gap-4 border-b border-slate-100 pb-5">
                  <div className="inline-flex rounded-2xl bg-gradient-to-r from-red-800 to-red-950 p-3.5 text-white shadow-md w-fit">
                    <HeartHandshake size={22} />
                  </div>
                  <div>
                    <h2 className="text-xl md:text-2xl font-bold text-slate-900">Schedule a Pickup</h2>
                    <p className="text-xs md:text-sm text-slate-500">Specify item data metrics requested by our local storage hubs</p>
                  </div>
                </div>

                <form onSubmit={submitDonation} className="mt-6 space-y-6">
                  
                  {/* DYNAMIC ITEMS LIST BOX */}
                  <div className="space-y-4">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <label className="text-sm font-semibold text-slate-700">Item List Bundle</label>
                      <button
                        type="button"
                        onClick={handleAddItem}
                        className="flex items-center justify-center gap-1.5 rounded-xl border border-red-900/20 bg-amber-50/50 px-3 py-2 sm:py-1.5 text-xs font-bold text-red-900 transition hover:bg-amber-100/30 w-full sm:w-auto"
                      >
                        <Plus size={14} /> Add Item
                      </button>
                    </div>

                    <AnimatePresence initial={false}>
                      {items.map((item, index) => (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, y: 15 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, scale: 0.95 }}
                          className="space-y-3 rounded-2xl border border-slate-100 bg-slate-50/50 p-3 md:p-4 transition-all"
                        >
                          <div className="grid gap-3 grid-cols-1 sm:grid-cols-12 items-center">
                            {/* Item Category */}
                            <div className="sm:col-span-5">
                              <select
                                value={item.name}
                                onChange={(e) => handleItemChange(index, 'name', e.target.value)}
                                className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-800 shadow-sm focus:border-red-800 focus:ring-1 focus:ring-red-800"
                              >
                                {categories.map((option) => (
                                  <option key={option} value={option}>{option}</option>
                                ))}
                              </select>
                            </div>

                            {/* Item Condition */}
                            <div className="sm:col-span-4">
                              <select
                                value={item.condition}
                                onChange={(e) => handleItemChange(index, 'condition', e.target.value)}
                                className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-800 shadow-sm focus:border-red-800 focus:ring-1 focus:ring-red-800"
                              >
                                {conditions.map((cond) => (
                                  <option key={cond} value={cond}>{cond} Condition</option>
                                ))}
                              </select>
                            </div>

                            {/* Quantity */}
                            <div className="sm:col-span-2">
                              <input
                                type="number"
                                min="1"
                                value={item.quantity}
                                onChange={(e) => handleItemChange(index, 'quantity', parseInt(e.target.value) || 1)}
                                className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-center text-slate-800 shadow-sm focus:border-red-800 focus:ring-1 focus:ring-red-800"
                                placeholder="Qty"
                              />
                            </div>

                            {/* Remove Row */}
                            <div className="sm:col-span-1 flex justify-end sm:justify-center">
                              <button
                                type="button"
                                disabled={items.length === 1}
                                onClick={() => handleRemoveItem(index)}
                                className="rounded-xl p-2.5 sm:p-2 bg-white sm:bg-transparent border sm:border-0 border-slate-200 text-slate-400 hover:bg-rose-50 hover:text-rose-600 disabled:opacity-40 transition"
                              >
                                <Trash2 size={16} />
                              </button>
                            </div>
                          </div>

                          {/* "OTHER" TYPE TEXT INPUT CONFIGURATION */}
                          <AnimatePresence>
                            {item.name === 'Other' && (
                              <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                exit={{ opacity: 0, height: 0 }}
                                className="overflow-hidden pt-1"
                              >
                                <div className="relative rounded-xl border border-slate-200 bg-white p-3 focus-within:ring-1 focus-within:ring-red-800 transition-shadow">
                                  <div className="absolute top-3 left-3 text-slate-400">
                                    <FileText size={16} />
                                  </div>
                                  <textarea
                                    required
                                    rows={2}
                                    value={item.description || ''}
                                    onChange={(e) => handleItemChange(index, 'description', e.target.value)}
                                    placeholder="Please describe the item(s) you wish to donate in detail..."
                                    className="w-full pl-7 text-xs text-slate-700 bg-transparent border-0 p-0 focus:ring-0 focus:outline-none resize-none placeholder:text-slate-400"
                                    maxLength={500}
                                  />
                                  <div className="text-[10px] text-right text-slate-400 mt-1">
                                    {item.description?.length || 0}/500 characters
                                  </div>
                                </div>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </motion.div>
                      ))}
                    </AnimatePresence>
                  </div>

                  {/* ADDRESS FIELD */}
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-slate-700">Full Pickup Address</label>
                    <div className="relative">
                      <MapPin className="absolute left-4 top-3.5 text-slate-400" size={18} />
                      <input
                        required
                        value={pickupAddress}
                        onChange={(e) => setPickupAddress(e.target.value)}
                        placeholder="Street, Building, Apartment, City Area..."
                        className="w-full rounded-2xl border border-slate-200 bg-slate-50/50 py-3.5 pl-11 pr-4 text-sm shadow-sm transition placeholder:text-slate-400 focus:bg-white focus:ring-2 focus:ring-red-900/10"
                      />
                    </div>
                  </div>

                  {/* SEARCHABLE CHARITY ORGANIZATION DROP-DOWN */}
                  <div className="space-y-2 relative" ref={dropdownRef}>
                    <label className="text-sm font-semibold text-slate-700">Preferred Charity Organization (Optional)</label>
                    
                    <div 
                      onClick={() => setIsOpenOrgDropdown(!isOpenOrgDropdown)}
                      className="flex items-center justify-between cursor-pointer rounded-2xl border border-slate-200 bg-slate-50/50 px-4 py-3.5 text-sm shadow-sm hover:bg-white hover:ring-2 hover:ring-red-900/10 transition-all"
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <HeartHandshake className="text-slate-400 shrink-0" size={18} />
                        <span className={`truncate ${organization ? 'text-slate-800 font-medium' : 'text-slate-400'}`}>
                          {organization || 'Select Charity Organization (Optional)'}
                        </span>
                      </div>
                      <ChevronDown size={16} className={`text-slate-400 shrink-0 transition-transform duration-200 ${isOpenOrgDropdown ? 'rotate-180' : ''}`} />
                    </div>

                    <AnimatePresence>
                      {isOpenOrgDropdown && (
                        <motion.div 
                          initial={{ opacity: 0, y: 5 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: 5 }}
                          className="absolute z-30 left-0 right-0 mt-1 rounded-xl border border-slate-200 bg-white shadow-xl overflow-hidden"
                        >
                          <div className="flex items-center border-b border-slate-100 px-3 py-2 bg-slate-50">
                            <Search className="text-slate-400 mr-2 shrink-0" size={14} />
                            <input 
                              type="text"
                              value={searchQuery}
                              onChange={(e) => setSearchQuery(e.target.value)}
                              onClick={(e) => e.stopPropagation()} 
                              placeholder="Search registry..."
                              className="w-full bg-transparent border-0 p-0 text-xs text-slate-800 placeholder:text-slate-400 focus:ring-0 focus:outline-none"
                            />
                          </div>
                          <ul className="max-h-48 overflow-y-auto py-1 text-xs text-slate-700">
                            <li 
                              onClick={() => { setOrganization(''); setIsOpenOrgDropdown(false); setSearchQuery(''); }}
                              className="px-3 py-3 hover:bg-slate-50 cursor-pointer font-medium text-slate-400 border-b border-slate-50"
                            >
                              Select Charity Organization (Optional)
                            </li>
                            {filteredOrganizations.length > 0 ? (
                              filteredOrganizations.map((org) => (
                                  <li 
                                    key={org}
                                    onClick={() => { setOrganization(org); setIsOpenOrgDropdown(false); setSearchQuery(''); }}
                                    className={`px-3 py-3 hover:bg-amber-50 hover:text-red-900 cursor-pointer transition-colors ${organization === org ? 'bg-amber-100/70 text-red-900 font-medium' : ''}`}
                                  >
                                    {org}
                                  </li>
                                ))
                            ) : (
                              <li className="px-3 py-3 text-center text-slate-400 bg-white">No results found</li>
                            )}
                          </ul>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  {/* SUBMIT BUTTON */}
                  <button
                    type="submit"
                    disabled={loading}
                    className="relative w-full overflow-hidden rounded-2xl bg-gradient-to-r from-red-800 to-red-950 py-3.5 md:py-4 text-sm md:text-base font-bold text-white shadow-lg shadow-red-900/20 transition-all duration-300 hover:opacity-95 hover:shadow-xl active:scale-[0.99] disabled:opacity-50"
                  >
                    {loading ? 'Processing Schedule...' : 'Confirm & Request Rider Pickup'}
                  </button>

                </form>
              </div>
            </div>

            {/* RIGHT SIDE: FEED / TRACKING */}
            <div className="xl:col-span-2 space-y-6">
              <div className="rounded-[24px] md:rounded-[32px] border border-slate-200 bg-white p-5 md:p-6 shadow-xl shadow-slate-100/50">
                <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
                  <div className="rounded-xl bg-slate-100 p-2.5 text-slate-700">
                    <ClipboardList size={20} />
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-slate-900">Your Donation Runs</h2>
                    <p className="text-[11px] md:text-xs text-slate-500">Live dispatch and routing dashboard</p>
                  </div>
                </div>

                <div className="mt-5 space-y-4 max-h-[400px] md:max-h-[560px] overflow-y-auto pr-1">
                  {list.length === 0 ? (
                    <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-200 py-10 md:py-12 text-center px-4">
                      <Package size={36} className="text-slate-300 md:w-10 md:h-10" />
                      <h3 className="mt-3 font-semibold text-slate-700 text-sm">No Active Collections</h3>
                      <p className="mt-1 text-[11px] md:text-xs text-slate-400 max-w-xs">Your requested pickups and distributed items history log will append here.</p>
                    </div>
                  ) : (
                    list.map((donation) => (
                      <div
                        key={donation._id}
                        className="rounded-2xl border border-slate-100 bg-slate-50/50 p-4 transition duration-200 hover:border-red-900/10 hover:bg-white hover:shadow-sm"
                      >
                        <div className="flex gap-3">
                          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-amber-50 text-red-900">
                            <Package size={16} />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between gap-2">
                              <span className="text-[10px] md:text-xs font-semibold text-red-900 uppercase tracking-wider bg-amber-50 px-2 py-0.5 rounded-md">
                                Dispatch Assigned
                              </span>
                              <span className="text-[10px] text-slate-400 shrink-0">
                                {new Date(donation.createdAt).toLocaleDateString()}
                              </span>
                            </div>

                            {/* Aggregated Items view */}
                            <div className="mt-2.5 space-y-1">
                              {donation.items?.map((itm, i) => (
                                <div key={i} className="text-[11px] md:text-xs font-medium text-slate-700 flex justify-between">
                                  <span className="truncate pr-2">• {itm.name} <span className="text-slate-400 font-normal">({itm.condition})</span></span>
                                  <span className="text-slate-500 font-bold shrink-0">x{itm.quantity}</span>
                                </div>
                              ))}
                            </div>

                            <div className="mt-3 pt-2.5 border-t border-slate-100/70 space-y-1.5 text-[11px] md:text-xs text-slate-500">
                              <div className="flex items-start gap-1.5">
                                <MapPin size={13} className="mt-0.5 shrink-0 text-slate-400" />
                                <span className="truncate">{donation.pickupAddress}</span>
                              </div>
                              <div className="flex items-center gap-1.5 font-medium text-slate-600">
                                <HeartHandshake size={13} className="shrink-0 text-red-800" />
                                <span className="truncate">To: {donation.organization || 'Nearest Hub'}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  )
}