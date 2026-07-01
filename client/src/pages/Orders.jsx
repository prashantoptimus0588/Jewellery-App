// src/pages/Orders.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaBox, FaTruck, FaCircleCheck, FaChevronDown } from 'react-icons/fa6';
import { fetchOrders } from '../services/orderService';
import useAuthStore from '../store/useAuthStore';

const statusConfig = {
  PENDING:    { icon: FaBox,        color: 'text-gray-600',   bg: 'bg-gray-50' },
  PAID:       { icon: FaBox,        color: 'text-amber-600',  bg: 'bg-amber-50' },
  PROCESSING: { icon: FaBox,        color: 'text-amber-600',  bg: 'bg-amber-50' },
  SHIPPED:    { icon: FaTruck,      color: 'text-blue-600',   bg: 'bg-blue-50' },
  DELIVERED:  { icon: FaCircleCheck,color: 'text-green-600',  bg: 'bg-green-50' },
  CANCELLED:  { icon: FaBox,        color: 'text-red-600',    bg: 'bg-red-50' },
};

const OrderCard = ({ order }) => {
  const [expanded, setExpanded] = useState(false);
  const config = statusConfig[order.status] || statusConfig.PENDING;
  const StatusIcon = config.icon;

  return (
    <div className="border border-gray-100 rounded-sm overflow-hidden">
      <div
        onClick={() => setExpanded(!expanded)}
        className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 cursor-pointer hover:bg-gray-50/50 transition-colors"
      >
        <div className="flex items-center gap-4">
          <div className={`w-10 h-10 rounded-full flex items-center justify-center ${config.bg}`}>
            <StatusIcon className={`w-4 h-4 ${config.color}`} />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-800">#{order.id.slice(-8).toUpperCase()}</p>
            <p className="text-xs text-gray-400">
              {new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-6">
          <span className={`text-xs font-semibold px-3 py-1.5 rounded-full ${config.bg} ${config.color}`}>
            {order.status}
          </span>
          <span className="text-sm font-semibold text-gray-900 hidden sm:block">
            ₹ {order.totalAmount.toLocaleString('en-IN')}
          </span>
          <FaChevronDown className={`w-3.5 h-3.5 text-gray-400 transition-transform ${expanded ? 'rotate-180' : ''}`} />
        </div>
      </div>

      {expanded && (
        <div className="border-t border-gray-100 p-5 flex flex-col gap-4 bg-gray-50/30">
          {order.items.map((item) => (
            <div key={item.id} className="flex items-center gap-4">
              <div className="w-16 h-16 bg-[#f9f9f9] rounded-sm overflow-hidden flex-shrink-0">
                <img
                  src={item.product?.images[0]?.url}
                  alt={item.name}
                  className="w-full h-full object-cover"
                />
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
          {order.status === 'DELIVERED' && (
            <button className="text-xs font-medium text-gray-500 underline self-start">
              Request Exchange
            </button>
          )}
        </div>
      )}
    </div>
  );
};

const Orders = () => {
  const { isAuthenticated } = useAuthStore();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated) return;
    fetchOrders()
      .then((data) => setOrders(data.orders))
      .finally(() => setLoading(false));
  }, [isAuthenticated]);

  if (!isAuthenticated) return (
    <div className="container mx-auto px-6 py-24 text-center">
      <p className="text-gray-400 font-serif text-xl mb-6">Please log in to view your orders</p>
      <Link to="/" className="text-[#832729] underline text-sm">Go to Home</Link>
    </div>
  );

  if (loading) return (
    <div className="container mx-auto px-6 py-10 flex flex-col gap-4">
      {[...Array(3)].map((_, i) => (
        <div key={i} className="animate-pulse border border-gray-100 rounded-sm p-5 h-20 bg-gray-50" />
      ))}
    </div>
  );

  if (orders.length === 0) return (
    <div className="container mx-auto px-6 py-24 text-center">
      <p className="text-gray-400 font-serif text-xl mb-6">You haven't placed any orders yet</p>
      <Link to="/products" className="text-[#832729] underline text-sm">Start Shopping</Link>
    </div>
  );

  return (
    <div className="container mx-auto px-6 py-10">
      <h1 className="text-3xl font-serif text-gray-900 mb-2">My Orders</h1>
      <p className="text-gray-500 text-sm mb-10">{orders.length} orders placed</p>
      <div className="flex flex-col gap-4">
        {orders.map((order) => <OrderCard key={order.id} order={order} />)}
      </div>
    </div>
  );
};

export default Orders;