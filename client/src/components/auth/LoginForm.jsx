import React, { useState } from 'react';
import useAuthStore from '../../store/useAuthStore';

const LoginForm = () => {
  const { setAuthMode, setOtpEmail } = useAuthStore();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async () => {
    if (!email || !email.includes('@')) {
      setError('Please enter a valid email address.');
      return;
    }

    setLoading(true);
    setError('');

    // TODO: Call POST /api/auth/send-otp with email
    // For now simulating API delay
    await new Promise((res) => setTimeout(res, 1000));

    setOtpEmail(email);
    setAuthMode('otp');
    setLoading(false);
  };

  return (
    <div className="flex flex-col gap-5">
      <div>
        <label className="block text-sm text-gray-600 mb-2 font-medium">
          Email Address
        </label>
        <input
          type="email"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            setError('');
          }}
          onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
          placeholder="you@example.com"
          className="w-full border border-gray-200 rounded-sm px-4 py-3 text-sm outline-none focus:border-[#832729] transition-colors"
        />
        {error && <p className="text-red-500 text-xs mt-2">{error}</p>}
      </div>

      <button
        onClick={handleSubmit}
        disabled={loading}
        className="w-full bg-[#832729] text-white font-medium py-3 rounded-sm hover:bg-[#6a1f21] transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
      >
        {loading ? 'Sending OTP...' : 'Continue with Email'}
      </button>
    </div>
  );
};

export default LoginForm;