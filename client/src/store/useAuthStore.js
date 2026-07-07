// src/store/useAuthStore.js
import { create } from 'zustand';
import { getMeApi } from '../services/authService';
import useWishlistStore from './useWishlistStore';

const useAuthStore = create((set) => ({
  user: null,
  token: localStorage.getItem('vj_token') || null,
  isAuthenticated: !!localStorage.getItem('vj_token'),
  
  // ✅ 1. ADDED: App starts in a loading state to prevent premature redirects
  isLoading: true, 
  
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
    useWishlistStore.getState().load();
  },

  logout: () => {
    localStorage.removeItem('vj_token');
    useWishlistStore.getState().load();
    set({ user: null, token: null, isAuthenticated: false });
  },

  rehydrate: async () => {
    const token = localStorage.getItem('vj_token');
    
    // ✅ 2. ADDED: If there's no token, stop loading immediately
    if (!token) {
      set({ isLoading: false }); 
      return;
    }
    
    try {
      const { user } = await getMeApi(token);
      set({ user, token, isAuthenticated: true });
      // Load wishlist on rehydrate too
      useWishlistStore.getState().load();
    } catch {
      localStorage.removeItem('vj_token');
      set({ user: null, token: null, isAuthenticated: false });
    } finally {
      // ✅ 3. ADDED: No matter if the API call succeeded or failed, stop loading
      set({ isLoading: false }); 
    }
  },
}));

export default useAuthStore;