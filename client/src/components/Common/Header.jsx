import React from 'react';
import { Link } from 'react-router-dom';
import { FaSearch,FaCameraRetro, FaMicrophoneAlt, FaCartPlus, FaStar, FaUser, FaHeart } from "react-icons/fa";
import brandLogo from '../../assets/VJ Logo.png';

const Header = () => {
  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
      {/* --- Top Utility Bar --- */}
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
        <div className="hidden md:flex flex-1 max-w-2xl mx-8 relative">
          <input 
            type="text" 
            placeholder="Search for engagement rings" 
            className="w-full bg-[#F9F9F9] text-gray-700 rounded-md py-2.5 pl-12 pr-12 outline-none border border-gray-200 focus:border-[#832729] transition-all"
          />
          {/* Search Icon */}
          <svg className="absolute left-4 top-3 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <FaSearch/>
          </svg>
          {/* Camera/Mic Icons */}
          <div className="absolute right-4 top-3 flex gap-3 text-gray-400">
            <svg className="w-5 h-5 cursor-pointer hover:text-[#832729]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <FaCameraRetro/>
            </svg>
            <svg className="w-5 h-5 cursor-pointer hover:text-[#832729]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <FaMicrophoneAlt/>
            </svg>
          </div>
        </div>

        {/* Action Icons */}
        <div className="flex items-center gap-6 text-gray-600">
          <button className="hover:text-[#832729] transition-colors flex flex-col items-center gap-1">

            {/* New items */}
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <FaStar/>
            </svg>
          </button>

          {/* WishList */}
          <button className="hover:text-[#832729] transition-colors">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <FaHeart/>
            </svg>
          </button>
          <button className="hover:text-[#832729] transition-colors">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <FaUser/>
            </svg>
          </button>
          
          {/* Cart Icon with Badge */}
          <button className="relative hover:text-[#832729] transition-colors">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <FaCartPlus/>
            </svg>
            <span className="absolute -top-2 -right-2 bg-[#832729] text-white text-[10px] font-bold h-4 w-4 rounded-full flex items-center justify-center">
              0
            </span>
          </button>
        </div>
      </div>

      {/* --- Category Navigation Bar --- */}
      <nav className="container mx-auto px-6 py-3 overflow-x-auto border-t border-gray-100">
        <ul className="flex items-center justify-center gap-10 text-[15px] font-medium text-gray-700 whitespace-nowrap">
          <li className="hover:text-[#832729] cursor-pointer transition-colors">All Jewellery</li>
          <li className="hover:text-[#832729] cursor-pointer transition-colors">Gold</li>
          <li className="hover:text-[#832729] cursor-pointer transition-colors">Diamond</li>
          <li className="hover:text-[#832729] cursor-pointer transition-colors">Earrings</li>
          <li className="hover:text-[#832729] cursor-pointer transition-colors">Rings</li>
          <li className="hover:text-[#832729] cursor-pointer transition-colors">Daily Wear</li>
          <li className="hover:text-[#832729] cursor-pointer transition-colors">Wedding</li>
          <li className="hover:text-[#832729] cursor-pointer transition-colors">Gifting</li>
        </ul>
      </nav>
    </header>
  );
};

export default Header;