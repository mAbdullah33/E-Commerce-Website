import { useState, useEffect } from 'react';
import { MdTrendingUp, MdShoppingBag, MdPeople, MdAttachMoney, MdArrowForward } from 'react-icons/md';
import { Link } from 'react-router-dom';
import axios from '../../api/axios';

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalOrders: 0,
    totalRevenue: 0,
    totalUsers: 0,
    outOfStockCount: 0
  });
  const [recentOrders, setRecentOrders] = useState([]);
  const [topProducts, setTopProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      setLoading(true);
      try {
        const [statsRes, ordersRes, productsRes] = await Promise.all([
          axios.get('/dashboard/stats'),
          axios.get('/dashboard/recent-orders'),
          axios.get('/dashboard/top-products')
        ]);
        
        if (statsRes.data.success) setStats(statsRes.data.stats);
        if (ordersRes.data.success) setRecentOrders(ordersRes.data.recentOrders);
        if (productsRes.data.success) setTopProducts(productsRes.data.topProducts);
      } catch (error) {
        console.error('Dashboard data fetch error:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboardData();
  }, []);

  const statCards = [
    { title: 'Total Revenue', value: `PKR ${stats.totalRevenue.toLocaleString()}`, sub: 'From delivered orders', icon: <MdAttachMoney size={24} />, color: 'bg-emerald-50 text-emerald-600', hover: 'hover:border-emerald-200' },
    { title: 'New Orders', value: stats.totalOrders, sub: `${recentOrders.length} Recent`, icon: <MdShoppingBag size={24} />, color: 'bg-amber-50 text-amber-600', hover: 'hover:border-amber-200' },
    { title: 'Total Products', value: stats.totalProducts, sub: `${stats.outOfStockCount} Out of stock`, icon: <MdTrendingUp size={24} />, color: 'bg-blue-50 text-blue-600', hover: 'hover:border-blue-200' },
    { title: 'Total Customers', value: stats.totalUsers, sub: 'Registered users', icon: <MdPeople size={24} />, color: 'bg-indigo-50 text-indigo-600', hover: 'hover:border-indigo-200' },
  ];

  const statusColors = {
    pending: 'bg-amber-100 text-amber-700',
    confirmed: 'bg-blue-100 text-blue-700',
    processing: 'bg-indigo-100 text-indigo-700',
    out_for_delivery: 'bg-orange-100 text-orange-700',
    delivered: 'bg-green-100 text-green-700',
    cancelled: 'bg-red-100 text-red-700',
  };

  return (
    <div className="space-y-10 animate-fade-in p-2">
      <header className="mb-2">
         <h1 className="text-3xl font-black text-gray-900 mb-1" style={{ fontFamily: "'Outfit', sans-serif" }}>Store Overview</h1>
         <p className="text-gray-500 font-medium">Here's what's happening with your store today.</p>
      </header>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, i) => (
          <div key={i} className={`bg-white p-7 rounded-[2rem] border border-gray-100 shadow-sm flex flex-col justify-between group transition-all duration-300 ${stat.hover}`}>
            <div className={`p-4 rounded-2xl w-fit mb-6 ${stat.color} group-hover:scale-110 transition-transform duration-500 shadow-lg shadow-current/10`}>
              {stat.icon}
            </div>
            <div>
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-1">{stat.title}</p>
              <h3 className="text-2xl font-black text-gray-900 leading-none mb-2">{loading ? '...' : stat.value}</h3>
              <p className="text-[10px] text-gray-400 font-bold italic">{stat.sub}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Orders */}
        <section className="lg:col-span-2 bg-white rounded-[2.5rem] border border-gray-100 shadow-sm overflow-hidden flex flex-col">
          <div className="p-8 border-b border-gray-50 flex items-center justify-between">
            <h3 className="text-xl font-black text-gray-900" style={{ fontFamily: "'Outfit', sans-serif" }}>Recent Orders</h3>
            <Link to="/admin/orders" className="text-[10px] font-black text-amber-600 uppercase tracking-widest hover:underline flex items-center gap-1">
              View All <MdArrowForward />
            </Link>
          </div>
          
          <div className="flex-1">
            {loading ? (
              <div className="p-20 text-center"><div className="w-10 h-10 border-4 border-amber-500 border-t-transparent rounded-full animate-spin mx-auto"></div></div>
            ) : recentOrders.length > 0 ? (
              <div className="divide-y divide-gray-50">
                {recentOrders.map((order) => (
                  <div key={order._id} className="p-6 flex items-center justify-between hover:bg-gray-50/50 transition-all group">
                    <div className="flex items-center gap-5">
                       <div className="w-12 h-12 bg-gray-50 rounded-2xl flex items-center justify-center text-xs font-black text-gray-400 group-hover:bg-amber-100 group-hover:text-amber-600 transition-all capitalize">
                         {order.customer.name[0]}
                       </div>
                       <div>
                          <p className="text-sm font-black text-gray-900 tracking-tight">{order.orderNumber}</p>
                          <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">{order.customer.name}</p>
                       </div>
                    </div>
                    <div className="flex items-center gap-8">
                       <div className="text-right hidden sm:block">
                          <p className="text-xs font-black text-gray-900">PKR {order.total.toLocaleString()}</p>
                          <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">{new Date(order.createdAt).toLocaleDateString()}</p>
                       </div>
                       <span className={`px-2.5 py-1 rounded-full text-[9px] font-black uppercase tracking-[0.1em] ${statusColors[order.status] || 'bg-gray-100 text-gray-500'}`}>
                         {order.status.replace('_', ' ')}
                       </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-80 text-gray-400 opacity-30">
                <div className="text-6xl mb-4">📜</div>
                <p className="text-sm font-black uppercase tracking-widest">No recent orders yet</p>
              </div>
            )}
          </div>
        </section>

        {/* Top Products */}
        <section className="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm overflow-hidden flex flex-col">
          <div className="p-8 border-b border-gray-50 flex items-center justify-between">
            <h3 className="text-xl font-black text-gray-900" style={{ fontFamily: "'Outfit', sans-serif" }}>Top Sellers</h3>
            <MdTrendingUp size={24} className="text-gray-200" />
          </div>
          
          <div className="flex-1">
            {loading ? (
              <div className="p-20 text-center"><div className="w-10 h-10 border-4 border-amber-500 border-t-transparent rounded-full animate-spin mx-auto"></div></div>
            ) : topProducts.length > 0 ? (
              <div className="divide-y divide-gray-50">
                {topProducts.map((product) => (
                  <div key={product._id} className="p-5 flex items-center gap-4 hover:bg-gray-50/50 transition-all">
                    <img 
                      src={product.images?.[0]?.url || 'https://via.placeholder.com/48'} 
                      alt={product.name} 
                      className="w-12 h-12 rounded-xl object-cover border border-gray-50"
                    />
                    <div className="flex-1 min-w-0">
                       <p className="text-xs font-black text-gray-900 truncate uppercase tracking-tight">{product.name}</p>
                       <p className="text-[10px] text-amber-500 font-black uppercase tracking-widest mt-0.5">{product.sold} Sold</p>
                    </div>
                    <div className="text-right">
                       <p className="text-xs font-black text-gray-900">PKR {product.price.toLocaleString()}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-80 text-gray-400 opacity-30">
                <div className="text-6xl mb-4">📊</div>
                <p className="text-sm font-black uppercase tracking-widest">No sales data yet</p>
              </div>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}
