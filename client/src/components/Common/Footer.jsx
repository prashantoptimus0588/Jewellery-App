// src/components/common/Footer.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import {
  FaGooglePlay,
  FaApple,
  FaWhatsapp,
  FaEnvelope,
  FaComments,
  FaInstagram,
  FaFacebookF,
  FaCcVisa,
  FaCcPaypal,
  FaCcAmex,
} from 'react-icons/fa6';
import { MdOutlineQrCodeScanner } from 'react-icons/md';

const Footer = () => {
  return (
    <footer className="bg-[#2a1314] text-[#f9f5f0] pt-16 pb-8 border-t-[8px] border-[#832729]">
      <div className="container mx-auto px-6">

        {/* Top Section */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 lg:gap-8 mb-12">

          {/* Column 1: Brand */}
          <div className="flex flex-col items-center md:items-start text-center md:text-left">
            <Link to="/" className="text-4xl font-serif tracking-widest mb-4">
              Vikas Jewellers
            </Link>
            <p className="text-sm text-gray-300 mb-6 leading-relaxed">
              Crafting timeless jewellery since 1985. BIS Hallmarked gold & certified diamonds delivered to your doorstep.
            </p>
            <p className="text-sm font-serif mb-4">Download the App</p>
            <div className="flex gap-3">
              <button className="bg-[#3d2627] hover:bg-[#4d3637] transition-colors rounded-md px-3 py-2 flex items-center gap-2 text-xs border border-white/10">
                <FaGooglePlay className="w-5 h-5" />
                <div className="text-left">
                  <div className="text-[9px] text-gray-300">Get it on</div>
                  <div className="font-semibold">Play Store</div>
                </div>
              </button>
              <button className="bg-[#3d2627] hover:bg-[#4d3637] transition-colors rounded-md px-3 py-2 flex items-center gap-2 text-xs border border-white/10">
                <FaApple className="w-5 h-5" />
                <div className="text-left">
                  <div className="text-[9px] text-gray-300">Download on the</div>
                  <div className="font-semibold">App Store</div>
                </div>
              </button>
            </div>
          </div>

          {/* Column 2: Shop */}
          <div>
            <h3 className="text-xl font-serif mb-6">Shop</h3>
            <ul className="space-y-4 text-sm text-gray-300">
              <li><Link to="/products?category=gold" className="hover:text-white transition-colors">Gold Jewellery</Link></li>
              <li><Link to="/products?category=diamond" className="hover:text-white transition-colors">Diamond Jewellery</Link></li>
              <li><Link to="/products?category=rings" className="hover:text-white transition-colors">Rings</Link></li>
              <li><Link to="/products?category=earrings" className="hover:text-white transition-colors">Earrings</Link></li>
              <li><Link to="/products?category=wedding" className="hover:text-white transition-colors">Wedding Collection</Link></li>
              <li><Link to="/products?category=gifting" className="hover:text-white transition-colors">Gifting</Link></li>
            </ul>
          </div>

          {/* Column 3: Account & Help */}
          <div>
            <h3 className="text-xl font-serif mb-6">My Account</h3>
            <ul className="space-y-4 text-sm text-gray-300">
              <li><Link to="/profile" className="hover:text-white transition-colors">My Profile</Link></li>
              <li><Link to="/orders" className="hover:text-white transition-colors">My Orders</Link></li>
              <li><Link to="/profile" className="hover:text-white transition-colors">Wishlist</Link></li>
              <li><Link to="/checkout" className="hover:text-white transition-colors">Checkout</Link></li>
            </ul>

            <h3 className="text-xl font-serif mb-4 mt-8">Help</h3>
            <ul className="space-y-4 text-sm text-gray-300">
              <li><span className="cursor-pointer hover:text-white transition-colors">FAQs</span></li>
              <li><span className="cursor-pointer hover:text-white transition-colors">Track Order</span></li>
              <li><span className="cursor-pointer hover:text-white transition-colors">Returns & Exchange</span></li>
            </ul>
          </div>

          {/* Column 4: Contact */}
          <div>
            <h3 className="text-xl font-serif mb-4">Contact Us</h3>
            <p className="text-sm text-gray-300 mb-1">📍 123, Jewellers Lane, Jaipur, Rajasthan</p>
            <p className="text-sm text-gray-300 mb-6">📞 +91 98765 43210</p>

            <h3 className="text-xl font-serif mb-4">Chat With Us</h3>
            <p className="text-sm text-gray-300 mb-4">Available 9AM – 9PM, Mon–Sat</p>

            <div className="flex gap-5 border-b border-white/20 pb-6">
              <a href="https://wa.me/919876543210" target="_blank" rel="noreferrer" className="hover:text-green-400 transition-colors">
                <FaWhatsapp className="w-6 h-6" />
              </a>
              <a href="mailto:support@vikasjewellers.com" className="hover:text-gray-300 transition-colors">
                <FaEnvelope className="w-6 h-6" />
              </a>
              <button className="hover:text-gray-300 transition-colors">
                <FaComments className="w-6 h-6" />
              </button>
            </div>
          </div>
        </div>

        {/* Middle: Social & Payment */}
        <div className="border-b border-white/20 pb-8 mb-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">

            <div className="flex items-center gap-4">
              <span className="text-lg font-serif mr-2">Follow Us</span>
              <div className="flex gap-3">
                <a href="https://instagram.com" target="_blank" rel="noreferrer"
                  className="w-9 h-9 rounded-full border border-white/30 flex items-center justify-center hover:bg-white/10 hover:border-white transition-all">
                  <FaInstagram className="w-4 h-4" />
                </a>
                <a href="https://wa.me/919876543210" target="_blank" rel="noreferrer"
                  className="w-9 h-9 rounded-full border border-white/30 flex items-center justify-center hover:bg-white/10 hover:border-white transition-all">
                  <FaWhatsapp className="w-4 h-4" />
                </a>
                <a href="https://facebook.com" target="_blank" rel="noreferrer"
                  className="w-9 h-9 rounded-full border border-white/30 flex items-center justify-center hover:bg-white/10 hover:border-white transition-all">
                  <FaFacebookF className="w-4 h-4" />
                </a>
              </div>
            </div>

            <div className="flex items-center gap-3 opacity-80">
              <span className="text-xs text-gray-400 mr-1">We Accept</span>
              <MdOutlineQrCodeScanner className="w-9 h-9 text-white" title="UPI" />
              <FaCcVisa className="w-10 h-10 text-white" />
              <FaCcAmex className="w-10 h-10 text-white" />
              <FaCcPaypal className="w-10 h-10 text-[#003087] bg-white rounded-sm px-1" />
            </div>
          </div>
        </div>

        {/* Bottom: Copyright */}
        <div className="flex flex-col md:flex-row justify-between items-center text-xs text-gray-400">
          <p>© 2026 Vikas Jewellers. All Rights Reserved.</p>
          <div className="flex gap-4 mt-4 md:mt-0">
            <span className="cursor-pointer hover:text-white transition-colors">Terms & Conditions</span>
            <span className="cursor-pointer hover:text-white transition-colors">Privacy Policy</span>
            <span className="cursor-pointer hover:text-white transition-colors">Disclaimer</span>
          </div>
        </div>

      </div>
    </footer>
  );
};

export default Footer;