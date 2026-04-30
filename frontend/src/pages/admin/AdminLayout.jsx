import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { MdDashboard, MdInventory, MdPeople, MdSettings, MdLogout, MdArrowBack, MdReceiptLong, MdExitToApp } from 'react-icons/md';

export default function AdminLayout({ children }) {
  const { logout, user } = useAuth();
  const location = useLocation();

  const navItems = [
    { title: 'Dashboard', icon: <MdDashboard size={20} />, path: '/admin' },
    { title: 'Products', icon: <MdInventory size={20} />, path: '/admin/products' },
    { title: 'Orders', icon: <MdReceiptLong size={20} />, path: '/admin/orders' },
    { title: 'Settings', icon: <MdSettings size={20} />, path: '/admin/settings' },
  ];

  return (
    <div className="min-h-screen bg-gray-100 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-900 text-white flex flex-col shadow-xl sticky top-0 h-screen overflow-y-auto">
        <div className="p-6">
          <Link to="/" className="flex items-center gap-2">
            <span className="text-2xl font-black bg-gradient-to-r from-amber-400 to-amber-600 bg-clip-text text-transparent" style={{ fontFamily: "'Outfit', sans-serif" }}>
              ROOFPANELS
            </span>
          </Link>
          <p className="text-gray-400 text-xs mt-1 font-bold uppercase tracking-widest">Admin Panel</p>
        </div>

        <nav className="flex-1 px-4 py-4 space-y-1">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group
                ${location.pathname === item.path 
                  ? 'bg-amber-500 text-white shadow-lg shadow-amber-500/30' 
                  : 'text-gray-400 hover:bg-gray-800 hover:text-white'
                }`}
            >
              <span className={`transition-colors ${location.pathname === item.path ? 'text-white' : 'group-hover:text-amber-400'}`}>
                {item.icon}
              </span>
              <span className="font-bold text-sm tracking-wide">{item.title}</span>
            </Link>
          ))}
        </nav>

        <div className="p-4 border-t border-gray-800">
          <div className="flex items-center gap-3 mb-4 px-2">
            <div className="w-10 h-10 rounded-full bg-amber-500 flex items-center justify-center text-white font-black text-lg">
              {user?.name?.[0] || 'A'}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold truncate">{user?.name}</p>
              <p className="text-xs text-gray-500 truncate">{user?.email}</p>
            </div>
          </div>
          <button
            onClick={logout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-400 hover:bg-red-500/10 transition-colors font-bold text-sm"
          >
            <MdExitToApp size={20} />
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 min-h-screen overflow-y-auto">
        <header className="bg-white border-b border-gray-200 h-20 px-8 flex items-center justify-between sticky top-0 z-40">
          <h2 className="text-xl font-black text-gray-900" style={{ fontFamily: "'Outfit', sans-serif" }}>
            {navItems.find(item => item.path === location.pathname)?.title || 'Admin'}
          </h2>
          <div className="flex items-center gap-4">
            <div className="bg-gray-100 rounded-full px-4 py-2 text-xs font-bold text-gray-600">
              Environment: Production
            </div>
          </div>
        </header>

        <div className="p-8">
          {children}
        </div>
      </main>
    </div>
  );
}
