import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../store/authSlice';
import { ShoppingBag, User, Search, ShieldCheck, Menu, X, LogOut, ChevronDown } from 'lucide-react';

export const Navbar = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { cartItems } = useSelector((state) => state.cart);
  const { user, isAuthenticated } = useSelector((state) => state.auth);
  const { verifiedProvince } = useSelector((state) => state.compliance);

  const [searchQuery, setSearchQuery] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdown, setUserDropdown] = useState(false);

  const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/shop?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const handleLogout = () => {
    dispatch(logout());
    navigate('/');
  };

  return (
    <nav className="sticky top-0 z-40 bg-slate-900/90 backdrop-blur-md border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20 gap-4">
          
          {/* Brand Logo */}
          <Link to="/" className="flex items-center gap-2 shrink-0">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center font-extrabold text-xl text-white shadow-lg shadow-cyan-500/20">
              CP
            </div>
            <div>
              <span className="text-xl font-bold tracking-tight text-white font-sans">
                CanPouch<span className="text-cyan-400">.ca</span>
              </span>
              <span className="block text-[10px] text-cyan-400 font-semibold tracking-wider uppercase">
                Canadian Compliant
              </span>
            </div>
          </Link>

          {/* Search Bar with Health Term Guard */}
          <form onSubmit={handleSearch} className="hidden md:flex flex-1 max-w-md relative">
            <input
              type="text"
              placeholder="Search pouches by brand, flavor, or strength..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-950/80 border border-slate-700/80 rounded-full pl-10 pr-4 py-2 text-xs text-slate-100 placeholder-slate-400 focus:outline-none focus:border-cyan-500 transition"
            />
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-2.5" />
          </form>

          {/* Mega Nav Links */}
          <div className="hidden lg:flex items-center gap-6 text-xs font-semibold text-slate-300">
            <Link to="/" className="hover:text-cyan-400 transition">Home</Link>
            <Link to="/shop" className="hover:text-cyan-400 transition">Shop All</Link>
            <Link to="/shop?category=mint-menthol" className="hover:text-cyan-400 transition">Mint</Link>
            <Link to="/shop?category=citrus-fruit" className="hover:text-cyan-400 transition">Citrus</Link>
            <Link to="/blog" className="hover:text-cyan-400 transition">Educational Blog</Link>
          </div>

          {/* Actions: Age Badge, Cart, Profile */}
          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-800 border border-slate-700 text-[11px] text-cyan-400 font-medium">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Verified ({verifiedProvince})</span>
            </div>

            {/* Cart Icon */}
            <Link to="/cart" className="relative p-2 text-slate-300 hover:text-white transition">
              <ShoppingBag className="w-6 h-6" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-cyan-500 text-slate-950 font-bold text-[10px] w-5 h-5 rounded-full flex items-center justify-center shadow-md">
                  {cartCount}
                </span>
              )}
            </Link>

            {/* Account / Admin Menu */}
            {isAuthenticated ? (
              <div className="relative">
                <button
                  onClick={() => setUserDropdown(!userDropdown)}
                  className="flex items-center gap-1.5 p-2 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800 transition text-xs font-medium"
                >
                  <User className="w-5 h-5 text-cyan-400" />
                  <span className="hidden sm:inline">{user?.firstName}</span>
                  <ChevronDown className="w-3.5 h-3.5" />
                </button>

                {userDropdown && (
                  <div className="absolute right-0 mt-2 w-48 bg-slate-900 border border-slate-700 rounded-xl shadow-xl py-2 z-50 text-xs">
                    <div className="px-4 py-2 border-b border-slate-800">
                      <p className="font-semibold text-white">{user?.firstName} {user?.lastName}</p>
                      <p className="text-[10px] text-slate-400 capitalize">{user?.role} Account</p>
                    </div>
                    <Link
                      to="/dashboard"
                      onClick={() => setUserDropdown(false)}
                      className="block px-4 py-2 hover:bg-slate-800 text-slate-200"
                    >
                      Customer Dashboard
                    </Link>
                    {(user?.role === 'admin' || user?.role === 'compliance_officer') && (
                      <Link
                        to="/admin"
                        onClick={() => setUserDropdown(false)}
                        className="block px-4 py-2 hover:bg-cyan-950 text-cyan-400 font-semibold"
                      >
                        Admin & Compliance Panel
                      </Link>
                    )}
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-2 hover:bg-red-950 text-red-400 flex items-center gap-1.5 mt-1"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link
                to="/login"
                className="bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-100 px-4 py-2 rounded-lg text-xs font-semibold transition"
              >
                Sign In
              </Link>
            )}

            {/* Mobile menu toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 text-slate-300"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-slate-900 border-b border-slate-800 px-4 pt-3 pb-6 space-y-3">
          <form onSubmit={handleSearch} className="relative mb-3">
            <input
              type="text"
              placeholder="Search pouches..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-lg pl-9 pr-3 py-2 text-xs text-white"
            />
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          </form>
          <Link to="/" onClick={() => setMobileMenuOpen(false)} className="block py-1.5 text-sm font-medium text-slate-200">Home</Link>
          <Link to="/shop" onClick={() => setMobileMenuOpen(false)} className="block py-1.5 text-sm font-medium text-slate-200">Shop Catalog</Link>
          <Link to="/blog" onClick={() => setMobileMenuOpen(false)} className="block py-1.5 text-sm font-medium text-slate-200">Educational Articles</Link>
        </div>
      )}
    </nav>
  );
};
