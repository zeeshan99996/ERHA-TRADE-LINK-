import { createFileRoute } from '@tanstack/react-router';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ShoppingBag, Search, Eye, X, Filter } from 'lucide-react';
import { db } from '@/lib/supabase';

export const Route = createFileRoute('/admin/orders')({
  component: OrdersPage,
});

function fmtRs(n: number) {
  return `Rs. ${n.toLocaleString('en-PK')}`;
}

function fmtDate(d: string) {
  try {
    return new Date(d).toLocaleDateString('en-PK', { day: '2-digit', month: 'short', year: 'numeric' });
  } catch {
    return d;
  }
}

const ORDER_STATUSES = ['All', 'Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'];
const PAYMENT_STATUSES = ['All', 'Paid', 'Pending', 'Refunded', 'Failed'];

const ORDER_STATUS_COLORS: Record<string, string> = {
  Pending: 'bg-amber-100 text-amber-700',
  Processing: 'bg-blue-100 text-blue-700',
  Shipped: 'bg-indigo-100 text-indigo-700',
  Delivered: 'bg-emerald-100 text-emerald-700',
  Cancelled: 'bg-red-100 text-red-700',
};

const PAYMENT_STATUS_COLORS: Record<string, string> = {
  Paid: 'bg-emerald-100 text-emerald-700',
  Pending: 'bg-amber-100 text-amber-700',
  Refunded: 'bg-purple-100 text-purple-700',
  Failed: 'bg-red-100 text-red-700',
};

