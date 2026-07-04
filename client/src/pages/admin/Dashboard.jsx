// src/pages/Admin/Dashboard.jsx
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  FaBox,
  FaClipboardList,
  FaUsers,
  FaIndianRupeeSign,
} from "react-icons/fa6";
import { fetchStats } from "../../services/adminService";

const statusColors = {
  PENDING: "bg-gray-100 text-gray-600",
  PAID: "bg-amber-50 text-amber-600",
  PROCESSING: "bg-amber-50 text-amber-600",
  SHIPPED: "bg-blue-50 text-blue-600",
  DELIVERED: "bg-green-50 text-green-600",
  CANCELLED: "bg-red-50 text-red-600",
};

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchStats()
      .then(setStats)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  if (loading)
    return (
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="animate-pulse bg-gray-100 rounded-sm h-28" />
        ))}
      </div>
    );

  if (error)
    return (
      <div className="text-center py-20">
        <p className="text-red-400 mb-2">{error}</p>
        <a href="/" className="text-sm text-[#832729] underline">
          Go back to store
        </a>
      </div>
    );

  if (!stats) return null;

  const statCards = [
    {
      label: "Total Products",
      value: stats.totalProducts,
      icon: FaBox,
      color: "text-blue-600 bg-blue-50",
    },
    {
      label: "Total Orders",
      value: stats.totalOrders,
      icon: FaClipboardList,
      color: "text-amber-600 bg-amber-50",
    },
    {
      label: "Total Users",
      value: stats.totalUsers,
      icon: FaUsers,
      color: "text-green-600 bg-green-50",
    },
    {
      label: "Total Revenue",
      value: `₹ ${stats.totalRevenue.toLocaleString("en-IN")}`,
      icon: FaIndianRupeeSign,
      color: "text-[#832729] bg-[#832729]/10",
    },
  ];

  return (
    <div className="flex flex-col gap-8">
      {/* Stat Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {statCards.map((card) => (
          <div
            key={card.label}
            className="bg-white border border-gray-100 rounded-sm p-5"
          >
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center mb-3 ${card.color}`}
            >
              <card.icon className="w-5 h-5" />
            </div>
            <p className="text-2xl font-semibold text-gray-900">{card.value}</p>
            <p className="text-xs text-gray-500 mt-1">{card.label}</p>
          </div>
        ))}
      </div>

      {/* Recent Orders */}
      <div className="bg-white border border-gray-100 rounded-sm p-6">
        <div className="flex justify-between items-center mb-5">
          <h3 className="font-serif text-lg text-gray-800">Recent Orders</h3>
          <Link to="/admin/orders" className="text-sm text-[#832729] underline">
            View All
          </Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 text-gray-500 text-left">
                <th className="pb-3 font-medium">Order ID</th>
                <th className="pb-3 font-medium">Customer</th>
                <th className="pb-3 font-medium">Amount</th>
                <th className="pb-3 font-medium">Status</th>
                <th className="pb-3 font-medium">Date</th>
              </tr>
            </thead>
            <tbody>
              {stats.recentOrders.map((order) => (
                <tr key={order.id} className="border-b border-gray-50">
                  <td className="py-3 text-gray-600">
                    #{order.id.slice(-6).toUpperCase()}
                  </td>
                  <td className="py-3 text-gray-800">
                    {order.user?.name || "N/A"}
                  </td>
                  <td className="py-3 text-gray-800">
                    ₹ {order.totalAmount.toLocaleString("en-IN")}
                  </td>
                  <td className="py-3">
                    <span
                      className={`text-xs font-semibold px-2 py-1 rounded-full ${statusColors[order.status] || "bg-gray-100 text-gray-600"}`}
                    >
                      {order.status}
                    </span>
                  </td>
                  <td className="py-3 text-gray-500">
                    {new Date(order.createdAt).toLocaleDateString("en-IN")}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
