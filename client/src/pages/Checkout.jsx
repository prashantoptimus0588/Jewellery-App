// src/pages/Checkout.jsx
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaCheck } from 'react-icons/fa6';
import useCartStore from '../store/useCartStore';
import useAuthStore from '../store/useAuthStore';
import { saveAddress, getAddresses, createRazorpayOrder, verifyPayment } from '../services/orderService';

const Checkout = () => {
  const navigate = useNavigate();
  const items = useCartStore((s) => s.items);
  const totalPrice = useCartStore((s) => s.totalPrice());
  const clearCart = useCartStore((s) => s.clearCart);
  const { isAuthenticated, openAuthModal } = useAuthStore();

  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [addresses, setAddresses] = useState([]);
  const [selectedAddressId, setSelectedAddressId] = useState(null);
  const [showNewForm, setShowNewForm] = useState(false);

  const [address, setAddress] = useState({
    fullName: '', phone: '', line1: '', city: '', state: '', pincode: '',
  });

  const grandTotal = totalPrice;

  useEffect(() => {
    if (!isAuthenticated) return;
    getAddresses().then((data) => {
      setAddresses(data.addresses);
      if (data.addresses.length > 0) {
        setSelectedAddressId(data.addresses[0].id);
      } else {
        setShowNewForm(true);
      }
    });
  }, [isAuthenticated]);

  const handleAddressChange = (field, value) =>
    setAddress((prev) => ({ ...prev, [field]: value }));

  const isAddressValid = selectedAddressId ||
    (address.fullName && address.phone && address.line1 && address.city && address.state && address.pincode);

  const handleContinueToPayment = async () => {
    if (!isAuthenticated) { openAuthModal(); return; }

    setLoading(true);
    try {
      let addressId = selectedAddressId;
      if (showNewForm || !selectedAddressId) {
        const { address: saved } = await saveAddress({ ...address, isDefault: addresses.length === 0 });
        addressId = saved.id;
        setSelectedAddressId(saved.id);
        setAddresses((prev) => [...prev, saved]);
      }
      setStep(2);
    } catch (err) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  const loadRazorpayScript = () =>
    new Promise((resolve) => {
      if (window.Razorpay) return resolve(true);
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });

  const handlePlaceOrder = async () => {
    setLoading(true);
    try {
      const loaded = await loadRazorpayScript();
      if (!loaded) throw new Error('Razorpay SDK failed to load');

      const orderData = await createRazorpayOrder({
        items: items.map((i) => ({
          productId: i.id,
          quantity: i.quantity,
          size: i.size,
        })),
        addressId: selectedAddressId,
      });

      const options = {
        key: orderData.keyId,
        amount: orderData.amount * 100,
        currency: orderData.currency,
        name: 'Vikas Jewellers',
        description: 'Jewellery Purchase',
        order_id: orderData.razorpayOrderId,
        handler: async (response) => {
          try {
            await verifyPayment({
              orderId: orderData.orderId,
              razorpayOrderId: response.razorpay_order_id,
              razorpayPaymentId: response.razorpay_payment_id,
              razorpaySignature: response.razorpay_signature,
            });
            clearCart();
            navigate('/orders');
          } catch (err) {
            alert('Payment verification failed: ' + err.message);
          }
        },
        prefill: { name: address.fullName, contact: address.phone },
        theme: { color: '#832729' },
        modal: { ondismiss: () => setLoading(false) },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err) {
      alert(err.message);
      setLoading(false);
    }
  };

  if (items.length === 0) return (
    <div className="container mx-auto px-6 py-24 text-center">
      <p className="text-gray-400 font-serif text-xl mb-6">Your cart is empty</p>
      <Link to="/products" className="text-[#832729] underline text-sm">Continue Shopping</Link>
    </div>
  );

  return (
    <div className="container mx-auto px-6 py-10">
      <h1 className="text-3xl font-serif text-gray-900 mb-10">Checkout</h1>

      <div className="flex flex-col lg:flex-row gap-12">
        <div className="w-full lg:w-2/3">

          {/* Step indicator */}
          <div className="flex items-center gap-4 mb-8">
            <StepBadge number={1} label="Shipping Address" active={step === 1} done={step > 1} />
            <div className="flex-grow h-px bg-gray-200" />
            <StepBadge number={2} label="Payment" active={step === 2} done={false} />
          </div>

          {/* Step 1 */}
          {step === 1 && (
            <div className="border border-gray-100 rounded-sm p-6 flex flex-col gap-5">

              {/* Saved addresses */}
              {addresses.length > 0 && (
                <div className="flex flex-col gap-3 mb-2">
                  <p className="text-sm font-medium text-gray-700">Saved Addresses</p>
                  {addresses.map((addr) => (
                    <label key={addr.id} className={`flex items-start gap-3 border rounded-sm p-4 cursor-pointer transition-colors ${
                      selectedAddressId === addr.id ? 'border-[#832729] bg-[#832729]/5' : 'border-gray-200'
                    }`}>
                      <input
                        type="radio"
                        name="address"
                        checked={selectedAddressId === addr.id}
                        onChange={() => { setSelectedAddressId(addr.id); setShowNewForm(false); }}
                        className="mt-1 accent-[#832729]"
                      />
                      <div className="text-sm">
                        <p className="font-medium text-gray-800">{addr.fullName}</p>
                        <p className="text-gray-500">{addr.line1}, {addr.city}, {addr.state} - {addr.pincode}</p>
                        <p className="text-gray-500">{addr.phone}</p>
                      </div>
                    </label>
                  ))}

                  <button
                    onClick={() => { setShowNewForm(!showNewForm); setSelectedAddressId(null); }}
                    className="text-sm text-[#832729] underline self-start"
                  >
                    {showNewForm ? 'Cancel' : '+ Add New Address'}
                  </button>
                </div>
              )}

              {/* New address form */}
              {showNewForm && (
                <div className="flex flex-col gap-4">
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
                </div>
              )}

              <button
                onClick={handleContinueToPayment}
                disabled={loading || !isAddressValid}
                className="mt-2 w-full bg-[#832729] text-white font-medium py-3 rounded-sm hover:bg-[#6a1f21] transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
              >
                {loading ? 'Saving...' : 'Continue to Payment'}
              </button>
            </div>
          )}

          {/* Step 2 */}
          {step === 2 && (
            <div className="border border-gray-100 rounded-sm p-6 flex flex-col gap-4">
              {(() => {
                const addr = addresses.find((a) => a.id === selectedAddressId);
                return addr ? (
                  <p className="text-sm text-gray-500">
                    Delivering to <span className="font-medium text-gray-800">{addr.fullName}, {addr.city}, {addr.state} - {addr.pincode}</span>
                    <button onClick={() => setStep(1)} className="text-[#832729] text-xs ml-3 underline">Edit</button>
                  </p>
                ) : null;
              })()}

              <div className="border border-gray-200 rounded-sm p-4 flex items-center gap-3">
                <div className="w-8 h-8 bg-[#072654] rounded flex items-center justify-center text-white text-xs font-bold">R</div>
                <div>
                  <p className="text-sm font-medium text-gray-800">Pay securely with Razorpay</p>
                  <p className="text-xs text-gray-400">UPI, Cards, Netbanking & Wallets</p>
                </div>
              </div>

              <button
                onClick={handlePlaceOrder}
                disabled={loading}
                className="mt-2 w-full bg-[#832729] text-white font-medium py-4 rounded-sm hover:bg-[#6a1f21] transition-colors disabled:opacity-60"
              >
                {loading ? 'Opening Payment...' : `Pay ₹ ${grandTotal.toLocaleString('en-IN')}`}
              </button>
            </div>
          )}
        </div>

        {/* Order Summary */}
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

const StepBadge = ({ number, label, active, done }) => (
  <div className="flex items-center gap-2">
    <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-semibold flex-shrink-0 ${
      done || active ? 'bg-[#832729] text-white' : 'bg-gray-100 text-gray-400'
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