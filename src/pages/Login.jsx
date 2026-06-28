import React, { useState, useContext } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import api from '../utils/api'
import { AuthContext } from '../context/AuthProvider'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const navigate = useNavigate()
  const { loadUser } = useContext(AuthContext)

  const submit = async (e) => {
    e.preventDefault()
    try {
      const res = await api.post('/api/auth/login', { email, password })
      localStorage.setItem('token', res.data.token)
      await loadUser()
      navigate('/dashboard')
    } catch (err) {
      alert(err.response?.data?.msg || 'Login failed')
    }
  }

  return (
    <div className="container py-16">
      <div className="mx-auto max-w-lg rounded-3xl border border-slate-200 bg-white p-10 shadow-sm">
        <h1 className="text-3xl font-semibold text-slate-900">Welcome back</h1>
        <p className="mt-3 text-slate-600">Sign in to manage your donations, payments, blood support and item contributions.</p>
        <form onSubmit={submit} className="mt-8 space-y-5">
          <label className="block">
            <span className="text-sm font-medium text-slate-700">Email</span>
            <input type="email" value={email} onChange={e => setEmail(e.target.value)} className="mt-2 w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900" placeholder="you@example.com" />
          </label>
          <label className="block">
            <span className="text-sm font-medium text-slate-700">Password</span>
            <input type="password" value={password} onChange={e => setPassword(e.target.value)} className="mt-2 w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900" placeholder="••••••••" />
          </label>
          <button type="submit" className="w-full rounded-full bg-primary px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-primary/20">Sign In</button>
        </form>
        <p className="mt-6 text-center text-sm text-slate-600">New here? <Link to="/register" className="font-semibold text-primary">Create an account</Link></p>
      </div>
    </div>
  )
}
