import React from 'react';
import { Link } from 'react-router-dom';
import { FaXmark } from 'react-icons/fa6';
import useCartStore from '../../store/useCartStore';
import CartItem from './CartItem';

const CartDrawer = ({ isOpen, onClose }) => {
  const items = useCartStore((s) => s.items);
  const totalPrice = useCartStore((s) => s.totalPrice());

  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-40 backdrop-blur-sm"
          onClick={onClose}
        />
      )}

      {/* Drawer */}
      <div className={`fixed top-0 right-0 h-full w-full max-w-md bg-white z-50 shadow-2xl flex flex-col transition-transform duration-300 ${
        isOpen ? 'translate-x-0' : 'translate-x-full'
      }`}>

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100">
          <h2 className="font-serif text-xl text-gray-900">
            Your Cart <span className="text-gray-400 font-sans text-sm font-normal">({items.length} items)</span>
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-700 transition-colors">
            <FaXmark className="w-5 h-5" />
          </button>
        </div>

        {/* Items */}
        <div className="flex-grow overflow-y-auto px-6">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center gap-4">
              <p className="text-gray-400 font-serif text-lg">Your cart is empty</p>
              <button onClick={onClose} className="text-sm text-[#832729] underline">
                Continue Shopping
              </button>
            </div>
          ) : (
            items.map((item) => <CartItem key={`${item.id}-${item.size}`} item={item} />)
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="px-6 py-6 border-t border-gray-100 bg-white">
            <div className="flex justify-between items-center mb-5">
              <span className="text-gray-500 text-sm">Subtotal</span>
              <span className="font-semibold text-gray-900 text-lg">
                ₹ {totalPrice.toLocaleString('en-IN')}
              </span>
            </div>
            <Link
              to="/checkout"
              onClick={onClose}
              className="block w-full text-center bg-[#832729] text-white font-medium py-4 rounded-sm hover:bg-[#6a1f21] transition-colors"
            >
              Proceed to Checkout
            </Link>
          </div>
        )}
      </div>
    </>
  );
};

export default CartDrawer;