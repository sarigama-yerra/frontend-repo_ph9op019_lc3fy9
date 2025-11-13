import { Link, NavLink } from 'react-router-dom'
import { Menu } from 'lucide-react'
import { useState } from 'react'

export default function Navbar() {
  const [open, setOpen] = useState(false)
  const navItem = (to, label) => (
    <NavLink
      to={to}
      onClick={() => setOpen(false)}
      className={({ isActive }) =>
        `px-3 py-2 rounded-md text-sm font-medium ${
          isActive ? 'text-blue-600' : 'text-gray-700 hover:text-blue-600'
        }`
      }
    >
      {label}
    </NavLink>
  )

  return (
    <header className="w-full bg-white/80 backdrop-blur border-b border-gray-200 sticky top-0 z-40">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <span className="text-xl font-bold text-blue-700">Juma Trek</span>
        </Link>
        <nav className="hidden md:flex items-center gap-2">
          {navItem('/', 'Home')}
          {navItem('/treks', 'Treks')}
          {navItem('/blog', 'Blog')}
          {navItem('/about', 'About')}
          {navItem('/contact', 'Contact')}
        </nav>
        <button className="md:hidden p-2" onClick={() => setOpen(!open)} aria-label="Menu">
          <Menu />
        </button>
      </div>
      {open && (
        <div className="md:hidden border-t border-gray-200">
          <div className="px-4 py-2 flex flex-col">
            {navItem('/', 'Home')}
            {navItem('/treks', 'Treks')}
            {navItem('/blog', 'Blog')}
            {navItem('/about', 'About')}
            {navItem('/contact', 'Contact')}
          </div>
        </div>
      )}
    </header>
  )
}
