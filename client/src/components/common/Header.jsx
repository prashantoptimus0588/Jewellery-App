import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaCartPlus, FaUser, FaHeart, FaBars, FaTimes, FaSearch } from "react-icons/fa";
import brandLogo from '../../assets/VJ Logo.png';
import CartDrawer from '../cart/CartDrawer';
import useCartStore from '../../store/useCartStore';
import useAuthStore from '../../store/useAuthStore';
import useWishlistStore from '../../store/useWishlistStore';
import SearchBar from './SearchBar';

const categories = [
  { name: 'All Jewellery', slug: 'all-jewellery' },
  { name: 'Gold', slug: 'gold' },
  { name: 'Diamond', slug: 'diamond' },
  { name: 'Earrings', slug: 'earrings' },
  { name: 'Rings', slug: 'rings' },
  { name: 'Daily Wear', slug: 'daily-wear' },
  { name: 'Wedding', slug: 'wedding' },
  { name: 'Gifting', slug: 'gifting' },
];

const Header = () => {
  const [cartOpen, setCartOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);

  const totalItems = useCartStore((s) => s.totalItems());
  const { openAuthModal, isAuthenticated } = useAuthStore();
  const { ids: wishlistIds } = useWishlistStore();

  const categoryPath = (cat) =>
    cat.slug === 'all-jewellery' ? '/products' : `/products?category=${cat.slug}`;

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
      {/* Top Utility Bar */}
      <div className="container mx-auto px-4 md:px-6 py-3 md:py-4 flex items-center justify-between gap-3">

        {/* Hamburger — mobile only */}
        <button
          className="md:hidden text-gray-700 p-1 -ml-1"
          onClick={() => setMobileMenuOpen(true)}
          aria-label="Open menu"
        >
          <FaBars className="w-5 h-5" />
        </button>

        <Link to="/" className="flex items-center flex-shrink-0">
          <img className="h-10 md:h-14 w-auto max-w-[140px] object-contain" src={brandLogo} alt="Vikas Jewellers" />
        </Link>

        {/* Search — desktop inline */}
        <div className="hidden md:flex flex-1 max-w-2xl mx-8">
          <SearchBar />
        </div>

        {/* Action Icons */}
        <div className="flex items-center gap-4 md:gap-6 text-gray-600">

          {/* Search — mobile toggle */}
          <button
            className="md:hidden hover:text-[#832729] transition-colors"
            onClick={() => setMobileSearchOpen((v) => !v)}
            aria-label="Search"
          >
            <FaSearch className="w-[18px] h-[18px]" />
          </button>

          {/* Wishlist */}
          <Link to="/profile" className="relative hover:text-[#832729] transition-colors">
            <FaHeart className="w-5 h-5" />
            {wishlistIds.length > 0 && (
              <span className="absolute -top-2 -right-2 bg-[#832729] text-white text-[10px] font-bold h-4 w-4 rounded-full flex items-center justify-center">
                {wishlistIds.length}
              </span>
            )}
          </Link>

          {/* Profile */}
          {isAuthenticated ? (
            <Link to="/profile" className="hover:text-[#832729] transition-colors">
              <FaUser className="w-5 h-5" />
            </Link>
          ) : (
            <button onClick={openAuthModal} className="hover:text-[#832729] transition-colors">
              <FaUser className="w-5 h-5" />
            </button>
          )}

          {/* Cart */}
          <button onClick={() => setCartOpen(true)} className="relative hover:text-[#832729] transition-colors">
            <FaCartPlus className="w-5 h-5" />
            {totalItems > 0 && (
              <span className="absolute -top-2 -right-2 bg-[#832729] text-white text-[10px] font-bold h-4 w-4 rounded-full flex items-center justify-center">
                {totalItems}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Mobile search bar — expands under top row */}
      {mobileSearchOpen && (
        <div className="md:hidden px-4 pb-3">
          <SearchBar />
        </div>
      )}

      {/* Category Nav — desktop only, plain links, no hover dropdown */}
      <nav className="hidden md:block border-t border-gray-100">
        <div className="container mx-auto px-6 py-3">
          <ul className="flex items-center justify-center gap-10 text-[15px] font-medium text-gray-700 whitespace-nowrap overflow-x-auto">
            {categories.map((cat) => (
              <li key={cat.name}>
                <Link
                  to={categoryPath(cat)}
                  className="hover:text-[#832729] transition-colors"
                >
                  {cat.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </nav>

      {/* Mobile slide-out menu */}
      {mobileMenuOpen && (
        <div className="md:hidden fixed inset-0 z-[60]">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => setMobileMenuOpen(false)}
          />
          {/* Panel */}
          <div className="absolute left-0 top-0 h-full w-[80%] max-w-xs bg-white shadow-xl flex flex-col">
            <div className="flex items-center justify-between px-4 py-4 border-b border-gray-100">
              <img className="h-9 w-auto object-contain" src={brandLogo} alt="Vikas Jewellers" />
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="text-gray-500 p-1"
                aria-label="Close menu"
              >
                <FaTimes className="w-5 h-5" />
              </button>
            </div>
            <ul className="flex-1 overflow-y-auto py-2">
              {categories.map((cat) => (
                <li key={cat.name}>
                  <Link
                    to={categoryPath(cat)}
                    onClick={() => setMobileMenuOpen(false)}
                    className="block px-5 py-3 text-[15px] font-medium text-gray-700 hover:text-[#832729] hover:bg-gray-50 transition-colors"
                  >
                    {cat.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}

      <CartDrawer isOpen={cartOpen} onClose={() => setCartOpen(false)} />
    </header>
  );
};

export default Header;