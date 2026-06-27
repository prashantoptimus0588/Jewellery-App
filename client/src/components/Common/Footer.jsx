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
  FaCcAmex
} from 'react-icons/fa6'; 
// Upi icon not available so scan and pay
import { MdOutlineQrCodeScanner } from "react-icons/md";


const Footer = () => {
  return (
    <footer className="bg-[#2a1314] text-[#f9f5f0] pt-16 pb-8 border-t-[8px] border-[#832729]">
      <div className="container mx-auto px-6">
        
        {/* --- Top Section: 4 Columns --- */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 lg:gap-8 mb-12">
          
          {/* Column 1: Brand & App Download */}
          <div className="flex flex-col items-center md:items-start text-center md:text-left">
            <Link to="/" className="text-4xl font-serif tracking-widest mb-6">
              Vikas Jewellers
            </Link>
            <p className="text-lg font-serif mb-4">Download the App from here</p>
            
            {/* QR Code Placeholder */}
            <div className="bg-white p-2 rounded-md mb-6 inline-block">
              <div className="w-32 h-32 border-4 border-black border-dashed flex items-center justify-center text-black font-bold">
                QR CODE
              </div>
            </div>

            {/* App Store Buttons */}
            <div className="flex gap-3">
              <button className="bg-[#3d2627] hover:bg-[#4d3637] transition-colors rounded-md px-3 py-2 flex items-center gap-2 text-xs border border-white/10">
                <FaGooglePlay className="w-5 h-5" />
                <div className="text-left">
                  <div className="text-[9px] text-gray-300">Download on the</div>
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

          {/* Column 2: Useful Links */}
          <div>
            <h3 className="text-xl font-serif mb-6">Useful Links</h3>
            <ul className="space-y-4 text-sm text-gray-300">
              <li><Link to="/" className="hover:text-white transition-colors">Delivery Information</Link></li>
              <li><Link to="/" className="hover:text-white transition-colors">International Shipping</Link></li>
              <li><Link to="/" className="hover:text-white transition-colors">Payment Options</Link></li>
              <li><Link to="/" className="hover:text-white transition-colors">Track your Order</Link></li>
              <li><Link to="/" className="hover:text-white transition-colors">Returns</Link></li>
              <li><Link to="/" className="hover:text-white transition-colors">Find a Store</Link></li>
            </ul>
          </div>

          {/* Column 3: Information */}
          <div>
            <h3 className="text-xl font-serif mb-6">Information</h3>
            <ul className="space-y-4 text-sm text-gray-300">
              <li><Link to="/" className="hover:text-white transition-colors">Blog</Link></li>
              <li><Link to="/" className="hover:text-white transition-colors">Offers & Contest Details</Link></li>
              <li><Link to="/" className="hover:text-white transition-colors">Help & FAQs</Link></li>
              <li><Link to="/" className="hover:text-white transition-colors">About Us</Link></li>
              <li><Link to="/" className="hover:text-white transition-colors">Cookie Policy</Link></li>
            </ul>
          </div>

          {/* Column 4: Contact Us */}
          <div>
            <h3 className="text-xl font-serif mb-4">Contact Us</h3>
            <p className="text-sm text-gray-300 mb-8 tracking-wider">123-456-7890</p>
            
            <h3 className="text-xl font-serif mb-4">Chat With Us</h3>
            <p className="text-sm text-gray-300 mb-4 tracking-wider">+91 9876543210</p>
            
            <div className="flex gap-5 border-b border-white/20 pb-6">
              {/* React Icons applied here */}
              <button className="hover:text-gray-300 transition-colors">
                <FaWhatsapp className="w-6 h-6" />
              </button>
              <button className="hover:text-gray-300 transition-colors">
                <FaEnvelope className="w-6 h-6" />
              </button>
              <button className="hover:text-gray-300 transition-colors">
                <FaComments className="w-6 h-6" />
              </button>
            </div>
          </div>

        </div>

        {/* --- Middle Section: Social & Payment Icons --- */}
        <div className="border-b border-white/20 pb-8 mb-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            
            {/* Social Links using React Icons */}
            <div className="flex items-center gap-4">
              <span className="text-lg font-serif mr-2">Social</span>
              <div className="flex gap-3">
                <div className="w-9 h-9 rounded-full border border-white/30 flex items-center justify-center hover:bg-white/10 hover:border-white transition-all cursor-pointer">
                  <FaInstagram className="w-4 h-4" />
                </div>
                <div className="w-9 h-9 rounded-full border border-white/30 flex items-center justify-center hover:bg-white/10 hover:border-white transition-all cursor-pointer">
                  <FaWhatsapp className="w-4 h-4" />
                </div>
                <div className="w-9 h-9 rounded-full border border-white/30 flex items-center justify-center hover:bg-white/10 hover:border-white transition-all cursor-pointer">
                  <FaFacebookF className="w-4 h-4" />
                </div>
              </div>
            </div>

            {/* Payment Methods using React Icons */}
            <div className="flex items-center gap-3 opacity-80">
              <MdOutlineQrCodeScanner className="w-10 h-10 text-white" />
              <FaCcVisa className="w-10 h-10 text-white" />
              <FaCcPaypal className="w-10 h-10 text-[#003087] bg-white rounded-sm px-1" />
            </div>

          </div>
        </div>

        {/* --- Bottom Section: Copyright & Legal --- */}
        <div className="flex flex-col md:flex-row justify-between items-center text-xs text-gray-400">
          <p>© 2026 Vikas Jewellers. All Rights Reserved.</p>
          <div className="flex gap-4 mt-4 md:mt-0">
            <Link to="/" className="hover:text-white transition-colors">Cyber Security Policy</Link>
            <Link to="/" className="hover:text-white transition-colors">Terms & Conditions</Link>
            <Link to="/" className="hover:text-white transition-colors">Privacy Notice</Link>
            <Link to="/" className="hover:text-white transition-colors">Disclaimer</Link>
          </div>
        </div>

      </div>
    </footer>
  );
};

export default Footer;