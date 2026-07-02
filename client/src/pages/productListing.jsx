// src/pages/ProductListing.jsx
import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { FaRegHeart, FaHeart, FaChevronDown, FaFilter, FaXmark } from 'react-icons/fa6';
import { fetchProducts } from '../services/productService';
import useWishlistStore from '../store/useWishlistStore';
import useAuthStore from '../store/useAuthStore';

const PRICE_RANGES = [
  { label: 'Under ₹ 25,000', min: 0, max: 25000 },
  { label: '₹ 25,000 - ₹ 50,000', min: 25000, max: 50000 },
  { label: '₹ 50,000 - ₹ 1,00,000', min: 50000, max: 100000 },
  { label: 'Over ₹ 1,00,000', min: 100000, max: null },
];

const METALS = ['Yellow Gold', 'Rose Gold', 'White Gold', 'Platinum'];

const SORT_OPTIONS = [
  { label: 'Best Matches', value: 'newest' },
  { label: 'Price: Low to High', value: 'price_asc' },
  { label: 'Price: High to Low', value: 'price_desc' },
];

const ProductListing = () => {
  const [searchParams] = useSearchParams();
  const category = searchParams.get('category') || '';
  const sub = searchParams.get('sub') || '';

  const [products, setProducts] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedPrice, setSelectedPrice] = useState(null);
  const [selectedMetals, setSelectedMetals] = useState([]);
  const [sort, setSort] = useState('newest');
  const [showSortMenu, setShowSortMenu] = useState(false);

  const { ids: wishlistIds, toggle: toggleWishlist } = useWishlistStore();
  const { isAuthenticated } = useAuthStore();

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setError('');
      try {
        const priceRange = selectedPrice != null ? PRICE_RANGES[selectedPrice] : {};
        const data = await fetchProducts({
          category, sub,
          minPrice: priceRange.min,
          maxPrice: priceRange.max,
          metals: selectedMetals,
          sort,
        });
        setProducts(data.products);
        setTotal(data.total);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [category, sub, selectedPrice, selectedMetals, sort]);

  const toggleMetal = (metal) =>
    setSelectedMetals((prev) =>
      prev.includes(metal) ? prev.filter((m) => m !== metal) : [...prev, metal]
    );

  const clearFilters = () => {
    setSelectedPrice(null);
    setSelectedMetals([]);
    setSort('newest');
  };

  const hasActiveFilters = selectedPrice != null || selectedMetals.length > 0;
  const pageTitle = sub || category || 'All Jewellery';
  const currentSortLabel = SORT_OPTIONS.find((o) => o.value === sort)?.label;

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
          <span className="text-lg text-gray-500 font-sans font-normal">({total} results)</span>
        </h1>
        <div className="flex items-center gap-4 w-full md:w-auto justify-between">
          <button
            className="md:hidden flex items-center gap-2 border border-gray-300 px-4 py-2 rounded-md text-sm font-medium"
            onClick={() => setShowFilters(!showFilters)}
          >
            <FaFilter /> Filter {hasActiveFilters && (
              <span className="bg-[#832729] text-white text-[10px] rounded-full w-4 h-4 flex items-center justify-center">
                {(selectedPrice != null ? 1 : 0) + selectedMetals.length}
              </span>
            )}
          </button>
          <div className="relative">
            <div
              onClick={() => setShowSortMenu(!showSortMenu)}
              className="flex items-center gap-2 text-sm border border-gray-300 px-4 py-2 rounded-full cursor-pointer hover:border-[#832729] transition-colors"
            >
              <span className="text-gray-500">Sort By:</span>
              <span className="font-semibold text-gray-900">{currentSortLabel}</span>
              <FaChevronDown className={`text-gray-400 ml-1 transition-transform ${showSortMenu ? 'rotate-180' : ''}`} />
            </div>
            {showSortMenu && (
              <div className="absolute right-0 top-full mt-1 bg-white border border-gray-100 rounded-sm shadow-lg z-30 w-52">
                {SORT_OPTIONS.map((opt) => (
                  <button
                    key={opt.value}
                    onClick={() => { setSort(opt.value); setShowSortMenu(false); }}
                    className={`w-full text-left px-4 py-3 text-sm transition-colors ${
                      sort === opt.value ? 'text-[#832729] bg-[#832729]/5 font-medium' : 'text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Active filter pills */}
      {hasActiveFilters && (
        <div className="flex flex-wrap gap-2 mb-6">
          {selectedPrice != null && (
            <span className="flex items-center gap-2 text-xs bg-[#832729]/10 text-[#832729] px-3 py-1.5 rounded-full font-medium">
              {PRICE_RANGES[selectedPrice].label}
              <button onClick={() => setSelectedPrice(null)}><FaXmark className="w-3 h-3" /></button>
            </span>
          )}
          {selectedMetals.map((m) => (
            <span key={m} className="flex items-center gap-2 text-xs bg-[#832729]/10 text-[#832729] px-3 py-1.5 rounded-full font-medium">
              {m}
              <button onClick={() => toggleMetal(m)}><FaXmark className="w-3 h-3" /></button>
            </span>
          ))}
          <button onClick={clearFilters} className="text-xs text-gray-400 underline ml-1">Clear all</button>
        </div>
      )}

      <div className="flex flex-col md:flex-row gap-10">
        <aside className={`w-full md:w-1/4 lg:w-1/5 ${showFilters ? 'block' : 'hidden md:block'}`}>
          <div className="border-b border-gray-200 pb-6 mb-6">
            <h3 className="font-serif text-lg mb-4 text-gray-800">Price</h3>
            <div className="space-y-3 text-sm text-gray-600">
              {PRICE_RANGES.map((range, i) => (
                <label key={range.label} className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="radio"
                    name="price"
                    checked={selectedPrice === i}
                    onChange={() => setSelectedPrice(selectedPrice === i ? null : i)}
                    onClick={() => { if (selectedPrice === i) setSelectedPrice(null); }}
                    className="w-4 h-4 accent-[#832729]"
                  />
                  {range.label}
                </label>
              ))}
            </div>
          </div>
          <div className="pb-6">
            <h3 className="font-serif text-lg mb-4 text-gray-800">Metal</h3>
            <div className="space-y-3 text-sm text-gray-600">
              {METALS.map((metal) => (
                <label key={metal} className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={selectedMetals.includes(metal)}
                    onChange={() => toggleMetal(metal)}
                    className="w-4 h-4 accent-[#832729]"
                  />
                  {metal}
                </label>
              ))}
            </div>
          </div>
          {hasActiveFilters && (
            <button onClick={clearFilters} className="text-sm text-[#832729] underline font-medium">
              Clear all filters
            </button>
          )}
        </aside>

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
          {error && <p className="text-red-500 text-sm">{error}</p>}
          {!loading && !error && products.length === 0 && (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <p className="text-gray-400 font-serif text-lg mb-3">No products found</p>
              {hasActiveFilters && (
                <button onClick={clearFilters} className="text-sm text-[#832729] underline">Clear filters</button>
              )}
            </div>
          )}
          {!loading && !error && products.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.map((product) => (
                <Link to={`/product/${product.slug}`} key={product.id} className="group flex flex-col cursor-pointer">
                  <div className="relative bg-[#f9f9f9] rounded-sm aspect-square overflow-hidden mb-4">
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        toggleWishlist(product.id, isAuthenticated);
                      }}
                      className="absolute top-4 right-4 z-10 text-gray-400 hover:text-[#832729] transition-colors"
                    >
                      {wishlistIds.includes(product.id)
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
                          product.tag.includes('left') ? 'text-red-600 bg-red-50' : 'text-[#832729] bg-[#832729]/10'
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