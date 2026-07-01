// src/pages/ProductListing.jsx
import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { FaRegHeart, FaHeart, FaChevronDown, FaFilter } from 'react-icons/fa6';
import { fetchProducts } from '../services/productService';

const ProductListing = () => {
  const [searchParams] = useSearchParams();
  const category = searchParams.get('category') || '';
  const sub = searchParams.get('sub') || '';

  const [products, setProducts] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [wishlist, setWishlist] = useState([]);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setError('');
      try {
        const data = await fetchProducts({ category, sub });
        setProducts(data.products);
        setTotal(data.total);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [category, sub]);

  const toggleWishlist = (id) =>
    setWishlist((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );

  const pageTitle = sub || category || 'All Jewellery';

  return (
    <div className="container mx-auto px-6 py-8">

      {/* Breadcrumbs */}
      <div className="text-sm text-gray-500 mb-6 font-medium">
        <Link to="/" className="hover:text-[#832729]">Home</Link>
        <span className="mx-2">&gt;</span>
        {category && !sub && <span className="text-[#832729] capitalize">{category}</span>}
        {sub && (
          <>
            <Link to={`/products?category=${category}`} className="hover:text-[#832729] capitalize">{category}</Link>
            <span className="mx-2">&gt;</span>
            <span className="text-[#832729] capitalize">{sub}</span>
          </>
        )}
        {!category && !sub && <span className="text-[#832729]">All Jewellery</span>}
      </div>

      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
        <h1 className="text-3xl font-serif text-gray-900 capitalize">
          {pageTitle}{' '}
          <span className="text-lg text-gray-500 font-sans font-normal">
            ({total} results)
          </span>
        </h1>
        <div className="flex items-center gap-4 w-full md:w-auto justify-between">
          <button
            className="md:hidden flex items-center gap-2 border border-gray-300 px-4 py-2 rounded-md text-sm font-medium"
            onClick={() => setShowFilters(!showFilters)}
          >
            <FaFilter /> Filter
          </button>
          <div className="flex items-center gap-2 text-sm border border-gray-300 px-4 py-2 rounded-full cursor-pointer hover:border-[#832729] transition-colors">
            <span className="text-gray-500">Sort By:</span>
            <span className="font-semibold text-gray-900">Best Matches</span>
            <FaChevronDown className="text-gray-400 ml-1" />
          </div>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-10">

        {/* Sidebar Filters */}
        <aside className={`w-full md:w-1/4 lg:w-1/5 ${showFilters ? 'block' : 'hidden md:block'}`}>
          <div className="border-b border-gray-200 pb-6 mb-6">
            <h3 className="font-serif text-lg mb-4 text-gray-800">Price</h3>
            <div className="space-y-3 text-sm text-gray-600">
              {['Under ₹ 25,000', '₹ 25,000 - ₹ 50,000', '₹ 50,000 - ₹ 1,00,000', 'Over ₹ 1,00,000'].map((label) => (
                <label key={label} className="flex items-center gap-3 cursor-pointer">
                  <input type="checkbox" className="w-4 h-4 accent-[#832729]" />
                  {label}
                </label>
              ))}
            </div>
          </div>

          <div className="border-b border-gray-200 pb-6 mb-6">
            <h3 className="font-serif text-lg mb-4 text-gray-800">Category</h3>
            <div className="space-y-3 text-sm text-gray-600">
              {['Rings', 'Earrings', 'Necklaces', 'Bangles', 'Pendants'].map((cat) => (
                <label key={cat} className="flex items-center gap-3 cursor-pointer">
                  <input type="checkbox" className="w-4 h-4 accent-[#832729]" />
                  {cat}
                </label>
              ))}
            </div>
          </div>

          <div className="pb-6">
            <h3 className="font-serif text-lg mb-4 text-gray-800">Metal</h3>
            <div className="space-y-3 text-sm text-gray-600">
              {['Yellow Gold', 'Rose Gold', 'White Gold', 'Platinum'].map((metal) => (
                <label key={metal} className="flex items-center gap-3 cursor-pointer">
                  <input type="checkbox" className="w-4 h-4 accent-[#832729]" />
                  {metal}
                </label>
              ))}
            </div>
          </div>
        </aside>

        {/* Product Grid */}
        <main className="w-full md:w-3/4 lg:w-4/5">

          {loading && (
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="animate-pulse">
                  <div className="bg-gray-100 rounded-sm aspect-square mb-3" />
                  <div className="h-4 bg-gray-100 rounded mb-2 w-3/4" />
                  <div className="h-3 bg-gray-100 rounded w-1/2" />
                </div>
              ))}
            </div>
          )}

          {error && (
            <p className="text-red-500 text-sm">{error}</p>
          )}

          {!loading && !error && products.length === 0 && (
            <p className="text-gray-400 font-serif text-lg">No products found.</p>
          )}

          {!loading && !error && products.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.map((product) => (
                <Link
                  to={`/product/${product.slug}`}
                  key={product.id}
                  className="group flex flex-col cursor-pointer"
                >
                  <div className="relative bg-[#f9f9f9] rounded-sm aspect-square overflow-hidden mb-4">
                    <button
                      onClick={(e) => { e.preventDefault(); e.stopPropagation(); toggleWishlist(product.id); }}
                      className="absolute top-4 right-4 z-10 text-gray-400 hover:text-[#832729] transition-colors"
                    >
                      {wishlist.includes(product.id)
                        ? <FaHeart className="w-5 h-5 text-[#832729]" />
                        : <FaRegHeart className="w-5 h-5" />}
                    </button>
                    <img
                      src={product.images[0]?.url}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                  <div className="flex flex-col flex-grow">
                    <h3 className="font-serif text-lg text-gray-800 mb-2 truncate">{product.name}</h3>
                    <div className="flex items-center gap-3">
                      <span className="font-semibold text-gray-900">
                        ₹ {product.price.toLocaleString('en-IN')}
                      </span>
                      {product.tag && (
                        <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-sm ${
                          product.tag.includes('left')
                            ? 'text-red-600 bg-red-50'
                            : 'text-[#832729] bg-[#832729]/10'
                        }`}>
                          {product.tag}
                        </span>
                      )}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default ProductListing;