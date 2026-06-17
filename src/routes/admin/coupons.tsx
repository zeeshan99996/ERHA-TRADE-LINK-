import { createFileRoute } from '@tanstack/react-router';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Plus, Edit, Trash2, X, Save, Copy, Check } from 'lucide-react';
import { db } from '@/lib/supabase';
import { toast } from 'sonner';

export const Route = createFileRoute('/admin/coupons')({
  component: CouponsPage,
});

const COUPON_TYPES = ['Percentage', 'Fixed', 'Free Shipping'];

export function CouponsPage() {
  const [coupons, setCoupons] = useState<any[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editCoupon, setEditCoupon] = useState<any | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const [form, setForm] = useState({
    code: '', type: 'Percentage', value: '', minOrder: '', maxUsage: '', expiry: '', status: 'Active',
  });

  const syncCoupons = async () => setCoupons(await db.getCoupons());

  useEffect(() => {
    syncCoupons();
    window.addEventListener('storage', syncCoupons);
    return () => window.removeEventListener('storage', syncCoupons);
  }, []);

  const openCreate = () => {
    setEditCoupon(null);
    setForm({ code: '', type: 'Percentage', value: '', minOrder: '', maxUsage: '', expiry: '', status: 'Active' });
    setIsModalOpen(true);
  };

  const openEdit = (c: any) => {
    setEditCoupon(c);
    setForm({
      code: c.code, type: c.type, value: String(c.value || ''), minOrder: String(c.minOrder || ''),
      maxUsage: String(c.maxUsage || ''), expiry: c.expiry || '', status: c.status,
    });
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    const code = form.code.toUpperCase().trim();
    if (!code) return toast.error('Coupon code is required');

    const payload: any = {
      id: editCoupon?.id || `CPN-${Date.now()}`,
      code,
      type: form.type,
      value: parseFloat(form.value) || 0,
      minOrder: parseFloat(form.minOrder) || 0,
      usageCount: editCoupon?.usageCount || 0,
      maxUsage: parseInt(form.maxUsage) || 10000,
      expiry: form.expiry || '2099-12-31',
      status: form.status,
    };

    try {
      await db.saveCoupon(payload);
      toast.success(editCoupon ? 'Coupon updated!' : 'Coupon created!');
      setIsModalOpen(false);
      await syncCoupons();
    } catch (err: any) {
      toast.error('Failed to save coupon: ' + (err?.message || 'Unknown error'));
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await db.deleteCoupon(id);
      toast.success('Coupon deleted');
    } catch (err: any) {
      toast.error('Failed to delete coupon: ' + (err?.message || 'Unknown error'));
    }
    setDeleteId(null);
    await syncCoupons();
  };

  const handleCopy = (code: string) => {
    navigator.clipboard.writeText(code).catch(() => {});
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
    toast.success('Code copied!');
  };

  const isExpired = (expiry: string) => expiry && new Date(expiry) < new Date();

  const getStatusBadge = (c: any) => {
    if (isExpired(c.expiry)) return 'bg-gray-100 text-gray-400';
    if (c.status === 'Active') return 'bg-emerald-100 text-emerald-700';
    if (c.status === 'Disabled') return 'bg-orange-100 text-orange-600';
    return 'bg-gray-100 text-gray-500';
  };

  const getStatusLabel = (c: any) => isExpired(c.expiry) ? 'Expired' : c.status;

  return (
    <div className="space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-bold text-slate-800">Coupons</h2>
          <p className="text-sm text-slate-500">{coupons.length} discount codes</p>
        </div>
        <button onClick={openCreate} className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white rounded-xl" style={{ background: 'linear-gradient(135deg,#6366f1,#8b5cf6)' }}>
          <Plus size={16} /> Create Coupon
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {coupons.map(c => (
          <motion.div key={c.id} layout className="bg-white rounded-2xl border border-slate-200 p-5 space-y-3">
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-mono font-bold text-indigo-600 text-lg tracking-wider">{c.code}</span>
                  <button onClick={() => handleCopy(c.code)} className="text-slate-400 hover:text-indigo-600 transition-colors">
                    {copiedCode === c.code ? <Check size={14} className="text-emerald-500" /> : <Copy size={14} />}
                  </button>
                </div>
                <p className="text-xs text-slate-500 mt-0.5">
                  {c.type === 'Percentage' ? `${c.value}% off` : c.type === 'Fixed' ? `Rs. ${c.value} off` : 'Free Shipping'}
                  {c.minOrder > 0 ? ` · Min Rs. ${c.minOrder}` : ''}
                </p>
              </div>
              <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${getStatusBadge(c)}`}>
                {getStatusLabel(c)}
              </span>
            </div>
            <div className="flex items-center justify-between text-xs text-slate-500">
              <span>Used: {c.usageCount || 0}/{c.maxUsage || '∞'}</span>
              <span>Expires: {c.expiry || 'Never'}</span>
            </div>
            {c.maxUsage > 0 && (
              <div className="w-full bg-slate-100 rounded-full h-1.5">
                <div className="bg-indigo-500 h-1.5 rounded-full transition-all"
                  style={{ width: `${Math.min(100, ((c.usageCount || 0) / c.maxUsage) * 100)}%` }} />
              </div>
            )}
            <div className="flex gap-2 pt-1">
              <button onClick={() => openEdit(c)} className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-semibold border border-slate-200 rounded-xl text-slate-600 hover:bg-slate-50 transition-colors">
                <Edit size={12} /> Edit
              </button>
              <button onClick={() => setDeleteId(c.id)} className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-semibold border border-red-100 rounded-xl text-red-500 hover:bg-red-50 transition-colors">
                <Trash2 size={12} /> Delete
              </button>
            </div>
          </motion.div>
        ))}
        {coupons.length === 0 && (
          <div className="col-span-full text-center py-16 text-slate-400">
            <p className="font-semibold text-slate-600">No coupons found</p>
          </div>
        )}
      </div>

      {/* Create/Edit Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
            <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
              <div className="flex items-center justify-between p-5 border-b border-slate-100">
                <h3 className="font-bold text-slate-800">{editCoupon ? 'Edit Coupon' : 'Create Coupon'}</h3>
                <button onClick={() => setIsModalOpen(false)} className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-500"><X size={16} /></button>
              </div>
              <form onSubmit={handleSave} className="p-5 space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">Coupon Code *</label>
                  <input type="text" value={form.code} onChange={e => setForm(f => ({ ...f, code: e.target.value.toUpperCase() }))}
                    className="w-full px-3 py-2.5 text-sm font-mono border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500" placeholder="ERHA20" required />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-600 mb-1">Type</label>
                    <select value={form.type} onChange={e => setForm(f => ({ ...f, type: e.target.value }))}
                      className="w-full px-3 py-2.5 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500">
                      {COUPON_TYPES.map(t => <option key={t}>{t}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-600 mb-1">Value ({form.type === 'Percentage' ? '%' : form.type === 'Fixed' ? 'Rs.' : 'N/A'})</label>
                    <input type="number" min="0" value={form.value} onChange={e => setForm(f => ({ ...f, value: e.target.value }))}
                      className="w-full px-3 py-2.5 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500" placeholder="20" disabled={form.type === 'Free Shipping'} />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-600 mb-1">Min Order (Rs.)</label>
                    <input type="number" min="0" value={form.minOrder} onChange={e => setForm(f => ({ ...f, minOrder: e.target.value }))}
                      className="w-full px-3 py-2.5 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500" placeholder="0" />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-600 mb-1">Max Uses</label>
                    <input type="number" min="0" value={form.maxUsage} onChange={e => setForm(f => ({ ...f, maxUsage: e.target.value }))}
                      className="w-full px-3 py-2.5 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500" placeholder="Unlimited" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-600 mb-1">Expiry Date</label>
                    <input type="date" value={form.expiry} onChange={e => setForm(f => ({ ...f, expiry: e.target.value }))}
                      className="w-full px-3 py-2.5 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500" />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-600 mb-1">Status</label>
                    <select value={form.status} onChange={e => setForm(f => ({ ...f, status: e.target.value }))}
                      className="w-full px-3 py-2.5 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500">
                      <option>Active</option><option>Disabled</option>
                    </select>
                  </div>
                </div>
                <div className="flex gap-3 pt-2">
                  <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 px-4 py-2.5 border border-slate-200 rounded-xl text-sm font-semibold text-slate-600 hover:bg-slate-50">Cancel</button>
                  <button type="submit" className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-semibold text-white rounded-xl" style={{ background: 'linear-gradient(135deg,#6366f1,#8b5cf6)' }}>
                    <Save size={14} /> {editCoupon ? 'Update' : 'Create'}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Delete Confirm */}
      <AnimatePresence>
        {deleteId && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
            <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-2xl text-center">
              <div className="w-14 h-14 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4"><Trash2 size={24} className="text-red-500" /></div>
              <h3 className="font-bold text-slate-800 mb-1">Delete Coupon?</h3>
              <p className="text-sm text-slate-500 mb-5">This action cannot be undone.</p>
              <div className="flex gap-3">
                <button onClick={() => setDeleteId(null)} className="flex-1 px-4 py-2.5 border border-slate-200 rounded-xl text-sm font-semibold text-slate-600 hover:bg-slate-50">Cancel</button>
                <button onClick={() => handleDelete(deleteId)} className="flex-1 px-4 py-2.5 bg-red-500 hover:bg-red-600 text-white rounded-xl text-sm font-semibold transition-colors">Delete</button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
