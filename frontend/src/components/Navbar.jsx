import { useState, useEffect, useRef } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { useAuth } from '../context/AuthContext';
import { MdLogin, MdLogout, MdSettings, MdDashboard } from 'react-icons/md';

const MenuIcon = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
  </svg>
);
const CloseIcon = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
  </svg>
);
const CartIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
  </svg>
);
const HeartIcon = ({ filled }) => (
  <svg className="w-5 h-5" fill={filled ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
  </svg>
);

const navLinks = [
  { label: 'Home', to: '/', exact: true },
  { label: 'Hot Sale 🔥', to: '/hot-sale' },
  { label: 'PVC Panels', to: '/products/pvc-panels' },
  { label: 'Hard Panels', to: '/products/hard-panels' },
  { label: 'Contact Us', to: '/contact' },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { totalItems } = useCart();
  const { items: wishlistItems } = useWishlist();
  const { user, logout, isAdmin } = useAuth();
  const navigate = useNavigate();
  const mobileRef = useRef(null);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handler);
    return () => window.removeEventListener('scroll', handler);
  }, []);

  useEffect(() => {
    const handler = (e) => {
      if (mobileOpen && mobileRef.current && !mobileRef.current.contains(e.target)) {
        setMobileOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [mobileOpen]);

  return (
    <>
      {/* Top announcement bar */}
      <div className="bg-amber-500 text-white text-xs text-center py-1.5 font-medium tracking-wide">
        🚚 Free delivery on orders above PKR 5,000 &nbsp;|&nbsp; 📞 Call us: 0300-1234567
      </div>

      <header
        className={`sticky top-0 z-50 transition-all duration-300 ${
          scrolled
            ? 'bg-white/95 backdrop-blur-md shadow-lg border-b border-gray-100'
            : 'bg-white shadow-sm'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-3 group">
              <div className="w-10 h-10 bg-gradient-to-br from-amber-500 to-orange-600 rounded-xl flex items-center justify-center shadow-md group-hover:scale-105 transition-transform">
                <span className="text-white font-black text-lg leading-none">P</span>
              </div>
              <div className="hidden sm:block">
                <div className="font-black text-gray-900 text-lg leading-tight tracking-tight" style={{ fontFamily: "'Outfit', sans-serif" }}>
                  Mehmood Traders
                </div>
                <div className="text-xs text-amber-600 font-semibold tracking-widest uppercase">
                  PVC Panels
                </div>
              </div>
            </Link>

            {/* Desktop Nav */}
            <nav className="hidden lg:flex items-center gap-1">
              {navLinks.map(({ label, to, exact }) => (
                <NavLink
                  key={to}
                  to={to}
                  end={exact}
                  className={({ isActive }) =>
                    `relative px-4 py-2 text-sm font-semibold rounded-lg transition-all duration-200 
                    ${isActive
                      ? 'text-amber-600 bg-amber-50'
                      : 'text-gray-700 hover:text-amber-600 hover:bg-amber-50'
                    }`
                  }
                >
                  {label}
                </NavLink>
              ))}
            </nav>

            {/* Right icons */}
            <div className="flex items-center gap-2">
              {/* Wishlist */}
              <button
                onClick={() => navigate('/wishlist')}
                className="relative p-2 text-gray-600 hover:text-rose-500 hover:bg-rose-50 rounded-xl transition-all"
                aria-label="Wishlist"
              >
                <HeartIcon filled={wishlistItems.length > 0} />
                {wishlistItems.length > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-rose-500 text-white text-xs rounded-full flex items-center justify-center font-bold">
                    {wishlistItems.length}
                  </span>
                )}
              </button>

              {/* Cart */}
              <button
                onClick={() => navigate('/cart')}
                className="relative p-2 text-gray-600 hover:text-amber-600 hover:bg-amber-50 rounded-xl transition-all"
                aria-label="Cart"
              >
                <CartIcon />
                {totalItems > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-amber-500 text-white text-xs rounded-full flex items-center justify-center font-bold">
                    {totalItems > 9 ? '9+' : totalItems}
                  </span>
                )}
              </button>

              {/* Auth links */}
              <div className="flex items-center border-l border-gray-100 ml-1 pl-3 gap-2">
                {user ? (
                  <>
                    {isAdmin ? (
                      <Link
                        to="/admin"
                        className="p-2 text-gray-600 hover:text-amber-600 hover:bg-amber-50 rounded-xl transition-all"
                        title="Admin Panel"
                      >
                        <MdSettings size={22} />
                      </Link>
                    ) : (
                      <Link
                        to="/dashboard"
                        className="p-2 text-gray-600 hover:text-amber-600 hover:bg-amber-50 rounded-xl transition-all"
                        title="My Dashboard"
                      >
                        <MdDashboard size={22} />
                      </Link>
                    )}
                    <button
                      onClick={logout}
                      className="p-2 text-gray-600 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
                      title="Logout"
                    >
                      <MdLogout size={22} />
                    </button>
                  </>
                ) : (
                  <Link
                    to="/login"
                    className="flex items-center gap-2 px-4 py-2 bg-gray-900 text-white text-xs font-black rounded-lg hover:bg-amber-500 hover:shadow-lg hover:shadow-amber-500/20 transition-all active:scale-95"
                  >
                    <MdLogin size={16} />
                    LOGIN
                  </Link>
                )}
              </div>

              {/* Mobile menu toggle */}
              <button
                onClick={() => setMobileOpen(!mobileOpen)}
                className="lg:hidden p-2 rounded-xl text-gray-700 hover:bg-gray-100 transition-colors"
              >
                {mobileOpen ? <CloseIcon /> : <MenuIcon />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        <div
          ref={mobileRef}
          className={`lg:hidden overflow-hidden transition-all duration-300 ease-in-out ${
            mobileOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
          }`}
        >
          <div className="bg-white border-t border-gray-100 px-4 py-3 space-y-1">
            {navLinks.map(({ label, to, exact }) => (
              <NavLink
                key={to}
                to={to}
                end={exact}
                onClick={() => setMobileOpen(false)}
                className={({ isActive }) =>
                  `block px-4 py-3 rounded-xl text-sm font-semibold transition-colors
                  ${isActive ? 'text-amber-600 bg-amber-50' : 'text-gray-700 hover:bg-gray-50'}`
                }
              >
                {label}
              </NavLink>
            ))}
            <div className="pt-2 border-t border-gray-100 flex gap-3">
              <button
                onClick={() => { navigate('/wishlist'); setMobileOpen(false); }}
                className="flex-1 py-2.5 border border-gray-200 rounded-xl text-sm font-semibold text-gray-700 hover:bg-gray-50 flex items-center justify-center gap-2"
              >
                <HeartIcon /> Wishlist ({wishlistItems.length})
              </button>
              <button
                onClick={() => { navigate('/cart'); setMobileOpen(false); }}
                className="flex-1 py-2.5 bg-amber-500 rounded-xl text-sm font-semibold text-white hover:bg-amber-600 flex items-center justify-center gap-2"
              >
                <CartIcon /> Cart ({totalItems})
              </button>
            </div>
          </div>
        </div>
      </header>
    </>
  );
}