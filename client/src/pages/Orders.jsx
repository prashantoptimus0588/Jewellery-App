import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaBox, FaTruck, FaCircleCheck, FaChevronDown } from 'react-icons/fa6';

// --- Dummy Data (replace with GET /api/orders later) ---
const dummyOrders = [
  {
    id: 'VJ-2026-1042',
    date: '2026-06-18',
    status: 'Delivered',
    total: 66174,
    items: [
      {
        id: 1,
        name: 'Bloom Bud Gold Ring',
        size: '12',
        quantity: 1,
        price: 66174,
        image: 'https://images.unsplash.com/photo-1605100804763-247f67b2548e?q=80&w=400',
      },
    ],
  },
  {
    id: 'VJ-2026-0988',
    date: '2026-06-05',
    status: 'Shipped',
    total: 112000,
    items: [
      {
        id: 5,
        name: 'Solitaire Diamond Studs',
        size: null,
        quantity: 1,
        price: 112000,
        image: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?q=80&w=400',
      },
    ],
  },
  {
    id: 'VJ-2026-0871',
    date: '2026-05-22',
    status: 'Processing',
    total: 128400,
    items: [
      {
        id: 4,
        name: 'Classic Gold Bangles',
        size: null,
        quantity: 1,
        price: 89500,
        image: 'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?q=80&w=400',
      },
      {
        id: 6,
        name: 'Imperial Rose Gold Ring',
        size: '10',
        quantity: 1,
        price: 38900,
        image: 'https://images.unsplash.com/photo-1601121141461-9d6647bca1ed?q=80&w=400',
      },
    ],
  },
];

const statusConfig = {
  Processing: { icon: FaBox, color: 'text-amber-600', bg: 'bg-amber-50' },
  Shipped: { icon: FaTruck, color: 'text-blue-600', bg: 'bg-blue-50' },
  Delivered: { icon: FaCircleCheck, color: 'text-green-600', bg: 'bg-green-50' },
};

const OrderCard = ({ order }) => {
  const [expanded, setExpanded] = useState(false);
  const { icon: StatusIcon, color, bg } = statusConfig[order.status];

  const formattedDate = new Date(order.date).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  return (
    <div className="border border-gray-100 rounded-sm overflow-hidden">

      {/* Header */}
      <div
        onClick={() => setExpanded(!expanded)}
        className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 cursor-pointer hover:bg-gray-50/50 transition-colors"
      >
        <div className="flex items-center gap-4">
          <div className={`w-10 h-10 rounded-full flex items-center justify-center ${bg}`}>
            <StatusIcon className={`w-4 h-4 ${color}`} />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-800">{order.id}</p>
            <p className="text-xs text-gray-400">Placed on {formattedDate}</p>
          </div>
        </div>

        <div className="flex items-center gap-6">
          <span className={`text-xs font-semibold px-3 py-1.5 rounded-full ${bg} ${color}`}>
            {order.status}
          </span>
          <span className="text-sm font-semibold text-gray-900 hidden sm:block">
            ₹ {order.total.toLocaleString('en-IN')}
          </span>
          <FaChevronDown className={`w-3.5 h-3.5 text-gray-400 transition-transform ${expanded ? 'rotate-180' : ''}`} />
        </div>
      </div>

      {/* Expanded Items */}
      {expanded && (
        <div className="border-t border-gray-100 p-5 flex flex-col gap-4 bg-gray-50/30">
          {order.items.map((item, idx) => (
            <div key={idx} className="flex items-center gap-4">
              <div className="w-16 h-16 bg-[#f9f9f9] rounded-sm overflow-hidden flex-shrink-0">
                <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
              </div>
              <div className="flex-grow">
                <p className="text-sm font-serif text-gray-800">{item.name}</p>
                <p className="text-xs text-gray-400">
                  {item.size && `Size ${item.size} · `}Qty {item.quantity}
                </p>
              </div>
              <p className="text-sm font-medium text-gray-700">
                ₹ {(item.price * item.quantity).toLocaleString('en-IN')}
              </p>
            </div>
          ))}

          <div className="flex gap-3 pt-2 sm:hidden">
            <span className="text-sm font-semibold text-gray-900">
              Total: ₹ {order.total.toLocaleString('en-IN')}
            </span>
          </div>

          <div className="flex gap-3 pt-2">
            <Link
              to={`/orders/${order.id}`}
              className="text-xs font-medium text-[#832729] underline"
            >
              View Order Details
            </Link>
            {order.status === 'Delivered' && (
              <button className="text-xs font-medium text-gray-500 underline">
                Request Exchange
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

const Orders = () => {
  const orders = dummyOrders; // TODO: replace with GET /api/orders

  if (orders.length === 0) {
    return (
      <div className="container mx-auto px-6 py-24 text-center">
        <p className="text-gray-400 font-serif text-xl mb-6">You haven't placed any orders yet</p>
        <Link to="/products" className="text-[#832729] underline text-sm">
          Start Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-6 py-10">
      <h1 className="text-3xl font-serif text-gray-900 mb-2">My Orders</h1>
      <p className="text-gray-500 text-sm mb-10">{orders.length} orders placed</p>

      <div className="flex flex-col gap-4">
        {orders.map((order) => (
          <OrderCard key={order.id} order={order} />
        ))}
      </div>
    </div>
  );
};

export default Orders;