import React from 'react';
import { FaTrash } from 'react-icons/fa6';
import useCartStore from '../../store/useCartStore';

const CartItem = ({ item }) => {
  const { removeItem, updateQuantity } = useCartStore();

  return (
    <div className="flex gap-4 py-4 border-b border-gray-100">
      
      {/* Image */}
      <div className="w-20 h-20 bg-[#f9f9f9] rounded-sm overflow-hidden flex-shrink-0">
        <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
      </div>

      {/* Details */}
      <div className="flex-grow">
        <p className="font-serif text-gray-800 text-sm mb-1">{item.name}</p>
        <p className="text-xs text-gray-400 mb-3">Size: {item.size}</p>

        {/* Quantity + Delete */}
        <div className="flex items-center justify-between">
          <div className="flex items-center border border-gray-200 rounded-sm">
            <button
              onClick={() => item.quantity > 1
                ? updateQuantity(item.id, item.size, item.quantity - 1)
                : removeItem(item.id, item.size)
              }
              className="w-8 h-8 flex items-center justify-center text-gray-500 hover:text-[#832729] transition-colors"
            >
              −
            </button>
            <span className="w-8 text-center text-sm">{item.quantity}</span>
            <button
              onClick={() => updateQuantity(item.id, item.size, item.quantity + 1)}
              className="w-8 h-8 flex items-center justify-center text-gray-500 hover:text-[#832729] transition-colors"
            >
              +
            </button>
          </div>

          <div className="flex items-center gap-4">
            <span className="text-sm font-semibold text-gray-900">
              ₹ {(item.price * item.quantity).toLocaleString('en-IN')}
            </span>
            <button
              onClick={() => removeItem(item.id, item.size)}
              className="text-gray-300 hover:text-red-500 transition-colors"
            >
              <FaTrash className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartItem;