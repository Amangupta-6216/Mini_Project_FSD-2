import React, { createContext, useContext, useState } from 'react'

const AuthContext = createContext(null)
export const useAuth = () => useContext(AuthContext)

function readStoredUser() {
  const raw = localStorage.getItem('lh_user')
  if (!raw) {
    localStorage.removeItem('lh_token')
    return null
  }

  try {
    const parsed = JSON.parse(raw)
    if (!parsed || typeof parsed !== 'object') {
      throw new Error('Invalid user payload')
    }
    return {
      username: parsed.username || '',
      role: parsed.role || '',
    }
  } catch {
    localStorage.removeItem('lh_user')
    localStorage.removeItem('lh_token')
    return null
  }
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(readStoredUser)
  const [token, setToken] = useState(() => (readStoredUser() ? localStorage.getItem('lh_token') : null))

  const login = (data) => {
    localStorage.setItem('lh_token', data.token)
    localStorage.setItem('lh_user', JSON.stringify({ username: data.username, role: data.role }))
    setToken(data.token)
    setUser({ username: data.username, role: data.role })
  }

  const logout = () => {
    localStorage.removeItem('lh_token')
    localStorage.removeItem('lh_user')
    setToken(null)
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ token, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}
