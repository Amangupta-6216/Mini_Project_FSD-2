import React from 'react'
import { NavLink } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function AppSidebar() {
  const { user } = useAuth()
  const initials = user?.username ? user.username.slice(0, 2).toUpperCase() : 'AD'
  const navItems = user?.role === 'ADMIN'
    ? [
        { path: '/dashboard', icon: 'DB', label: 'Dashboard' },
        { path: '/books', icon: 'BK', label: 'Books' },
        { path: '/members', icon: 'MB', label: 'Members' },
        { path: '/transactions', icon: 'TX', label: 'Transactions' },
      ]
    : [
        { path: '/books', icon: 'BK', label: 'Books' },
        { path: '/transactions', icon: 'TX', label: 'My Activity' },
      ]

  return (
    <aside className="sidebar">
      <div className="sidebar-logo">
        <div className="logo-icon">LH</div>
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
