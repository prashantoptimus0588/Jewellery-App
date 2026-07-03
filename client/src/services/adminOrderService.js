// src/services/adminOrderService.js

const BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const authHeaders = () => ({
  'Content-Type': 'application/json',
  Authorization: `Bearer ${localStorage.getItem('vj_token')}`,
});

// ✅ Must be named exactly fetchAdminOrders and have "export const"
export const fetchAdminOrders = async ({ page = 1, limit = 20, status, search } = {}) => {
  const params = new URLSearchParams();
  params.set('page', page);
  params.set('limit', limit);
  if (status) params.set('status', status);
  if (search) params.set('search', search);

  const res = await fetch(`${BASE}/admin/orders?${params.toString()}`, { 
    headers: authHeaders() 
  });
  
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Failed to fetch orders');
  return data;
};

// ✅ Must be named exactly updateOrderStatus and have "export const"
export const updateOrderStatus = async (id, status) => {
  const res = await fetch(`${BASE}/admin/orders/${id}/status`, {
    method: 'PATCH',
    headers: authHeaders(),
    body: JSON.stringify({ status }),
  });
  
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Failed to update order status');
  return data;
};