import { useEffect, useState } from 'react'
import { BrowserRouter, Routes, Route, useNavigate } from 'react-router-dom'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import TrekCard from './components/TrekCard'
import AdminLogin from './components/AdminLogin'
import AdminLayout from './components/AdminLayout'
import AdminRoute from './components/AdminRoute'
import AdminDashboard from './components/AdminDashboard'
import AdminTreks from './components/AdminTreks'
import AdminBlog from './components/AdminBlog'
import AdminInquiries from './components/AdminInquiries'

const API_BASE = import.meta.env.VITE_BACKEND_URL || ''

function Home() {
  const [treks, setTreks] = useState([])
  const [search, setSearch] = useState('')
  const [difficulty, setDifficulty] = useState('')
  const [region, setRegion] = useState('')
  const [minDays, setMinDays] = useState('')
  const [maxDays, setMaxDays] = useState('')
  const navigate = useNavigate()

  useEffect(() => {
    const params = new URLSearchParams()
    if (search) params.set('search', search)
    if (difficulty) params.set('difficulty', difficulty)
    if (region) params.set('region', region)
    if (minDays) params.set('min_days', minDays)
    if (maxDays) params.set('max_days', maxDays)
    fetch(`${API_BASE}/api/treks?${params.toString()}`)
      .then(r => r.json())
      .then(setTreks)
      .catch(() => setTreks([]))
  }, [search, difficulty, region, minDays, maxDays])

  return (
    <>
      <Hero onExplore={() => document.getElementById('treks')?.scrollIntoView({behavior:'smooth'})} />
      <section id="treks" className="max-w-6xl mx-auto px-4 py-10">
        <div className="flex flex-col md:flex-row md:items-end gap-4 md:gap-6">
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700">Search</label>
            <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Everest, Annapurna..." className="mt-1 w-full border rounded-md px-3 py-2" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Difficulty</label>
            <select value={difficulty} onChange={e=>setDifficulty(e.target.value)} className="mt-1 border rounded-md px-3 py-2">
              <option value="">Any</option>
              <option>Easy</option>
              <option>Moderate</option>
              <option>Challenging</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Region</label>
            <input value={region} onChange={e=>setRegion(e.target.value)} placeholder="Everest, Annapurna, Langtang..." className="mt-1 border rounded-md px-3 py-2" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Days</label>
            <div className="flex gap-2">
              <input value={minDays} onChange={e=>setMinDays(e.target.value)} placeholder="Min" className="mt-1 border rounded-md px-3 py-2 w-20" />
              <input value={maxDays} onChange={e=>setMaxDays(e.target.value)} placeholder="Max" className="mt-1 border rounded-md px-3 py-2 w-20" />
            </div>
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
          {treks.map(t => (
            <TrekCard key={t.id} trek={t} onSelect={() => navigate(`/treks/${t.id}`)} />
          ))}
          {treks.length === 0 && (
            <div className="col-span-full text-center text-gray-600">No treks found.</div>
          )}
        </div>
      </section>
    </>
  )
}

function TrekDetail() {
  const [trek, setTrek] = useState(null)
  const id = location.pathname.split('/').pop()
  const [form, setForm] = useState({ name:'', email:'', message:'', travelers:1 })
  const submit = async (e) => {
    e.preventDefault()
    const res = await fetch(`${API_BASE}/api/inquiries`, { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({...form, trek_id:id}) })
    const data = await res.json()
    alert(data.message || 'Submitted')
    setForm({ name:'', email:'', message:'', travelers:1 })
  }
  useEffect(() => {
    fetch(`${API_BASE}/api/treks/${id}`).then(r=>r.json()).then(setTrek)
  }, [id])
  if (!trek) return <div className="max-w-5xl mx-auto px-4 py-10">Loading...</div>
  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <div className="h-72 rounded-lg bg-cover bg-center" style={{backgroundImage:`url(${trek.images?.[0] || 'https://images.unsplash.com/photo-1464820453369-31d2c0b651af?q=80&w=2070&auto=format&fit=crop'})`}} />
          <h1 className="mt-6 text-3xl font-bold">{trek.title}</h1>
          <p className="text-gray-600">{trek.region} • {trek.difficulty} • {trek.duration_days} days • Max {trek.max_altitude_m || '—'}m</p>
          <p className="mt-4">{trek.overview}</p>
          <h3 className="mt-6 font-semibold">Highlights</h3>
          <ul className="list-disc ml-5 text-gray-700">
            {trek.highlights?.map((h,i)=>(<li key={i}>{h}</li>))}
          </ul>
          <h3 className="mt-6 font-semibold">Itinerary</h3>
          <ol className="list-decimal ml-5 text-gray-700 space-y-1">
            {trek.itinerary?.map((d,i)=>(<li key={i}>Day {i+1}: {d}</li>))}
          </ol>
          <div className="grid sm:grid-cols-2 gap-6 mt-6">
            <div>
              <h4 className="font-semibold">Inclusions</h4>
              <ul className="list-disc ml-5 text-gray-700">
                {trek.inclusions?.map((x,i)=>(<li key={i}>{x}</li>))}
              </ul>
            </div>
            <div>
              <h4 className="font-semibold">Exclusions</h4>
              <ul className="list-disc ml-5 text-gray-700">
                {trek.exclusions?.map((x,i)=>(<li key={i}>{x}</li>))}
              </ul>
            </div>
          </div>
        </div>
        <aside>
          <div className="border rounded-lg p-4 sticky top-24">
            <div className="text-2xl font-bold">${trek.price_usd} <span className="text-sm text-gray-600">per person</span></div>
            <form className="mt-4 space-y-3" onSubmit={submit}>
              <input required value={form.name} onChange={e=>setForm({...form, name:e.target.value})} placeholder="Your name" className="w-full border rounded-md px-3 py-2" />
              <input required type="email" value={form.email} onChange={e=>setForm({...form, email:e.target.value})} placeholder="Email" className="w-full border rounded-md px-3 py-2" />
              <input type="number" min={1} value={form.travelers} onChange={e=>setForm({...form, travelers:Number(e.target.value)})} placeholder="Travelers" className="w-full border rounded-md px-3 py-2" />
              <textarea required value={form.message} onChange={e=>setForm({...form, message:e.target.value})} placeholder="Message" className="w-full border rounded-md px-3 py-2" rows={4} />
              <button className="w-full bg-blue-600 hover:bg-blue-700 text-white rounded-md py-2 font-semibold">Send Inquiry</button>
            </form>
          </div>
        </aside>
      </div>
    </div>
  )
}

