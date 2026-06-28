import React, { createContext, useState, useEffect } from 'react'
import api from '../utils/api'

export const AuthContext = createContext()

export default function AuthProvider({ children }){
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  const loadUser = async ()=>{
    const token = localStorage.getItem('token')
    if (!token) { setUser(null); setLoading(false); return }
    try {
      const res = await api.get('/api/auth/me')
      setUser(res.data)
    } catch (err) {
      console.error('loadUser error', err.message)
      setUser(null)
      localStorage.removeItem('token')
    } finally {
      setLoading(false)
    }
  }

  useEffect(()=>{ loadUser() }, [])

  const logout = ()=>{
    localStorage.removeItem('token')
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, loading, loadUser, logout }}>
      {children}
    </AuthContext.Provider>
  )
}
