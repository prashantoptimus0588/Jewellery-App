// src/pages/Home.jsx
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Hero from '../components/layout/Hero';
import { FaArrowRight, FaHeart, FaRegHeart } from 'react-icons/fa6';
import { fetchProducts } from '../services/productService';
import useWishlistStore from '../store/useWishlistStore';
import useAuthStore from '../store/useAuthStore';

// --- Static Data (categories use real slugs, images stay static) ---
const categories = [
  { name: 'Rings', slug: 'rings', image: 'https://images.unsplash.com/photo-1605100804763-247f67b2548e?q=80&w=800' },
  { name: 'Earrings', slug: 'earrings', image: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?q=80&w=800' },
  { name: 'Necklaces', slug: 'diamond', image: 'https://images.unsplash.com/photo-1599643478524-fb66f7ca066b?q=80&w=800' },
  { name: 'Bangles', slug: 'gold', image: 'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?q=80&w=800' },
];

const trustPoints = [
  { icon: '🏅', title: '100% Certified', desc: 'BIS Hallmarked gold & certified diamonds' },
  { icon: '🔄', title: 'Lifetime Exchange', desc: 'Exchange your jewellery anytime, anywhere' },
  { icon: '🚚', title: 'Free Insured Shipping', desc: 'Fully insured delivery to your doorstep' },
  { icon: '🔒', title: 'Secure Payments', desc: 'Razorpay secured 100% safe checkout' },
];

const SectionHeader = ({ title, subtitle, link, linkText }) => (
  <div className="flex items-end justify-between mb-10">
    <div>
      <h2 className="text-3xl font-serif text-gray-900 mb-2">{title}</h2>
      {subtitle && <p className="text-gray-500 text-sm">{subtitle}</p>}
      <div className="w-12 h-0.5 bg-[#832729] mt-3" />
    </div>
    {link && (
      <Link to={link} className="flex items-center gap-2 text-sm font-medium text-[#832729] hover:gap-3 transition-all">
        {linkText} <FaArrowRight className="w-3 h-3" />
      </Link>
    )}
  </div>
);

const Home = () => {
  const [featured, setFeatured] = useState([]);
  const [newArrivals, setNewArrivals] = useState([]);
  const [loadingFeatured, setLoadingFeatured] = useState(true);
  const [loadingNew, setLoadingNew] = useState(true);

  const { ids: wishlistIds, toggle: toggleWishlist } = useWishlistStore();
  const { isAuthenticated } = useAuthStore();

  useEffect(() => {
    // Fetch best sellers
    fetchProducts({ sort: 'newest', limit: 4 })
      .then((data) => setFeatured(data.products))
      .finally(() => setLoadingFeatured(false));

    // Fetch new arrivals (price asc for variety)
    fetchProducts({ sort: 'price_asc', limit: 4 })
      .then((data) => setNewArrivals(data.products))
      .finally(() => setLoadingNew(false));
  }, []);

  return (
    <div className="flex flex-col gap-20 pb-20">

      <Hero />

      {/* Shop by Category */}
      <section className="container mx-auto px-6">
        <SectionHeader title="Shop by Category" subtitle="Find the perfect piece for every occasion" />
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {categories.map((cat) => (
            <Link
              key={cat.slug}
              to={`/products?category=${cat.slug}`}
              className="group relative overflow-hidden rounded-sm aspect-[3/4]"
            >
              <img
                src={cat.image}
                alt={cat.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
              <span className="absolute bottom-5 left-0 right-0 text-center text-white font-serif text-xl">
                {cat.name}
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured Collection */}
      <section className="container mx-auto px-6">
        <SectionHeader
          title="Featured Collection"
          subtitle="Handpicked pieces loved by our customers"
          link="/products"
          linkText="View All"
        />
        {loadingFeatured ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="bg-gray-100 rounded-sm aspect-square mb-3" />
                <div className="h-4 bg-gray-100 rounded mb-2 w-3/4" />
                <div className="h-3 bg-gray-100 rounded w-1/2" />
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {featured.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                isWishlisted={wishlistIds.includes(product.id)}
                onWishlist={() => toggleWishlist(product.id, isAuthenticated)}
              />
            ))}
          </div>
        )}
      </section>

      {/* New Arrivals */}
      <section className="container mx-auto px-6">
        <SectionHeader
          title="New Arrivals"
          subtitle="Fresh additions to our collection"
          link="/products?sort=newest"
          linkText="See More"
        />
        {loadingNew ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="bg-gray-100 rounded-sm aspect-square mb-3" />
                <div className="h-4 bg-gray-100 rounded mb-2 w-3/4" />
                <div className="h-3 bg-gray-100 rounded w-1/2" />
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {newArrivals.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                isWishlisted={wishlistIds.includes(product.id)}
                onWishlist={() => toggleWishlist(product.id, isAuthenticated)}
              />
            ))}
          </div>
        )}
      </section>

      {/* Bridal Banner */}
      <section className="relative h-[400px] overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1601121141461-9d6647bca1ed?q=80&w=2070"
          alt="Wedding Banner"
          className="w-full h-full object-cover object-center"
        />
        <div className="absolute inset-0 bg-black/50" />
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center text-white px-6">
          <span className="uppercase tracking-widest text-xs text-gray-300 mb-3">Exclusive</span>
          <h2 className="text-4xl md:text-5xl font-serif mb-4">The Bridal Edit</h2>
          <p className="text-gray-300 mb-8 max-w-md text-sm">
            Curated bridal sets crafted for your most cherished moments.
          </p>
          <Link
            to="/products?category=wedding"
            className="bg-white text-[#832729] font-medium px-10 py-3 rounded-sm hover:bg-[#832729] hover:text-white transition-all duration-300"
          >
            Explore Bridal
          </Link>
        </div>
      </section>

      {/* Trust Badges */}
      <section className="container mx-auto px-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {trustPoints.map((point, i) => (
            <div key={i} className="flex flex-col items-center text-center p-6 border border-gray-100 rounded-sm hover:border-[#832729]/30 transition-colors">
              <span className="text-3xl mb-3">{point.icon}</span>
              <h4 className="font-serif text-gray-800 mb-1">{point.title}</h4>
              <p className="text-xs text-gray-500 leading-relaxed">{point.desc}</p>
            </div>
          ))}
        </div>
      </section>

    </div>
  );
};

// --- Product Card with wishlist ---
const ProductCard = ({ product, isWishlisted, onWishlist }) => (
  <div className="group relative">
    <Link to={`/product/${product.slug}`}>
      <div className="relative overflow-hidden rounded-sm bg-[#f9f9f9] aspect-square mb-3">
        {product.tag && (
          <span className="absolute top-3 left-3 z-10 bg-[#832729] text-white text-[10px] font-semibold px-2 py-1 rounded-sm tracking-wide">
            {product.tag}
          </span>
        )}
        <img
          src={product.images?.[0]?.url}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
      </div>
      <p className="text-sm font-medium text-gray-800 group-hover:text-[#832729] transition-colors truncate">
        {product.name}
      </p>
      <p className="text-sm text-gray-500 mt-1">₹ {product.price.toLocaleString('en-IN')}</p>
    </Link>
    <button
      onClick={(e) => { e.preventDefault(); onWishlist(); }}
      className="absolute top-3 right-3 z-10 p-1.5 bg-white rounded-full shadow-sm text-gray-400 hover:text-[#832729] transition-colors"
    >
      {isWishlisted
        ? <FaHeart className="w-4 h-4 text-[#832729]" />
        : <FaRegHeart className="w-4 h-4" />}
    </button>
  </div>
);

export default Home;