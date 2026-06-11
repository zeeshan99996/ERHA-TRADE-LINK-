import { createFileRoute } from '@tanstack/react-router';
import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Users,
  UserCheck,
  UserX,
  TrendingUp,
  Search,
  X,
  Eye,
  MapPin,
  Mail,
  Phone,
  ShoppingBag,
  Calendar,
  ChevronDown,
  MessageSquare,
  Save,
} from 'lucide-react';
import { adminCustomers, type AdminCustomer } from '@/lib/admin-data';

export const Route = createFileRoute('/admin/customers')({
  component: CustomersPage,
});

// ─── Helpers ──────────────────────────────────────────────────────────────────

function fmtRs(n: number) {
  return `Rs. ${n.toLocaleString('en-PK')}`;
}

function fmtDate(d: string) {
  return new Date(d).toLocaleDateString('en-PK', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
}

function getInitials(name: string) {
  return name
    .split(' ')
    .map((w) => w[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();
}

const CITIES = ['All Cities', 'Karachi', 'Lahore', 'Islamabad', 'Rawalpindi', 'Faisalabad', 'Multan', 'Peshawar'];
const STATUSES = ['All', 'Active', 'Inactive'];

// ─── Stat Card ────────────────────────────────────────────────────────────────

function StatCard({
  label,
  value,
  icon: Icon,
  color,
  delay,
}: {
  label: string;
  value: string | number;
  icon: React.ElementType;
  color: string;
  delay: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.4 }}
      className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex items-center gap-4"
    >
      <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${color}`}>
        <Icon className="w-7 h-7 text-white" />
      </div>
      <div>
        <p className="text-sm text-gray-500 font-medium">{label}</p>
        <p className="text-2xl font-bold text-gray-900 mt-0.5">{value}</p>
      </div>
    </motion.div>
  );
}

// ─── Status Badge ─────────────────────────────────────────────────────────────

function StatusBadge({ status }: { status: AdminCustomer['status'] }) {
  const styles: Record<string, string> = {
    Active: 'bg-emerald-100 text-emerald-700',
    Inactive: 'bg-gray-100 text-gray-500',
  };
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${styles[status]}`}>
      <span className={`w-1.5 h-1.5 rounded-full mr-1.5 ${status === 'Active' ? 'bg-emerald-500' : 'bg-gray-400'}`} />
      {status}
    </span>
  );
}

// ─── Slide-Over ───────────────────────────────────────────────────────────────

