import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaUser, FaLocationDot, FaHeart, FaRightFromBracket, FaPen } from 'react-icons/fa6';
import useAuthStore from '../store/useAuthStore';

// --- Dummy Data (replace with real API later) ---
const dummyAddresses = [
  {
    id: 1,
    label: 'Home',
    fullName: 'Prashant Sharma',
    line1: '123, Vaishali Nagar',
    city: 'Jaipur',
    state: 'Rajasthan',
    pincode: '302021',
    phone: '+91 98765 43210',
    isDefault: true,
  },
];

const dummyWishlist = [
  {
    id: 1,
    name: 'Bloom Bud Gold Ring',
    price: 66174,
    image: 'https://images.unsplash.com/photo-1605100804763-247f67b2548e?q=80&w=400',
  },
  {
    id: 5,
    name: 'Solitaire Diamond Studs',
    price: 112000,
    image: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?q=80&w=400',
  },
];

const tabs = [
  { key: 'details', label: 'Account Details', icon: FaUser },
  { key: 'addresses', label: 'Saved Addresses', icon: FaLocationDot },
  { key: 'wishlist', label: 'Wishlist', icon: FaHeart },
];

const Profile = () => {
  const navigate = useNavigate();
  const { user, logout, isAuthenticated } = useAuthStore();
  const [activeTab, setActiveTab] = useState('details');

  // Guard: redirect if not logged in
  if (!isAuthenticated) {
    return (
      <div className="container mx-auto px-6 py-24 text-center">
        <p className="text-gray-400 font-serif text-xl mb-6">Please log in to view your profile</p>
        <Link to="/" className="text-[#832729] underline text-sm">
          Go to Home
        </Link>
      </div>
    );
  }

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="container mx-auto px-6 py-10">

      {/* Header */}
      <div className="flex items-center gap-5 mb-10">
        <div className="w-16 h-16 rounded-full bg-[#832729]/10 flex items-center justify-center text-[#832729] font-serif text-2xl flex-shrink-0">
          {user?.avatar
            ? <img src={user.avatar} alt={user.name} className="w-full h-full rounded-full object-cover" />
            : user?.name?.charAt(0).toUpperCase()
          }
        </div>
        <div>
          <h1 className="text-2xl font-serif text-gray-900">{user?.name}</h1>
          <p className="text-sm text-gray-500">{user?.email}</p>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-10">

        {/* LEFT: Tab Navigation */}
        <aside className="w-full md:w-1/4">
          <nav className="flex flex-col gap-1">
            {tabs.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`flex items-center gap-3 px-4 py-3 rounded-sm text-sm font-medium transition-colors text-left ${
                  activeTab === tab.key
                    ? 'bg-[#832729]/10 text-[#832729]'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                <tab.icon className="w-4 h-4" />
                {tab.label}
              </button>
            ))}

            <button
              onClick={handleLogout}
              className="flex items-center gap-3 px-4 py-3 rounded-sm text-sm font-medium text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors text-left mt-4 border-t border-gray-100 pt-4"
            >
              <FaRightFromBracket className="w-4 h-4" />
              Logout
            </button>
          </nav>
        </aside>

        {/* RIGHT: Tab Content */}
        <main className="w-full md:w-3/4">

          {/* Account Details */}
          {activeTab === 'details' && (
            <div className="border border-gray-100 rounded-sm p-6 flex flex-col gap-5">
              <h3 className="font-serif text-lg text-gray-800 mb-1">Account Details</h3>

              <Field label="Full Name" value={user?.name} />
              <Field label="Email Address" value={user?.email} />
              <Field label="Phone Number" value={user?.phone || 'Not added'} />

              <button className="self-start text-sm text-[#832729] underline font-medium mt-2">
                Edit Details
              </button>
            </div>
          )}

          {/* Saved Addresses */}
          {activeTab === 'addresses' && (
            <div className="flex flex-col gap-4">
              <div className="flex items-center justify-between mb-1">
                <h3 className="font-serif text-lg text-gray-800">Saved Addresses</h3>
                <button className="text-sm text-[#832729] underline font-medium">
                  + Add New Address
                </button>
              </div>

              {dummyAddresses.length === 0 ? (
                <p className="text-gray-400 text-sm">No saved addresses yet.</p>
              ) : (
                dummyAddresses.map((addr) => (
                  <div key={addr.id} className="border border-gray-100 rounded-sm p-5 flex justify-between items-start">
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-sm font-semibold text-gray-800">{addr.label}</span>
                        {addr.isDefault && (
                          <span className="text-[10px] font-semibold text-[#832729] bg-[#832729]/10 px-2 py-0.5 rounded-sm">
                            Default
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-gray-600">{addr.fullName}</p>
                      <p className="text-sm text-gray-500">
                        {addr.line1}, {addr.city}, {addr.state} - {addr.pincode}
                      </p>
                      <p className="text-sm text-gray-500 mt-1">{addr.phone}</p>
                    </div>
                    <button className="text-gray-400 hover:text-[#832729] transition-colors">
                      <FaPen className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))
              )}
            </div>
          )}

          {/* Wishlist */}
          {activeTab === 'wishlist' && (
            <div>
              <h3 className="font-serif text-lg text-gray-800 mb-5">Wishlist</h3>

              {dummyWishlist.length === 0 ? (
                <p className="text-gray-400 text-sm">Your wishlist is empty.</p>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-5">
                  {dummyWishlist.map((item) => (
                    <Link
                      to={`/product/${item.id}`}
                      key={item.id}
                      className="group"
                    >
                      <div className="bg-[#f9f9f9] rounded-sm aspect-square overflow-hidden mb-2">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      </div>
                      <p className="text-xs text-gray-700 line-clamp-1">{item.name}</p>
                      <p className="text-xs text-gray-400">₹ {item.price.toLocaleString('en-IN')}</p>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          )}

        </main>
      </div>
    </div>
  );
};

// --- Helper ---
const Field = ({ label, value }) => (
  <div className="grid grid-cols-3 gap-4 text-sm py-2 border-b border-gray-50">
    <span className="text-gray-400">{label}</span>
    <span className="col-span-2 text-gray-800 font-medium">{value}</span>
  </div>
);

export default Profile;