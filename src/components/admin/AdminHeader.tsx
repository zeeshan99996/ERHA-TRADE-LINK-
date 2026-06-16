import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Bell,
  Search,
  ChevronDown,
  Settings,
  LogOut,
  User,
  Package,
  Star,
  ShoppingBag,
  CheckCircle,
  AlertTriangle,
  X,
  Menu,
} from 'lucide-react';

// ─── TYPES ────────────────────────────────────────────────────────────────────

interface AdminHeaderProps {
  title: string;
  subtitle?: string;
  onMenuToggle?: () => void;
}

interface Notification {
  id: string;
  type: 'order' | 'stock' | 'review' | 'payment';
  title: string;
  description: string;
  time: string;
  read: boolean;
}

// ─── STATIC DATA ─────────────────────────────────────────────────────────────

const notifications: Notification[] = [
  {
    id: 'N1',
    type: 'order',
    title: 'New Order Received',
    description: 'ORD-2024-015 from Umar Farooq — Rs. 5,998',
    time: '2 min ago',
    read: false,
  },
  {
    id: 'N2',
    type: 'stock',
    title: 'Low Stock Alert',
    description: 'ERHA SlimPower 10000 has only 8 units left',
    time: '15 min ago',
    read: false,
  },
  {
    id: 'N3',
    type: 'review',
    title: 'New Review Pending',
    description: 'Hassan Tariq left a 2★ review on Gaming Headset',
    time: '1 hr ago',
    read: false,
  },
  {
    id: 'N4',
    type: 'payment',
    title: 'Payment Received',
    description: 'JazzCash payment confirmed for ORD-2024-011',
    time: '2 hr ago',
    read: true,
  },
  {
    id: 'N5',
    type: 'order',
    title: 'Order Delivered',
    description: 'ORD-2024-006 delivered to Zainab Akhtar in Faisalabad',
    time: '3 hr ago',
    read: true,
  },
];

const notificationIcon = (type: Notification['type']) => {
  switch (type) {
    case 'order': return { icon: ShoppingBag, bg: 'rgba(99,102,241,0.15)', color: '#818cf8' };
    case 'stock': return { icon: AlertTriangle, bg: 'rgba(245,158,11,0.15)', color: '#f59e0b' };
    case 'review': return { icon: Star, bg: 'rgba(239,68,68,0.15)', color: '#f87171' };
    case 'payment': return { icon: CheckCircle, bg: 'rgba(34,197,94,0.15)', color: '#4ade80' };
  }
};

const avatarMenuItems = [
  { icon: User, label: 'My Profile', description: 'View admin profile' },
  { icon: Package, label: 'Inventory', description: 'Manage stock levels' },
  { icon: Settings, label: 'Settings', description: 'System preferences' },
];

// ─── COMPONENT ───────────────────────────────────────────────────────────────

