import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

const API_BASE = import.meta.env.VITE_BACKEND_URL || ''

export default function AdminLogin() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const navigate = useNavigate()

  const submit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      const res = await fetch(`${API_BASE}/api/admin/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.detail || 'Login failed')
      localStorage.setItem('adminToken', data.token)
      localStorage.setItem('adminEmail', data.user?.email || email)
      navigate('/admin')
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-md mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold">Admin Login</h1>
      <p className="text-gray-600 mt-2">Use your admin credentials to continue.</p>
      <form className="mt-6 space-y-4" onSubmit={submit}>
        <input type="email" required value={email} onChange={e=>setEmail(e.target.value)} placeholder="Email" className="w-full border rounded-md px-3 py-2" />
        <input type="password" required value={password} onChange={e=>setPassword(e.target.value)} placeholder="Password" className="w-full border rounded-md px-3 py-2" />
        {error && <div className="text-red-600 text-sm">{error}</div>}
        <button disabled={loading} className="w-full bg-blue-600 hover:bg-blue-700 text-white rounded-md py-2 font-semibold disabled:opacity-60">
          {loading ? 'Signing in...' : 'Sign In'}
        </button>
      </form>
    </div>
  )
}
