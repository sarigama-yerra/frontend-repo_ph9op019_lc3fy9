import { useEffect, useState } from 'react'
const API_BASE = import.meta.env.VITE_BACKEND_URL || ''

export default function AdminDashboard() {
  const [stats, setStats] = useState({ treks: 0, posts: 0, inquiries: 0 })
  const token = typeof window !== 'undefined' ? localStorage.getItem('adminToken') : null

  useEffect(() => {
    const headers = token ? { 'X-Admin-Key': token } : {}
    Promise.all([
      fetch(`${API_BASE}/api/treks`).then(r=>r.json()),
      fetch(`${API_BASE}/api/blog-posts`).then(r=>r.json()),
      fetch(`${API_BASE}/api/inquiries`, { headers }).then(r=>r.json())
    ]).then(([treks, posts, inquiries]) => setStats({ treks: treks.length || 0, posts: posts.length || 0, inquiries: inquiries.length || 0 }))
    .catch(()=>{})
  }, [])

  return (
    <div className="grid sm:grid-cols-3 gap-4">
      <div className="bg-white rounded-lg p-4 border">
        <div className="text-sm text-gray-600">Treks</div>
        <div className="text-3xl font-bold">{stats.treks}</div>
      </div>
      <div className="bg-white rounded-lg p-4 border">
        <div className="text-sm text-gray-600">Blog Posts</div>
        <div className="text-3xl font-bold">{stats.posts}</div>
      </div>
      <div className="bg-white rounded-lg p-4 border">
        <div className="text-sm text-gray-600">Inquiries</div>
        <div className="text-3xl font-bold">{stats.inquiries}</div>
      </div>
    </div>
  )
}
