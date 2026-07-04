// src/pages/Admin/AdminLayout.jsx
import React, { useState } from "react";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import {
  FaChartBar,
  FaBox,
  FaClipboardList,
  FaRightFromBracket,
  FaBars,
  FaXmark,
} from "react-icons/fa6";
import useAuthStore from "../../store/useAuthStore";
import { Navigate } from "react-router-dom";

const navItems = [
  { path: "/admin", label: "Dashboard", icon: FaChartBar, exact: true },
  { path: "/admin/products", label: "Products", icon: FaBox },
  { path: "/admin/orders", label: "Orders", icon: FaClipboardList },
];

const AdminLayout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { logout, user, isAuthenticated } = useAuthStore();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/");
  };
  if (!isAuthenticated) return <Navigate to="/" replace />;
  if (user?.role !== "ADMIN")
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 text-center px-6">
        <h1 className="text-4xl font-serif text-gray-800 mb-4">
          Access Denied
        </h1>
        <p className="text-gray-500 mb-8">
          You don't have permission to access the admin panel.
        </p>
        <a href="/" className="text-sm text-[#832729] underline">
          Go back to store
        </a>
      </div>
    );
  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 w-64 bg-[#2a1314] text-white flex flex-col z-50 transform transition-transform duration-300 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } md:relative md:translate-x-0`}
      >
        <div className="p-6 border-b border-white/10">
          <Link to="/" className="font-serif text-xl text-white">
            Vikas Jewellers
          </Link>
          <p className="text-xs text-gray-400 mt-1">Admin Panel</p>
        </div>

        <nav className="flex-grow p-4 flex flex-col gap-1">
          {navItems.map((item) => {
            const active = item.exact
              ? location.pathname === item.path
              : location.pathname.startsWith(item.path);
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 rounded-sm text-sm font-medium transition-colors ${
                  active
                    ? "bg-[#832729] text-white"
                    : "text-gray-300 hover:bg-white/10"
                }`}
              >
                <item.icon className="w-4 h-4" />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-white/10">
          <p className="text-xs text-gray-400 mb-3">{user?.name}</p>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 text-sm text-gray-400 hover:text-red-400 transition-colors"
          >
            <FaRightFromBracket className="w-4 h-4" /> Logout
          </button>
        </div>
      </aside>

      {/* Backdrop for mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main */}
      <div className="flex-grow flex flex-col overflow-hidden">
        <header className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <button
            onClick={() => setSidebarOpen(true)}
            className="md:hidden text-gray-600"
          >
            <FaBars className="w-5 h-5" />
          </button>
          <h1 className="font-serif text-xl text-gray-800">Admin Dashboard</h1>
          <Link to="/" className="text-sm text-[#832729] underline">
            View Store
          </Link>
        </header>

        <main className="flex-grow overflow-y-auto p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
