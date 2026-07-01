import React, { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { FaSearch, FaCameraRetro, FaMicrophoneAlt, FaCartPlus, FaStar, FaUser, FaHeart } from "react-icons/fa";
import brandLogo from '../../assets/VJ Logo.png';
import CartDrawer from '../cart/CartDrawer';
import useCartStore from '../../store/useCartStore';
import useAuthStore from '../../store/useAuthStore';

const categories = [
  { name: 'All Jewellery', slug: 'all-jewellery', items: [{ label: 'New Arrivals', slug: 'new-arrivals' }, { label: 'Best Sellers', slug: 'best-sellers' }, { label: 'Gift Finder', slug: 'gift-finder' }] },
  { name: 'Gold', slug: 'gold', items: [{ label: 'Gold Rings', slug: 'gold-rings' }, { label: 'Gold Chains', slug: 'gold-chains' }, { label: 'Gold Bangles', slug: 'gold-bangles' }, { label: 'Gold Earrings', slug: 'gold-earrings' }] },
  { name: 'Diamond', slug: 'diamond', items: [{ label: 'Diamond Rings', slug: 'diamond-rings' }, { label: 'Diamond Earrings', slug: 'diamond-earrings' }, { label: 'Diamond Pendants', slug: 'diamond-pendants' }] },
  { name: 'Earrings', slug: 'earrings', items: [{ label: 'Studs', slug: 'studs' }, { label: 'Hoops', slug: 'hoops' }, { label: 'Jhumkas', slug: 'jhumkas' }, { label: 'Drop Earrings', slug: 'drop-earrings' }] },
  { name: 'Rings', slug: 'rings', items: [{ label: 'Engagement Rings', slug: 'engagement-rings' }, { label: 'Couple Rings', slug: 'couple-rings' }, { label: 'Cocktail Rings', slug: 'cocktail-rings' }] },
  { name: 'Daily Wear', slug: 'daily-wear', items: [{ label: 'Lightweight Gold', slug: 'lightweight-gold' }, { label: 'Minimal Studs', slug: 'minimal-studs' }, { label: 'Everyday Chains', slug: 'everyday-chains' }] },
  { name: 'Wedding', slug: 'wedding', items: [{ label: 'Bridal Sets', slug: 'bridal-sets' }, { label: 'Mangalsutra', slug: 'mangalsutra' }, { label: 'Wedding Bands', slug: 'wedding-bands' }] },
  { name: 'Gifting', slug: 'gifting', items: [{ label: 'Under ₹10,000', slug: 'under-10000' }, { label: 'Anniversary Gifts', slug: 'anniversary-gifts' }, { label: 'Gift Cards', slug: 'gift-cards' }] },
];

const Header = () => {
  const [cartOpen, setCartOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState(null);
  const leaveTimer = useRef(null);
  const totalItems = useCartStore((s) => s.totalItems());
  const { openAuthModal, isAuthenticated, user } = useAuthStore();

  const handleMouseEnter = (catName) => {
    clearTimeout(leaveTimer.current);
    setActiveCategory(catName);
  };

  const handleMouseLeave = () => {
    leaveTimer.current = setTimeout(() => setActiveCategory(null), 150);
  };

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50">

      {/* Top Utility Bar */}
      <div className="container mx-auto px-6 py-4 flex items-center justify-between">

        <Link to="/" className="flex items-center flex-shrink-0">
          <img className="h-14 w-36 object-contain object-left" src={brandLogo} alt="Vikas Jewellers" />
        </Link>

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

          {/* Wishlist */}
          <Link to="/profile" className="hover:text-[#832729] transition-colors">
            <FaHeart className="w-5 h-5" />
          </Link>

          {/* Profile */}
          {isAuthenticated ? (
            <Link to="/profile" className="hover:text-[#832729] transition-colors">
              <FaUser className="w-5 h-5" />
              <span className="text-xs font-medium hidden md:block">
                {user?.name ? user.name.split(' ')[0] : 'Profile'}
              </span>
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

      {/* Category Nav */}
      <nav className="border-t border-gray-100 relative">
        <div className="container mx-auto px-6 py-3">
          <ul className="flex items-center justify-center gap-10 text-[15px] font-medium text-gray-700 whitespace-nowrap overflow-x-auto">
            {categories.map((cat) => (
              <li
                key={cat.name}
                onMouseEnter={() => handleMouseEnter(cat.name)}
                onMouseLeave={handleMouseLeave}
                className="relative"
              >
                <Link
                  to={cat.slug === 'all-jewellery' ? '/products' : `/products?category=${cat.slug}`}
                  className={`hover:text-[#832729] cursor-pointer transition-colors ${activeCategory === cat.name ? 'text-[#832729]' : ''}`}
                >
                  {cat.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Dropdown — also has mouse handlers to keep it open */}
        {activeCategory && (
          <div
            onMouseEnter={() => handleMouseEnter(activeCategory)}
            onMouseLeave={handleMouseLeave}
            className="absolute left-0 right-0 top-full bg-white border-t border-gray-100 shadow-lg z-40"
          >
            <div className="container mx-auto px-6 py-6 flex justify-center gap-12 flex-wrap">
              {categories
                .find((c) => c.name === activeCategory)
                ?.items.map((sub) => (
                  <Link
                    key={sub.slug}
                    to={`/products?category=${categories.find(c => c.name === activeCategory)?.slug}&sub=${sub.slug}`}
                    className="text-sm text-gray-600 hover:text-[#832729] transition-colors"
                    onClick={() => setActiveCategory(null)}
                  >
                    {sub.label}
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