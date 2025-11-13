import { LogOut, Settings, FileText, Mountain } from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'

export default function AdminLayout({ children }) {
  const navigate = useNavigate()
  const email = typeof window !== 'undefined' ? localStorage.getItem('adminEmail') : ''

  const logout = () => {
    localStorage.removeItem('adminToken')
    localStorage.removeItem('adminEmail')
    navigate('/admin/login')
  }

  return (
    <div className="min-h-screen grid grid-cols-1 md:grid-cols-[220px_1fr]">
      <aside className="border-r bg-white">
        <div className="p-4 border-b font-bold text-lg">Juma Trek CMS</div>
        <nav className="p-4 space-y-2">
          <Link className="block px-3 py-2 rounded hover:bg-gray-100" to="/admin">Dashboard</Link>
          <Link className="block px-3 py-2 rounded hover:bg-gray-100" to="/admin/treks">Treks</Link>
          <Link className="block px-3 py-2 rounded hover:bg-gray-100" to="/admin/blog">Blog Posts</Link>
          <Link className="block px-3 py-2 rounded hover:bg-gray-100" to="/admin/inquiries">Inquiries</Link>
        </nav>
      </aside>
      <main className="bg-gray-50 min-h-screen">
        <header className="flex items-center justify-between px-6 py-4 border-b bg-white">
          <div className="font-semibold">Simple CMS</div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-600 hidden sm:block">{email}</span>
            <button onClick={logout} className="inline-flex items-center gap-2 text-sm bg-gray-900 text-white rounded px-3 py-1.5">
              <LogOut size={16} /> Logout
            </button>
          </div>
        </header>
        <div className="p-6">
          {children}
        </div>
      </main>
    </div>
  )
}
