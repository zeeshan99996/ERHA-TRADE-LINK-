import { createFileRoute } from '@tanstack/react-router'
import { useState, useEffect } from 'react'
import { motion } from 'motion/react'
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts'
import {
  TrendingUp,
  TrendingDown,
  ShoppingBag,
  Users,
  Package,
  DollarSign,
  AlertTriangle,
  ArrowRight,
} from 'lucide-react'
import { db } from '@/lib/supabase'

export const Route = createFileRoute('/admin/')({
  component: DashboardPage,
})

// ─── Dynamic Chart Data Helpers ─────────────────────────────────────────────

const getRevenueChartData = (orders: any[]) => {
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
  const result = []
  const now = new Date()
  
  for (let i = 5; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1)
    const monthName = months[d.getMonth()]
    const yearVal = d.getFullYear()
    
    const matchingOrders = orders.filter(o => {
      const orderDate = new Date(o.date)
      return orderDate.getMonth() === d.getMonth() && orderDate.getFullYear() === yearVal && o.orderStatus !== 'Cancelled'
    })
    
    const revenue = matchingOrders.reduce((sum, o) => sum + (o.total || 0), 0)
    const ordersCount = matchingOrders.length
    
    result.push({
      month: `${monthName}`,
      revenue,
      orders: ordersCount,
    })
  }
  return result
}

const getCategoryChartData = (products: any[]) => {
  const CATEGORY_COLORS: Record<string, string> = {
    'Ultra Compact': '#6366F1',
    'Laptop Power Banks': '#8B5CF6',
    'MagSafe & Wireless': '#10B981',
    'High Capacity': '#F59E0B',
    'Rugged & Solar': '#EF4444',
  }
  
  const counts: Record<string, number> = {}
  let total = 0
  
  products.forEach(p => {
    if (p.category) {
      counts[p.category] = (counts[p.category] || 0) + 1
      total++
    }
  })
  
  if (total === 0) {
    return Object.entries(CATEGORY_COLORS).map(([name, color]) => ({
      name,
      value: 0,
      color,
    }))
  }
  
  return Object.entries(counts).map(([name, count]) => ({
    name,
    value: Math.round((count / total) * 100),
    color: CATEGORY_COLORS[name] || '#94A3B8',
  }))
}

// ─── Helpers ────────────────────────────────────────────────────────────────

function formatPKR(n: number) {
  if (n >= 1_000_000) return `Rs. ${(n / 1_000_000).toFixed(2)}M`
  if (n >= 1_000) return `Rs. ${(n / 1_000).toFixed(0)}K`
  return `Rs. ${n.toLocaleString('en-PK')}`
}

function formatPKRFull(n: number) {
  return `Rs. ${n.toLocaleString('en-PK')}`
}

const STATUS_COLORS: Record<string, { bg: string; text: string; dot: string }> = {
  Delivered:   { bg: 'bg-emerald-50',  text: 'text-emerald-700',  dot: 'bg-emerald-500' },
  Shipped:     { bg: 'bg-blue-50',     text: 'text-blue-700',     dot: 'bg-blue-500' },
  Processing:  { bg: 'bg-indigo-50',   text: 'text-indigo-700',   dot: 'bg-indigo-500' },
  Pending:     { bg: 'bg-amber-50',    text: 'text-amber-700',    dot: 'bg-amber-500' },
  Cancelled:   { bg: 'bg-red-50',      text: 'text-red-700',      dot: 'bg-red-500' },
  Returned:    { bg: 'bg-orange-50',   text: 'text-orange-700',   dot: 'bg-orange-500' },
}

// ─── Stat Card ───────────────────────────────────────────────────────────────

type StatCardProps = {
  title: string
  value: string
  trend: string
  trendUp: boolean
  icon: React.ReactNode
  iconBg: string
  delay: number
}

