import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { FaRegHeart, FaHeart, FaTruck, FaShieldAlt, FaCertificate } from 'react-icons/fa';

const ProductDetail = () => {
  const { id } = useParams(); // Gets the product ID from the URL

  // --- Dummy Data for a Single Product ---
  const product = {
    name: "Bloom Bud Gold Ring",
    price: 66174,
    description: "Inspired by the first bloom of spring, this exquisite ring is crafted in 22 Karat Yellow Gold. Intricate petal details surround a brilliant center, making it a perfect statement piece for special occasions.",
    purity: "22 Karat",
    weight: "4.50 g",
    images: [
      "https://images.unsplash.com/photo-1605100804763-247f67b2548e?q=80&w=2070&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1603561591411-07eea52f1e26?q=80&w=2070&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1599643477877-530eb83abc8e?q=80&w=2070&auto=format&fit=crop"
    ]
  };

  // State for interactivity
  const [mainImage, setMainImage] = useState(product.images[0]);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [ringSize, setRingSize] = useState('12');

  return (
    <div className="container mx-auto px-6 py-8">
      
      {/* --- Breadcrumbs --- */}
      <div className="text-sm text-gray-500 mb-8 font-medium">
        <Link to="/" className="hover:text-[#832729]">Home</Link>
        <span className="mx-2">&gt;</span>
        <Link to="/products" className="hover:text-[#832729]">Rings</Link>
        <span className="mx-2">&gt;</span>
        <span className="text-[#832729]">{product.name}</span>
      </div>

      <div className="flex flex-col lg:flex-row gap-12">
        
        {/* --- LEFT: Image Gallery --- */}
        <div className="w-full lg:w-1/2 flex flex-col-reverse md:flex-row gap-4">
          
          {/* Thumbnail Strip */}
          <div className="flex md:flex-col gap-4 overflow-x-auto md:overflow-visible">
            {product.images.map((img, index) => (
              <button 
                key={index}
                onClick={() => setMainImage(img)}
                className={`w-20 h-20 flex-shrink-0 border-2 rounded-sm overflow-hidden ${
                  mainImage === img ? 'border-[#832729]' : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <img src={img} alt={`Thumbnail ${index + 1}`} className="w-full h-full object-cover" />
              </button>
            ))}
          </div>

          {/* Main Hero Image */}
          <div className="flex-grow bg-[#f9f9f9] rounded-sm relative aspect-square flex items-center justify-center p-8">
            <button 
              onClick={() => setIsWishlisted(!isWishlisted)}
              className="absolute top-6 right-6 z-10 p-2 bg-white rounded-full shadow-sm text-gray-400 hover:text-[#832729] transition-colors"
            >
              {isWishlisted ? <FaHeart className="w-6 h-6 text-[#832729]" /> : <FaRegHeart className="w-6 h-6" />}
            </button>
            <img src={mainImage} alt={product.name} className="w-full h-full object-contain" />
          </div>
        </div>

        {/* --- RIGHT: Product Information --- */}
        <div className="w-full lg:w-1/2 flex flex-col">
          
          <h1 className="text-3xl md:text-4xl font-serif text-gray-900 mb-4">
            {product.name}
          </h1>
          
          <p className="text-gray-600 mb-6 leading-relaxed">
            {product.description}
          </p>

          <div className="text-3xl font-semibold text-gray-900 mb-6">
            ₹ {product.price.toLocaleString('en-IN')}
          </div>

          {/* Configuration Options */}
          <div className="flex flex-col gap-6 mb-8 border-t border-b border-gray-200 py-6">
            
            {/* Ring Size Selector */}
            <div>
              <div className="flex justify-between items-center mb-3">
                <span className="font-serif text-gray-800">Select Size</span>
                <button className="text-sm text-[#832729] underline font-medium">Size Guide</button>
              </div>
              <div className="flex gap-3 flex-wrap">
                {['10', '11', '12', '13', '14'].map((size) => (
                  <button 
                    key={size}
                    onClick={() => setRingSize(size)}
                    className={`w-12 h-12 rounded-sm border flex items-center justify-center text-sm transition-all ${
                      ringSize === size 
                        ? 'border-[#832729] bg-[#832729] text-white' 
                        : 'border-gray-300 text-gray-700 hover:border-[#832729]'
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            {/* Product Specs */}
            <div className="grid grid-cols-2 gap-4 text-sm bg-gray-50 p-4 rounded-sm">
              <div>
                <span className="text-gray-500 block">Purity</span>
                <span className="font-semibold text-gray-800">{product.purity}</span>
              </div>
              <div>
                <span className="text-gray-500 block">Gross Weight</span>
                <span className="font-semibold text-gray-800">{product.weight}</span>
              </div>
            </div>
          </div>

          {/* Call to Action Buttons */}
          <div className="flex gap-4 mb-10">
            <button className="flex-1 bg-white text-[#832729] border border-[#832729] font-medium py-4 rounded-sm hover:bg-[#832729]/5 transition-colors">
              Add to Cart
            </button>
            <button className="flex-1 bg-[#832729] text-white border border-[#832729] font-medium py-4 rounded-sm hover:bg-[#6a1f21] transition-colors shadow-lg shadow-[#832729]/30">
              Buy Now
            </button>
          </div>

          {/* Trust Badges */}
          <div className="grid grid-cols-3 gap-4 border-t border-gray-200 pt-8">
            <div className="flex flex-col items-center text-center gap-2 text-gray-600">
              <FaCertificate className="w-8 h-8 text-[#832729]/80" />
              <span className="text-xs font-medium">100% Certified <br/>Jewellery</span>
            </div>
            <div className="flex flex-col items-center text-center gap-2 text-gray-600 border-l border-r border-gray-200">
              <FaShieldAlt className="w-8 h-8 text-[#832729]/80" />
              <span className="text-xs font-medium">Lifetime <br/>Exchange</span>
            </div>
            <div className="flex flex-col items-center text-center gap-2 text-gray-600">
              <FaTruck className="w-8 h-8 text-[#832729]/80" />
              <span className="text-xs font-medium">Free Insured <br/>Shipping</span>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default ProductDetail;