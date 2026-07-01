import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

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

const App = () => {
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
        </Route>
      </Routes>

      {/* Mounted once globally, inside Router so it can use router hooks */}
      <AuthModal />
    </BrowserRouter>
  );
};

export default App;