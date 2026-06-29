import { create } from 'zustand';

const useAuthStore = create((set) => ({
  user: null,        // { id, name, email, avatar }
  isAuthenticated: false,
  isAuthModalOpen: false,
  authMode: 'login', // 'login' | 'otp'
  otpEmail: '',

  openAuthModal: () => set({ isAuthModalOpen: true, authMode: 'login' }),
  closeAuthModal: () => set({ isAuthModalOpen: false, otpEmail: '' }),
  setAuthMode: (mode) => set({ authMode: mode }),
  setOtpEmail: (email) => set({ otpEmail: email }),

  login: (userData) => set({
    user: userData,
    isAuthenticated: true,
    isAuthModalOpen: false,
    otpEmail: '',
  }),

  logout: () => set({
    user: null,
    isAuthenticated: false,
  }),
}));

export default useAuthStore;