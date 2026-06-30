import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaCheck } from 'react-icons/fa6';
import useCartStore from '../store/useCartStore';

const Checkout = () => {
  const navigate = useNavigate();
  const items = useCartStore((s) => s.items);
  const totalPrice = useCartStore((s) => s.totalPrice());
  const clearCart = useCartStore((s) => s.clearCart);

  const [step, setStep] = useState(1); // 1 = address, 2 = payment
  const [loading, setLoading] = useState(false);

  const [address, setAddress] = useState({
    fullName: '',
    phone: '',
    line1: '',
    city: '',
    state: '',
    pincode: '',
  });

  const shippingFee = 0; // free insured shipping
  const grandTotal = totalPrice + shippingFee;

  const handleAddressChange = (field, value) => {
    setAddress((prev) => ({ ...prev, [field]: value }));
  };

  const isAddressValid =
    address.fullName && address.phone && address.line1 && address.city && address.state && address.pincode;

  const handlePlaceOrder = async () => {
    setLoading(true);

    // TODO: 1. Call POST /api/orders to create order in DB
    // TODO: 2. Call POST /api/payments/razorpay/create to get Razorpay order id
    // TODO: 3. Open Razorpay checkout widget with that order id
    // TODO: 4. On payment success, call POST /api/payments/razorpay/verify
    // TODO: 5. On verify success, clearCart() and navigate to /orders

    await new Promise((res) => setTimeout(res, 1200)); // simulate API

    clearCart();
    navigate('/orders');
  };

  if (items.length === 0) {
    return (
      <div className="container mx-auto px-6 py-24 text-center">
        <p className="text-gray-400 font-serif text-xl mb-6">Your cart is empty</p>
        <Link to="/products" className="text-[#832729] underline text-sm">
          Continue Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-6 py-10">

      <h1 className="text-3xl font-serif text-gray-900 mb-10">Checkout</h1>

      <div className="flex flex-col lg:flex-row gap-12">

        {/* LEFT: Steps */}
        <div className="w-full lg:w-2/3">

          {/* Step indicator */}
          <div className="flex items-center gap-4 mb-8">
            <StepBadge number={1} label="Shipping Address" active={step === 1} done={step > 1} />
            <div className="flex-grow h-px bg-gray-200" />
            <StepBadge number={2} label="Payment" active={step === 2} done={false} />
          </div>

          {/* Step 1: Address Form */}
          {step === 1 && (
            <div className="flex flex-col gap-4 border border-gray-100 rounded-sm p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input label="Full Name" value={address.fullName} onChange={(v) => handleAddressChange('fullName', v)} />
                <Input label="Phone Number" value={address.phone} onChange={(v) => handleAddressChange('phone', v)} />
              </div>
              <Input label="Address Line" value={address.line1} onChange={(v) => handleAddressChange('line1', v)} />
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Input label="City" value={address.city} onChange={(v) => handleAddressChange('city', v)} />
                <Input label="State" value={address.state} onChange={(v) => handleAddressChange('state', v)} />
                <Input label="Pincode" value={address.pincode} onChange={(v) => handleAddressChange('pincode', v)} />
              </div>

              <button
                onClick={() => setStep(2)}
                disabled={!isAddressValid}
                className="mt-4 w-full bg-[#832729] text-white font-medium py-3 rounded-sm hover:bg-[#6a1f21] transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
              >
                Continue to Payment
              </button>
            </div>
          )}

          {/* Step 2: Payment */}
          {step === 2 && (
            <div className="flex flex-col gap-4 border border-gray-100 rounded-sm p-6">
              <p className="text-sm text-gray-500 mb-2">
                Delivering to <span className="font-medium text-gray-800">{address.fullName}, {address.city}, {address.state} - {address.pincode}</span>
                <button onClick={() => setStep(1)} className="text-[#832729] text-xs ml-3 underline">Edit</button>
              </p>

              <div className="border border-gray-200 rounded-sm p-4 flex items-center gap-3">
                <img src="https://razorpay.com/favicon.png" alt="razorpay" className="w-6 h-6" />
                <div>
                  <p className="text-sm font-medium text-gray-800">Pay securely with Razorpay</p>
                  <p className="text-xs text-gray-400">UPI, Cards, Netbanking & Wallets</p>
                </div>
              </div>

              <button
                onClick={handlePlaceOrder}
                disabled={loading}
                className="mt-4 w-full bg-[#832729] text-white font-medium py-4 rounded-sm hover:bg-[#6a1f21] transition-colors disabled:opacity-60"
              >
                {loading ? 'Processing...' : `Pay ₹ ${grandTotal.toLocaleString('en-IN')}`}
              </button>
            </div>
          )}
        </div>

        {/* RIGHT: Order Summary */}
        <div className="w-full lg:w-1/3">
          <div className="border border-gray-100 rounded-sm p-6 sticky top-24">
            <h3 className="font-serif text-lg text-gray-800 mb-5">Order Summary</h3>

            <div className="flex flex-col gap-4 mb-5 max-h-80 overflow-y-auto">
              {items.map((item) => (
                <div key={`${item.id}-${item.size}`} className="flex gap-3">
                  <div className="w-14 h-14 bg-[#f9f9f9] rounded-sm overflow-hidden flex-shrink-0">
                    <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-grow">
                    <p className="text-xs text-gray-800 line-clamp-1">{item.name}</p>
                    <p className="text-xs text-gray-400">Size {item.size} × {item.quantity}</p>
                  </div>
                  <p className="text-xs font-medium text-gray-700">
                    ₹ {(item.price * item.quantity).toLocaleString('en-IN')}
                  </p>
                </div>
              ))}
            </div>

            <div className="flex flex-col gap-2 text-sm border-t border-gray-100 pt-4">
              <div className="flex justify-between text-gray-500">
                <span>Subtotal</span>
                <span>₹ {totalPrice.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between text-gray-500">
                <span>Shipping</span>
                <span className="text-green-600">Free</span>
              </div>
              <div className="flex justify-between font-semibold text-gray-900 text-base pt-2 border-t border-gray-100 mt-2">
                <span>Total</span>
                <span>₹ {grandTotal.toLocaleString('en-IN')}</span>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

// --- Helper Components ---
const StepBadge = ({ number, label, active, done }) => (
  <div className="flex items-center gap-2">
    <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-semibold flex-shrink-0 ${
      done ? 'bg-[#832729] text-white' : active ? 'bg-[#832729] text-white' : 'bg-gray-100 text-gray-400'
    }`}>
      {done ? <FaCheck className="w-3 h-3" /> : number}
    </div>
    <span className={`text-sm font-medium hidden sm:block ${active || done ? 'text-gray-800' : 'text-gray-400'}`}>
      {label}
    </span>
  </div>
);

const Input = ({ label, value, onChange }) => (
  <div>
    <label className="block text-xs text-gray-500 mb-1.5 font-medium">{label}</label>
    <input
      type="text"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full border border-gray-200 rounded-sm px-3 py-2.5 text-sm outline-none focus:border-[#832729] transition-colors"
    />
  </div>
);

export default Checkout;