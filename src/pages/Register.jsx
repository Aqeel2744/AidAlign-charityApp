import React, { useState, useContext } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import api from '../utils/api'
import { AuthContext } from '../context/AuthProvider'

export default function Register() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const navigate = useNavigate()
  const { loadUser } = useContext(AuthContext)

  const submit = async (e) => {
    e.preventDefault()
    try {
      const res = await api.post('/api/auth/register', { name, email, password })
      localStorage.setItem('token', res.data.token)
      await loadUser()
      navigate('/dashboard')
    } catch (err) {
      alert(err.response?.data?.msg || 'Register failed')
    }
  }

  return (
    <div className="container py-16">
      <div className="mx-auto max-w-lg rounded-3xl border border-slate-200 bg-white p-10 shadow-sm">
        <h1 className="text-3xl font-semibold text-slate-900">Create your account</h1>
        <p className="mt-3 text-slate-600">Get started with AidAlign and manage all your contributions from one dashboard.</p>
        <form onSubmit={submit} className="mt-8 space-y-5">
          <label className="block">
            <span className="text-sm font-medium text-slate-700">Full name</span>
            <input value={name} onChange={e=>setName(e.target.value)} className="mt-2 w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900" placeholder="aqeel" />
          </label>
          <label className="block">
            <span className="text-sm font-medium text-slate-700">Email</span>
            <input type="email" value={email} onChange={e=>setEmail(e.target.value)} className="mt-2 w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900" placeholder="you@example.com" />
          </label>
          <label className="block">
            <span className="text-sm font-medium text-slate-700">Password</span>
            <input type="password" value={password} onChange={e=>setPassword(e.target.value)} className="mt-2 w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900" placeholder="••••••••" />
          </label>
          <button className="w-full rounded-full bg-primary px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-primary/20">Create account</button>
        </form>
        <p className="mt-6 text-center text-sm text-slate-600">Already have an account? <Link to="/login" className="font-semibold text-primary">Sign in</Link></p>
      </div>
    </div>
  )
}
