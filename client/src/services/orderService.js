// src/services/orderService.js
const BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const authHeaders = () => ({
  'Content-Type': 'application/json',
  Authorization: `Bearer ${localStorage.getItem('vj_token')}`,
});

export const saveAddress = async (addressData) => {
  const res = await fetch(`${BASE}/orders/address`, {
    method: 'POST',
    headers: authHeaders(),
    body: JSON.stringify(addressData),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Failed to save address');
  return data; // { address }
};

export const getAddresses = async () => {
  const res = await fetch(`${BASE}/orders/addresses`, { headers: authHeaders() });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Failed to fetch addresses');
  return data; // { addresses }
};

export const createRazorpayOrder = async ({ items, addressId }) => {
  const res = await fetch(`${BASE}/orders/create-razorpay-order`, {
    method: 'POST',
    headers: authHeaders(),
    body: JSON.stringify({ items, addressId }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Failed to create order');
  return data; // { orderId, razorpayOrderId, amount, currency, keyId }
};

export const verifyPayment = async (payload) => {
  const res = await fetch(`${BASE}/orders/verify-payment`, {
    method: 'POST',
    headers: authHeaders(),
    body: JSON.stringify(payload),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Payment verification failed');
  return data;
};

export const fetchOrders = async () => {
  const res = await fetch(`${BASE}/orders`, { headers: authHeaders() });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Failed to fetch orders');
  return data; // { orders }
};