function StatCard({ title, value, trend, trendUp, icon, iconBg, delay }: StatCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, delay, ease: 'easeOut' }}
      className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 flex items-start gap-4"
    >
      <div className={`${iconBg} p-3 rounded-xl flex-shrink-0`}>
        {icon}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-slate-500 mb-1">{title}</p>
        <p className="text-2xl font-bold text-slate-800 leading-none mb-2">{value}</p>
        <div className="flex items-center gap-1">
          {trendUp ? (
            <TrendingUp className="w-3.5 h-3.5 text-emerald-500" />
          ) : (
            <TrendingDown className="w-3.5 h-3.5 text-red-500" />
          )}
          <span className={`text-xs font-semibold ${trendUp ? 'text-emerald-600' : 'text-red-600'}`}>
            {trend}
          </span>
          <span className="text-xs text-slate-400">vs last month</span>
        </div>
      </div>
    </motion.div>
  )
}

// ─── Custom Tooltip for AreaChart ────────────────────────────────────────────

function RevenueTooltip({ active, payload, label }: {
  active?: boolean
  payload?: Array<{ value: number; name: string }>
  label?: string
}) {
  if (!active || !payload?.length) return null
  return (
    <div className="bg-white border border-slate-200 rounded-xl shadow-lg p-3 text-sm">
      <p className="font-semibold text-slate-700 mb-2">{label}</p>
      {payload.map((p) => (
        <div key={p.name} className="flex items-center gap-2">
          <span className="text-slate-500 capitalize">{p.name === 'revenue' ? 'Revenue' : 'Orders'}:</span>
          <span className="font-bold text-slate-800">
            {p.name === 'revenue' ? formatPKR(p.value) : p.value}
          </span>
        </div>
      ))}
    </div>
  )
}

// ─── Custom Tooltip for PieChart ─────────────────────────────────────────────

function CategoryTooltip({ active, payload }: {
  active?: boolean
  payload?: Array<{ name: string; value: number; payload: { color: string } }>
}) {
  if (!active || !payload?.length) return null
  const item = payload[0]
  return (
    <div className="bg-white border border-slate-200 rounded-xl shadow-lg p-3 text-sm">
      <div className="flex items-center gap-2">
        <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: item.payload.color }} />
        <span className="font-semibold text-slate-700">{item.name}</span>
        <span className="font-bold text-slate-800">{item.value}%</span>
      </div>
    </div>
  )
}

// ─── Custom Legend ────────────────────────────────────────────────────────────

function CustomLegend({ payload }: { payload?: Array<{ value: string; color: string }> }) {
  if (!payload) return null
  return (
    <div className="flex flex-col gap-2 mt-2">
      {payload.map((entry) => (
        <div key={entry.value} className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: entry.color }} />
          <span className="text-xs text-slate-600">{entry.value}</span>
        </div>
      ))}
    </div>
  )
}

// ─── Dashboard Page ───────────────────────────────────────────────────────────

