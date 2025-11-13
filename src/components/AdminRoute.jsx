import { Navigate } from 'react-router-dom'

export default function AdminRoute({ children }) {
  const token = typeof window !== 'undefined' ? localStorage.getItem('adminToken') : null
  if (!token) return <Navigate to="/admin/login" replace />
  return children
}
