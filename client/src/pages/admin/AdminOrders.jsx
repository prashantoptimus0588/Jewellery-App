// src/pages/Admin/AdminOrders.jsx
import React, { useEffect, useState } from 'react';
import { FaChevronDown } from 'react-icons/fa6';
import { fetchAdminOrders, updateOrderStatus } from '../../services/adminService';

const STATUSES = ['PENDING', 'PAID', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED', 'REFUNDED'];

const statusColors = {
  PENDING: 'bg-gray-100 text-gray-600',
  PAID: 'bg-amber-50 text-amber-600',
  PROCESSING: 'bg-amber-50 text-amber-600',
  SHIPPED: 'bg-blue-50 text-blue-600',
  DELIVERED: 'bg-green-50 text-green-600',
  CANCELLED: 'bg-red-50 text-red-500',
  REFUNDED: 'bg-purple-50 text-purple-600',
};

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState(null);
  const [updating, setUpdating] = useState(null);

  useEffect(() => {
    fetchAdminOrders()
      .then((data) => setOrders(data.orders))
      .finally(() => setLoading(false));
  }, []);

  const handleStatusChange = async (orderId, status) => {
    setUpdating(orderId);
    try {
      await updateOrderStatus(orderId, status);
      setOrders((prev) =>
        prev.map((o) => o.id === orderId ? { ...o, status } : o)
      );
    } catch (err) {
      alert(err.message);
    } finally {
      setUpdating(null);
    }
  };

  return (
    <div>
      <h2 className="font-serif text-2xl text-gray-800 mb-6">Orders ({orders.length})</h2>

      {loading ? (
        <div className="flex flex-col gap-3">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="animate-pulse bg-gray-100 rounded-sm h-16" />
          ))}
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {orders.map((order) => (
            <div key={order.id} className="bg-white border border-gray-100 rounded-sm overflow-hidden">

              {/* Order Row */}
              <div
                className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 cursor-pointer hover:bg-gray-50/50 transition-colors"
                onClick={() => setExpanded(expanded === order.id ? null : order.id)}
              >
                <div className="flex items-center gap-4">
                  <div>
                    <p className="text-sm font-medium text-gray-800">
                      #{order.id.slice(-8).toUpperCase()}
                    </p>
                    <p className="text-xs text-gray-400">
                      {order.user?.name} · {order.user?.email}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-4 flex-wrap">
                  <span className="text-sm font-medium text-gray-800">
                    ₹ {order.totalAmount.toLocaleString('en-IN')}
                  </span>

                  {/* Status Dropdown */}
                  <select
                    value={order.status}
                    onChange={(e) => { e.stopPropagation(); handleStatusChange(order.id, e.target.value); }}
                    onClick={(e) => e.stopPropagation()}
                    disabled={updating === order.id}
                    className={`text-xs font-semibold px-3 py-1.5 rounded-full border-0 outline-none cursor-pointer ${statusColors[order.status]}`}
                  >
                    {STATUSES.map((s) => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>

                  <span className="text-xs text-gray-400">
                    {new Date(order.createdAt).toLocaleDateString('en-IN')}
                  </span>

                  <FaChevronDown className={`w-3.5 h-3.5 text-gray-400 transition-transform ${expanded === order.id ? 'rotate-180' : ''}`} />
                </div>
              </div>

              {/* Expanded Order Items */}
              {expanded === order.id && (
                <div className="border-t border-gray-100 p-4 bg-gray-50/30 flex flex-col gap-4">

                  {/* Delivery Address */}
                  {order.address && (
                    <div className="text-xs text-gray-500">
                      <span className="font-medium text-gray-700">Deliver to: </span>
                      {order.address.fullName}, {order.address.line1}, {order.address.city}, {order.address.state} - {order.address.pincode}
                    </div>
                  )}

                  {/* Items */}
                  {order.items.map((item) => (
                    <div key={item.id} className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-white rounded-sm overflow-hidden flex-shrink-0 border border-gray-100">
                        <img src={item.product?.images[0]?.url} alt={item.name} className="w-full h-full object-cover" />
                      </div>
                      <div className="flex-grow">
                        <p className="text-sm font-medium text-gray-800">{item.name}</p>
                        <p className="text-xs text-gray-400">
                          {item.size && `Size ${item.size} · `}Qty {item.quantity}
                        </p>
                      </div>
                      <p className="text-sm font-medium text-gray-700">
                        ₹ {(item.price * item.quantity).toLocaleString('en-IN')}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminOrders;