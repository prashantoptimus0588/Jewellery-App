import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

// Layout
import UserLayout from './components/layout/UserLayout';

// Pages
import Home from './pages/Home';
import ProductListing from './pages/ProductListing';
import ProductDetail from './pages/ProductDetail';
import Checkout from './pages/Checkout';
import Orders from './pages/Orders';
import Profile from './pages/Profile';

// Auth
import AuthModal from './components/auth/AuthModal';
import AuthCallback from './pages/AuthCallback';
import NotFound from './pages/NotFound';

import AdminProducts from './pages/admin/AdminProducts';
import AdminRoute from './components/auth/AdminRoute';
import AdminLayout from './components/layout/AdminLayout';
import AdminOrders from './pages/admin/AdminOrders';
import useAuthStore from './store/useAuthStore';


const App = () => {
  const rehydrate = useAuthStore((state) => state.rehydrate);

  useEffect(() => {
    rehydrate();
  }, [rehydrate]);
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/auth/callback" element={<AuthCallback />} />
        
        <Route path="/" element={<UserLayout />}>
          <Route index element={<Home />} />
          <Route path="products" element={<ProductListing />} />
          <Route path="product/:slug" element={<ProductDetail />} />
          <Route path="checkout" element={<Checkout />} />
          <Route path="orders" element={<Orders />} />
          <Route path="profile" element={<Profile />} />
          <Route path="*" element={<NotFound />} />
        </Route>

        <Route
          path="/admin"
          element={
            <AdminRoute>
              <AdminLayout />
            </AdminRoute>
          }
        >
          {/* Automatically redirects from /admin to /admin/orders */}
          <Route index element={<Navigate to="orders" replace />} />
          <Route path="products" element={<AdminProducts />} />
          <Route path="orders" element={<AdminOrders />} />
        </Route>
      </Routes>

      {/* Mounted once globally, inside Router so it can use router hooks */}
      <AuthModal />
    </BrowserRouter>
  );
};

export default App;