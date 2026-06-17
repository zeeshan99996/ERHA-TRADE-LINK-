import { Link, useRouterState } from '@tanstack/react-router';
import { motion, AnimatePresence } from 'motion/react';
import { useState, useEffect } from 'react';
import { db } from '@/lib/supabase';
import {
  LayoutDashboard,
  ShoppingBag,
  Package,
  Users,
  Tag,
  Star,
  CreditCard,
  Settings,
  ChevronLeft,
  LogOut,
  Zap,
  X,
  Store,
} from 'lucide-react';

interface AdminSidebarProps {
  isCollapsed: boolean;
  onToggle: () => void;
  mobileOpen: boolean;
  onMobileClose: () => void;
  isMobile: boolean;
}

interface NavItem {
  label: string;
  icon: React.ElementType;
  href: string;
  badge?: number;
}

interface NavGroup {
  title: string;
  items: NavItem[];
}

const EXPANDED_WIDTH = 260;
const COLLAPSED_WIDTH = 72;

export default function AdminSidebar({ isCollapsed, onToggle, mobileOpen, onMobileClose, isMobile }: AdminSidebarProps) {
  const routerState = useRouterState();
  const currentPath = routerState.location.pathname;

  const [role, setRole] = useState(() => db.getUserRole());
  const [pendingOrdersCount, setPendingOrdersCount] = useState(0);

  const syncState = async () => {
    setRole(db.getUserRole());
    const orders = await db.getOrders();
    setPendingOrdersCount(orders.filter(o => o.orderStatus === 'Pending').length);
  };

  useEffect(() => {
    syncState();
    window.addEventListener('storage', syncState);
    return () => window.removeEventListener('storage', syncState);
  }, []);

  const isActive = (href: string) => {
    if (href === '/admin') return currentPath === '/admin';
    return currentPath.startsWith(href);
  };

  const navGroups: NavGroup[] = [
    {
      title: 'Overview',
      items: [
        { label: 'Dashboard', icon: LayoutDashboard, href: '/admin' },
      ],
    },
    {
      title: 'Commerce',
      items: [
        { label: 'Orders', icon: ShoppingBag, href: '/admin/orders', badge: pendingOrdersCount },
        ...(role !== 'Staff' ? [
          { label: 'Products', icon: Package, href: '/admin/products' },
          { label: 'Customers', icon: Users, href: '/admin/customers' },
        ] : []),
      ],
    },
    ...(role === 'Super Admin' ? [
      {
        title: 'Marketing',
        items: [
          { label: 'Coupons', icon: Tag, href: '/admin/coupons' },
          { label: 'Categories', icon: Star, href: '/admin/categories' },
        ],
      },
      {
        title: 'Finance',
        items: [
          { label: 'Payments', icon: CreditCard, href: '/admin/payments' },
        ],
      },
      {
        title: 'System',
        items: [
          { label: 'Settings', icon: Settings, href: '/admin/settings' },
        ],
      },
    ] : [])
  ];

  return (
    <motion.aside
      initial={false}
      animate={
        isMobile
          ? { x: mobileOpen ? 0 : -EXPANDED_WIDTH, width: EXPANDED_WIDTH }
          : { x: 0, width: isCollapsed ? COLLAPSED_WIDTH : EXPANDED_WIDTH }
      }
      transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
      className="fixed inset-y-0 left-0 z-50 lg:relative lg:translate-x-0 flex flex-col h-screen shrink-0 overflow-hidden select-none"
      style={{ backgroundColor: '#0F172A', borderRight: '1px solid rgba(255,255,255,0.06)' }}
    >
      {/* ── Top gradient accent ── */}
      <div
        className="absolute top-0 left-0 right-0 h-px"
        style={{ background: 'linear-gradient(90deg, #6366f1, #8b5cf6, #a78bfa)' }}
      />

      {/* ── Logo area ── */}
      <div className="flex items-center h-16 px-4 shrink-0" style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
        <div className="flex items-center gap-3 min-w-0">
          <div
            className="flex items-center justify-center w-9 h-9 rounded-xl shrink-0"
            style={{ background: 'linear-gradient(135deg, #6366f1, #8b5cf6)' }}
          >
            <Zap size={18} className="text-white" strokeWidth={2.5} />
          </div>

          <AnimatePresence initial={false}>
            {!isCollapsed && (
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                transition={{ duration: 0.2 }}
                className="min-w-0"
              >
                <p className="text-white font-bold text-sm leading-tight tracking-wide whitespace-nowrap">
                  ERHA Trade Link
                </p>
                <p className="text-xs leading-tight whitespace-nowrap font-semibold" style={{ color: '#6366f1' }}>
                  {role}
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Collapse toggle (Desktop) or Close toggle (Mobile) */}
        {isMobile ? (
          <button
            onClick={onMobileClose}
            className="ml-auto flex items-center justify-center w-7 h-7 rounded-lg transition-colors shrink-0"
            style={{ color: '#94a3b8' }}
            onMouseEnter={e => (e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.08)')}
            onMouseLeave={e => (e.currentTarget.style.backgroundColor = 'transparent')}
            title="Close sidebar"
          >
            <X size={16} />
          </button>
        ) : (
          <>
            {/* Collapse toggle */}
            <AnimatePresence initial={false}>
              {!isCollapsed && (
                <motion.button
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onClick={onToggle}
                  className="ml-auto flex items-center justify-center w-7 h-7 rounded-lg transition-colors shrink-0"
                  style={{ color: '#94a3b8' }}
                  onMouseEnter={e => (e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.08)')}
                  onMouseLeave={e => (e.currentTarget.style.backgroundColor = 'transparent')}
                  title="Collapse sidebar"
                >
                  <ChevronLeft size={16} />
                </motion.button>
              )}
            </AnimatePresence>

            {/* Expand toggle when collapsed */}
            {isCollapsed && (
              <button
                onClick={onToggle}
                className="ml-auto flex items-center justify-center w-7 h-7 rounded-lg transition-colors"
                style={{ color: '#94a3b8' }}
                onMouseEnter={e => (e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.08)')}
                onMouseLeave={e => (e.currentTarget.style.backgroundColor = 'transparent')}
                title="Expand sidebar"
              >
                <motion.div animate={{ rotate: 180 }}>
                  <ChevronLeft size={16} />
                </motion.div>
              </button>
            )}
          </>
        )}
      </div>

      {/* ── Navigation ── */}
      <nav className="flex-1 overflow-y-auto overflow-x-hidden py-4 scrollbar-hide">
        {navGroups.map((group) => (
          <div key={group.title} className="mb-1">
            <AnimatePresence initial={false}>
              {!isCollapsed && (
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.15 }}
                  className="px-4 pt-3 pb-1 text-xs font-semibold uppercase tracking-widest whitespace-nowrap"
                  style={{ color: '#475569' }}
                >
                  {group.title}
                </motion.p>
              )}
            </AnimatePresence>

            {isCollapsed && (
              <div className="mx-3 my-2 h-px" style={{ backgroundColor: 'rgba(255,255,255,0.06)' }} />
            )}

            {group.items.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.href);

              return (
                <div key={item.href} className="px-3 mb-0.5">
                  <Link
                    to={item.href}
                    className="relative flex items-center gap-3 rounded-xl px-3 py-2.5 transition-all duration-200 group"
                    style={{
                      background: active
                        ? 'linear-gradient(135deg, rgba(99,102,241,0.3), rgba(139,92,246,0.2))'
                        : 'transparent',
                      color: active ? '#e0e7ff' : '#94a3b8',
                    }}
                    onMouseEnter={e => {
                      if (!active) {
                        (e.currentTarget as HTMLElement).style.backgroundColor = 'rgba(255,255,255,0.06)';
                        (e.currentTarget as HTMLElement).style.color = '#e2e8f0';
                      }
                    }}
                    onMouseLeave={e => {
                      if (!active) {
                        (e.currentTarget as HTMLElement).style.backgroundColor = 'transparent';
                        (e.currentTarget as HTMLElement).style.color = '#94a3b8';
                      }
                    }}
                    title={isCollapsed ? item.label : undefined}
                  >
                    {active && (
                      <motion.div
                        layoutId="activeIndicator"
                        className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-5 rounded-full"
                        style={{ background: 'linear-gradient(180deg, #6366f1, #8b5cf6)' }}
                        transition={{ type: 'spring', bounce: 0.2, duration: 0.4 }}
                      />
                    )}

                    <span className="shrink-0 flex items-center justify-center w-5 h-5">
                      <Icon
                        size={18}
                        strokeWidth={active ? 2.5 : 2}
                        style={{ color: active ? '#818cf8' : 'currentColor' }}
                      />
                    </span>

                    <AnimatePresence initial={false}>
                      {!isCollapsed && (
                        <motion.span
                          initial={{ opacity: 0, x: -8 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: -8 }}
                          transition={{ duration: 0.18 }}
                          className="flex-1 text-sm font-medium whitespace-nowrap flex items-center justify-between"
                        >
                          {item.label}
                          {item.badge !== undefined && item.badge > 0 && (
                            <span
                              className="text-xs font-bold px-1.5 py-0.5 rounded-full"
                              style={{ background: 'rgba(99,102,241,0.25)', color: '#818cf8' }}
                            >
                              {item.badge}
                            </span>
                          )}
                        </motion.span>
                      )}
                    </AnimatePresence>

                    {isCollapsed && item.badge !== undefined && item.badge > 0 && (
                      <span
                        className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full"
                        style={{ backgroundColor: '#6366f1' }}
                      />
                    )}
                  </Link>
                </div>
              );
            })}
          </div>
        ))}
      </nav>

      <div className="shrink-0 p-3" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
        {/* Back to Store button */}
        <Link
          to="/"
          className="flex items-center gap-3 rounded-xl px-3 py-2.5 mb-2 transition-all w-full"
          style={{ color: '#6366f1', backgroundColor: 'rgba(99,102,241,0.1)' }}
          onMouseEnter={e => (e.currentTarget.style.backgroundColor = 'rgba(99,102,241,0.18)')}
          onMouseLeave={e => (e.currentTarget.style.backgroundColor = 'rgba(99,102,241,0.1)')}
          title="Back to Store"
        >
          <span className="shrink-0 flex items-center justify-center w-5 h-5">
            <Store size={17} style={{ color: '#818cf8' }} />
          </span>
          <AnimatePresence initial={false}>
            {!isCollapsed && (
              <motion.span
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -8 }}
                transition={{ duration: 0.18 }}
                className="text-sm font-semibold whitespace-nowrap"
                style={{ color: '#818cf8' }}
              >
                Back to Store
              </motion.span>
            )}
          </AnimatePresence>
        </Link>

        <div
          className="flex items-center gap-3 rounded-xl p-3 transition-colors cursor-pointer"
          style={{ backgroundColor: 'rgba(255,255,255,0.04)' }}
          onMouseEnter={e => (e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.08)')}
          onMouseLeave={e => (e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.04)')}
        >
          <div
            className="w-8 h-8 rounded-full shrink-0 flex items-center justify-center text-sm font-bold text-white"
            style={{ background: 'linear-gradient(135deg, #6366f1, #8b5cf6)' }}
          >
            A
          </div>

          <AnimatePresence initial={false}>
            {!isCollapsed && (
              <motion.div
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -8 }}
                transition={{ duration: 0.18 }}
                className="flex-1 min-w-0"
              >
                <p className="text-sm font-semibold text-white leading-tight whitespace-nowrap truncate">
                  Admin User
                </p>
                <p className="text-xs leading-tight whitespace-nowrap" style={{ color: '#475569' }}>
                  {role}
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.aside>
  );
}