export function OrdersPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [search, setSearch] = useState('');
  const [orderStatus, setOrderStatus] = useState('All');
  const [paymentStatus, setPaymentStatus] = useState('All');
  const [selectedOrder, setSelectedOrder] = useState<any | null>(null);
  const [showFilters, setShowFilters] = useState(false);

  const syncOrders = () => setOrders(db.getOrders());

  useEffect(() => {
    syncOrders();
    window.addEventListener('storage', syncOrders);
    return () => window.removeEventListener('storage', syncOrders);
  }, []);

  const handleUpdateStatus = (id: string, status: string) => {
    db.updateOrderStatus(id, status);
    syncOrders();
    if (selectedOrder?.id === id) {
      setSelectedOrder((prev: any) => prev ? { ...prev, orderStatus: status } : prev);
    }
  };

  const handleUpdatePaymentStatus = (id: string, status: string) => {
    db.updateOrderPaymentStatus(id, status);
    syncOrders();
    if (selectedOrder?.id === id) {
      setSelectedOrder((prev: any) => prev ? { ...prev, paymentStatus: status } : prev);
    }
  };

  const filtered = orders.filter(o => {
    const q = search.toLowerCase();
    const matchSearch = o.id.toLowerCase().includes(q) || o.customer.toLowerCase().includes(q) || (o.email || '').toLowerCase().includes(q);
    const matchOrder = orderStatus === 'All' || o.orderStatus === orderStatus;
    const matchPayment = paymentStatus === 'All' || o.paymentStatus === paymentStatus;
    return matchSearch && matchOrder && matchPayment;
  });

  const stats = {
    total: orders.length,
    pending: orders.filter(o => o.orderStatus === 'Pending').length,
    delivered: orders.filter(o => o.orderStatus === 'Delivered').length,
    revenue: orders.filter(o => o.paymentStatus === 'Paid').reduce((s: number, o: any) => s + (o.total || 0), 0),
  };

  return (
    <div className="space-y-5">
      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Orders', value: stats.total, color: 'text-indigo-600', bg: 'bg-indigo-50' },
          { label: 'Pending', value: stats.pending, color: 'text-amber-600', bg: 'bg-amber-50' },
          { label: 'Delivered', value: stats.delivered, color: 'text-emerald-600', bg: 'bg-emerald-50' },
          { label: 'Paid Revenue', value: fmtRs(stats.revenue), color: 'text-violet-600', bg: 'bg-violet-50' },
        ].map(s => (
          <div key={s.label} className={`${s.bg} rounded-2xl p-4`}>
            <p className="text-xs text-slate-500 font-medium">{s.label}</p>
            <p className={`text-xl font-bold mt-1 ${s.color}`}>{s.value}</p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 space-y-3">
        <div className="flex gap-3">
          <div className="relative flex-1">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input type="text" placeholder="Search by order ID, customer, email..." value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500" />
          </div>
          <button onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-1.5 px-4 py-2.5 text-sm font-semibold border border-slate-200 rounded-xl text-slate-600 hover:bg-slate-50">
            <Filter size={14} /> Filters
          </button>
        </div>
        {showFilters && (
          <div className="flex flex-wrap gap-3">
            <select value={orderStatus} onChange={e => setOrderStatus(e.target.value)}
              className="px-3 py-2 text-sm border border-slate-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500">
              {ORDER_STATUSES.map(s => <option key={s}>{s}</option>)}
            </select>
            <select value={paymentStatus} onChange={e => setPaymentStatus(e.target.value)}
              className="px-3 py-2 text-sm border border-slate-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500">
              {PAYMENT_STATUSES.map(s => <option key={s}>{s}</option>)}
            </select>
          </div>
        )}
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50">
                <th className="text-left px-5 py-3.5 text-xs font-semibold text-slate-500 uppercase">Order ID</th>
                <th className="text-left px-5 py-3.5 text-xs font-semibold text-slate-500 uppercase">Customer</th>
                <th className="text-left px-5 py-3.5 text-xs font-semibold text-slate-500 uppercase hidden md:table-cell">Items</th>
                <th className="text-left px-5 py-3.5 text-xs font-semibold text-slate-500 uppercase">Total</th>
                <th className="text-left px-5 py-3.5 text-xs font-semibold text-slate-500 uppercase hidden sm:table-cell">Payment</th>
                <th className="text-left px-5 py-3.5 text-xs font-semibold text-slate-500 uppercase">Status</th>
                <th className="text-right px-5 py-3.5 text-xs font-semibold text-slate-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filtered.map((o: any) => (
                <tr key={o.id} className="group hover:bg-slate-50 transition-colors">
                  <td className="px-5 py-3.5 font-mono text-xs font-semibold text-indigo-600">{o.id}</td>
                  <td className="px-5 py-3.5">
                    <p className="font-medium text-slate-800">{o.customer}</p>
                    <p className="text-xs text-slate-400">{o.email}</p>
                  </td>
                  <td className="px-5 py-3.5 text-slate-500 hidden md:table-cell">
                    <span className="text-xs">{(o.items || []).join(', ').substring(0, 40)}{(o.items || []).join(', ').length > 40 ? '…' : ''}</span>
                  </td>
                  <td className="px-5 py-3.5 font-semibold text-slate-700">{fmtRs(o.total || 0)}</td>
                  <td className="px-5 py-3.5 hidden sm:table-cell">
                    <select
                      value={o.paymentStatus}
                      onChange={(e) => handleUpdatePaymentStatus(o.id, e.target.value)}
                      className={`text-xs font-semibold px-2.5 py-1 rounded-full border border-slate-200 bg-white outline-none cursor-pointer ${PAYMENT_STATUS_COLORS[o.paymentStatus] || 'bg-gray-100 text-gray-600'} transition-all`}
                    >
                      {['Paid', 'Pending', 'Refunded', 'Failed'].map(statusOption => (
                        <option key={statusOption} value={statusOption} className="bg-white text-slate-800 font-semibold">{statusOption}</option>
                      ))}
                    </select>
                  </td>
                  <td className="px-5 py-3.5">
                    <select
                      value={o.orderStatus}
                      onChange={(e) => handleUpdateStatus(o.id, e.target.value)}
                      className={`text-xs font-semibold px-2.5 py-1 rounded-full border border-slate-200 bg-white outline-none cursor-pointer ${ORDER_STATUS_COLORS[o.orderStatus] || 'bg-gray-100 text-gray-600'} transition-all`}
                    >
                      {['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'].map(statusOption => (
                        <option key={statusOption} value={statusOption} className="bg-white text-slate-800 font-semibold">{statusOption}</option>
                      ))}
                    </select>
                  </td>
                  <td className="px-5 py-3.5 text-right">
                    <button onClick={() => setSelectedOrder(o)}
                      className="flex items-center gap-1 ml-auto text-[11px] bg-indigo-50 text-indigo-600 hover:bg-indigo-100 font-bold px-2.5 py-1 rounded-lg transition-all">
                      <Eye size={12} /> View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filtered.length === 0 && (
            <div className="text-center py-16 text-slate-400">
              <ShoppingBag className="size-12 mx-auto mb-3 opacity-30" />
              <p className="font-semibold text-slate-600">No orders found</p>
            </div>
          )}
        </div>
      </div>

      {/* Order Detail Modal */}
      <AnimatePresence>
        {selectedOrder && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
            <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden">
              <div className="flex items-center justify-between p-5 border-b border-slate-100">
                <div>
                  <h3 className="font-bold text-slate-800">Order {selectedOrder.id}</h3>
                  <p className="text-xs text-slate-400">{fmtDate(selectedOrder.date)}</p>
                </div>
                <button onClick={() => setSelectedOrder(null)} className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-500"><X size={16} /></button>
              </div>
              <div className="p-5 space-y-4 max-h-[70vh] overflow-y-auto">
                <div className="grid grid-cols-2 gap-4">
                  <div><p className="text-xs text-slate-500 font-medium">Customer</p><p className="font-semibold text-slate-800">{selectedOrder.customer}</p></div>
                  <div><p className="text-xs text-slate-500 font-medium">Phone</p><p className="font-semibold text-slate-800">{selectedOrder.phone}</p></div>
                  <div><p className="text-xs text-slate-500 font-medium">Email</p><p className="font-semibold text-slate-800 text-xs">{selectedOrder.email}</p></div>
                  <div><p className="text-xs text-slate-500 font-medium">Total</p><p className="font-bold text-indigo-600">{fmtRs(selectedOrder.total || 0)}</p></div>
                  <div><p className="text-xs text-slate-500 font-medium">Payment</p><span className={`text-xs font-semibold px-2 py-1 rounded-full ${PAYMENT_STATUS_COLORS[selectedOrder.paymentStatus] || ''}`}>{selectedOrder.paymentStatus}</span></div>
                  <div><p className="text-xs text-slate-500 font-medium">Method</p><p className="font-semibold text-slate-800">{selectedOrder.paymentMethod}</p></div>
                </div>
                <div>
                  <p className="text-xs text-slate-500 font-medium mb-1">Items</p>
                  <ul className="space-y-1">{(selectedOrder.items || []).map((item: string, i: number) => <li key={i} className="text-sm text-slate-700 bg-slate-50 px-3 py-2 rounded-lg">{item}</li>)}</ul>
                </div>
                {selectedOrder.address && <div><p className="text-xs text-slate-500 font-medium">Address</p><p className="text-sm text-slate-700">{selectedOrder.address}</p></div>}
                <div className="border-t border-slate-100 pt-4">
                  <p className="text-xs text-slate-500 font-medium mb-2">Update Order Status</p>
                  <div className="flex flex-wrap gap-2">
                    {(['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled']).map(s => (
                      <button key={s} onClick={() => handleUpdateStatus(selectedOrder.id, s)}
                        className={`text-xs px-3 py-1.5 rounded-lg font-semibold border transition-all ${selectedOrder.orderStatus === s ? 'bg-indigo-600 text-white border-indigo-600' : 'border-slate-200 text-slate-600 hover:bg-slate-50'}`}>
                        {s}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="border-t border-slate-100 pt-4">
                  <p className="text-xs text-slate-500 font-medium mb-2">Update Payment Status</p>
                  <div className="flex flex-wrap gap-2">
                    {(['Paid', 'Pending', 'Refunded', 'Failed']).map(s => (
                      <button key={s} onClick={() => handleUpdatePaymentStatus(selectedOrder.id, s)}
                        className={`text-xs px-3 py-1.5 rounded-lg font-semibold border transition-all ${selectedOrder.paymentStatus === s ? 'bg-indigo-600 text-white border-indigo-600' : 'border-slate-200 text-slate-600 hover:bg-slate-50'}`}>
                        {s}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
