// src/components/auth/OtpModal.jsx
import React, { useState, useRef, useEffect } from "react";
import useAuthStore from "../../store/useAuthStore";
import { verifyOtpApi, sendOtpApi } from "../../services/authService";

const OtpModal = () => {
  const { otpEmail, setAuthMode, login } = useAuthStore();
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [resendTimer, setResendTimer] = useState(30);
  const inputs = useRef([]);

  useEffect(() => {
    if (resendTimer === 0) return;
    const t = setInterval(() => setResendTimer((prev) => prev - 1), 1000);
    return () => clearInterval(t);
  }, [resendTimer]);

  const handleChange = (value, index) => {
    if (!/^\d*$/.test(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value.slice(-1);
    setOtp(newOtp);
    setError("");
    if (value && index < 5) inputs.current[index + 1]?.focus();
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e) => {
    const pasted = e.clipboardData
      .getData("text")
      .replace(/\D/g, "")
      .slice(0, 6);
    if (pasted.length === 6) {
      setOtp(pasted.split(""));
      inputs.current[5]?.focus();
    }
  };

  const handleVerify = async () => {
    const code = otp.join("");
    if (code.length < 6) {
      setError("Please enter the complete 6-digit OTP.");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const { token, user } = await verifyOtpApi(otpEmail, code);
      login(user, token);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    setResendTimer(30);
    setOtp(["", "", "", "", "", ""]);
    setError("");
    try {
      await sendOtpApi(otpEmail);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="flex flex-col gap-5">
      <div className="text-center">
        <p className="text-sm text-gray-500">We sent a 6-digit code to</p>
        <p className="font-medium text-gray-800 text-sm mt-1">{otpEmail}</p>
      </div>

      <div className="flex gap-3 justify-center" onPaste={handlePaste}>
        {otp.map((digit, index) => (
          <input
            key={index}
            ref={(el) => (inputs.current[index] = el)}
            type="text"
            inputMode="numeric"
            value={digit}
            onChange={(e) => handleChange(e.target.value, index)}
            onKeyDown={(e) => handleKeyDown(e, index)}
            maxLength={1}
            className={`w-11 h-12 text-center text-lg font-semibold border rounded-sm outline-none transition-colors ${
              error
                ? "border-red-400 bg-red-50"
                : digit
                  ? "border-[#832729] bg-[#832729]/5"
                  : "border-gray-200 focus:border-[#832729]"
            }`}
          />
        ))}
      </div>

      {error && <p className="text-red-500 text-xs text-center">{error}</p>}

      <button
        onClick={handleVerify}
        disabled={loading}
        className="w-full bg-[#832729] text-white font-medium py-3 rounded-sm hover:bg-[#6a1f21] transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
      >
        {loading ? "Verifying..." : "Verify OTP"}
      </button>

      <div className="flex items-center justify-between text-xs text-gray-500">
        <button
          onClick={() => setAuthMode("login")}
          className="hover:text-[#832729] transition-colors"
        >
          ← Change email
        </button>
        {resendTimer > 0 ? (
          <span>Resend in {resendTimer}s</span>
        ) : (
          <button
            onClick={handleResend}
            className="text-[#832729] font-medium hover:underline"
          >
            Resend OTP
          </button>
        )}
      </div>
    </div>
  );
};

export default OtpModal;
