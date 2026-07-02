import React from 'react';
import { FaXmark } from 'react-icons/fa6';
import useAuthStore from '../../store/useAuthStore';
import LoginForm from './LoginForm';
import OtpModal from './OtpModal';
import GoogleButton from './GoogleButton';

const AuthModal = () => {
  const { isAuthModalOpen, closeAuthModal, authMode } = useAuthStore();

  if (!isAuthModalOpen) return null;

  
  return (
    <>
        {/* Backdrop */}
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm"
          style={{ zIndex: 50 }}
          onClick={closeAuthModal}
        />

        {/* Modal */}
        <div
          className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-sm bg-white rounded-sm shadow-2xl p-8"
          style={{ zIndex: 60 }}
          onClick={(e) => e.stopPropagation()}
        >
        {/* Close */}
        <button
          onClick={closeAuthModal}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 transition-colors"
        >
          <FaXmark className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="text-center mb-7">
          <h2 className="font-serif text-2xl text-gray-900 mb-1">
            {authMode === 'otp' ? 'Enter OTP' : 'Welcome Back'}
          </h2>
          <p className="text-sm text-gray-400">
            {authMode === 'otp'
              ? 'Check your inbox for the code'
              : 'Sign in to your Vikas Jewellers account'}
          </p>
        </div>

        {/* Content */}
        {authMode === 'login' ? (
          <div className="flex flex-col gap-4">
            <LoginForm />
            <div className="flex items-center gap-3">
              <div className="flex-grow h-px bg-gray-100" />
              <span className="text-xs text-gray-400">or</span>
              <div className="flex-grow h-px bg-gray-100" />
            </div>
            <GoogleButton/>
          </div>
        ) : (
          <OtpModal />
        )}
      </div>
    </>
  );
};

export default AuthModal;