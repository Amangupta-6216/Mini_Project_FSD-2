import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './context/AuthContext'
import LoginPage from './pages/LoginPage'
import DashboardPage from './pages/DashboardPage'
import BooksPage from './pages/BooksPage'
import MembersPage from './pages/MembersPage'
import TransactionsPage from './pages/TransactionsPage'
import Layout from './components/Layout'

function PrivateRoute({ children }) {
  const { token } = useAuth()
  return token ? children : <Navigate to="/login" replace />
}

function AdminRoute({ children }) {
  const { user } = useAuth()
  return user?.role === 'ADMIN' ? children : <Navigate to="/books" replace />
}

function DefaultRoute() {
  const { user } = useAuth()
  return <Navigate to={user?.role === 'ADMIN' ? '/dashboard' : '/books'} replace />
}

export default function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/" element={<PrivateRoute><Layout /></PrivateRoute>}>
          <Route index element={<DefaultRoute />} />
          <Route path="dashboard" element={<AdminRoute><DashboardPage /></AdminRoute>} />
          <Route path="books" element={<BooksPage />} />
          <Route path="members" element={<AdminRoute><MembersPage /></AdminRoute>} />
          <Route path="transactions" element={<TransactionsPage />} />
        </Route>
        <Route path="*" element={<DefaultRoute />} />
      </Routes>
    </AuthProvider>
  )
}
