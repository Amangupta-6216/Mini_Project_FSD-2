import React from 'react'
import { Outlet } from 'react-router-dom'
import AppSidebar from './AppSidebar'
import AppNavbar from './AppNavbar'

export default function Layout() {
  return (
    <div className="layout">
      <AppSidebar />
      <div className="main-content">
        <AppNavbar />
        <div className="page-body">
          <Outlet />
        </div>
      </div>
    </div>
  )
}
