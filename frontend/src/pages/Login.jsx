import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { login } from '../api/auth'
import toast from 'react-hot-toast'

export default function Login() {
  const [form, setForm] = useState({ username: '', password: '' })
  const [loading, setLoading] = useState(false)
  const { login: setAuth } = useAuth()
  const navigate = useNavigate()

  const handle = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      const { data } = await login(form.username, form.password)
      setAuth(data)
      toast.success(`Welcome back, ${data.username}!`)
      navigate('/dashboard')
    } catch {
      toast.error('Invalid credentials. Try admin / admin123')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="login-page">
      <div className="login-bg-orb login-bg-orb-1" />
      <div className="login-bg-orb login-bg-orb-2" />
      <div className="login-card">
        <div className="login-logo">
          <div className="login-logo-icon">📖</div>
          <h1>LibraHub</h1>
          <p>Library Management System</p>
        </div>
        <form onSubmit={handle}>
          <div className="form-group">
            <label className="form-label">Username</label>
            <input
              id="login-username"
              className="form-control"
              placeholder="Enter username"
              value={form.username}
              onChange={e => setForm({ ...form, username: e.target.value })}
              required
            />
          </div>
          <div className="form-group">
            <label className="form-label">Password</label>
            <input
              id="login-password"
              type="password"
              className="form-control"
              placeholder="Enter password"
              value={form.password}
              onChange={e => setForm({ ...form, password: e.target.value })}
              required
            />
          </div>
          <button id="login-submit" className="login-btn" type="submit" disabled={loading}>
            {loading ? '⏳ Signing in...' : '🔐 Sign In'}
          </button>
        </form>
        <div className="login-hint">
          <strong>Admin:</strong> admin / admin123<br />
          <strong>Member:</strong> member / member123
        </div>
      </div>
    </div>
  )
}
