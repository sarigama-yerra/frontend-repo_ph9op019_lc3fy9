import { useEffect, useState } from 'react'

const API_BASE = import.meta.env.VITE_BACKEND_URL || ''

export default function AdminInquiries() {
  const [inquiries, setInquiries] = useState([])
  const token = typeof window !== 'undefined' ? localStorage.getItem('adminToken') : null

  const load = async () => {
    const headers = token ? { 'X-Admin-Key': token } : {}
    const res = await fetch(`${API_BASE}/api/inquiries`, { headers })
    const data = await res.json()
    setInquiries(Array.isArray(data) ? data : [])
  }

  useEffect(() => { load() }, [])

  return (
    <div className="bg-white border rounded-lg">
      <div className="p-4 border-b font-semibold">Inquiries</div>
      <div className="divide-y">
        {inquiries.map(i => (
          <div key={i.id} className="p-4">
            <div className="font-medium">{i.name} • {i.email}</div>
            <div className="text-sm text-gray-600">Travelers: {i.travelers || 1} • Trek: {i.trek_id || '-'} • {new Date(i.created_at).toLocaleString()}</div>
            <p className="mt-2 text-gray-800 whitespace-pre-wrap">{i.message}</p>
          </div>
        ))}
        {inquiries.length === 0 && <div className="p-6 text-center text-gray-600">No inquiries yet.</div>}
      </div>
    </div>
  )}