export default function AdminHeader({ title, subtitle, onMenuToggle }: AdminHeaderProps) {
  const [showNotifications, setShowNotifications] = useState(false);
  const [showAvatar, setShowAvatar] = useState(false);
  const [searchFocused, setSearchFocused] = useState(false);
  const [notifList, setNotifList] = useState<Notification[]>(notifications);

  const notifRef = useRef<HTMLDivElement>(null);
  const avatarRef = useRef<HTMLDivElement>(null);

  const unreadCount = notifList.filter(n => !n.read).length;

  // Close dropdowns on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setShowNotifications(false);
      }
      if (avatarRef.current && !avatarRef.current.contains(e.target as Node)) {
        setShowAvatar(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const markAllRead = () => {
    setNotifList(prev => prev.map(n => ({ ...n, read: true })));
  };

  const dismissNotif = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setNotifList(prev => prev.filter(n => n.id !== id));
  };

  return (
    <header
      className="flex items-center h-16 px-4 md:px-6 shrink-0 gap-4 z-30"
      style={{
        backgroundColor: '#ffffff',
        borderBottom: '1px solid #E2E8F0',
      }}
    >
      {/* Mobile Menu Toggle Button */}
      {onMenuToggle && (
        <button
          onClick={onMenuToggle}
          className="lg:hidden flex items-center justify-center w-10 h-10 rounded-xl mr-1 text-slate-500 hover:bg-slate-100 transition-colors shrink-0"
          aria-label="Toggle Menu"
        >
          <Menu size={20} />
        </button>
      )}

      {/* ── Left: Title + breadcrumb ── */}
      <div className="min-w-0 mr-4">
        <h1 className="text-lg font-bold text-slate-800 leading-tight truncate">
          {title}
        </h1>
        {subtitle && (
          <p className="text-xs text-slate-400 leading-tight truncate mt-0.5">
            Admin Panel
            <span className="mx-1.5 text-slate-300">›</span>
            {subtitle}
          </p>
        )}
      </div>

      {/* ── Center: Search bar ── */}
      <div className="flex-1 max-w-md mx-auto">
        <motion.div
          animate={{
            boxShadow: searchFocused
              ? '0 0 0 3px rgba(99,102,241,0.15)'
              : '0 0 0 0px rgba(99,102,241,0)',
          }}
          transition={{ duration: 0.2 }}
          className="relative rounded-full"
        >
          <div
            className="flex items-center gap-2.5 rounded-full px-4 py-2.5 transition-colors"
            style={{
              backgroundColor: searchFocused ? '#fff' : '#F8FAFC',
              border: `1.5px solid ${searchFocused ? '#6366f1' : '#E2E8F0'}`,
            }}
          >
            <Search size={16} className="shrink-0" style={{ color: searchFocused ? '#6366f1' : '#94a3b8' }} />
            <input
              type="text"
              placeholder="Search orders, products, customers…"
              onFocus={() => setSearchFocused(true)}
              onBlur={() => setSearchFocused(false)}
              className="flex-1 bg-transparent text-sm text-slate-700 outline-none placeholder:text-slate-400 min-w-0"
            />
            <kbd
              className="hidden sm:flex items-center gap-1 text-xs px-1.5 py-0.5 rounded"
              style={{ color: '#94a3b8', backgroundColor: '#F1F5F9', border: '1px solid #E2E8F0', fontFamily: 'monospace' }}
            >
              ⌘K
            </kbd>
          </div>
        </motion.div>
      </div>

      {/* ── Right: Actions ── */}
      <div className="flex items-center gap-2 ml-2 shrink-0">

        {/* Notification Bell */}
        <div ref={notifRef} className="relative">
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={() => {
              setShowNotifications(v => !v);
              setShowAvatar(false);
            }}
            className="relative flex items-center justify-center w-10 h-10 rounded-xl transition-colors"
            style={{ color: '#64748b', backgroundColor: showNotifications ? '#F1F5F9' : 'transparent' }}
            onMouseEnter={e => (e.currentTarget.style.backgroundColor = '#F1F5F9')}
            onMouseLeave={e => {
              if (!showNotifications) e.currentTarget.style.backgroundColor = 'transparent';
            }}
          >
            <Bell size={20} />
            {unreadCount > 0 && (
              <motion.span
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="absolute -top-0.5 -right-0.5 w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold text-white"
                style={{ backgroundColor: '#ef4444', fontSize: '10px' }}
              >
                {unreadCount}
              </motion.span>
            )}
          </motion.button>

          {/* Notification Dropdown */}
          <AnimatePresence>
            {showNotifications && (
              <motion.div
                initial={{ opacity: 0, y: 8, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 8, scale: 0.96 }}
                transition={{ duration: 0.18, ease: [0.4, 0, 0.2, 1] }}
                className="absolute right-0 top-12 w-80 rounded-2xl overflow-hidden z-50"
                style={{
                  background: 'rgba(255,255,255,0.95)',
                  backdropFilter: 'blur(20px)',
                  WebkitBackdropFilter: 'blur(20px)',
                  border: '1px solid rgba(226,232,240,0.8)',
                  boxShadow: '0 20px 60px rgba(0,0,0,0.12), 0 8px 24px rgba(0,0,0,0.08)',
                }}
              >
                {/* Header */}
                <div className="flex items-center justify-between px-4 py-3" style={{ borderBottom: '1px solid #F1F5F9' }}>
                  <div>
                    <p className="text-sm font-bold text-slate-800">Notifications</p>
                    {unreadCount > 0 && (
                      <p className="text-xs text-slate-400">{unreadCount} unread</p>
                    )}
                  </div>
                  {unreadCount > 0 && (
                    <button
                      onClick={markAllRead}
                      className="text-xs font-medium transition-colors"
                      style={{ color: '#6366f1' }}
                      onMouseEnter={e => (e.currentTarget.style.color = '#4f46e5')}
                      onMouseLeave={e => (e.currentTarget.style.color = '#6366f1')}
                    >
                      Mark all read
                    </button>
                  )}
                </div>

                {/* List */}
                <div className="divide-y divide-slate-100" style={{ maxHeight: '340px', overflowY: 'auto' }}>
                  {notifList.length === 0 ? (
                    <div className="py-10 text-center">
                      <Bell size={28} className="mx-auto mb-2 text-slate-300" />
                      <p className="text-sm text-slate-400">No notifications</p>
                    </div>
                  ) : (
                    notifList.map((notif) => {
                      const { icon: NIcon, bg, color } = notificationIcon(notif.type);
                      return (
                        <motion.div
                          key={notif.id}
                          layout
                          initial={{ opacity: 0, x: 10 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: 10 }}
                          className="flex gap-3 px-4 py-3 group cursor-pointer transition-colors"
                          style={{ backgroundColor: notif.read ? 'transparent' : 'rgba(99,102,241,0.03)' }}
                          onMouseEnter={e => (e.currentTarget.style.backgroundColor = '#F8FAFC')}
                          onMouseLeave={e => (e.currentTarget.style.backgroundColor = notif.read ? 'transparent' : 'rgba(99,102,241,0.03)')}
                        >
                          {/* Icon */}
                          <div
                            className="w-8 h-8 rounded-xl shrink-0 flex items-center justify-center mt-0.5"
                            style={{ backgroundColor: bg }}
                          >
                            <NIcon size={14} style={{ color }} />
                          </div>

                          {/* Content */}
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-semibold text-slate-700 leading-tight flex items-center gap-1.5">
                              {notif.title}
                              {!notif.read && (
                                <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ backgroundColor: '#6366f1' }} />
                              )}
                            </p>
                            <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">
                              {notif.description}
                            </p>
                            <p className="text-xs mt-1" style={{ color: '#94a3b8' }}>
                              {notif.time}
                            </p>
                          </div>

                          {/* Dismiss */}
                          <button
                            onClick={e => dismissNotif(notif.id, e)}
                            className="shrink-0 opacity-0 group-hover:opacity-100 transition-opacity p-1 rounded-lg"
                            style={{ color: '#94a3b8' }}
                            onMouseEnter={e => (e.currentTarget.style.color = '#ef4444')}
                            onMouseLeave={e => (e.currentTarget.style.color = '#94a3b8')}
                          >
                            <X size={12} />
                          </button>
                        </motion.div>
                      );
                    })
                  )}
                </div>

                {/* Footer */}
                {notifList.length > 0 && (
                  <div className="px-4 py-2.5" style={{ borderTop: '1px solid #F1F5F9' }}>
                    <button
                      className="w-full text-center text-xs font-medium py-1.5 rounded-lg transition-colors"
                      style={{ color: '#6366f1' }}
                      onMouseEnter={e => (e.currentTarget.style.backgroundColor = '#F5F3FF')}
                      onMouseLeave={e => (e.currentTarget.style.backgroundColor = 'transparent')}
                    >
                      View all notifications
                    </button>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Divider */}
        <div className="w-px h-6 mx-1" style={{ backgroundColor: '#E2E8F0' }} />

        {/* Avatar / User Menu */}
        <div ref={avatarRef} className="relative">
          <motion.button
            whileTap={{ scale: 0.97 }}
            onClick={() => {
              setShowAvatar(v => !v);
              setShowNotifications(false);
            }}
            className="flex items-center gap-2.5 rounded-xl px-3 py-2 transition-colors"
            style={{ backgroundColor: showAvatar ? '#F1F5F9' : 'transparent' }}
            onMouseEnter={e => (e.currentTarget.style.backgroundColor = '#F1F5F9')}
            onMouseLeave={e => {
              if (!showAvatar) e.currentTarget.style.backgroundColor = 'transparent';
            }}
          >
            {/* Avatar circle */}
            <div
              className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold text-white shrink-0"
              style={{ background: 'linear-gradient(135deg, #6366f1, #8b5cf6)' }}
            >
              A
            </div>
            <div className="hidden sm:block text-left">
              <p className="text-sm font-semibold text-slate-700 leading-tight">Admin</p>
              <p className="text-xs leading-tight" style={{ color: '#94a3b8' }}>Super Admin</p>
            </div>
            <motion.div
              animate={{ rotate: showAvatar ? 180 : 0 }}
              transition={{ duration: 0.2 }}
              className="hidden sm:block"
            >
              <ChevronDown size={14} style={{ color: '#94a3b8' }} />
            </motion.div>
          </motion.button>

          {/* Avatar Dropdown */}
          <AnimatePresence>
            {showAvatar && (
              <motion.div
                initial={{ opacity: 0, y: 8, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 8, scale: 0.96 }}
                transition={{ duration: 0.18, ease: [0.4, 0, 0.2, 1] }}
                className="absolute right-0 top-12 w-56 rounded-2xl overflow-hidden z-50"
                style={{
                  background: 'rgba(255,255,255,0.97)',
                  backdropFilter: 'blur(20px)',
                  WebkitBackdropFilter: 'blur(20px)',
                  border: '1px solid rgba(226,232,240,0.8)',
                  boxShadow: '0 20px 60px rgba(0,0,0,0.12), 0 8px 24px rgba(0,0,0,0.08)',
                }}
              >
                {/* User info header */}
                <div className="px-4 py-3.5" style={{ borderBottom: '1px solid #F1F5F9' }}>
                  <div className="flex items-center gap-3">
                    <div
                      className="w-10 h-10 rounded-full flex items-center justify-center text-base font-bold text-white shrink-0"
                      style={{ background: 'linear-gradient(135deg, #6366f1, #8b5cf6)' }}
                    >
                      A
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-bold text-slate-800 truncate">Admin User</p>
                      <p className="text-xs text-slate-400 truncate">admin@erha.pk</p>
                    </div>
                  </div>
                </div>

                {/* Menu items */}
                <div className="py-1.5">
                  {avatarMenuItems.map(({ icon: Icon, label, description }) => (
                    <button
                      key={label}
                      className="w-full flex items-center gap-3 px-4 py-2.5 text-left transition-colors group"
                      onMouseEnter={e => (e.currentTarget.style.backgroundColor = '#F8FAFC')}
                      onMouseLeave={e => (e.currentTarget.style.backgroundColor = 'transparent')}
                    >
                      <div
                        className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0 transition-colors"
                        style={{ backgroundColor: '#F1F5F9', color: '#64748b' }}
                      >
                        <Icon size={15} />
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-slate-700">{label}</p>
                        <p className="text-xs text-slate-400">{description}</p>
                      </div>
                    </button>
                  ))}
                </div>

                {/* Sign out */}
                <div className="px-3 py-2.5" style={{ borderTop: '1px solid #F1F5F9' }}>
                  <button
                    className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left transition-colors group"
                    style={{ color: '#ef4444' }}
                    onMouseEnter={e => (e.currentTarget.style.backgroundColor = 'rgba(239,68,68,0.06)')}
                    onMouseLeave={e => (e.currentTarget.style.backgroundColor = 'transparent')}
                  >
                    <div
                      className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0"
                      style={{ backgroundColor: 'rgba(239,68,68,0.08)', color: '#ef4444' }}
                    >
                      <LogOut size={15} />
                    </div>
                    <div>
                      <p className="text-sm font-medium">Sign Out</p>
                      <p className="text-xs" style={{ color: '#fca5a5' }}>End admin session</p>
                    </div>
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </header>
  );
}
