// src/services/productService.js
const BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export const fetchProducts = async ({ category, sub, page = 1, limit = 12 } = {}) => {
  const params = new URLSearchParams();
  if (category) params.set('category', category);
  if (sub) params.set('sub', sub);
  params.set('page', page);
  params.set('limit', limit);

  const res = await fetch(`${BASE}/products?${params.toString()}`);
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Failed to fetch products');
  return data; // { products, total, page, totalPages }
};

export const fetchProductBySlug = async (slug) => {
  const res = await fetch(`${BASE}/products/${slug}`);
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Product not found');
  return data; // { product }
};