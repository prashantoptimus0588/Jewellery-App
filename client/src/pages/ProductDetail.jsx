// src/pages/ProductDetail.jsx
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { FaRegHeart, FaHeart, FaTruck, FaShield, FaCertificate } from 'react-icons/fa6';
import { fetchProductBySlug } from '../services/productService';
import useCartStore from '../store/useCartStore';
import useWishlistStore from '../store/useWishlistStore';
import useAuthStore from '../store/useAuthStore';


const ProductDetail = () => {
  const { slug } = useParams(); // route is /product/:id but we pass slug
  const addItem = useCartStore((s) => s.addItem);

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [mainImage, setMainImage] = useState('');
  const { ids: wishlistIds, toggle: toggleWishlist } = useWishlistStore();
  const { isAuthenticated } = useAuthStore();
  const [ringSize, setRingSize] = useState('12');

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setError('');
      try {
        const data = await fetchProductBySlug(slug);
        setProduct(data.product);
        setMainImage(data.product.images[0]?.url || '');
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [slug]);

  if (loading) return (
    <div className="container mx-auto px-6 py-8 animate-pulse">
      <div className="flex flex-col lg:flex-row gap-12">
        <div className="w-full lg:w-1/2 bg-gray-100 rounded-sm h-[480px]" />
        <div className="w-full lg:w-1/2 flex flex-col gap-4">
          <div className="h-8 bg-gray-100 rounded w-2/3" />
          <div className="h-4 bg-gray-100 rounded w-full" />
          <div className="h-4 bg-gray-100 rounded w-3/4" />
          <div className="h-10 bg-gray-100 rounded w-1/3 mt-4" />
        </div>
      </div>
    </div>
  );

  if (error) return (
    <div className="container mx-auto px-6 py-24 text-center">
      <p className="text-red-400 mb-4">{error}</p>
      <Link to="/products" className="text-[#832729] underline text-sm">Back to Products</Link>
    </div>
  );

  if (!product) return null;

  const breadcrumbCategory = product.category?.parent?.name || product.category?.name;
  const breadcrumbSlug = product.category?.parent?.slug || product.category?.slug;

  return (
    <div className="container mx-auto px-6 py-8">

      {/* Breadcrumbs */}
      <div className="text-sm text-gray-500 mb-8 font-medium">
        <Link to="/" className="hover:text-[#832729]">Home</Link>
        <span className="mx-2">&gt;</span>
        <Link to={`/products?category=${breadcrumbSlug}`} className="hover:text-[#832729]">
          {breadcrumbCategory}
        </Link>
        <span className="mx-2">&gt;</span>
        <span className="text-[#832729]">{product.name}</span>
      </div>

      <div className="flex flex-col lg:flex-row gap-12">

        {/* LEFT: Image Gallery */}
        <div className="w-full lg:w-1/2 flex flex-col-reverse md:flex-row gap-4">
          <div className="flex md:flex-col gap-3 overflow-x-auto md:overflow-visible">
            {product.images.map((img) => (
              <button
                key={img.id}
                onClick={() => setMainImage(img.url)}
                className={`w-20 h-20 flex-shrink-0 border-2 rounded-sm overflow-hidden transition-all ${
                  mainImage === img.url ? 'border-[#832729]' : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <img src={img.url} alt="" className="w-full h-full object-cover" />
              </button>
            ))}
          </div>

          <div className="flex-grow bg-[#f9f9f9] rounded-sm relative h-[480px]">
            <button
              onClick={() => toggleWishlist(product.id, isAuthenticated)}
              className="absolute top-4 right-4 z-10 p-2 bg-white rounded-full shadow-sm text-gray-400 hover:text-[#832729] transition-colors"
            >
              {wishlistIds.includes(product.id)
                ? <FaHeart className="w-5 h-5 text-[#832729]" />
                : <FaRegHeart className="w-5 h-5" />}
            </button>
            <img src={mainImage} alt={product.name} className="w-full h-full object-cover rounded-sm" />
          </div>
        </div>

        {/* RIGHT: Product Info */}
        <div className="w-full lg:w-1/2 flex flex-col">

          <h1 className="text-3xl md:text-4xl font-serif text-gray-900 mb-4">{product.name}</h1>
          <p className="text-gray-500 mb-6 leading-relaxed">{product.description}</p>
          <div className="text-3xl font-semibold text-gray-900 mb-6">
            ₹ {product.price.toLocaleString('en-IN')}
          </div>

          <div className="flex flex-col gap-6 mb-8 border-t border-b border-gray-200 py-6">
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
                    className={`w-12 h-12 rounded-sm border text-sm transition-all ${
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

            <div className="grid grid-cols-2 gap-4 text-sm bg-gray-50 p-4 rounded-sm">
              {product.purity && (
                <div>
                  <span className="text-gray-500 block">Purity</span>
                  <span className="font-semibold text-gray-800">{product.purity}</span>
                </div>
              )}
              {product.weight && (
                <div>
                  <span className="text-gray-500 block">Gross Weight</span>
                  <span className="font-semibold text-gray-800">{product.weight}</span>
                </div>
              )}
            </div>
          </div>

          <div className="flex gap-4 mb-10">
            <button
              onClick={() => addItem({
                id: product.id,
                name: product.name,
                price: product.price,
                image: mainImage,
                size: ringSize,
              })}
              className="flex-1 bg-white text-[#832729] border border-[#832729] font-medium py-4 rounded-sm hover:bg-[#832729]/5 transition-colors"
            >
              Add to Cart
            </button>
            <button className="flex-1 bg-[#832729] text-white font-medium py-4 rounded-sm hover:bg-[#6a1f21] transition-colors shadow-lg shadow-[#832729]/30">
              Buy Now
            </button>
          </div>

          <div className="grid grid-cols-3 gap-4 border-t border-gray-200 pt-8">
            <div className="flex flex-col items-center text-center gap-2 text-gray-600">
              <FaCertificate className="w-7 h-7 text-[#832729]/80" />
              <span className="text-xs font-medium">100% Certified<br />Jewellery</span>
            </div>
            <div className="flex flex-col items-center text-center gap-2 text-gray-600 border-x border-gray-200">
              <FaShield className="w-7 h-7 text-[#832729]/80" />
              <span className="text-xs font-medium">Lifetime<br />Exchange</span>
            </div>
            <div className="flex flex-col items-center text-center gap-2 text-gray-600">
              <FaTruck className="w-7 h-7 text-[#832729]/80" />
              <span className="text-xs font-medium">Free Insured<br />Shipping</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;