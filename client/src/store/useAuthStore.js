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
    set({ user: userData, token, isAuthenticated: true, isAuthModalOpen: false, otpEmail: '' });
    // Load wishlist from DB on login
    import('../store/useWishlistStore').then(({ default: useWishlistStore }) => {
      useWishlistStore.getState().load();
    });
  },

  logout: () => {
    localStorage.removeItem('vj_token');
    import('../store/useWishlistStore').then(({ default: useWishlistStore }) => {
      useWishlistStore.getState().clear();
    });
    set({ user: null, token: null, isAuthenticated: false });
  },

  rehydrate: async () => {
    const token = localStorage.getItem('vj_token');
    if (!token) return;
    try {
      const { user } = await getMeApi(token);
      set({ user, token, isAuthenticated: true });
      // Load wishlist on rehydrate too
      const { default: useWishlistStore } = await import('../store/useWishlistStore');
      useWishlistStore.getState().load();
    } catch {
      localStorage.removeItem('vj_token');
      set({ user: null, token: null, isAuthenticated: false });
    }
  },
}));

export default useAuthStore;