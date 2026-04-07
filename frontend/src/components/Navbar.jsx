import { useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import toast from 'react-hot-toast'

const pageMeta = {
  '/dashboard':    { title: 'Dashboard',    subtitle: 'Overview of your library' },
  '/books':        { title: 'Books',        subtitle: 'Manage your book catalog' },
  '/members':      { title: 'Members',      subtitle: 'Manage library members' },
  '/transactions': { title: 'Transactions', subtitle: 'Issue, return and overdue books' },
}

export default function Navbar() {
  const { pathname } = useLocation()
  const { logout } = useAuth()
  const navigate = useNavigate()
  const meta = pageMeta[pathname] || { title: 'LibraHub', subtitle: '' }

  const handleLogout = () => {
    logout()
    navigate('/login')
    toast.success('Logged out successfully')
  }

  return (
    <header className="navbar">
      <div>
        <div className="navbar-title">{meta.title}</div>
        <div className="navbar-subtitle">{meta.subtitle}</div>
      </div>
      <div className="navbar-actions">
        <button className="logout-btn" onClick={handleLogout} id="logout-btn">
          🚪 Logout
        </button>
      </div>
    </header>
  )
}
