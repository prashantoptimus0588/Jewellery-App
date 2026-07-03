// src/services/adminProductService.js
const BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const authHeaders = () => ({
  Authorization: `Bearer ${localStorage.getItem('vj_token')}`,
});

const jsonAuthHeaders = () => ({
  'Content-Type': 'application/json',
  Authorization: `Bearer ${localStorage.getItem('vj_token')}`,
});

export const fetchAdminProducts = async ({ page = 1, limit = 20, search, category } = {}) => {
  const params = new URLSearchParams();
  params.set('page', page);
  params.set('limit', limit);
  if (search) params.set('search', search);
  if (category) params.set('category', category);

  const res = await fetch(`${BASE}/admin/products?${params.toString()}`, { headers: authHeaders() });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Failed to fetch products');
  return data; // { products, total, page, totalPages }
};

// productData: plain object of fields, images: array of File objects
export const createProduct = async (productData, images = []) => {
  const formData = new FormData();
  Object.entries(productData).forEach(([key, value]) => {
    if (value !== undefined && value !== null) formData.append(key, value);
  });
  images.forEach((file) => formData.append('images', file));

  const res = await fetch(`${BASE}/admin/products`, {
    method: 'POST',
    headers: authHeaders(), // no Content-Type — browser sets multipart boundary automatically
    body: formData,
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Failed to create product');
  return data; // { product }
};

export const updateProduct = async (id, productData, images = []) => {
  const formData = new FormData();
  Object.entries(productData).forEach(([key, value]) => {
    if (value !== undefined && value !== null) formData.append(key, value);
  });
  images.forEach((file) => formData.append('images', file));

  const res = await fetch(`${BASE}/admin/products/${id}`, {
    method: 'PUT',
    headers: authHeaders(),
    body: formData,
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Failed to update product');
  return data; // { product }
};

export const updateStock = async (id, stock) => {
  const res = await fetch(`${BASE}/admin/products/${id}/stock`, {
    method: 'PATCH',
    headers: jsonAuthHeaders(),
    body: JSON.stringify({ stock }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Failed to update stock');
  return data;
};

export const deleteProduct = async (id) => {
  const res = await fetch(`${BASE}/admin/products/${id}`, {
    method: 'DELETE',
    headers: authHeaders(),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Failed to delete product');
  return data;
};

export const deleteProductImage = async (productId, imageId) => {
  const res = await fetch(`${BASE}/admin/products/${productId}/images/${imageId}`, {
    method: 'DELETE',
    headers: authHeaders(),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Failed to delete image');
  return data;
};