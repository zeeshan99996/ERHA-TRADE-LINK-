import { createFileRoute } from '@tanstack/react-router';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Package, Plus, Search, Edit, Trash2, X, Save, Upload, Image as ImageIcon } from 'lucide-react';
import { db } from '@/lib/supabase';
import { toast } from 'sonner';

function compressImage(base64Str: string, maxDim = 800, quality = 0.8): Promise<string> {
  return new Promise((resolve) => {
    const img = new Image();
    img.src = base64Str;
    img.onload = () => {
      let w = img.width;
      let h = img.height;
      if (w > maxDim || h > maxDim) {
        if (w > h) {
          h = Math.round((h * maxDim) / w);
          w = maxDim;
        } else {
          w = Math.round((w * maxDim) / h);
          h = maxDim;
        }
      }
      const canvas = document.createElement('canvas');
      canvas.width = w;
      canvas.height = h;
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        resolve(base64Str);
        return;
      }
      ctx.drawImage(img, 0, 0, w, h);
      resolve(canvas.toDataURL('image/jpeg', quality));
    };
    img.onerror = () => resolve(base64Str);
  });
}

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
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('All');
  const [filterCategory, setFilterCategory] = useState('All');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editProduct, setEditProduct] = useState<any | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [form, setForm] = useState({
    name: '', category: CATEGORIES[0], price: '', salePrice: '', stock: '', status: 'Active', description: '', images: [] as string[],
  });

  // Image Cropper States
  const [activeImageIndex, setActiveImageIndex] = useState<number | null>(null);
  const [isCropModalOpen, setIsCropModalOpen] = useState(false);
  const [cropSrc, setCropSrc] = useState<string>('');
  const [scale, setScale] = useState(1);
  const [rotate, setRotate] = useState(0);
  const [offsetX, setOffsetX] = useState(0);
  const [offsetY, setOffsetY] = useState(0);
  const [imgDimensions, setImgDimensions] = useState({ w: 0, h: 0, initialW: 0, initialH: 0 });

  useEffect(() => {
    if (!cropSrc) return;
    const img = new Image();
    img.src = cropSrc;
    img.onload = () => {
      const fitScale = Math.min(256 / img.width, 256 / img.height);
      setImgDimensions({
        w: img.width,
        h: img.height,
        initialW: img.width * fitScale,
        initialH: img.height * fitScale
      });
      setScale(1);
      setRotate(0);
      setOffsetX(0);
      setOffsetY(0);
    };
  }, [cropSrc]);

  const handleCropSave = () => {
    if (!cropSrc) return;
    const img = new Image();
    img.src = cropSrc;
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = 500;
      canvas.height = 500;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, 500, 500);

      ctx.save();
      ctx.translate(250, 250);
      ctx.rotate((rotate * Math.PI) / 180);
      ctx.scale(scale, scale);

      const uiToCanvasScale = 500 / 256;
      ctx.translate(offsetX * uiToCanvasScale, offsetY * uiToCanvasScale);

      const fitScale = Math.min(500 / img.width, 500 / img.height);
      const drawW = img.width * fitScale;
      const drawH = img.height * fitScale;

      ctx.drawImage(img, -drawW / 2, -drawH / 2, drawW, drawH);
      ctx.restore();

      const croppedBase64 = canvas.toDataURL('image/jpeg', 0.75);
      setForm(f => {
        const nextImages = [...f.images];
        if (activeImageIndex !== null) {
          nextImages[activeImageIndex] = croppedBase64;
        }
        return { ...f, images: nextImages };
      });
      setIsCropModalOpen(false);
      setActiveImageIndex(null);
      toast.success("Image cropped successfully!");
    };
  };

  const syncProducts = async () => {
    setIsLoading(true);
    try {
      setProducts(await db.getProducts());
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    syncProducts();
    window.addEventListener('storage', syncProducts);
    return () => window.removeEventListener('storage', syncProducts);
  }, []);

  const openCreate = () => {
    setEditProduct(null);
    setForm({ name: '', category: CATEGORIES[0], price: '', salePrice: '', stock: '', status: 'Active', description: '', images: [] });
    setIsModalOpen(true);
  };

  const openEdit = (p: any) => {
    setEditProduct(p);
    const imgs = p.image ? p.image.split('|||').filter(Boolean) : [];
    setForm({
      name: p.name, category: p.category, price: String(p.price), salePrice: String(p.salePrice || ''),
      stock: String(p.stock), status: p.status, description: p.shortDescription || p.description || '', images: imgs,
    });
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    const baseId = editProduct?.id || `PRD-${Date.now()}`;
    const joinedImages = (form.images || []).filter(Boolean).join('|||');
    const payload: any = {
      id: baseId,
      name: String(form.name || '').trim(),
      category: form.category || CATEGORIES[0],
      price: parseFloat(String(form.price || '0')) || 0,
      salePrice: form.salePrice ? parseFloat(String(form.salePrice)) : undefined,
      stock: parseInt(String(form.stock || '0'), 10) || 0,
      minStock: editProduct?.minStock ?? 10,
      status: form.status || 'Active',
      shortDescription: String(form.description || '').trim(),
      image: joinedImages || 'https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?w=400',
      brand: 'ERHA',
      sku: editProduct?.sku || `ERH-${baseId}`,
      rating: editProduct?.rating || 4.5,
      reviews: editProduct?.reviews || 0,
      badge: editProduct?.badge || '',
      features: editProduct?.features || [],
      specifications: editProduct?.specifications || {},
      costPrice: editProduct?.costPrice || 0,
    };
    
    if (!payload.name) {
      toast.error('Product name is required');
      const scrollContainer = document.getElementById('product-form-scroll');
      if (scrollContainer) scrollContainer.scrollTop = 0;
      const nameInput = document.getElementById('product-name-input');
      if (nameInput) nameInput.focus();
      return;
    }

    try {
      await db.saveProduct(payload);
      toast.success(editProduct ? 'Product updated!' : 'Product added!');
      setIsModalOpen(false);
      await syncProducts();
    } catch (err: any) {
      toast.error('Failed to save product: ' + (err?.message || 'Unknown error'));
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image size should be less than 5MB.');
      return;
    }

    const reader = new FileReader();
    reader.onload = async (event) => {
      const base64String = event.target?.result as string;
      // Client-side compression optimization before cropping
      const compressed = await compressImage(base64String, 800, 0.8);
      setActiveImageIndex(index);
      setCropSrc(compressed);
      setIsCropModalOpen(true);
      // Reset input value to allow selecting same file again
      e.target.value = '';
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
                      <img src={p.image ? p.image.split('|||')[0] : ''} alt={p.name} className="w-10 h-10 rounded-xl object-contain bg-white border border-slate-100 p-0.5" onError={e => ((e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?w=100')} />
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
          {isLoading ? (
            <div className="text-center py-16 text-slate-400 flex flex-col items-center justify-center gap-3">
              <div className="animate-spin rounded-full h-8 w-8 border-2 border-indigo-600 border-t-transparent"></div>
              <p className="font-semibold text-slate-600 text-sm">Fetching products from database...</p>
            </div>
          ) : filtered.length === 0 && (
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
              <form onSubmit={handleSave} id="product-form-scroll" className="p-5 space-y-4 max-h-[70vh] overflow-y-auto">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">Product Name *</label>
                  <input type="text" id="product-name-input" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                    className="w-full px-3 py-2.5 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500" placeholder="e.g. ERHA PowerCore 20000" />
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
                  <div className="flex justify-between items-center mb-2">
                    <label className="block text-xs font-semibold text-slate-600">Product Images (Max 3)</label>
                    <span className="text-[10px] font-medium text-slate-400">Max 5MB per image</span>
                  </div>
                  <div className="grid grid-cols-3 gap-3">
                    {form.images.map((img, idx) => (
                      <div key={idx} className="relative aspect-square border border-slate-200 rounded-xl p-1 bg-slate-50 flex flex-col items-center justify-center group overflow-hidden">
                        <img
                          src={img}
                          alt={`Product ${idx + 1}`}
                          className="size-full object-contain bg-white rounded-lg"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?w=100';
                          }}
                        />
                        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-1.5 p-1">
                          <button
                            type="button"
                            onClick={() => {
                              setActiveImageIndex(idx);
                              setCropSrc(img);
                              setIsCropModalOpen(true);
                            }}
                            className="text-[10px] font-bold text-white bg-indigo-600 hover:bg-indigo-700 px-2 py-0.5 rounded w-full text-center cursor-pointer"
                          >
                            Crop
                          </button>
                          <label className="text-[10px] font-bold text-white bg-amber-600 hover:bg-amber-700 px-2 py-0.5 rounded w-full text-center cursor-pointer">
                            Replace
                            <input
                              type="file"
                              accept="image/*"
                              onChange={(e) => handleImageUpload(e, idx)}
                              className="hidden"
                            />
                          </label>
                          {idx > 0 && (
                            <button
                              type="button"
                              onClick={() => {
                                setForm(f => {
                                  const nextImages = [...f.images];
                                  const [selected] = nextImages.splice(idx, 1);
                                  nextImages.unshift(selected);
                                  return { ...f, images: nextImages };
                                });
                              }}
                              className="text-[10px] font-bold text-white bg-emerald-600 hover:bg-emerald-700 px-2 py-0.5 rounded w-full text-center cursor-pointer"
                            >
                              Make Primary
                            </button>
                          )}
                          <button
                            type="button"
                            onClick={() => {
                              setForm(f => ({
                                ...f,
                                images: f.images.filter((_, i) => i !== idx)
                              }));
                            }}
                            className="text-[10px] font-bold text-white bg-red-600 hover:bg-red-700 px-2 py-0.5 rounded w-full text-center cursor-pointer"
                          >
                            Remove
                          </button>
                        </div>
                        <div className="absolute bottom-1 left-1 bg-slate-900/80 text-[8px] font-bold text-white px-1.5 py-0.5 rounded">
                          {idx === 0 ? 'Primary' : `Image ${idx + 1}`}
                        </div>
                      </div>
                    ))}
                    {form.images.length < 3 && (
                      <label className="aspect-square flex flex-col items-center justify-center border-2 border-dashed border-slate-200 hover:border-indigo-500 rounded-xl p-2 cursor-pointer bg-slate-50 hover:bg-slate-100/50 transition-colors group">
                        <Upload className="size-5 text-slate-400 group-hover:text-indigo-500 transition-colors mb-1" />
                        <span className="text-[10px] font-semibold text-slate-600 group-hover:text-indigo-500 transition-colors text-center">
                          Upload Image
                        </span>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => handleImageUpload(e, form.images.length)}
                          className="hidden"
                        />
                      </label>
                    )}
                  </div>
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

      {/* Image Crop Modal */}
      <AnimatePresence>
        {isCropModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/55 backdrop-blur-xs">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden border border-slate-100"
            >
              <div className="flex items-center justify-between p-5 border-b border-slate-100">
                <h3 className="font-bold text-slate-800">Crop & Align Product Image</h3>
                <button
                  type="button"
                  onClick={() => setIsCropModalOpen(false)}
                  className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-500"
                >
                  <X size={16} />
                </button>
              </div>

              <div className="p-5 space-y-6">
                {/* Crop Box Container */}
                <div className="w-64 h-64 border-2 border-dashed border-indigo-400 bg-slate-950 relative overflow-hidden rounded-2xl mx-auto flex items-center justify-center shadow-inner">
                  {cropSrc && (
                    <img
                      src={cropSrc}
                      alt="To crop"
                      className="max-w-none pointer-events-none select-none"
                      style={{
                        width: imgDimensions.initialW ? `${imgDimensions.initialW}px` : 'auto',
                        height: imgDimensions.initialH ? `${imgDimensions.initialH}px` : 'auto',
                        transform: `translate(${offsetX}px, ${offsetY}px) scale(${scale}) rotate(${rotate}deg)`,
                        transformOrigin: 'center',
                        transition: 'none'
                      }}
                    />
                  )}
                  {/* Grid Lines Overlay */}
                  <div className="absolute inset-0 border border-white/20 pointer-events-none grid grid-cols-3 grid-rows-3">
                    <div className="border-r border-b border-white/20"></div>
                    <div className="border-r border-b border-white/20"></div>
                    <div className="border-b border-white/20"></div>
                    <div className="border-r border-b border-white/20"></div>
                    <div className="border-r border-b border-white/20"></div>
                    <div className="border-b border-white/20"></div>
                    <div className="border-r border-white/20"></div>
                    <div className="border-r border-white/20"></div>
                    <div></div>
                  </div>
                </div>

                <p className="text-center text-xs text-slate-500">
                  Drag the sliders below to adjust the zoom, rotation, and alignment within the frame.
                </p>

                {/* Sliders */}
                <div className="space-y-4">
                  {/* Zoom Scale Slider */}
                  <div>
                    <div className="flex justify-between text-xs font-semibold text-slate-600 mb-1">
                      <span>Zoom / Scale</span>
                      <span>{Math.round(scale * 100)}%</span>
                    </div>
                    <input
                      type="range"
                      min="0.5"
                      max="3.0"
                      step="0.05"
                      value={scale}
                      onChange={(e) => setScale(parseFloat(e.target.value))}
                      className="w-full h-1.5 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                    />
                  </div>

                  {/* Rotation Slider */}
                  <div>
                    <div className="flex justify-between text-xs font-semibold text-slate-600 mb-1">
                      <span>Rotation</span>
                      <span>{rotate}°</span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="360"
                      step="1"
                      value={rotate}
                      onChange={(e) => setRotate(parseInt(e.target.value))}
                      className="w-full h-1.5 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                    />
                  </div>

                  {/* Pan X Slider */}
                  <div>
                    <div className="flex justify-between text-xs font-semibold text-slate-600 mb-1">
                      <span>Horizontal Alignment</span>
                      <span>{offsetX}px</span>
                    </div>
                    <input
                      type="range"
                      min="-200"
                      max="200"
                      step="1"
                      value={offsetX}
                      onChange={(e) => setOffsetX(parseInt(e.target.value))}
                      className="w-full h-1.5 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                    />
                  </div>

                  {/* Pan Y Slider */}
                  <div>
                    <div className="flex justify-between text-xs font-semibold text-slate-600 mb-1">
                      <span>Vertical Alignment</span>
                      <span>{offsetY}px</span>
                    </div>
                    <input
                      type="range"
                      min="-200"
                      max="200"
                      step="1"
                      value={offsetY}
                      onChange={(e) => setOffsetY(parseInt(e.target.value))}
                      className="w-full h-1.5 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                    />
                  </div>
                </div>

                {/* Reset Control */}
                <div className="text-right">
                  <button
                    type="button"
                    onClick={() => {
                      setScale(1);
                      setRotate(0);
                      setOffsetX(0);
                      setOffsetY(0);
                    }}
                    className="text-xs font-semibold text-indigo-600 hover:text-indigo-700 hover:underline"
                  >
                    Reset Adjustments
                  </button>
                </div>

                {/* Actions */}
                <div className="flex gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setIsCropModalOpen(false)}
                    className="flex-1 px-4 py-2.5 border border-slate-200 rounded-xl text-sm font-semibold text-slate-600 hover:bg-slate-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={handleCropSave}
                    className="flex-1 px-4 py-2.5 text-sm font-semibold text-white rounded-xl transition-all shadow-md hover:opacity-95"
                    style={{ background: 'linear-gradient(135deg,#6366f1,#8b5cf6)' }}
                  >
                    Save Changes
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