function Blog() {
  const [posts, setPosts] = useState([])
  useEffect(()=>{ fetch(`${API_BASE}/api/blog-posts`).then(r=>r.json()).then(setPosts) },[])
  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold">Blog & Guides</h1>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
        {posts.map(p => (
          <div key={p.id} className="bg-white rounded-lg shadow overflow-hidden">
            <div className="h-40 bg-cover bg-center" style={{backgroundImage:`url(${p.cover_image || 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?q=80&w=2069&auto=format&fit=crop'})`}} />
            <div className="p-4">
              <h3 className="font-semibold">{p.title}</h3>
              <p className="text-sm text-gray-600">{p.excerpt}</p>
            </div>
          </div>
        ))}
        {posts.length === 0 && <div className="col-span-full text-center text-gray-600">No posts yet.</div>}
      </div>
    </div>
  )
}

function About() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-10 space-y-4">
      <h1 className="text-3xl font-bold">About Juma Trek</h1>
      <p>We are a Nepal-based trekking company offering authentic Himalayan experiences with safety-first mindset and expert local guides.</p>
    </div>
  )
}

function Contact() {
  const [form, setForm] = useState({ name:'', email:'', message:'' })
  const submit = async (e) => {
    e.preventDefault()
    const res = await fetch(`${API_BASE}/api/inquiries`, { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify(form) })
    const data = await res.json()
    alert(data.message || 'Submitted')
    setForm({ name:'', email:'', message:'' })
  }
  return (
    <div id="contact" className="max-w-3xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold">Contact Us</h1>
      <form className="mt-6 space-y-3" onSubmit={submit}>
        <input required value={form.name} onChange={e=>setForm({...form, name:e.target.value})} placeholder="Your name" className="w-full border rounded-md px-3 py-2" />
        <input required type="email" value={form.email} onChange={e=>setForm({...form, email:e.target.value})} placeholder="Email" className="w-full border rounded-md px-3 py-2" />
        <textarea required value={form.message} onChange={e=>setForm({...form, message:e.target.value})} placeholder="Message" className="w-full border rounded-md px-3 py-2" rows={5} />
        <button className="bg-blue-600 hover:bg-blue-700 text-white rounded-md px-5 py-2 font-semibold">Send</button>
      </form>
    </div>
  )
}

function SiteLayout({ children }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white text-gray-900">
      <Navbar />
      {children}
      <footer className="mt-16 border-t border-gray-200">
        <div className="max-w-6xl mx-auto px-4 py-6 text-sm text-gray-600 flex flex-col sm:flex-row items-center justify-between">
          <p>© {new Date().getFullYear()} Juma Trek. All rights reserved.</p>
          <p>Crafted in Nepal.</p>
        </div>
      </footer>
    </div>
  )
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<SiteLayout><Home /></SiteLayout>} />
        <Route path="/treks" element={<SiteLayout><Home /></SiteLayout>} />
        <Route path="/treks/:id" element={<SiteLayout><TrekDetail /></SiteLayout>} />
        <Route path="/blog" element={<SiteLayout><Blog /></SiteLayout>} />
        <Route path="/about" element={<SiteLayout><About /></SiteLayout>} />
        <Route path="/contact" element={<SiteLayout><Contact /></SiteLayout>} />

        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin" element={<AdminRoute><AdminLayout><AdminDashboard /></AdminLayout></AdminRoute>} />
        <Route path="/admin/treks" element={<AdminRoute><AdminLayout><AdminTreks /></AdminLayout></AdminRoute>} />
        <Route path="/admin/blog" element={<AdminRoute><AdminLayout><AdminBlog /></AdminLayout></AdminRoute>} />
        <Route path="/admin/inquiries" element={<AdminRoute><AdminLayout><AdminInquiries /></AdminLayout></AdminRoute>} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
