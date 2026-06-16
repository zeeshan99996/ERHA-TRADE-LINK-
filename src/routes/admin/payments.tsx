import { createFileRoute } from '@tanstack/react-router';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { CreditCard, Search, Eye, X } from 'lucide-react';
import { db } from '@/lib/supabase';

export const Route = createFileRoute('/admin/payments')({
  component: PaymentsPage,
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

const PAYMENT_STATUS_COLORS: Record<string, string> = {
  Paid: 'bg-emerald-100 text-emerald-700',
  Pending: 'bg-amber-100 text-amber-700',
  Refunded: 'bg-purple-100 text-purple-700',
  Failed: 'bg-red-100 text-red-700',
};

export function PaymentsPage() {
  const [payments, setPayments] = useState<any[]>([]);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('All');
  const [selected, setSelected] = useState<any | null>(null);

  const syncPayments = () => setPayments(db.getPayments());

  useEffect(() => {
    syncPayments();
    window.addEventListener('storage', syncPayments);
    return () => window.removeEventListener('storage', syncPayments);
  }, []);

  const paid = payments.filter(p => p.status === 'Paid');
  const pending = payments.filter(p => p.status === 'Pending');
  const refunded = payments.filter(p => p.status === 'Refunded');
  const totalRevenue = paid.reduce((s, p) => s + (p.amount || 0), 0);

  const filtered = payments.filter(p => {
    const q = search.toLowerCase();
    const matchSearch = (p.id || '').toLowerCase().includes(q) || (p.orderId || '').toLowerCase().includes(q) || (p.method || '').toLowerCase().includes(q);
    const matchFilter = filter === 'All' || p.status === filter;
    return matchSearch && matchFilter;
  });

  return (
    <div className="space-y-5">
      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Revenue', value: fmtRs(totalRevenue), color: 'text-emerald-600', bg: 'bg-emerald-50' },
          { label: 'Paid', value: paid.length, color: 'text-indigo-600', bg: 'bg-indigo-50' },
          { label: 'Pending', value: pending.length, color: 'text-amber-600', bg: 'bg-amber-50' },
          { label: 'Refunded', value: refunded.length, color: 'text-purple-600', bg: 'bg-purple-50' },
        ].map(s => (
          <div key={s.label} className={`${s.bg} rounded-2xl p-4`}>
            <p className="text-xs text-slate-500 font-medium">{s.label}</p>
            <p className={`text-xl font-bold mt-1 ${s.color}`}>{s.value}</p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input type="text" placeholder="Search transactions..." value={search} onChange={e => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white" />
        </div>
        <div className="flex gap-2 flex-wrap">
          {['All', 'Paid', 'Pending', 'Refunded'].map(f => (
            <button key={f} onClick={() => setFilter(f)}
              className={`px-4 py-2 text-sm font-semibold rounded-xl transition-all ${filter === f ? 'bg-indigo-600 text-white' : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'}`}>
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50">
                <th className="text-left px-5 py-3.5 text-xs font-semibold text-slate-500 uppercase">Payment ID</th>
                <th className="text-left px-5 py-3.5 text-xs font-semibold text-slate-500 uppercase">Order</th>
                <th className="text-left px-5 py-3.5 text-xs font-semibold text-slate-500 uppercase hidden md:table-cell">Method</th>
                <th className="text-left px-5 py-3.5 text-xs font-semibold text-slate-500 uppercase hidden md:table-cell">Date</th>
                <th className="text-left px-5 py-3.5 text-xs font-semibold text-slate-500 uppercase">Amount</th>
                <th className="text-left px-5 py-3.5 text-xs font-semibold text-slate-500 uppercase">Status</th>
                <th className="text-right px-5 py-3.5 text-xs font-semibold text-slate-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filtered.map((p: any) => (
                <tr key={p.id} className="group hover:bg-slate-50 transition-colors">
                  <td className="px-5 py-3.5 font-mono text-xs font-semibold text-indigo-600">{p.id}</td>
                  <td className="px-5 py-3.5 font-medium text-slate-700">{p.orderId}</td>
                  <td className="px-5 py-3.5 text-slate-500 hidden md:table-cell">{p.method}</td>
                  <td className="px-5 py-3.5 text-slate-500 hidden md:table-cell">{fmtDate(p.date)}</td>
                  <td className="px-5 py-3.5 font-bold text-slate-700">{fmtRs(p.amount || 0)}</td>
                  <td className="px-5 py-3.5">
                    <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${PAYMENT_STATUS_COLORS[p.status] || 'bg-gray-100 text-gray-600'}`}>{p.status}</span>
                  </td>
                  <td className="px-5 py-3.5 text-right">
                    <button onClick={() => setSelected(p)} className="flex items-center gap-1 ml-auto text-[11px] bg-indigo-50 text-indigo-600 hover:bg-indigo-100 font-bold px-2.5 py-1 rounded-lg transition-all">
                      <Eye size={12} /> View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filtered.length === 0 && (
            <div className="text-center py-16 text-slate-400">
              <CreditCard className="size-12 mx-auto mb-3 opacity-30" />
              <p className="font-semibold text-slate-600">No transactions found</p>
            </div>
          )}
        </div>
      </div>

      {/* Detail Modal */}
      <AnimatePresence>
        {selected && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
            <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden">
              <div className="flex items-center justify-between p-5 border-b border-slate-100">
                <h3 className="font-bold text-slate-800">Transaction {selected.id}</h3>
                <button onClick={() => setSelected(null)} className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-500"><X size={16} /></button>
              </div>
              <div className="p-5 space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <div><p className="text-xs text-slate-500 font-medium">Order ID</p><p className="font-semibold text-slate-800">{selected.orderId}</p></div>
                  <div><p className="text-xs text-slate-500 font-medium">Amount</p><p className="font-bold text-emerald-600">{fmtRs(selected.amount || 0)}</p></div>
                  <div><p className="text-xs text-slate-500 font-medium">Method</p><p className="font-semibold text-slate-800">{selected.method}</p></div>
                  <div><p className="text-xs text-slate-500 font-medium">Date</p><p className="font-semibold text-slate-800">{fmtDate(selected.date)}</p></div>
                  <div><p className="text-xs text-slate-500 font-medium">Status</p><span className={`text-xs font-semibold px-2 py-1 rounded-full ${PAYMENT_STATUS_COLORS[selected.status] || ''}`}>{selected.status}</span></div>
                  {selected.reference && <div><p className="text-xs text-slate-500 font-medium">Reference</p><p className="font-mono text-xs text-slate-700">{selected.reference}</p></div>}
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
