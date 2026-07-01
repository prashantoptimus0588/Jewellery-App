// src/store/useAuthStore.js
import { create } from 'zustand';
import { getMeApi } from '../services/authService';

const useAuthStore = create((set) => ({
  user: null,
  token: localStorage.getItem('vj_token') || null,
  isAuthenticated: !!localStorage.getItem('vj_token'),
  isAuthModalOpen: false,
  authMode: 'login',
  otpEmail: '',

  openAuthModal: () => set({ isAuthModalOpen: true, authMode: 'login' }),
  closeAuthModal: () => set({ isAuthModalOpen: false, otpEmail: '' }),
  setAuthMode: (mode) => set({ authMode: mode }),
  setOtpEmail: (email) => set({ otpEmail: email }),

  login: (userData, token) => {
    localStorage.setItem('vj_token', token);
    set({
      user: userData,
      token,
      isAuthenticated: true,
      isAuthModalOpen: false,
      otpEmail: '',
    });
  },

  logout: () => {
    localStorage.removeItem('vj_token');
    set({ user: null, token: null, isAuthenticated: false });
  },

  // Call on app mount to rehydrate user from saved token
  rehydrate: async () => {
    const token = localStorage.getItem('vj_token');
    if (!token) return;
    try {
      const { user } = await getMeApi(token);
      set({ user, token, isAuthenticated: true });
    } catch {
      localStorage.removeItem('vj_token');
      set({ user: null, token: null, isAuthenticated: false });
    }
  },
}));

export default useAuthStore;