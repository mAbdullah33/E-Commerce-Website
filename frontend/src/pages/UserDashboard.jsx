import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import axios from '../api/axios';
import { MdOutlineReceiptLong, MdOutlineLocalShipping, MdOutlineCancel, MdOutlineCheckCircle, MdArrowForward } from 'react-icons/md';

export default function UserDashboard() {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const { data } = await axios.get('/orders/my-orders');
        setOrders(data.orders || []);
      } catch (error) {
        console.error('Failed to fetch orders:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  const getStatusIcon = (status) => {
    switch (status) {
      case 'cancelled': return <MdOutlineCancel className="text-red-500" />;
      case 'delivered': return <MdOutlineCheckCircle className="text-green-500" />;
      default: return <MdOutlineLocalShipping className="text-amber-500" />;
    }
  };

  const statusColors = {
    pending: 'bg-amber-100 text-amber-700',
    confirmed: 'bg-blue-100 text-blue-700',
    processing: 'bg-indigo-100 text-indigo-700',
    shipped: 'bg-orange-100 text-orange-700',
    delivered: 'bg-green-100 text-green-700',
    cancelled: 'bg-red-100 text-red-700',
  };

  return (
    <div className="min-h-screen bg-gray-50/50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        <header className="mb-10">
          <h1 className="text-3xl font-black text-gray-900 mb-2" style={{ fontFamily: "'Outfit', sans-serif" }}>Welcome, {user?.name}</h1>
          <p className="text-gray-500 font-medium">Track your orders and manage your account</p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12 text-center">
          <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-gray-100">
             <div className="text-4xl mb-4 font-black text-amber-500">{orders.length}</div>
             <div className="text-xs font-black text-gray-400 uppercase tracking-widest">Total Orders</div>
          </div>
          <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-gray-100">
             <div className="text-4xl mb-4 font-black text-green-500">{orders.filter(o => o.status === 'delivered').length}</div>
             <div className="text-xs font-black text-gray-400 uppercase tracking-widest">Delivered</div>
          </div>
          <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-gray-100">
             <div className="text-4xl mb-4 font-black text-blue-500">{orders.filter(o => !['delivered', 'cancelled'].includes(o.status)).length}</div>
             <div className="text-xs font-black text-gray-400 uppercase tracking-widest">In Progress</div>
          </div>
        </div>

        <div className="bg-white rounded-[2.5rem] shadow-sm border border-gray-100 overflow-hidden">
          <div className="px-8 py-6 border-b border-gray-100 flex items-center justify-between">
            <h2 className="text-xl font-black text-gray-900" style={{ fontFamily: "'Outfit', sans-serif" }}>Recent Orders</h2>
            <MdOutlineReceiptLong size={24} className="text-gray-300" />
          </div>

          <div className="divide-y divide-gray-100">
            {loading ? (
              <div className="p-20 text-center"><div className="w-10 h-10 border-4 border-amber-500 border-t-transparent rounded-full animate-spin mx-auto"></div></div>
            ) : orders.length > 0 ? (
              orders.map((order) => (
                <div key={order._id} className="p-6 sm:p-8 hover:bg-gray-50/50 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-6 group">
                  <div className="flex items-center gap-5">
                    <div className="w-14 h-14 bg-gray-50 rounded-2xl flex items-center justify-center text-gray-400 group-hover:scale-110 transition-transform">
                      {getStatusIcon(order.status)}
                    </div>
                    <div>
                      <div className="flex items-center gap-3 mb-1">
                        <span className="text-sm font-black text-gray-900 tracking-tight">{order.orderNumber}</span>
                        <span className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${statusColors[order.status] || 'bg-gray-100 text-gray-500'}`}>
                          {order.status}
                        </span>
                      </div>
                      <p className="text-xs text-gray-500 font-bold">{new Date(order.createdAt).toLocaleDateString()} • {order.items.length} Items</p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between sm:justify-end gap-10">
                    <div className="text-right">
                      <p className="text-xs font-black text-gray-400 uppercase tracking-widest mb-1">Total Amount</p>
                      <p className="text-lg font-black text-gray-900">PKR {order.total?.toLocaleString()}</p>
                    </div>
                    <Link 
                      to={`/order/${order._id}`}
                      className="w-10 h-10 bg-gray-900 text-white rounded-xl flex items-center justify-center hover:bg-amber-500 transition-all active:scale-95 shadow-lg shadow-gray-900/10 hover:shadow-amber-500/30"
                    >
                      <MdArrowForward size={20} />
                    </Link>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-20 text-center">
                <div className="text-5xl mb-4 opacity-10">📦</div>
                <h3 className="text-xl font-black text-gray-900 mb-2">No orders found</h3>
                <p className="text-gray-500 mb-6 font-medium">You haven't placed any orders yet.</p>
                <Link to="/products/pvc-panels" className="inline-flex items-center gap-2 px-8 py-3.5 bg-gray-900 text-white text-xs font-black rounded-2xl hover:bg-amber-500 hover:shadow-lg hover:shadow-amber-500/20 transition-all active:scale-95">
                  START SHOPPING
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
