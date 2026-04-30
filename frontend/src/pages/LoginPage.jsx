import { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import { MdEmail, MdLock, MdVisibility, MdVisibilityOff, MdArrowForward, MdPerson, MdAssignmentInd } from 'react-icons/md';

export default function LoginPage({ isRegister = false }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const { login, register, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const searchParams = new URLSearchParams(location.search);
  const redirectPath = searchParams.get('redirect');
  const from = location.state?.from?.pathname || (redirectPath ? `/${redirectPath}` : null);

  // If already logged in, redirect away
  useEffect(() => {
    if (user) {
      if (from) {
        navigate(from, { replace: true });
      } else {
        navigate(user.role === 'admin' ? '/admin' : '/', { replace: true });
      }
    }
  }, [user, navigate, from]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      if (isRegister) {
        if (!name.trim()) throw new Error('Please enter your full name');
        await register({ name, email, password });
        toast.success('Account created! Welcome to PanelCraft');
      } else {
        await login({ email, password });
        toast.success('Welcome back!');
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message || 'Authentication failed');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 py-20 bg-gray-50/50">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-[2.5rem] shadow-xl shadow-gray-200/50 border border-gray-100 overflow-hidden animate-fade-in">
          <div className="p-8 sm:p-12">
            <div className="text-center mb-10">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-amber-500 rounded-3xl shadow-lg shadow-amber-500/30 text-white mb-6 animate-bounce-subtle">
                {isRegister ? <MdAssignmentInd size={38} /> : <MdLock size={38} />}
              </div>
              <h1 className="text-3xl font-black text-gray-900" style={{ fontFamily: "'Outfit', sans-serif" }}>
                {isRegister ? 'Join PanelCraft' : 'Welcome Back'}
              </h1>
              <p className="text-gray-500 font-medium mt-2">
                {isRegister ? 'Create an account to start shopping' : 'Enter your credentials to access your account'}
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {isRegister && (
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] pl-1">Full Name</label>
                  <div className="relative group">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-amber-500 transition-colors">
                      <MdPerson size={20} />
                    </span>
                    <input
                      required
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-50 rounded-2xl text-sm focus:outline-none focus:ring-4 focus:ring-amber-500/10 focus:bg-white transition-all font-bold placeholder:font-medium"
                      placeholder="Your Full Name"
                    />
                  </div>
                </div>
              )}

              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] pl-1">Email Address</label>
                <div className="relative group">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-amber-500 transition-colors">
                    <MdEmail size={20} />
                  </span>
                  <input
                    required
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-50 rounded-2xl text-sm focus:outline-none focus:ring-4 focus:ring-amber-500/10 focus:bg-white transition-all font-bold placeholder:font-medium"
                    placeholder="example@mail.com"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center px-1">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Password</label>
                  {!isRegister && <a href="#" className="text-[10px] font-black text-amber-600 hover:underline uppercase tracking-widest">Forgot?</a>}
                </div>
                <div className="relative group">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-amber-500 transition-colors">
                    <MdLock size={20} />
                  </span>
                  <input
                    required
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-12 pr-12 py-4 bg-gray-50 border border-gray-50 rounded-2xl text-sm focus:outline-none focus:ring-4 focus:ring-amber-500/10 focus:bg-white transition-all font-bold placeholder:font-medium"
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    {showPassword ? <MdVisibilityOff size={20} /> : <MdVisibility size={20} />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full py-4 bg-gray-900 text-white font-black rounded-2xl shadow-xl shadow-gray-900/10 hover:bg-amber-500 hover:shadow-amber-500/30 transition-all active:scale-95 flex items-center justify-center gap-2 group border-none text-xs tracking-[0.15em] uppercase"
              >
                {submitting ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  <>
                    {isRegister ? 'Create My Account' : 'Secure Login'}
                    <MdArrowForward size={18} className="group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </button>
            </form>

            <div className="mt-10 text-center relative">
               <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-gray-50"></div></div>
               <span className="relative px-4 bg-white text-[10px] font-black text-gray-300 uppercase tracking-[0.2em]">OR</span>
            </div>

            <div className="mt-8 text-center text-sm">
              {isRegister ? (
                <p className="font-bold text-gray-500 underline-offset-4 decoration-amber-500">
                  Already have an account? {' '}
                  <Link to="/login" className="text-amber-600 hover:underline">Sign In Instead</Link>
                </p>
              ) : (
                <p className="font-bold text-gray-500 underline-offset-4 decoration-amber-500">
                  Need an account? {' '}
                  <Link to="/register" className="text-amber-600 hover:underline">Register Today</Link>
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
