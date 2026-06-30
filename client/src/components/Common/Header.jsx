import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaSearch, FaCameraRetro, FaMicrophoneAlt, FaCartPlus, FaStar, FaUser, FaHeart } from "react-icons/fa";
import brandLogo from '../../assets/VJ Logo.png';
import CartDrawer from '../cart/CartDrawer';
import useCartStore from '../../store/useCartStore';
import useAuthStore from '../../store/useAuthStore';

const categories = [
  {
    name: 'All Jewellery',
    items: ['New Arrivals', 'Best Sellers', 'Gift Finder'],
  },
  {
    name: 'Gold',
    items: ['Gold Rings', 'Gold Chains', 'Gold Bangles', 'Gold Earrings'],
  },
  {
    name: 'Diamond',
    items: ['Diamond Rings', 'Diamond Earrings', 'Diamond Pendants'],
  },
  {
    name: 'Earrings',
    items: ['Studs', 'Hoops', 'Jhumkas', 'Drop Earrings'],
  },
  {
    name: 'Rings',
    items: ['Engagement Rings', 'Couple Rings', 'Cocktail Rings'],
  },
  {
    name: 'Daily Wear',
    items: ['Lightweight Gold', 'Minimal Studs', 'Everyday Chains'],
  },
  {
    name: 'Wedding',
    items: ['Bridal Sets', 'Mangalsutra', 'Wedding Bands'],
  },
  {
    name: 'Gifting',
    items: ['Under ₹10,000', 'Anniversary Gifts', 'Gift Cards'],
  },
];

const Header = () => {
  const [cartOpen, setCartOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState(null);
  const totalItems = useCartStore((s) => s.totalItems());
  const { openAuthModal, isAuthenticated, user } = useAuthStore();

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50">

      {/* Top Utility Bar */}
      <div className="container mx-auto px-6 py-4 flex items-center justify-between">

        {/* Brand Logo */}
        <Link to="/" className="flex items-center flex-shrink-0">
          <img
            className="h-14 w-36 object-contain object-left"
            src={brandLogo}
            alt="Vikas Jewellers"
          />
        </Link>

        {/* Search Bar */}
        <div className="hidden md:flex flex-1 max-w-2xl mx-8 relative items-center">
          <FaSearch className="absolute left-4 text-gray-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Search for engagement rings"
            className="w-full bg-[#F9F9F9] text-gray-700 rounded-md py-2.5 pl-11 pr-20 outline-none border border-gray-200 focus:border-[#832729] transition-all"
          />
          <div className="absolute right-4 flex gap-3 text-gray-400">
            <FaCameraRetro className="w-4 h-4 cursor-pointer hover:text-[#832729] transition-colors" />
            <FaMicrophoneAlt className="w-4 h-4 cursor-pointer hover:text-[#832729] transition-colors" />
          </div>
        </div>

        {/* Action Icons */}
        <div className="flex items-center gap-6 text-gray-600">

          <button className="hover:text-[#832729] transition-colors">
            <FaStar className="w-5 h-5" />
          </button>

          <Link to="/profile" className="hover:text-[#832729] transition-colors">
            <FaHeart className="w-5 h-5" />
          </Link>

          <button onClick={isAuthenticated ? undefined : openAuthModal} className="hover:text-[#832729] transition-colors">
            {isAuthenticated ? (
              <Link to="/profile" className="text-xs font-medium text-[#832729]">
                {user.name.split(' ')[0]}
              </Link>
            ) : (
              <FaUser className="w-5 h-5" />
            )}
          </button>

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

      {/* Category Nav with Hover Dropdown */}
      <nav
        className="container mx-auto px-6 py-3 border-t border-gray-100 overflow-x-auto relative"
        onMouseLeave={() => setActiveCategory(null)}
      >
        <ul className="flex items-center justify-center gap-10 text-[15px] font-medium text-gray-700 whitespace-nowrap">
          {categories.map((cat) => (
            <li
              key={cat.name}
              onMouseEnter={() => setActiveCategory(cat.name)}
              className="relative"
            >
              <Link
                to={`/products?category=${encodeURIComponent(cat.name)}`}
                className="hover:text-[#832729] cursor-pointer transition-colors"
              >
                {cat.name}
              </Link>
            </li>
          ))}
        </ul>

        {/* Dropdown Panel */}
        {activeCategory && (
          <div className="absolute left-0 right-0 top-full bg-white border-t border-gray-100 shadow-lg z-40">
            <div className="container mx-auto px-6 py-6 flex justify-center gap-16">
              {categories
                .find((c) => c.name === activeCategory)
                ?.items.map((sub) => (
                  <Link
                    key={sub}
                    to={`/products?category=${encodeURIComponent(activeCategory)}&sub=${encodeURIComponent(sub)}`}
                    className="text-sm text-gray-600 hover:text-[#832729] transition-colors"
                  >
                    {sub}
                  </Link>
                ))}
            </div>
          </div>
        )}
      </nav>

      <CartDrawer isOpen={cartOpen} onClose={() => setCartOpen(false)} />

    </header>
  );
};

export default Header;