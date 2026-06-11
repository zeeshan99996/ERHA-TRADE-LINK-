import { createFileRoute, Outlet, useRouterState } from '@tanstack/react-router'
import { useState } from 'react'
import AdminSidebar from '@/components/admin/AdminSidebar'
import AdminHeader from '@/components/admin/AdminHeader'

export const Route = createFileRoute('/admin')({
  component: AdminLayout,
})

function AdminLayout() {
  const [collapsed, setCollapsed] = useState(false)
  const routerState = useRouterState()
  const pathname = routerState.location.pathname

  // Map pathnames to page titles
  const titleMap: Record<string, { title: string; subtitle: string }> = {
    '/admin': { title: 'Dashboard', subtitle: 'Welcome back, Admin!' },
    '/admin/orders': { title: 'Orders', subtitle: 'Manage customer orders' },
    '/admin/products': { title: 'Products', subtitle: 'Manage your inventory' },
    '/admin/customers': { title: 'Customers', subtitle: 'View and manage customers' },
    '/admin/coupons': { title: 'Coupons', subtitle: 'Manage discount codes' },
    '/admin/reviews': { title: 'Reviews', subtitle: 'Moderate customer reviews' },
    '/admin/payments': { title: 'Payments', subtitle: 'Transaction history' },
    '/admin/settings': { title: 'Settings', subtitle: 'Store configuration' },
  }
  const current = titleMap[pathname] ?? { title: 'Admin', subtitle: '' }

  return (
    <div className="flex h-screen bg-[#F8FAFC] overflow-hidden">
      <AdminSidebar isCollapsed={collapsed} onToggle={() => setCollapsed(!collapsed)} />
      <div className="flex-1 flex flex-col overflow-hidden min-w-0">
        <AdminHeader title={current.title} subtitle={current.subtitle} />
        <main className="flex-1 overflow-y-auto p-6">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
