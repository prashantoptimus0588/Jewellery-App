// src/services/adminService.js
const BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const authHeaders = () => ({
  Authorization: `Bearer ${localStorage.getItem('vj_token')}`,
});

export const fetchStats = async () => {
  const res = await fetch(`${BASE}/admin/stats`, { headers: authHeaders() });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error);
  return data;
};

export const fetchAdminProducts = async () => {
  const res = await fetch(`${BASE}/admin/products`, { headers: authHeaders() });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error);
  return data;
};

export const createProduct = async (formData) => {
  const res = await fetch(`${BASE}/admin/products`, {
    method: 'POST',
    headers: authHeaders(),
    body: formData,
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error);
  return data;
};

export const updateProduct = async (id, formData) => {
  const res = await fetch(`${BASE}/admin/products/${id}`, {
    method: 'PUT',
    headers: authHeaders(),
    body: formData,
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error);
  return data;
};

export const deleteProduct = async (id) => {
  const res = await fetch(`${BASE}/admin/products/${id}`, {
    method: 'DELETE',
    headers: authHeaders(),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error);
  return data;
};

export const deleteProductImage = async (imageId) => {
  const res = await fetch(`${BASE}/admin/products/images/${imageId}`, {
    method: 'DELETE',
    headers: authHeaders(),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error);
  return data;
};

export const fetchAdminOrders = async () => {
  const res = await fetch(`${BASE}/admin/orders`, { headers: authHeaders() });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error);
  return data;
};

export const updateOrderStatus = async (id, status) => {
  const res = await fetch(`${BASE}/admin/orders/${id}/status`, {
    method: 'PUT',
    headers: { ...authHeaders(), 'Content-Type': 'application/json' },
    body: JSON.stringify({ status }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error);
  return data;
};