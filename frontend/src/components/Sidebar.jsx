import { NavLink } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const navItems = [
  { path: '/dashboard', icon: '📊', label: 'Dashboard' },
  { path: '/books',     icon: '📚', label: 'Books' },
  { path: '/members',   icon: '👥', label: 'Members' },
  { path: '/transactions', icon: '🔄', label: 'Transactions' },
]

export default function Sidebar() {
  const { user } = useAuth()
  const initials = user?.username?.slice(0, 2).toUpperCase() || 'AD'

  return (
    <aside className="sidebar">
      <div className="sidebar-logo">
        <div className="logo-icon">📖</div>
        <div>
          <div className="logo-text">LibraHub</div>
          <div className="logo-sub">Library System</div>
        </div>
      </div>

      <nav className="sidebar-nav">
        <div className="nav-section-title">Navigation</div>
        {navItems.map(item => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) => `nav-item${isActive ? ' active' : ''}`}
          >
            <span className="nav-icon">{item.icon}</span>
            {item.label}
          </NavLink>
        ))}
      </nav>

      <div className="sidebar-footer">
        <div className="sidebar-user">
          <div className="user-avatar">{initials}</div>
          <div className="user-info">
            <div className="user-name">{user?.username}</div>
            <div className="user-role">{user?.role}</div>
          </div>
        </div>
      </div>
    </aside>
  )
}
