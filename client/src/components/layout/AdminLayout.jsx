// src/components/layout/AdminLayout.jsx
import React from 'react';
import { NavLink, Outlet } from 'react-router-dom';

const navItems = [
  { to: '/admin/products', label: 'Products' },
  { to: '/admin/orders', label: 'Orders' },
];

const AdminLayout = () => {
  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      <aside style={{ width: 220, borderRight: '1px solid #e5e5e5', padding: '1.5rem 1rem' }}>
        <h2 style={{ marginBottom: '1.5rem', fontSize: '1.1rem' }}>Admin</h2>
        <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              style={({ isActive }) => ({
                padding: '0.5rem 0.75rem',
                borderRadius: 6,
                textDecoration: 'none',
                color: isActive ? '#fff' : '#333',
                background: isActive ? '#111' : 'transparent',
              })}
            >
              {item.label}
            </NavLink>
          ))}
        </nav>
      </aside>
      <main style={{ flex: 1, padding: '2rem' }}>
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;