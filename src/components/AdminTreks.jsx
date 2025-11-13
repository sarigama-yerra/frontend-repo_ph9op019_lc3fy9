import { useEffect, useState } from 'react'

const API_BASE = import.meta.env.VITE_BACKEND_URL || ''

const emptyTrek = {
  title: '',
  region: '',
  difficulty: 'Moderate',
  duration_days: 10,
  max_altitude_m: 0,
  price_usd: 0,
  overview: '',
  highlights: [],
  itinerary: [],
  inclusions: [],
  exclusions: [],
  images: []
}

export default function AdminTreks() {
  const [treks, setTreks] = useState([])
  const [editing, setEditing] = useState(null)
  const [form, setForm] = useState(emptyTrek)
  const token = typeof window !== 'undefined' ? localStorage.getItem('adminToken') : null

  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { 'X-Admin-Key': token } : {})
  }

  const load = async () => {
    const res = await fetch(`${API_BASE}/api/treks`)
    const data = await res.json()
    setTreks(Array.isArray(data) ? data : [])
  }

  useEffect(() => { load() }, [])

  const startCreate = () => { setEditing('new'); setForm(emptyTrek) }
  const startEdit = (t) => { setEditing(t.id); setForm({...t}) }
  const cancel = () => { setEditing(null); setForm(emptyTrek) }

  const save = async () => {
    const body = JSON.stringify({
      ...form,
      duration_days: Number(form.duration_days) || 0,
      max_altitude_m: Number(form.max_altitude_m) || 0,
      price_usd: Number(form.price_usd) || 0,
      highlights: (form.highlights || []).filter(Boolean),
      itinerary: (form.itinerary || []).filter(Boolean),
      inclusions: (form.inclusions || []).filter(Boolean),
      exclusions: (form.exclusions || []).filter(Boolean),
      images: (form.images || []).filter(Boolean)
    })
    if (editing === 'new') {
      const res = await fetch(`${API_BASE}/api/treks`, { method:'POST', headers, body })
      if (res.ok) { await load(); cancel() }
      else alert('Failed to create')
    } else {
      const res = await fetch(`${API_BASE}/api/treks/${editing}`, { method:'PUT', headers, body })
      if (res.ok) { await load(); cancel() }
      else alert('Failed to update')
    }
  }

  const remove = async (id) => {
    if (!confirm('Delete this trek?')) return
    const res = await fetch(`${API_BASE}/api/treks/${id}`, { method:'DELETE', headers })
    if (res.ok) { await load(); cancel() }
    else alert('Failed to delete')
  }

  const parseList = (value) => value.split('\n').map(s=>s.trim()).filter(Boolean)

  return (
    <div className="grid lg:grid-cols-[1fr_420px] gap-6">
      <div className="bg-white border rounded-lg p-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-semibold">Treks</h2>
          <button onClick={startCreate} className="bg-blue-600 hover:bg-blue-700 text-white rounded px-3 py-1.5">New</button>
        </div>
        <div className="divide-y">
          {treks.map(t => (
            <div key={t.id} className="py-3 flex items-center justify-between">
              <div>
                <div className="font-medium">{t.title}</div>
                <div className="text-sm text-gray-600">{t.region} • {t.duration_days} days • {t.difficulty}</div>
              </div>
              <div className="flex items-center gap-2">
                <button onClick={()=>startEdit(t)} className="px-3 py-1.5 rounded border">Edit</button>
                <button onClick={()=>remove(t.id)} className="px-3 py-1.5 rounded border text-red-600">Delete</button>
              </div>
            </div>
          ))}
          {treks.length === 0 && <div className="text-center text-gray-600 py-8">No treks yet.</div>}
        </div>
      </div>

      <div className="bg-white border rounded-lg p-4">
        <h2 className="font-semibold mb-2">{editing ? (editing==='new' ? 'Create Trek' : 'Edit Trek') : 'Select a trek'}</h2>
        {editing && (
          <div className="space-y-2">
            <input value={form.title} onChange={e=>setForm({...form, title:e.target.value})} placeholder="Title" className="w-full border rounded px-3 py-2" />
            <div className="grid grid-cols-2 gap-2">
              <input value={form.region} onChange={e=>setForm({...form, region:e.target.value})} placeholder="Region" className="border rounded px-3 py-2" />
              <select value={form.difficulty} onChange={e=>setForm({...form, difficulty:e.target.value})} className="border rounded px-3 py-2">
                <option>Easy</option>
                <option>Moderate</option>
                <option>Challenging</option>
              </select>
            </div>
            <div className="grid grid-cols-3 gap-2">
              <input type="number" value={form.duration_days} onChange={e=>setForm({...form, duration_days:e.target.value})} placeholder="Days" className="border rounded px-3 py-2" />
              <input type="number" value={form.max_altitude_m} onChange={e=>setForm({...form, max_altitude_m:e.target.value})} placeholder="Max Alt (m)" className="border rounded px-3 py-2" />
              <input type="number" value={form.price_usd} onChange={e=>setForm({...form, price_usd:e.target.value})} placeholder="Price (USD)" className="border rounded px-3 py-2" />
            </div>
            <textarea value={form.overview} onChange={e=>setForm({...form, overview:e.target.value})} placeholder="Overview" className="w-full border rounded px-3 py-2" rows={3} />

            <div className="grid grid-cols-2 gap-2">
              <textarea value={(form.highlights||[]).join('\n')} onChange={e=>setForm({...form, highlights: parseList(e.target.value)})} placeholder="Highlights (one per line)" className="border rounded px-3 py-2" rows={4} />
              <textarea value={(form.itinerary||[]).join('\n')} onChange={e=>setForm({...form, itinerary: parseList(e.target.value)})} placeholder="Itinerary (one per line)" className="border rounded px-3 py-2" rows={4} />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <textarea value={(form.inclusions||[]).join('\n')} onChange={e=>setForm({...form, inclusions: parseList(e.target.value)})} placeholder="Inclusions (one per line)" className="border rounded px-3 py-2" rows={3} />
              <textarea value={(form.exclusions||[]).join('\n')} onChange={e=>setForm({...form, exclusions: parseList(e.target.value)})} placeholder="Exclusions (one per line)" className="border rounded px-3 py-2" rows={3} />
            </div>
            <textarea value={(form.images||[]).join('\n')} onChange={e=>setForm({...form, images: parseList(e.target.value)})} placeholder="Image URLs (one per line)" className="w-full border rounded px-3 py-2" rows={3} />

            <div className="flex items-center gap-2 pt-2">
              <button onClick={save} className="bg-green-600 hover:bg-green-700 text-white rounded px-3 py-1.5">Save</button>
              <button onClick={cancel} className="border rounded px-3 py-1.5">Cancel</button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
