// src/components/common/SearchBar.jsx
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaMagnifyingGlass, FaXmark } from 'react-icons/fa6';
import { searchProductsApi } from '../../services/productService';

const SearchBar = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const debounceRef = useRef(null);
  const containerRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (query.trim().length < 2) {
      setResults([]);
      setShowDropdown(false);
      return;
    }

    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(async () => {
      setLoading(true);
      try {
        const data = await searchProductsApi(query);
        setResults(data.products);
        setShowDropdown(true);
      } catch {
        setResults([]);
      } finally {
        setLoading(false);
      }
    }, 300);

    return () => clearTimeout(debounceRef.current);
  }, [query]);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClick = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const handleSelect = (slug) => {
    setQuery('');
    setShowDropdown(false);
    navigate(`/product/${slug}`);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!query.trim()) return;
    setShowDropdown(false);
    navigate(`/products?search=${encodeURIComponent(query.trim())}`);
    setQuery('');
  };

  const clearQuery = () => {
    setQuery('');
    setResults([]);
    setShowDropdown(false);
  };

  return (
    <div ref={containerRef} className="relative w-full">
      <form onSubmit={handleSubmit} className="relative flex items-center">
        <FaMagnifyingGlass className="absolute left-4 text-gray-400 w-4 h-4 pointer-events-none" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => results.length > 0 && setShowDropdown(true)}
          placeholder="Search for engagement rings, gold, diamonds..."
          className="w-full bg-[#F9F9F9] text-gray-700 rounded-md py-2.5 pl-11 pr-10 outline-none border border-gray-200 focus:border-[#832729] transition-all"
        />
        {query && (
          <button
            type="button"
            onClick={clearQuery}
            className="absolute right-4 text-gray-400 hover:text-gray-600"
          >
            <FaXmark className="w-4 h-4" />
          </button>
        )}
      </form>

      {/* Dropdown */}
      {showDropdown && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-100 rounded-sm shadow-xl z-50 overflow-hidden">
          {loading && (
            <div className="px-4 py-3 text-sm text-gray-400">Searching...</div>
          )}

          {!loading && results.length === 0 && (
            <div className="px-4 py-3 text-sm text-gray-400">
              No results for "{query}"
            </div>
          )}

          {!loading && results.length > 0 && (
            <>
              {results.map((product) => (
                <button
                  key={product.id}
                  onClick={() => handleSelect(product.slug)}
                  className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors text-left"
                >
                  <div className="w-10 h-10 bg-[#f9f9f9] rounded-sm overflow-hidden flex-shrink-0">
                    <img
                      src={product.images[0]?.url}
                      alt={product.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-grow min-w-0">
                    <p className="text-sm font-medium text-gray-800 truncate">{product.name}</p>
                    <p className="text-xs text-gray-400">₹ {product.price.toLocaleString('en-IN')}</p>
                  </div>
                </button>
              ))}

              <button
                onClick={handleSubmit}
                className="w-full px-4 py-3 text-sm text-[#832729] font-medium hover:bg-[#832729]/5 transition-colors text-left border-t border-gray-100"
              >
                See all results for "{query}"
              </button>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default SearchBar;