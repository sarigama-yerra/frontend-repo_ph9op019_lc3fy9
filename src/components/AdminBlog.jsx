import { useEffect, useState } from 'react'

const API_BASE = import.meta.env.VITE_BACKEND_URL || ''

const emptyPost = {
  title: '',
  excerpt: '',
  content: '',
  tags: [],
  cover_image: ''
}

export default function AdminBlog() {
  const [posts, setPosts] = useState([])
  const [editing, setEditing] = useState(null)
  const [form, setForm] = useState(emptyPost)
  const token = typeof window !== 'undefined' ? localStorage.getItem('adminToken') : null

  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { 'X-Admin-Key': token } : {})
  }

  const load = async () => {
    const res = await fetch(`${API_BASE}/api/blog-posts`)
    const data = await res.json()
    setPosts(Array.isArray(data) ? data : [])
  }

  useEffect(() => { load() }, [])

  const startCreate = () => { setEditing('new'); setForm(emptyPost) }
  const startEdit = (p) => { setEditing(p.id); setForm({...p, tags: p.tags || []}) }
  const cancel = () => { setEditing(null); setForm(emptyPost) }

  const save = async () => {
    const body = JSON.stringify({
      ...form,
      tags: (form.tags || []).map(t=>t.trim()).filter(Boolean)
    })
    if (editing === 'new') {
      const res = await fetch(`${API_BASE}/api/blog-posts`, { method:'POST', headers, body })
      if (res.ok) { await load(); cancel() }
      else alert('Failed to create')
    } else {
      const res = await fetch(`${API_BASE}/api/blog-posts/${editing}`, { method:'PUT', headers, body })
      if (res.ok) { await load(); cancel() }
      else alert('Failed to update')
    }
  }

  const remove = async (id) => {
    if (!confirm('Delete this post?')) return
    const res = await fetch(`${API_BASE}/api/blog-posts/${id}`, { method:'DELETE', headers })
    if (res.ok) { await load(); cancel() }
    else alert('Failed to delete')
  }

  return (
    <div className="grid lg:grid-cols-[1fr_420px] gap-6">
      <div className="bg-white border rounded-lg p-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-semibold">Blog Posts</h2>
          <button onClick={startCreate} className="bg-blue-600 hover:bg-blue-700 text-white rounded px-3 py-1.5">New</button>
        </div>
        <div className="divide-y">
          {posts.map(p => (
            <div key={p.id} className="py-3 flex items-center justify-between">
              <div>
                <div className="font-medium">{p.title}</div>
                <div className="text-sm text-gray-600">{(p.tags||[]).join(', ')}</div>
              </div>
              <div className="flex items-center gap-2">
                <button onClick={()=>startEdit(p)} className="px-3 py-1.5 rounded border">Edit</button>
                <button onClick={()=>remove(p.id)} className="px-3 py-1.5 rounded border text-red-600">Delete</button>
              </div>
            </div>
          ))}
          {posts.length === 0 && <div className="text-center text-gray-600 py-8">No posts yet.</div>}
        </div>
      </div>

      <div className="bg-white border rounded-lg p-4">
        <h2 className="font-semibold mb-2">{editing ? (editing==='new' ? 'Create Post' : 'Edit Post') : 'Select a post'}</h2>
        {editing && (
          <div className="space-y-2">
            <input value={form.title} onChange={e=>setForm({...form, title:e.target.value})} placeholder="Title" className="w-full border rounded px-3 py-2" />
            <input value={form.cover_image} onChange={e=>setForm({...form, cover_image:e.target.value})} placeholder="Cover Image URL" className="w-full border rounded px-3 py-2" />
            <input value={form.excerpt} onChange={e=>setForm({...form, excerpt:e.target.value})} placeholder="Excerpt" className="w-full border rounded px-3 py-2" />
            <textarea value={form.content} onChange={e=>setForm({...form, content:e.target.value})} placeholder="Content (Markdown or HTML)" className="w-full border rounded px-3 py-2" rows={8} />
            <textarea value={(form.tags||[]).join('\n')} onChange={e=>setForm({...form, tags: e.target.value.split('\n').map(s=>s.trim()).filter(Boolean)})} placeholder="Tags (one per line)" className="w-full border rounded px-3 py-2" rows={3} />

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
