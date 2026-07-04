// src/pages/Admin/AdminProducts.jsx
import React, { useEffect, useState } from 'react';
import { FaPlus, FaPen, FaTrash, FaXmark } from 'react-icons/fa6';
import { fetchAdminProducts, createProduct, updateProduct, deleteProduct, deleteProductImage } from '../../services/adminService';

const CATEGORIES = [
  { label: 'Gold Rings', slug: 'gold-rings' },
  { label: 'Gold Chains', slug: 'gold-chains' },
  { label: 'Gold Bangles', slug: 'gold-bangles' },
  { label: 'Gold Earrings', slug: 'gold-earrings' },
  { label: 'Diamond Rings', slug: 'diamond-rings' },
  { label: 'Diamond Earrings', slug: 'diamond-earrings' },
  { label: 'Diamond Pendants', slug: 'diamond-pendants' },
  { label: 'Studs', slug: 'studs' },
  { label: 'Hoops', slug: 'hoops' },
  { label: 'Jhumkas', slug: 'jhumkas' },
  { label: 'Drop Earrings', slug: 'drop-earrings' },
  { label: 'Engagement Rings', slug: 'engagement-rings' },
  { label: 'Couple Rings', slug: 'couple-rings' },
  { label: 'Cocktail Rings', slug: 'cocktail-rings' },
  { label: 'Bridal Sets', slug: 'bridal-sets' },
  { label: 'Mangalsutra', slug: 'mangalsutra' },
  { label: 'Wedding Bands', slug: 'wedding-bands' },
  { label: 'Lightweight Gold', slug: 'lightweight-gold' },
  { label: 'Minimal Studs', slug: 'minimal-studs' },
  { label: 'Everyday Chains', slug: 'everyday-chains' },
];

const METALS = ['YELLOW_GOLD', 'ROSE_GOLD', 'WHITE_GOLD', 'PLATINUM'];

const emptyForm = {
  name: '', description: '', price: '', purity: '', weight: '',
  metal: '', stock: '1', tag: '', categorySlug: 'gold-rings', isActive: true,
};

const AdminProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [files, setFiles] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const load = () => {
    setLoading(true);
    fetchAdminProducts()
      .then((data) => setProducts(data.products))
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const openCreate = () => {
    setEditingProduct(null);
    setForm(emptyForm);
    setFiles([]);
    setError('');
    setShowForm(true);
  };

  const openEdit = (product) => {
    setEditingProduct(product);
    setForm({
      name: product.name,
      description: product.description,
      price: product.price,
      purity: product.purity || '',
      weight: product.weight || '',
      metal: product.metal || '',
      stock: product.stock,
      tag: product.tag || '',
      categorySlug: product.category?.slug || 'gold-rings',
      isActive: product.isActive,
    });
    setFiles([]);
    setError('');
    setShowForm(true);
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    setError('');
    try {
      const formData = new FormData();
      Object.entries(form).forEach(([k, v]) => formData.append(k, v));
      files.forEach((f) => formData.append('images', f));

      if (editingProduct) {
        await updateProduct(editingProduct.id, formData);
      } else {
        await createProduct(formData);
      }

      setShowForm(false);
      load();
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this product?')) return;
    try {
      await deleteProduct(id);
      load();
    } catch (err) {
      alert(err.message);
    }
  };

  const handleDeleteImage = async (imageId) => {
    if (!confirm('Delete this image?')) return;
    try {
      await deleteProductImage(imageId);
      setEditingProduct((prev) => ({
        ...prev,
        images: prev.images.filter((i) => i.id !== imageId),
      }));
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="font-serif text-2xl text-gray-800">Products ({products.length})</h2>
        <button
          onClick={openCreate}
          className="flex items-center gap-2 bg-[#832729] text-white px-4 py-2.5 rounded-sm text-sm font-medium hover:bg-[#6a1f21] transition-colors"
        >
          <FaPlus className="w-3.5 h-3.5" /> Add Product
        </button>
      </div>

      {/* Product Table */}
      {loading ? (
        <div className="flex flex-col gap-3">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="animate-pulse bg-gray-100 rounded-sm h-16" />
          ))}
        </div>
      ) : (
        <div className="bg-white border border-gray-100 rounded-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 text-gray-500 text-left bg-gray-50">
                  <th className="px-4 py-3 font-medium">Image</th>
                  <th className="px-4 py-3 font-medium">Name</th>
                  <th className="px-4 py-3 font-medium">Category</th>
                  <th className="px-4 py-3 font-medium">Price</th>
                  <th className="px-4 py-3 font-medium">Stock</th>
                  <th className="px-4 py-3 font-medium">Status</th>
                  <th className="px-4 py-3 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {products.map((product) => (
                  <tr key={product.id} className="border-b border-gray-50 hover:bg-gray-50/50">
                    <td className="px-4 py-3">
                      <div className="w-12 h-12 bg-[#f9f9f9] rounded-sm overflow-hidden">
                        <img src={product.images[0]?.url} alt="" className="w-full h-full object-cover" />
                      </div>
                    </td>
                    <td className="px-4 py-3 font-medium text-gray-800 max-w-[200px] truncate">{product.name}</td>
                    <td className="px-4 py-3 text-gray-500">{product.category?.name}</td>
                    <td className="px-4 py-3 text-gray-800">₹ {product.price.toLocaleString('en-IN')}</td>
                    <td className="px-4 py-3 text-gray-600">{product.stock}</td>
                    <td className="px-4 py-3">
                      <span className={`text-xs font-semibold px-2 py-1 rounded-full ${
                        product.isActive ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-500'
                      }`}>
                        {product.isActive ? 'Active' : 'Hidden'}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex gap-2">
                        <button
                          onClick={() => openEdit(product)}
                          className="text-gray-400 hover:text-[#832729] transition-colors"
                        >
                          <FaPen className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDelete(product.id)}
                          className="text-gray-400 hover:text-red-500 transition-colors"
                        >
                          <FaTrash className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Form Modal */}
      {showForm && (
        <>
          <div className="fixed inset-0 bg-black/50 z-40" onClick={() => setShowForm(false)} />
          <div className="fixed top-4 right-4 bottom-4 w-full max-w-lg bg-white z-50 rounded-sm shadow-2xl flex flex-col overflow-hidden">

            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
              <h3 className="font-serif text-lg text-gray-800">
                {editingProduct ? 'Edit Product' : 'Add Product'}
              </h3>
              <button onClick={() => setShowForm(false)} className="text-gray-400 hover:text-gray-700">
                <FaXmark className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-grow overflow-y-auto px-6 py-5 flex flex-col gap-4">

              {/* Existing Images (edit mode) */}
              {editingProduct?.images?.length > 0 && (
                <div>
                  <label className="block text-xs text-gray-500 mb-2">Current Images</label>
                  <div className="flex gap-2 flex-wrap">
                    {editingProduct.images.map((img) => (
                      <div key={img.id} className="relative w-16 h-16 rounded-sm overflow-hidden">
                        <img src={img.url} alt="" className="w-full h-full object-cover" />
                        <button
                          onClick={() => handleDeleteImage(img.id)}
                          className="absolute top-0.5 right-0.5 bg-red-500 text-white rounded-full w-4 h-4 flex items-center justify-center"
                        >
                          <FaXmark className="w-2.5 h-2.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <FormInput label="Product Name" value={form.name} onChange={(v) => setForm((p) => ({ ...p, name: v }))} />
              <FormInput label="Description" value={form.description} onChange={(v) => setForm((p) => ({ ...p, description: v }))} textarea />
              <div className="grid grid-cols-2 gap-4">
                <FormInput label="Price (₹)" value={form.price} onChange={(v) => setForm((p) => ({ ...p, price: v }))} type="number" />
                <FormInput label="Stock" value={form.stock} onChange={(v) => setForm((p) => ({ ...p, stock: v }))} type="number" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <FormInput label="Purity (e.g. 22 Karat)" value={form.purity} onChange={(v) => setForm((p) => ({ ...p, purity: v }))} />
                <FormInput label="Weight (e.g. 4.50 g)" value={form.weight} onChange={(v) => setForm((p) => ({ ...p, weight: v }))} />
              </div>

              <div>
                <label className="block text-xs text-gray-500 mb-1.5">Metal</label>
                <select
                  value={form.metal}
                  onChange={(e) => setForm((p) => ({ ...p, metal: e.target.value }))}
                  className="w-full border border-gray-200 rounded-sm px-3 py-2.5 text-sm outline-none focus:border-[#832729]"
                >
                  <option value="">None</option>
                  {METALS.map((m) => <option key={m} value={m}>{m.replace('_', ' ')}</option>)}
                </select>
              </div>

              <div>
                <label className="block text-xs text-gray-500 mb-1.5">Category</label>
                <select
                  value={form.categorySlug}
                  onChange={(e) => setForm((p) => ({ ...p, categorySlug: e.target.value }))}
                  className="w-full border border-gray-200 rounded-sm px-3 py-2.5 text-sm outline-none focus:border-[#832729]"
                >
                  {CATEGORIES.map((c) => <option key={c.slug} value={c.slug}>{c.label}</option>)}
                </select>
              </div>

              <FormInput label="Tag (e.g. Best Seller)" value={form.tag} onChange={(v) => setForm((p) => ({ ...p, tag: v }))} />

              <div>
                <label className="block text-xs text-gray-500 mb-1.5">Status</label>
                <select
                  value={form.isActive}
                  onChange={(e) => setForm((p) => ({ ...p, isActive: e.target.value === 'true' }))}
                  className="w-full border border-gray-200 rounded-sm px-3 py-2.5 text-sm outline-none focus:border-[#832729]"
                >
                  <option value="true">Active</option>
                  <option value="false">Hidden</option>
                </select>
              </div>

              <div>
                <label className="block text-xs text-gray-500 mb-1.5">Upload Images (max 5)</label>
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={(e) => setFiles(Array.from(e.target.files))}
                  className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-sm file:border-0 file:text-sm file:font-medium file:bg-[#832729]/10 file:text-[#832729] hover:file:bg-[#832729]/20"
                />
                {files.length > 0 && (
                  <p className="text-xs text-gray-400 mt-1">{files.length} file(s) selected</p>
                )}
              </div>

              {error && <p className="text-red-500 text-xs">{error}</p>}
            </div>

            <div className="px-6 py-4 border-t border-gray-100">
              <button
                onClick={handleSubmit}
                disabled={submitting}
                className="w-full bg-[#832729] text-white font-medium py-3 rounded-sm hover:bg-[#6a1f21] transition-colors disabled:opacity-60"
              >
                {submitting ? 'Saving...' : editingProduct ? 'Update Product' : 'Create Product'}
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

const FormInput = ({ label, value, onChange, type = 'text', textarea }) => (
  <div>
    <label className="block text-xs text-gray-500 mb-1.5">{label}</label>
    {textarea ? (
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        rows={3}
        className="w-full border border-gray-200 rounded-sm px-3 py-2.5 text-sm outline-none focus:border-[#832729] resize-none"
      />
    ) : (
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full border border-gray-200 rounded-sm px-3 py-2.5 text-sm outline-none focus:border-[#832729]"
      />
    )}
  </div>
);

export default AdminProducts;