import React from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import toast from 'react-hot-toast'

const pageMeta = {
  '/dashboard': { title: 'Dashboard', subtitle: 'Overview of your library' },
  '/books': { title: 'Books', subtitle: 'Manage your book catalog' },
  '/members': { title: 'Members', subtitle: 'Manage library members' },
  '/transactions': { title: 'Transactions', subtitle: 'Monitor all transactions and overdue books' },
}

export default function AppNavbar() {
  const { pathname } = useLocation()
  const { logout, user } = useAuth()
  const navigate = useNavigate()
  const memberMeta = {
    '/books': { title: 'Books', subtitle: 'Search and borrow available books' },
    '/transactions': { title: 'My Activity', subtitle: 'View and return your borrowed books' },
  }
  const meta = user?.role === 'MEMBER'
    ? memberMeta[pathname] || { title: 'LibraHub', subtitle: '' }
    : pageMeta[pathname] || { title: 'LibraHub', subtitle: '' }

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
          Logout
        </button>
      </div>
    </header>
  )
}
