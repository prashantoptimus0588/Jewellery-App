// src/services/userService.js
const BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const authHeaders = () => ({
  'Content-Type': 'application/json',
  Authorization: `Bearer ${localStorage.getItem('vj_token')}`,
});

export const fetchWishlist = async () => {
  const res = await fetch(`${BASE}/user/wishlist`, { headers: authHeaders() });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Failed to fetch wishlist');
  return data; // { wishlist }
};

export const addToWishlist = async (productId) => {
  const res = await fetch(`${BASE}/user/wishlist/${productId}`, {
    method: 'POST',
    headers: authHeaders(),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Failed to add to wishlist');
  return data;
};

export const removeFromWishlist = async (productId) => {
  const res = await fetch(`${BASE}/user/wishlist/${productId}`, {
    method: 'DELETE',
    headers: authHeaders(),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Failed to remove from wishlist');
  return data;
};

export const updateProfile = async ({ name, phone }) => {
  const res = await fetch(`${BASE}/user/profile`, {
    method: 'PUT',
    headers: authHeaders(),
    body: JSON.stringify({ name, phone }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Failed to update profile');
  return data; // { user }
};