function DashboardPage() {
  const [products, setProducts] = useState<any[]>([])
  const [orders, setOrders] = useState<any[]>([])
  const [customersCount, setCustomersCount] = useState(0)

  useEffect(() => {
    setProducts(db.getProducts())
    setOrders(db.getOrders())
    setCustomersCount(db.getCustomers().length)

    const syncAll = () => {
      setProducts(db.getProducts())
      setOrders(db.getOrders())
      setCustomersCount(db.getCustomers().length)
    }

    window.addEventListener('storage', syncAll)
    return () => window.removeEventListener('storage', syncAll)
  }, [])

  // Compute totals
  const activeOrders = orders.filter(o => o.orderStatus !== 'Cancelled')
  const totalRevenue = activeOrders.reduce((s, d) => s + (d.total || 0), 0)
  const totalOrders = orders.length

  // Compute low stock products (stock < minStock)
  const lowStockProducts = products.filter(
    (p) => (p.stock ?? 0) < (p.minStock ?? 10)
  )

  // Recent 5 orders
  const recentOrders = [...orders]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 5)

  const revenueData = getRevenueChartData(orders)
  const categoryData = getCategoryChartData(products)

  const stats = [
    {
      title: 'Total Revenue',
      value: formatPKRFull(totalRevenue),
      trend: totalRevenue > 0 ? '+100%' : '0%',
      trendUp: true,
      icon: <DollarSign className="w-5 h-5 text-indigo-600" />,
      iconBg: 'bg-indigo-100',
      delay: 0.05,
    },
    {
      title: 'Total Orders',
      value: String(totalOrders),
      trend: totalOrders > 0 ? '+100%' : '0%',
      trendUp: true,
      icon: <ShoppingBag className="w-5 h-5 text-violet-600" />,
      iconBg: 'bg-violet-100',
      delay: 0.12,
    },
    {
      title: 'Active Customers',
      value: String(customersCount),
      trend: customersCount > 0 ? '+100%' : '0%',
      trendUp: true,
      icon: <Users className="w-5 h-5 text-emerald-600" />,
      iconBg: 'bg-emerald-100',
      delay: 0.19,
    },
    {
      title: 'Low Stock Items',
      value: String(lowStockProducts.length),
      trend: lowStockProducts.length > 0 ? `${lowStockProducts.length} items` : '0 items',
      trendUp: false,
      icon: <Package className="w-5 h-5 text-amber-600" />,
      iconBg: 'bg-amber-100',
      delay: 0.26,
    },
  ]

  return (
    <div className="space-y-6">

      {/* ── Stats Row ──────────────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {stats.map((s) => (
          <StatCard key={s.title} {...s} />
        ))}
      </div>

      {/* ── Charts Row ─────────────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">

        {/* Revenue Area Chart */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.32, ease: 'easeOut' }}
          className="lg:col-span-3 bg-white rounded-2xl shadow-sm border border-slate-100 p-6"
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-base font-bold text-slate-800">Revenue Overview</h2>
              <p className="text-sm text-slate-500 mt-0.5">Last 6 months performance</p>
            </div>
            <div className="bg-indigo-50 text-indigo-700 text-xs font-semibold px-3 py-1.5 rounded-full">
              {formatPKR(totalRevenue)} total
            </div>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={revenueData} margin={{ top: 5, right: 5, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#6366F1" stopOpacity={0.18} />
                  <stop offset="95%" stopColor="#6366F1" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="ordersGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#8B5CF6" stopOpacity={0.15} />
                  <stop offset="95%" stopColor="#8B5CF6" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
              <XAxis
                dataKey="month"
                tick={{ fontSize: 12, fill: '#94A3B8' }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                tick={{ fontSize: 11, fill: '#94A3B8' }}
                axisLine={false}
                tickLine={false}
                tickFormatter={(v) => `${(v / 1000).toFixed(0)}K`}
                width={42}
              />
              <Tooltip content={<RevenueTooltip />} />
              <Area
                type="monotone"
                dataKey="revenue"
                stroke="#6366F1"
                strokeWidth={2.5}
                fill="url(#revenueGradient)"
                dot={{ r: 4, fill: '#6366F1', strokeWidth: 2, stroke: '#fff' }}
                activeDot={{ r: 6 }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Category Pie Chart */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.38, ease: 'easeOut' }}
          className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-slate-100 p-6"
        >
          <div className="mb-4">
            <h2 className="text-base font-bold text-slate-800">Sales by Category</h2>
            <p className="text-sm text-slate-500 mt-0.5">Revenue distribution</p>
          </div>
          <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-2">
            <div className="w-full sm:flex-1">
              <ResponsiveContainer width="100%" height={160}>
                <PieChart>
                  <Pie
                    data={categoryData}
                    cx="50%"
                    cy="50%"
                    innerRadius={45}
                    outerRadius={72}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {categoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} stroke="transparent" />
                    ))}
                  </Pie>
                  <Tooltip content={<CategoryTooltip />} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="flex flex-col gap-2 flex-shrink-0 w-full sm:w-auto">
              {categoryData.map((cat) => (
                <div key={cat.name} className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: cat.color }} />
                  <span className="text-xs text-slate-600 leading-none">{cat.name}</span>
                  <span className="text-xs font-bold text-slate-700 ml-auto">{cat.value}%</span>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>

      {/* ── Bottom Row: Recent Orders + Low Stock ──────────────────────────── */}
      <div className="grid grid-cols-1 xl:grid-cols-5 gap-4">

        {/* Recent Orders Table */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.44, ease: 'easeOut' }}
          className="xl:col-span-3 bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden"
        >
          <div className="p-6 pb-4 flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-slate-800">Recent Orders</h2>
              <p className="text-sm text-slate-500 mt-0.5">Latest 5 transactions</p>
            </div>
            <button className="flex items-center gap-1.5 text-indigo-600 text-xs font-semibold hover:text-indigo-800 transition-colors">
              View all <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-t border-slate-100">
                  <th className="text-left text-xs font-semibold text-slate-400 uppercase tracking-wide px-6 py-3">Order</th>
                  <th className="text-left text-xs font-semibold text-slate-400 uppercase tracking-wide px-3 py-3">Customer</th>
                  <th className="text-left text-xs font-semibold text-slate-400 uppercase tracking-wide px-3 py-3">Total</th>
                  <th className="text-left text-xs font-semibold text-slate-400 uppercase tracking-wide px-3 py-3">Status</th>
                  <th className="text-left text-xs font-semibold text-slate-400 uppercase tracking-wide px-3 py-3 pr-6">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {recentOrders.map((order, i) => {
                  const customerName = typeof order.customer === 'string'
                    ? order.customer
                    : (order.customer as { name: string }).name
                  const statusStyle = STATUS_COLORS[order.orderStatus] ?? { bg: 'bg-slate-50', text: 'text-slate-600', dot: 'bg-slate-400' }
                  return (
                    <motion.tr
                      key={order.id}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3, delay: 0.5 + i * 0.06 }}
                      className="hover:bg-slate-50 transition-colors"
                    >
                      <td className="px-6 py-4">
                        <span className="font-semibold text-slate-700">{order.id}</span>
                      </td>
                      <td className="px-3 py-4">
                        <span className="text-slate-600">{customerName}</span>
                      </td>
                      <td className="px-3 py-4">
                        <span className="font-semibold text-slate-800">{formatPKRFull(order.total)}</span>
                      </td>
                      <td className="px-3 py-4">
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${statusStyle.bg} ${statusStyle.text}`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${statusStyle.dot}`} />
                          {order.orderStatus}
                        </span>
                      </td>
                      <td className="px-3 py-4 pr-6">
                        <span className="text-slate-500">
                          {new Date(order.date).toLocaleDateString('en-PK', { day: 'numeric', month: 'short' })}
                        </span>
                      </td>
                    </motion.tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </motion.div>

        {/* Low Stock Alerts */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.5, ease: 'easeOut' }}
          className="xl:col-span-2 bg-white rounded-2xl shadow-sm border border-slate-100 p-6"
        >
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-base font-bold text-slate-800">Low Stock Alert</h2>
              <p className="text-sm text-slate-500 mt-0.5">{lowStockProducts.length} items need restock</p>
            </div>
            <div className="bg-amber-100 p-2 rounded-xl">
              <AlertTriangle className="w-4 h-4 text-amber-600" />
            </div>
          </div>

          {lowStockProducts.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <div className="w-12 h-12 rounded-full bg-emerald-50 flex items-center justify-center mb-3">
                <Package className="w-6 h-6 text-emerald-500" />
              </div>
              <p className="text-sm font-semibold text-slate-600">All stocked up!</p>
              <p className="text-xs text-slate-400 mt-1">No low stock items right now.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {lowStockProducts.slice(0, 6).map((product, i) => {
                const stockPct = Math.min(
                  100,
                  Math.round((product.stock / (product.minStock ?? 10)) * 100)
                )
                const isOut = product.stock === 0
                return (
                  <motion.div
                    key={product.id}
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: 0.55 + i * 0.06 }}
                    className={`rounded-xl p-3.5 border ${
                      isOut
                        ? 'bg-red-50 border-red-100'
                        : 'bg-amber-50 border-amber-100'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <p className="text-xs font-semibold text-slate-700 leading-tight line-clamp-2 flex-1">
                        {product.name}
                      </p>
                      <span className={`text-xs font-bold flex-shrink-0 ${isOut ? 'text-red-600' : 'text-amber-700'}`}>
                        {isOut ? 'OUT' : `${product.stock} left`}
                      </span>
                    </div>
                    <div className="w-full bg-white rounded-full h-1.5 overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all ${isOut ? 'bg-red-500' : 'bg-amber-400'}`}
                        style={{ width: `${stockPct}%` }}
                      />
                    </div>
                    <p className="text-xs text-slate-400 mt-1.5">
                      Min. required: {product.minStock ?? 10} units
                    </p>
                  </motion.div>
                )
              })}
            </div>
          )}
        </motion.div>
      </div>
    </div>
  )
}
