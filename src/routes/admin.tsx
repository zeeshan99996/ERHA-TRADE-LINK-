import { createFileRoute, Outlet, useRouterState } from '@tanstack/react-router'
import { useState, useEffect } from 'react'
import AdminSidebar from '@/components/admin/AdminSidebar'
import AdminHeader from '@/components/admin/AdminHeader'

export const Route = createFileRoute('/admin')({
  component: AdminLayout,
})

function AdminLayout() {
  const [collapsed, setCollapsed] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const routerState = useRouterState()
  const pathname = routerState.location.pathname

  // Detect screen size
  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 1024
      setIsMobile(mobile)
      if (!mobile) setMobileOpen(false)
    }
    handleResize()
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  // Close mobile sidebar on route change
  useEffect(() => {
    setMobileOpen(false)
  }, [pathname])

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
    '/admin/categories': { title: 'Categories', subtitle: 'Manage product categories' },
  }
  const current = titleMap[pathname] ?? { title: 'Admin', subtitle: '' }

  return (
    <div className="flex h-screen bg-[#F8FAFC] overflow-hidden relative">
      <AdminSidebar
        isCollapsed={collapsed}
        onToggle={() => setCollapsed(!collapsed)}
        mobileOpen={mobileOpen}
        onMobileClose={() => setMobileOpen(false)}
        isMobile={isMobile}
      />

      {/* Mobile Drawer Backdrop */}
      {isMobile && mobileOpen && (
        <div
          onClick={() => setMobileOpen(false)}
          className="fixed inset-0 bg-slate-900/50 z-40 backdrop-blur-xs transition-opacity lg:hidden"
        />
      )}

      <div className="flex-1 flex flex-col overflow-hidden min-w-0">
        <AdminHeader
          title={current.title}
          subtitle={current.subtitle}
          onMenuToggle={() => setMobileOpen(!mobileOpen)}
        />
        <main className="flex-1 overflow-y-auto p-4 md:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
