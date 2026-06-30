import React, { useState, useMemo } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { FaRegHeart, FaHeart, FaChevronDown, FaFilter } from "react-icons/fa6";

const ProductListing = () => {
  // --- 1. Dummy Data (To be replaced by Postgres/Prisma later) ---
  // NOTE: category/sub here are placeholders. Once the backend exists, products
  // should carry a real `categorySlug` + `subCategorySlug` (or relation) that
  // matches whatever taxonomy the Header nav and Prisma schema agree on.
  const products = [
    {
      id: 1,
      name: "Bloom Bud Gold Ring",
      price: 66174,
      image:
        "https://images.unsplash.com/photo-1605100804763-247f67b2548e?q=80&w=2070&auto=format&fit=crop",
      category: "Rings",
      sub: "Cocktail Rings",
      tag: "Best Seller",
    },
    {
      id: 2,
      name: "Verdant Bloom Gold Ring",
      price: 63350,
      image:
        "https://images.unsplash.com/photo-1603561591411-07eea52f1e26?q=80&w=2070&auto=format&fit=crop",
      category: "Rings",
      sub: "Engagement Rings",
      tag: "Only 1 left!",
    },
    {
      id: 3,
      name: "Radiant Diamond Necklace",
      price: 145000,
      image:
        "https://images.unsplash.com/photo-1599643477877-530eb83abc8e?q=80&w=2070&auto=format&fit=crop",
      category: "Necklaces",
      sub: "Diamond Pendants",
      tag: null,
    },
    {
      id: 4,
      name: "Classic Gold Bangles",
      price: 89500,
      image:
        "https://images.unsplash.com/photo-1611591437281-460bfbe1220a?q=80&w=2070&auto=format&fit=crop",
      category: "Bangles",
      sub: "Gold Bangles",
      tag: "New Arrival",
    },
    {
      id: 5,
      name: "Solitaire Diamond Studs",
      price: 112000,
      image:
        "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?q=80&w=2070&auto=format&fit=crop",
      category: "Earrings",
      sub: "Studs",
      tag: null,
    },
    {
      id: 6,
      name: "Imperial Rose Gold Ring",
      price: 78200,
      image:
        "https://images.unsplash.com/photo-1601121141461-9d6647bca1ed?q=80&w=2070&auto=format&fit=crop",
      category: "Rings",
      sub: "Cocktail Rings",
      tag: null,
    },
  ];

  // --- 2. URL-driven filter state ---
  const [searchParams, setSearchParams] = useSearchParams();
  const category = searchParams.get("category"); // e.g. "Rings", "Gold", "All Jewellery"
  const sub = searchParams.get("sub"); // e.g. "Cocktail Rings"

  // State to handle mobile filter toggle and wishlist UI interactions
  const [showFilters, setShowFilters] = useState(false);
  const [wishlist, setWishlist] = useState([]);

  const toggleWishlist = (id) => {
    if (wishlist.includes(id)) {
      setWishlist(wishlist.filter((itemId) => itemId !== id));
    } else {
      setWishlist([...wishlist, id]);
    }
  };

  const clearFilters = () => {
    setSearchParams({});
  };

  // --- 3. Derived, filtered product list ---
  // Loose/case-insensitive matching for now since dummy `category` values
  // don't yet share a taxonomy with the Header's nav categories. Swap this
  // for a real `?category=slug&sub=slug` -> Prisma `where` clause later.
  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      if (
        category &&
        category.toLowerCase() !== "all jewellery" &&
        !product.category.toLowerCase().includes(category.toLowerCase()) &&
        !category.toLowerCase().includes(product.category.toLowerCase())
      ) {
        return false;
      }

      if (
        sub &&
        !(product.sub || "").toLowerCase().includes(sub.toLowerCase())
      ) {
        return false;
      }

      return true;
    });
  }, [category, sub]);

  return (
    <div className="container mx-auto px-6 py-8">
      {/* --- Breadcrumbs --- */}
      <div className="text-sm text-gray-500 mb-6 font-medium">
        <Link to="/" className="hover:text-[#832729]">
          Home
        </Link>
        <span className="mx-2">&gt;</span>
        {category ? (
          <>
            <Link to="/products" className="hover:text-[#832729]">
              All Jewellery
            </Link>
            <span className="mx-2">&gt;</span>
            <span className="text-[#832729]">{sub || category}</span>
          </>
        ) : (
          <span className="text-[#832729]">All Jewellery</span>
        )}
      </div>

      {/* --- Page Header & Controls --- */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
        <h1 className="text-3xl font-serif text-gray-900">
          {sub || category || "All Jewellery"}{" "}
          <span className="text-lg text-gray-500 font-sans font-normal">
            ({filteredProducts.length} results)
          </span>
        </h1>

        <div className="flex items-center gap-4 w-full md:w-auto justify-between">
          {/* Active filter pill + clear */}
          {(category || sub) && (
            <button
              onClick={clearFilters}
              className="text-sm text-gray-500 hover:text-[#832729] underline whitespace-nowrap"
            >
              Clear filters
            </button>
          )}

          {/* Mobile Filter Button */}
          <button
            className="md:hidden flex items-center gap-2 border border-gray-300 px-4 py-2 rounded-md text-sm font-medium"
            onClick={() => setShowFilters(!showFilters)}
          >
            <FaFilter /> Filter
          </button>

          {/* Sort Dropdown */}
          <div className="flex items-center gap-2 text-sm border border-gray-300 px-4 py-2 rounded-full cursor-pointer hover:border-[#832729] transition-colors">
            <span className="text-gray-500">Sort By:</span>
            <span className="font-semibold text-gray-900">Best Matches</span>
            <FaChevronDown className="text-gray-400 ml-1" />
          </div>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-10">
        {/* --- LEFT SIDEBAR: FILTERS --- */}
        <aside
          className={`w-full md:w-1/4 lg:w-1/5 ${showFilters ? "block" : "hidden md:block"}`}
        >
          {/* Price Filter */}
          <div className="border-b border-gray-200 pb-6 mb-6">
            <h3 className="font-serif text-lg mb-4 text-gray-800">Price</h3>
            <div className="space-y-3 text-sm text-gray-600">
              <label className="flex items-center gap-3 cursor-pointer">
                <input type="checkbox" className="w-4 h-4 accent-[#832729]" />
                Under ₹ 25,000
              </label>
              <label className="flex items-center gap-3 cursor-pointer">
                <input type="checkbox" className="w-4 h-4 accent-[#832729]" />₹
                25,000 - ₹ 50,000
              </label>
              <label className="flex items-center gap-3 cursor-pointer">
                <input type="checkbox" className="w-4 h-4 accent-[#832729]" />₹
                50,000 - ₹ 1,00,000
              </label>
              <label className="flex items-center gap-3 cursor-pointer">
                <input type="checkbox" className="w-4 h-4 accent-[#832729]" />
                Over ₹ 1,00,000
              </label>
            </div>
          </div>

          {/* Category Filter */}
          <div className="border-b border-gray-200 pb-6 mb-6">
            <h3 className="font-serif text-lg mb-4 text-gray-800">Category</h3>
            <div className="space-y-3 text-sm text-gray-600">
              {["Rings", "Earrings", "Necklaces", "Bangles", "Pendants"].map(
                (cat) => (
                  <label
                    key={cat}
                    className="flex items-center gap-3 cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      className="w-4 h-4 accent-[#832729]"
                      checked={category?.toLowerCase() === cat.toLowerCase()}
                      onChange={() =>
                        setSearchParams(
                          category?.toLowerCase() === cat.toLowerCase()
                            ? {}
                            : { category: cat }
                        )
                      }
                    />
                    {cat}
                  </label>
                ),
              )}
            </div>
          </div>

          {/* Metal Filter */}
          <div className="pb-6">
            <h3 className="font-serif text-lg mb-4 text-gray-800">Metal</h3>
            <div className="space-y-3 text-sm text-gray-600">
              {["Yellow Gold", "Rose Gold", "White Gold", "Platinum"].map(
                (metal) => (
                  <label
                    key={metal}
                    className="flex items-center gap-3 cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      className="w-4 h-4 accent-[#832729]"
                    />
                    {metal}
                  </label>
                ),
              )}
            </div>
          </div>
        </aside>

        {/* --- RIGHT AREA: PRODUCT GRID --- */}
        {filteredProducts.length === 0 ? (
          <div className="w-full md:w-3/4 lg:w-4/5 flex flex-col items-center justify-center py-24 text-center gap-4">
            <p className="text-gray-400 font-serif text-lg">
              No products match {sub ? `"${sub}"` : `"${category}"`} yet.
            </p>
            <button
              onClick={clearFilters}
              className="text-sm text-[#832729] underline"
            >
              View all jewellery
            </button>
          </div>
        ) : (
          <main className="w-full md:w-3/4 lg:w-4/5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProducts.map((product) => (
              <Link
                to={`/product/${product.id}`}
                key={product.id}
                className="group flex flex-col cursor-pointer"
              >
                {/* Product Image Box */}
                <div className="relative bg-[#f9f9f9] rounded-sm aspect-square overflow-hidden mb-4 flex items-center justify-center p-6">
                  {/* Wishlist Button */}
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      toggleWishlist(product.id);
                    }}
                    className="absolute top-4 right-4 z-10 text-gray-400 hover:text-[#832729] transition-colors"
                  >
                    {wishlist.includes(product.id) ? (
                      <FaHeart className="w-5 h-5 text-[#832729]" />
                    ) : (
                      <FaRegHeart className="w-5 h-5" />
                    )}
                  </button>

                  {/* Main Image */}
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-500"
                  />
                </div>

                {/* Product Details */}
                <div className="flex flex-col flex-grow">
                  <h3 className="font-serif text-lg text-gray-800 mb-2 truncate">
                    {product.name}
                  </h3>

                  <div className="flex items-center gap-3 mb-3">
                    <span className="font-semibold text-gray-900">
                      ₹ {product.price.toLocaleString("en-IN")}
                    </span>
                    {/* Optional Tags (Best Seller, Only 1 left, etc.) */}
                    {product.tag && (
                      <span
                        className={`text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-sm ${
                          product.tag.includes("left")
                            ? "text-red-600 bg-red-50"
                            : "text-[#832729] bg-[#832729]/10"
                        }`}
                      >
                        {product.tag}
                      </span>
                    )}
                  </div>
                </div>
              </Link>
            ))}
          </main>
        )}
      </div>
    </div>
  );
};

export default ProductListing;