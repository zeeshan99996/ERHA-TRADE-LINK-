import { createFileRoute } from '@tanstack/react-router';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Package, Plus, Search, Edit, Trash2, X, Save, Upload, Image as ImageIcon } from 'lucide-react';
import { db } from '@/lib/supabase';
import { toast } from 'sonner';

export const Route = createFileRoute('/admin/products')({
  component: ProductsPage,
});

function fmtRs(n: number) {
  return `Rs. ${n.toLocaleString('en-PK')}`;
}

const STATUS_BADGES: Record<string, string> = {
  Active: 'bg-emerald-100 text-emerald-700',
  Draft: 'bg-gray-100 text-gray-500',
  'Out of Stock': 'bg-red-100 text-red-700',
};

const CATEGORIES = ['Ultra Compact', 'High Capacity', 'MagSafe & Wireless', 'Laptop Power Banks', 'Rugged & Solar'];

export function ProductsPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('All');
  const [filterCategory, setFilterCategory] = useState('All');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editProduct, setEditProduct] = useState<any | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [form, setForm] = useState({
    name: '', category: CATEGORIES[0], price: '', salePrice: '', stock: '', status: 'Active', description: '', image: '',
  });

  const syncProducts = async () => setProducts(await db.getProducts());

  useEffect(() => {
    syncProducts();
    window.addEventListener('storage', syncProducts);
    return () => window.removeEventListener('storage', syncProducts);
  }, []);

  const openCreate = () => {
    setEditProduct(null);
    setForm({ name: '', category: CATEGORIES[0], price: '', salePrice: '', stock: '', status: 'Active', description: '', image: '' });
    setIsModalOpen(true);
  };

  const openEdit = (p: any) => {
    setEditProduct(p);
    setForm({
      name: p.name, category: p.category, price: String(p.price), salePrice: String(p.salePrice || ''),
      stock: String(p.stock), status: p.status, description: p.shortDescription || p.description || '', image: p.image || '',
    });
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    const baseId = editProduct?.id || `PRD-${Date.now()}`;
    const payload: any = {
      id: baseId,
      name: form.name.trim(),
      category: form.category,
      price: parseFloat(form.price) || 0,
      salePrice: form.salePrice ? parseFloat(form.salePrice) : undefined,
      stock: parseInt(form.stock) || 0,
      minStock: editProduct?.minStock ?? 10,
      status: form.status,
      shortDescription: form.description.trim(),
      image: form.image.trim() || 'https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?w=400',
      brand: 'ERHA',
      sku: editProduct?.sku || `ERH-${baseId}`,
      rating: editProduct?.rating || 4.5,
      reviews: editProduct?.reviews || 0,
      badge: editProduct?.badge || '',
      features: editProduct?.features || [],
      specifications: editProduct?.specifications || {},
      costPrice: editProduct?.costPrice || 0,
    };
    if (!payload.name) return toast.error('Product name is required');
    try {
      await db.saveProduct(payload);
      toast.success(editProduct ? 'Product updated!' : 'Product added!');
      setIsModalOpen(false);
      await syncProducts();
    } catch (err: any) {
      toast.error('Failed to save product: ' + (err?.message || 'Unknown error'));
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      toast.error('Image size should be less than 2MB.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const base64String = event.target?.result as string;
      setForm(f => ({ ...f, image: base64String }));
    };
    reader.readAsDataURL(file);
  };

  const handleDelete = async (id: string) => {
    try {
      await db.deleteProduct(id);
      toast.success('Product deleted');
    } catch (err: any) {
      toast.error('Failed to delete product: ' + (err?.message || 'Unknown error'));
    }
    setDeleteId(null);
    await syncProducts();
  };

  const filtered = products.filter(p => {
    const matchSearch = p.name.toLowerCase().includes(search.toLowerCase());
    const matchStatus = filterStatus === 'All' || p.status === filterStatus;
    const matchCat = filterCategory === 'All' || p.category === filterCategory;
    return matchSearch && matchStatus && matchCat;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-bold text-slate-800">Products</h2>
          <p className="text-sm text-slate-500">{products.length} total products</p>
        </div>
        <button
          onClick={openCreate}
          className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white rounded-xl transition-all"
          style={{ background: 'linear-gradient(135deg,#6366f1,#8b5cf6)' }}
        >
          <Plus size={16} /> Add Product
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search products..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
          />
        </div>
        <select
          value={filterStatus}
          onChange={e => setFilterStatus(e.target.value)}
          className="px-3 py-2.5 text-sm border border-slate-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
        >
          {['All', 'Active', 'Draft', 'Out of Stock'].map(s => <option key={s}>{s}</option>)}
        </select>
        <select
          value={filterCategory}
          onChange={e => setFilterCategory(e.target.value)}
          className="px-3 py-2.5 text-sm border border-slate-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
        >
          {['All', ...CATEGORIES].map(c => <option key={c}>{c}</option>)}
        </select>
      </div>

      {/* Product Table */}
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50">
                <th className="text-left px-5 py-3.5 text-xs font-semibold text-slate-500 uppercase tracking-wider">Product</th>
                <th className="text-left px-5 py-3.5 text-xs font-semibold text-slate-500 uppercase tracking-wider hidden md:table-cell">Category</th>
                <th className="text-left px-5 py-3.5 text-xs font-semibold text-slate-500 uppercase tracking-wider">Price</th>
                <th className="text-left px-5 py-3.5 text-xs font-semibold text-slate-500 uppercase tracking-wider hidden sm:table-cell">Stock</th>
                <th className="text-left px-5 py-3.5 text-xs font-semibold text-slate-500 uppercase tracking-wider">Status</th>
                <th className="text-right px-5 py-3.5 text-xs font-semibold text-slate-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filtered.map(p => (
                <tr key={p.id} className="group hover:bg-slate-50 transition-colors">
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-3">
                      <img src={p.image} alt={p.name} className="w-10 h-10 rounded-xl object-cover border border-slate-100" onError={e => ((e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?w=100')} />
                      <span className="font-medium text-slate-800 line-clamp-1">{p.name}</span>
                    </div>
                  </td>
                  <td className="px-5 py-3.5 text-slate-500 hidden md:table-cell">{p.category}</td>
                  <td className="px-5 py-3.5">
                    <div>
                      <span className="font-semibold text-slate-700">{fmtRs(p.salePrice || p.price)}</span>
                      {p.salePrice && p.salePrice < p.price && <span className="text-xs text-slate-400 line-through ml-1">{fmtRs(p.price)}</span>}
                    </div>
                  </td>
                  <td className="px-5 py-3.5 text-slate-500 hidden sm:table-cell">{p.stock ?? 0} units</td>
                  <td className="px-5 py-3.5">
                    <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${STATUS_BADGES[p.status] || 'bg-gray-100 text-gray-600'}`}>
                      {p.status}
                    </span>
                  </td>
                  <td className="px-5 py-3.5 text-right">
                    <div className="flex justify-end gap-1.5">
                      <button onClick={() => openEdit(p)} className="p-1.5 rounded-lg text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 transition-colors" title="Edit"><Edit size={14} /></button>
                      <button onClick={() => setDeleteId(p.id)} className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors" title="Delete"><Trash2 size={14} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filtered.length === 0 && (
            <div className="text-center py-16 text-slate-400">
              <Package className="size-12 mx-auto mb-3 opacity-30" />
              <p className="font-semibold text-slate-600">No products found</p>
              <p className="text-xs mt-1">Try adjusting your filters or add a new product.</p>
            </div>
          )}
        </div>
      </div>

      {/* Add/Edit Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden"
            >
              <div className="flex items-center justify-between p-5 border-b border-slate-100">
                <h3 className="font-bold text-slate-800">{editProduct ? 'Edit Product' : 'Add New Product'}</h3>
                <button onClick={() => setIsModalOpen(false)} className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-500"><X size={16} /></button>
              </div>
              <form onSubmit={handleSave} className="p-5 space-y-4 max-h-[70vh] overflow-y-auto">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">Product Name *</label>
                  <input type="text" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                    className="w-full px-3 py-2.5 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500" placeholder="e.g. ERHA PowerCore 20000" required />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-600 mb-1">Category</label>
                    <select value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))}
                      className="w-full px-3 py-2.5 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500">
                      {CATEGORIES.map(c => <option key={c}>{c}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-600 mb-1">Status</label>
                    <select value={form.status} onChange={e => setForm(f => ({ ...f, status: e.target.value }))}
                      className="w-full px-3 py-2.5 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500">
                      {['Active', 'Draft', 'Out of Stock'].map(s => <option key={s}>{s}</option>)}
                    </select>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-600 mb-1">Regular Price (Rs.)</label>
                    <input type="number" min="0" value={form.price} onChange={e => setForm(f => ({ ...f, price: e.target.value }))}
                      className="w-full px-3 py-2.5 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500" placeholder="4999" />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-600 mb-1">Sale Price (Rs.)</label>
                    <input type="number" min="0" value={form.salePrice} onChange={e => setForm(f => ({ ...f, salePrice: e.target.value }))}
                      className="w-full px-3 py-2.5 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500" placeholder="Optional" />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">Stock Quantity</label>
                  <input type="number" min="0" value={form.stock} onChange={e => setForm(f => ({ ...f, stock: e.target.value }))}
                    className="w-full px-3 py-2.5 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500" placeholder="50" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">Product Image</label>
                  {form.image ? (
                    <div className="relative border border-slate-200 rounded-xl p-2 bg-slate-50 flex items-center gap-3">
                      <img
                        src={form.image}
                        alt="Product Preview"
                        className="w-16 h-16 rounded-lg object-cover border border-slate-200 bg-white"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?w=100';
                        }}
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-xs text-slate-500 truncate">Image uploaded successfully</p>
                        <button
                          type="button"
                          onClick={() => setForm(f => ({ ...f, image: '' }))}
                          className="text-xs font-semibold text-red-500 hover:text-red-600 mt-1"
                        >
                          Remove Image
                        </button>
                      </div>
                    </div>
                  ) : (
                    <label className="flex flex-col items-center justify-center border-2 border-dashed border-slate-200 hover:border-indigo-500 rounded-xl p-6 cursor-pointer bg-slate-50 hover:bg-slate-100/50 transition-colors group">
                      <Upload className="size-6 text-slate-400 group-hover:text-indigo-500 transition-colors mb-2" />
                      <span className="text-xs font-semibold text-slate-600 group-hover:text-indigo-500 transition-colors">
                        Click to upload image
                      </span>
                      <span className="text-[10px] text-slate-400 mt-1">
                        Select from browser, files, or drive (max. 2MB)
                      </span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="hidden"
                      />
                    </label>
                  )}
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">Short Description</label>
                  <textarea rows={3} value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
                    className="w-full px-3 py-2.5 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none" placeholder="Short product description..." />
                </div>
                <div className="flex gap-3 pt-2">
                  <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 px-4 py-2.5 border border-slate-200 rounded-xl text-sm font-semibold text-slate-600 hover:bg-slate-50 transition-colors">Cancel</button>
                  <button type="submit" className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-semibold text-white rounded-xl transition-all" style={{ background: 'linear-gradient(135deg,#6366f1,#8b5cf6)' }}>
                    <Save size={14} /> {editProduct ? 'Update' : 'Create'}
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
              <h3 className="font-bold text-slate-800 mb-1">Delete Product?</h3>
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
