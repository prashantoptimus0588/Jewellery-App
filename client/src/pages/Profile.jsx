// src/pages/Profile.jsx
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaUser, FaLocationDot, FaHeart, FaRightFromBracket, FaPen, FaCheck } from 'react-icons/fa6';
import useAuthStore from '../store/useAuthStore';
import { fetchWishlist, removeFromWishlist } from '../services/userService';
import { getAddresses, saveAddress } from '../services/orderService';
import { updateProfile } from '../services/userService';

const tabs = [
  { key: 'details',   label: 'Account Details',  icon: FaUser },
  { key: 'addresses', label: 'Saved Addresses',   icon: FaLocationDot },
  { key: 'wishlist',  label: 'Wishlist',           icon: FaHeart },
];

const Profile = () => {
  const navigate = useNavigate();
  const { user, logout, isAuthenticated, login, token } = useAuthStore();
  const [activeTab, setActiveTab] = useState('details');

  // Addresses state
  const [addresses, setAddresses] = useState([]);
  const [addrLoading, setAddrLoading] = useState(false);
  const [showAddrForm, setShowAddrForm] = useState(false);
  const [newAddr, setNewAddr] = useState({
    fullName: '', phone: '', line1: '', city: '', state: '', pincode: '', label: 'Home',
  });

  // Wishlist state
  const [wishlist, setWishlist] = useState([]);
  const [wishlistLoading, setWishlistLoading] = useState(false);

  // Edit profile state
  const [editing, setEditing] = useState(false);
  const [editName, setEditName] = useState(user?.name || '');
  const [editPhone, setEditPhone] = useState(user?.phone || '');
  const [editLoading, setEditLoading] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) return;
    if (activeTab === 'addresses') {
      setAddrLoading(true);
      getAddresses()
        .then((data) => setAddresses(data.addresses))
        .finally(() => setAddrLoading(false));
    }
    if (activeTab === 'wishlist') {
      setWishlistLoading(true);
      fetchWishlist()
        .then((data) => setWishlist(data.wishlist))
        .finally(() => setWishlistLoading(false));
    }
  }, [activeTab, isAuthenticated]);

  const handleLogout = () => { logout(); navigate('/'); };

  const handleSaveAddress = async () => {
    try {
      const { address } = await saveAddress({ ...newAddr, isDefault: addresses.length === 0 });
      setAddresses((prev) => [...prev, address]);
      setShowAddrForm(false);
      setNewAddr({ fullName: '', phone: '', line1: '', city: '', state: '', pincode: '', label: 'Home' });
    } catch (err) {
      alert(err.message);
    }
  };

  const handleRemoveWishlist = async (productId) => {
    try {
      await removeFromWishlist(productId);
      setWishlist((prev) => prev.filter((i) => i.productId !== productId));
    } catch (err) {
      alert(err.message);
    }
  };

  const handleUpdateProfile = async () => {
    setEditLoading(true);
    try {
      const { user: updated } = await updateProfile({ name: editName, phone: editPhone });
      login(updated, token);
      setEditing(false);
    } catch (err) {
      alert(err.message);
    } finally {
      setEditLoading(false);
    }
  };

  if (!isAuthenticated) return (
    <div className="container mx-auto px-6 py-24 text-center">
      <p className="text-gray-400 font-serif text-xl mb-6">Please log in to view your profile</p>
      <Link to="/" className="text-[#832729] underline text-sm">Go to Home</Link>
    </div>
  );

  return (
    <div className="container mx-auto px-6 py-10">

      {/* Header */}
      <div className="flex items-center gap-5 mb-10">
        <div className="w-16 h-16 rounded-full bg-[#832729]/10 flex items-center justify-center text-[#832729] font-serif text-2xl flex-shrink-0 overflow-hidden">
          {user?.avatar
            ? <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
            : user?.name?.charAt(0).toUpperCase()
          }
        </div>
        <div>
          <h1 className="text-2xl font-serif text-gray-900">{user?.name}</h1>
          <p className="text-sm text-gray-500">{user?.email}</p>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-10">

        {/* Sidebar */}
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

        {/* Content */}
        <main className="w-full md:w-3/4">

          {/* Account Details */}
          {activeTab === 'details' && (
            <div className="border border-gray-100 rounded-sm p-6 flex flex-col gap-5">
              <h3 className="font-serif text-lg text-gray-800 mb-1">Account Details</h3>

              {editing ? (
                <div className="flex flex-col gap-4">
                  <div>
                    <label className="block text-xs text-gray-500 mb-1.5">Full Name</label>
                    <input
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                      className="w-full border border-gray-200 rounded-sm px-3 py-2.5 text-sm outline-none focus:border-[#832729] transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-500 mb-1.5">Phone Number</label>
                    <input
                      value={editPhone}
                      onChange={(e) => setEditPhone(e.target.value)}
                      className="w-full border border-gray-200 rounded-sm px-3 py-2.5 text-sm outline-none focus:border-[#832729] transition-colors"
                    />
                  </div>
                  <div className="flex gap-3">
                    <button
                      onClick={handleUpdateProfile}
                      disabled={editLoading}
                      className="flex items-center gap-2 bg-[#832729] text-white text-sm font-medium px-5 py-2.5 rounded-sm hover:bg-[#6a1f21] transition-colors disabled:opacity-60"
                    >
                      <FaCheck className="w-3 h-3" />
                      {editLoading ? 'Saving...' : 'Save Changes'}
                    </button>
                    <button
                      onClick={() => setEditing(false)}
                      className="text-sm text-gray-500 underline"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <Field label="Full Name" value={user?.name} />
                  <Field label="Email Address" value={user?.email} />
                  <Field label="Phone Number" value={user?.phone || 'Not added'} />
                  <button
                    onClick={() => { setEditing(true); setEditName(user?.name || ''); setEditPhone(user?.phone || ''); }}
                    className="self-start flex items-center gap-2 text-sm text-[#832729] underline font-medium mt-2"
                  >
                    <FaPen className="w-3 h-3" /> Edit Details
                  </button>
                </>
              )}
            </div>
          )}

          {/* Addresses */}
          {activeTab === 'addresses' && (
            <div className="flex flex-col gap-4">
              <div className="flex items-center justify-between mb-1">
                <h3 className="font-serif text-lg text-gray-800">Saved Addresses</h3>
                <button
                  onClick={() => setShowAddrForm(!showAddrForm)}
                  className="text-sm text-[#832729] underline font-medium"
                >
                  {showAddrForm ? 'Cancel' : '+ Add New Address'}
                </button>
              </div>

              {showAddrForm && (
                <div className="border border-gray-100 rounded-sm p-5 flex flex-col gap-4">
                  <div className="grid grid-cols-2 gap-4">
                    <AddrInput label="Full Name" value={newAddr.fullName} onChange={(v) => setNewAddr((p) => ({ ...p, fullName: v }))} />
                    <AddrInput label="Phone" value={newAddr.phone} onChange={(v) => setNewAddr((p) => ({ ...p, phone: v }))} />
                  </div>
                  <AddrInput label="Address Line" value={newAddr.line1} onChange={(v) => setNewAddr((p) => ({ ...p, line1: v }))} />
                  <div className="grid grid-cols-3 gap-4">
                    <AddrInput label="City" value={newAddr.city} onChange={(v) => setNewAddr((p) => ({ ...p, city: v }))} />
                    <AddrInput label="State" value={newAddr.state} onChange={(v) => setNewAddr((p) => ({ ...p, state: v }))} />
                    <AddrInput label="Pincode" value={newAddr.pincode} onChange={(v) => setNewAddr((p) => ({ ...p, pincode: v }))} />
                  </div>
                  <button
                    onClick={handleSaveAddress}
                    className="self-start bg-[#832729] text-white text-sm font-medium px-6 py-2.5 rounded-sm hover:bg-[#6a1f21] transition-colors"
                  >
                    Save Address
                  </button>
                </div>
              )}

              {addrLoading ? (
                <div className="flex flex-col gap-3">
                  {[...Array(2)].map((_, i) => (
                    <div key={i} className="animate-pulse border border-gray-100 rounded-sm p-5 h-24 bg-gray-50" />
                  ))}
                </div>
              ) : addresses.length === 0 ? (
                <p className="text-gray-400 text-sm">No saved addresses yet.</p>
              ) : (
                addresses.map((addr) => (
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
                      <p className="text-sm text-gray-500">{addr.line1}, {addr.city}, {addr.state} - {addr.pincode}</p>
                      <p className="text-sm text-gray-500 mt-1">{addr.phone}</p>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {/* Wishlist */}
          {activeTab === 'wishlist' && (
            <div>
              <h3 className="font-serif text-lg text-gray-800 mb-5">Wishlist</h3>
              {wishlistLoading ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-5">
                  {[...Array(3)].map((_, i) => (
                    <div key={i} className="animate-pulse">
                      <div className="bg-gray-100 rounded-sm aspect-square mb-2" />
                      <div className="h-3 bg-gray-100 rounded w-3/4 mb-1" />
                      <div className="h-3 bg-gray-100 rounded w-1/2" />
                    </div>
                  ))}
                </div>
              ) : wishlist.length === 0 ? (
                <p className="text-gray-400 text-sm">Your wishlist is empty.</p>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-5">
                  {wishlist.map((item) => (
                    <div key={item.id} className="group relative">
                      <Link to={`/product/${item.product.slug}`}>
                        <div className="bg-[#f9f9f9] rounded-sm aspect-square overflow-hidden mb-2">
                          <img
                            src={item.product.images[0]?.url}
                            alt={item.product.name}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                        </div>
                        <p className="text-xs text-gray-700 line-clamp-1">{item.product.name}</p>
                        <p className="text-xs text-gray-400">₹ {item.product.price.toLocaleString('en-IN')}</p>
                      </Link>
                      <button
                        onClick={() => handleRemoveWishlist(item.productId)}
                        className="absolute top-2 right-2 bg-white rounded-full p-1.5 shadow-sm text-gray-400 hover:text-red-500 transition-colors"
                      >
                        <FaHeart className="w-3.5 h-3.5" />
                      </button>
                    </div>
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

const Field = ({ label, value }) => (
  <div className="grid grid-cols-3 gap-4 text-sm py-2 border-b border-gray-50">
    <span className="text-gray-400">{label}</span>
    <span className="col-span-2 text-gray-800 font-medium">{value}</span>
  </div>
);

const AddrInput = ({ label, value, onChange }) => (
  <div>
    <label className="block text-xs text-gray-500 mb-1.5">{label}</label>
    <input
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full border border-gray-200 rounded-sm px-3 py-2.5 text-sm outline-none focus:border-[#832729] transition-colors"
    />
  </div>
);

export default Profile;