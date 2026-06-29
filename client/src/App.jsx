import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

// Layout
import UserLayout from './components/layout/UserLayout';

// Pages
import Home from './pages/Home';
import ProductListing from './pages/ProductListing';
import ProductDetail from './pages/ProductDetail';
import AuthModal from './components/auth/AuthModal';

// Auth


const App = () => {
  return (
    <div>
      <BrowserRouter>
        <Routes>
          {/* All routes inside UserLayout get the Navbar and Footer */}
          <Route path="/" element={<UserLayout />}>
            <Route index element={<Home />} />
            <Route path="products" element={<ProductListing />} />
            {/* The :id allows dynamic routing for individual products */}
            <Route path="product/:id" element={<ProductDetail />} />
          </Route>
        </Routes>
      </BrowserRouter>
      
      <AuthModal/>
    </div>
  );
};

export default App;