function CustomerSlideOver({
  customer,
  onClose,
}: {
  customer: AdminCustomer | null;
  onClose: () => void;
}) {
  const [notes, setNotes] = useState(customer?.notes ?? '');
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <AnimatePresence>
      {customer && (
        <>
          {/* Backdrop */}
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/40 z-40"
          />
          {/* Panel */}
          <motion.div
            key="panel"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className="fixed right-0 top-0 h-full w-full max-w-md bg-white z-50 shadow-2xl flex flex-col"
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-6 text-white">
              <div className="flex items-center justify-between mb-4">
                <span className="text-sm font-medium text-indigo-200">{customer.id}</span>
                <button
                  onClick={onClose}
                  className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center hover:bg-white/30 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
              <div className="flex items-center gap-4">
                <div
                  className="w-16 h-16 rounded-2xl flex items-center justify-center text-xl font-bold shadow-lg"
                  style={{ backgroundColor: customer.avatarColor }}
                >
                  {getInitials(customer.name)}
                </div>
                <div>
                  <h2 className="text-xl font-bold">{customer.name}</h2>
                  <StatusBadge status={customer.status} />
                </div>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {/* Contact Info */}
              <div>
                <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Contact Info</h3>
                <div className="space-y-3">
                  {[
                    { icon: Mail, label: customer.email },
                    { icon: Phone, label: customer.phone },
                    { icon: MapPin, label: customer.city },
                  ].map(({ icon: Icon, label }) => (
                    <div key={label} className="flex items-center gap-3 text-sm text-gray-700">
                      <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center">
                        <Icon className="w-4 h-4 text-gray-500" />
                      </div>
                      <span>{label}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Order Summary */}
              <div>
                <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Order Summary</h3>
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-indigo-50 rounded-xl p-4">
                    <ShoppingBag className="w-5 h-5 text-indigo-500 mb-1" />
                    <p className="text-2xl font-bold text-indigo-700">{customer.totalOrders}</p>
                    <p className="text-xs text-indigo-500 font-medium">Total Orders</p>
                  </div>
                  <div className="bg-emerald-50 rounded-xl p-4">
                    <TrendingUp className="w-5 h-5 text-emerald-500 mb-1" />
                    <p className="text-lg font-bold text-emerald-700">{fmtRs(customer.totalSpending)}</p>
                    <p className="text-xs text-emerald-500 font-medium">Total Spent</p>
                  </div>
                </div>
              </div>

              {/* Dates */}
              <div>
                <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Account Dates</h3>
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500 flex items-center gap-2">
                      <Calendar className="w-4 h-4" /> Joined
                    </span>
                    <span className="font-medium text-gray-800">{fmtDate(customer.joinDate)}</span>
                  </div>
                  {customer.lastOrderDate && (
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-500 flex items-center gap-2">
                        <ShoppingBag className="w-4 h-4" /> Last Order
                      </span>
                      <span className="font-medium text-gray-800">{fmtDate(customer.lastOrderDate)}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Notes */}
              <div>
                <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3 flex items-center gap-2">
                  <MessageSquare className="w-3.5 h-3.5" /> Notes
                </h3>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Add notes about this customer..."
                  rows={4}
                  className="w-full px-3 py-2 text-sm border border-gray-200 rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-gray-700 placeholder-gray-400"
                />
                <button
                  onClick={handleSave}
                  className={`mt-2 flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    saved
                      ? 'bg-emerald-100 text-emerald-700'
                      : 'bg-indigo-600 text-white hover:bg-indigo-700'
                  }`}
                >
                  <Save className="w-4 h-4" />
                  {saved ? 'Saved!' : 'Save Notes'}
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

function CustomersPage() {
  const [search, setSearch] = useState('');
  const [cityFilter, setCityFilter] = useState('All Cities');
  const [statusFilter, setStatusFilter] = useState('All');
  const [selectedCustomer, setSelectedCustomer] = useState<AdminCustomer | null>(null);

  const totalCustomers = adminCustomers.length;
  const activeCount = adminCustomers.filter((c) => c.status === 'Active').length;
  const inactiveCount = adminCustomers.filter((c) => c.status === 'Inactive').length;
  const avgOrderValue = Math.round(
    adminCustomers.reduce((sum, c) => sum + c.totalSpending / Math.max(c.totalOrders, 1), 0) / totalCustomers
  );

  const filtered = adminCustomers.filter((c) => {
    const matchSearch =
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.email.toLowerCase().includes(search.toLowerCase()) ||
      c.phone.includes(search);
    const matchCity = cityFilter === 'All Cities' || c.city === cityFilter;
    const matchStatus = statusFilter === 'All' || c.status === statusFilter;
    return matchSearch && matchCity && matchStatus;
  });

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <CustomerSlideOver customer={selectedCustomer} onClose={() => setSelectedCustomer(null)} />

      {/* Page Header */}
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Customers</h1>
        <p className="text-gray-500 mt-1">Manage and view all your customer accounts</p>
      </motion.div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard label="Total Customers" value={totalCustomers} icon={Users} color="bg-indigo-500" delay={0.05} />
        <StatCard label="Active" value={activeCount} icon={UserCheck} color="bg-emerald-500" delay={0.1} />
        <StatCard label="Inactive" value={inactiveCount} icon={UserX} color="bg-gray-400" delay={0.15} />
        <StatCard label="Avg Order Value" value={fmtRs(avgOrderValue)} icon={TrendingUp} color="bg-amber-500" delay={0.2} />
      </div>

      {/* Filters */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.25 }}
        className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 mb-6 flex flex-wrap gap-3 items-center"
      >
        {/* Search */}
        <div className="relative flex-1 min-w-48">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search by name, email, phone..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          />
        </div>

        {/* City Filter */}
        <div className="relative">
          <select
            value={cityFilter}
            onChange={(e) => setCityFilter(e.target.value)}
            className="appearance-none bg-gray-50 border border-gray-200 text-sm text-gray-700 rounded-xl pl-3 pr-8 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer"
          >
            {CITIES.map((c) => (
              <option key={c}>{c}</option>
            ))}
          </select>
          <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
        </div>

        {/* Status Filter */}
        <div className="flex gap-2">
          {STATUSES.map((s) => (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              className={`px-3 py-2 rounded-xl text-sm font-medium transition-all ${
                statusFilter === s
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {s}
            </button>
          ))}
        </div>

        <span className="text-sm text-gray-400 ml-auto">
          {filtered.length} of {totalCustomers} customers
        </span>
      </motion.div>

      {/* Table */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden"
      >
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                {['Customer', 'Contact', 'City', 'Orders', 'Total Spent', 'Joined', 'Status', ''].map((h) => (
                  <th
                    key={h}
                    className="text-left px-5 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wider whitespace-nowrap"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filtered.map((c, i) => (
                <motion.tr
                  key={c.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 + i * 0.04 }}
                  className="hover:bg-indigo-50/30 transition-colors group"
                >
                  {/* Avatar + Name */}
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <div
                        className="w-10 h-10 rounded-xl flex items-center justify-center text-sm font-bold text-white shadow-sm flex-shrink-0"
                        style={{ backgroundColor: c.avatarColor }}
                      >
                        {getInitials(c.name)}
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900 text-sm">{c.name}</p>
                        <p className="text-xs text-gray-400">{c.id}</p>
                      </div>
                    </div>
                  </td>

                  {/* Contact */}
                  <td className="px-5 py-4">
                    <p className="text-sm text-gray-700">{c.email}</p>
                    <p className="text-xs text-gray-400">{c.phone}</p>
                  </td>

                  {/* City */}
                  <td className="px-5 py-4">
                    <span className="flex items-center gap-1 text-sm text-gray-600">
                      <MapPin className="w-3.5 h-3.5 text-gray-400" />
                      {c.city}
                    </span>
                  </td>

                  {/* Orders */}
                  <td className="px-5 py-4 text-center">
                    <span className="text-sm font-semibold text-gray-800">{c.totalOrders}</span>
                  </td>

                  {/* Total Spent */}
                  <td className="px-5 py-4">
                    <span className="text-sm font-semibold text-indigo-700">{fmtRs(c.totalSpending)}</span>
                  </td>

                  {/* Joined */}
                  <td className="px-5 py-4">
                    <span className="text-sm text-gray-500">{fmtDate(c.joinDate)}</span>
                  </td>

                  {/* Status */}
                  <td className="px-5 py-4">
                    <StatusBadge status={c.status} />
                  </td>

                  {/* Actions */}
                  <td className="px-5 py-4">
                    <button
                      onClick={() => setSelectedCustomer(c)}
                      className="flex items-center gap-1.5 text-xs font-medium text-indigo-600 hover:text-indigo-800 opacity-0 group-hover:opacity-100 transition-all bg-indigo-50 hover:bg-indigo-100 px-3 py-1.5 rounded-lg"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      View
                    </button>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>

          {filtered.length === 0 && (
            <div className="text-center py-16 text-gray-400">
              <Users className="w-12 h-12 mx-auto mb-3 opacity-30" />
              <p className="text-lg font-medium">No customers found</p>
              <p className="text-sm">Try adjusting your search or filters</p>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}
