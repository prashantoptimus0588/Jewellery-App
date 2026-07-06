// src/services/chatService.js
const BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export const sendMessage = async (message, sessionId) => {
  const res = await fetch(`${BASE}/chat/message`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ message, sessionId }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Chat failed');
  return data; // { sessionId, response, products }
};

export const clearSession = async (sessionId) => {
  await fetch(`${BASE}/chat/session/${sessionId}`, { method: 'DELETE' });
};