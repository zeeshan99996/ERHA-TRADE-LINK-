import { createFileRoute } from '@tanstack/react-router';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Plus, Edit, Trash2, X, Save } from 'lucide-react';
import { db } from '@/lib/supabase';
import { toast } from 'sonner';

export const Route = createFileRoute('/admin/categories')({
  component: CategoriesPage,
});

const ICONS = ['⚡', '🔋', '📱', '💻', '☀️', '🌿', '🏔️', '✈️'];

export function CategoriesPage() {
  const [categories, setCategories] = useState<any[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editCat, setEditCat] = useState<any | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [form, setForm] = useState({ name: '', slug: '', icon: ICONS[0] });

  const syncCategories = () => setCategories(db.getCategories());

  useEffect(() => {
    syncCategories();
    window.addEventListener('storage', syncCategories);
    return () => window.removeEventListener('storage', syncCategories);
  }, []);

  const openCreate = () => {
    setEditCat(null);
    setForm({ name: '', slug: '', icon: ICONS[0] });
    setIsModalOpen(true);
  };

  const openEdit = (c: any) => {
    setEditCat(c);
    setForm({ name: c.name, slug: c.slug || '', icon: c.icon || ICONS[0] });
    setIsModalOpen(true);
  };

  const toSlug = (name: string) => name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim()) return toast.error('Category name is required');
    const payload: any = {
      id: editCat?.id || `cat-${Date.now()}`,
      name: form.name.trim(),
      slug: form.slug.trim() || toSlug(form.name),
      icon: form.icon,
      imageUrl: editCat?.imageUrl || 'https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?w=400',
      parentId: null,
    };
    db.saveCategory(payload);
    toast.success(editCat ? 'Category updated!' : 'Category created!');
    setIsModalOpen(false);
    syncCategories();
  };

  const handleDelete = (id: string) => {
    db.deleteCategory(id);
    toast.success('Category deleted');
    setDeleteId(null);
    syncCategories();
  };

  return (
    <div className="space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-bold text-slate-800">Categories</h2>
          <p className="text-sm text-slate-500">{categories.length} product categories</p>
        </div>
        <button onClick={openCreate} className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white rounded-xl" style={{ background: 'linear-gradient(135deg,#6366f1,#8b5cf6)' }}>
          <Plus size={16} /> Add Category
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {categories.map(c => (
          <motion.div key={c.id} layout className="bg-white rounded-2xl border border-slate-200 overflow-hidden hover:shadow-md transition-shadow">
            <div className="h-28 bg-gradient-to-br from-indigo-50 to-violet-50 flex items-center justify-center relative overflow-hidden">
              {c.imageUrl ? (
                <img src={c.imageUrl} alt={c.name} className="absolute inset-0 w-full h-full object-cover opacity-30" onError={e => ((e.target as HTMLImageElement).style.display = 'none')} />
              ) : null}
              <span className="text-4xl relative z-10">{c.icon || '📦'}</span>
            </div>
            <div className="p-4 space-y-3">
              <div>
                <h3 className="font-bold text-slate-800">{c.name}</h3>
                <p className="text-xs text-slate-400 font-mono">{c.slug}</p>
              </div>
              <div className="flex gap-2">
                <button onClick={() => openEdit(c)} className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-semibold border border-slate-200 rounded-xl text-slate-600 hover:bg-slate-50 transition-colors">
                  <Edit size={12} /> Edit
                </button>
                <button onClick={() => setDeleteId(c.id)} className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-semibold border border-red-100 rounded-xl text-red-500 hover:bg-red-50 transition-colors">
                  <Trash2 size={12} /> Delete
                </button>
              </div>
            </div>
          </motion.div>
        ))}
        {categories.length === 0 && (
          <div className="col-span-full text-center py-16 text-slate-400">
            <p className="font-semibold text-slate-600">No categories found</p>
          </div>
        )}
      </div>

      {/* Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
            <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
              <div className="flex items-center justify-between p-5 border-b border-slate-100">
                <h3 className="font-bold text-slate-800">{editCat ? 'Edit Category' : 'Add Category'}</h3>
                <button onClick={() => setIsModalOpen(false)} className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-500"><X size={16} /></button>
              </div>
              <form onSubmit={handleSave} className="p-5 space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">Category Name *</label>
                  <input type="text" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                    className="w-full px-3 py-2.5 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500" placeholder="Ultra Compact" required />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">Slug (optional)</label>
                  <input type="text" value={form.slug} onChange={e => setForm(f => ({ ...f, slug: e.target.value }))}
                    className="w-full px-3 py-2.5 text-sm font-mono border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500" placeholder="ultra-compact" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-2">Icon</label>
                  <div className="flex flex-wrap gap-2">
                    {ICONS.map(icon => (
                      <button key={icon} type="button" onClick={() => setForm(f => ({ ...f, icon }))}
                        className={`w-10 h-10 rounded-xl text-xl flex items-center justify-center transition-all ${form.icon === icon ? 'bg-indigo-100 ring-2 ring-indigo-500' : 'bg-slate-50 hover:bg-slate-100'}`}>
                        {icon}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="flex gap-3 pt-2">
                  <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 px-4 py-2.5 border border-slate-200 rounded-xl text-sm font-semibold text-slate-600 hover:bg-slate-50">Cancel</button>
                  <button type="submit" className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-semibold text-white rounded-xl" style={{ background: 'linear-gradient(135deg,#6366f1,#8b5cf6)' }}>
                    <Save size={14} /> {editCat ? 'Update' : 'Create'}
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
              <h3 className="font-bold text-slate-800 mb-1">Delete Category?</h3>
              <div className="flex gap-3 mt-5">
                <button onClick={() => setDeleteId(null)} className="flex-1 px-4 py-2.5 border border-slate-200 rounded-xl text-sm font-semibold">Cancel</button>
                <button onClick={() => handleDelete(deleteId)} className="flex-1 px-4 py-2.5 bg-red-500 text-white rounded-xl text-sm font-semibold">Delete</button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
