import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import axios from '../api/axios';
import { MdOutlineArrowBack, MdOutlineReceiptLong, MdOutlineLocalShipping, MdOutlineCancel, MdOutlineCheckCircle, MdOutlineWatchLater, MdOutlineLocationOn, MdOutlinePayment } from 'react-icons/md';
import toast from 'react-hot-toast';

export default function OrderDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const { data } = await axios.get(`/orders/${id}`);
        if (data.success) {
          setOrder(data.order);
        }
      } catch (error) {
        console.error('Failed to fetch order details:', error);
        toast.error('Order not found or unauthorized');
        navigate('/dashboard');
      } finally {
        setLoading(false);
      }
    };
    fetchOrder();
  }, [id, navigate]);

  const getStatusInfo = (status) => {
    switch (status) {
      case 'pending': return { icon: <MdOutlineWatchLater />, color: 'text-amber-500', bg: 'bg-amber-50', label: 'Order Pending' };
      case 'confirmed': return { icon: <MdOutlineCheckCircle />, color: 'text-blue-500', bg: 'bg-blue-50', label: 'Confirmed' };
      case 'processing': return { icon: <MdOutlineWatchLater />, color: 'text-indigo-500', bg: 'bg-indigo-50', label: 'Processing' };
      case 'out_for_delivery': return { icon: <MdOutlineLocalShipping />, color: 'text-orange-500', bg: 'bg-orange-50', label: 'Out for Delivery' };
      case 'delivered': return { icon: <MdOutlineCheckCircle />, color: 'text-green-500', bg: 'bg-green-50', label: 'Delivered' };
      case 'cancelled': return { icon: <MdOutlineCancel />, color: 'text-red-500', bg: 'bg-red-50', label: 'Cancelled' };
      default: return { icon: <MdOutlineReceiptLong />, color: 'text-gray-500', bg: 'bg-gray-50', label: status };
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="w-12 h-12 border-4 border-amber-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!order) return null;

  const statusInfo = getStatusInfo(order.status);

  return (
    <div className="min-h-screen bg-gray-50/50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <Link to="/dashboard" className="inline-flex items-center gap-2 text-sm font-black text-gray-400 hover:text-amber-500 transition-all mb-8 uppercase tracking-widest group">
          <MdOutlineArrowBack className="group-hover:-translate-x-1 transition-transform" />
          Back to Dashboard
        </Link>

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-3xl font-black text-gray-900" style={{ fontFamily: "'Outfit', sans-serif" }}>
                Order {order.orderNumber}
              </h1>
              <span className={`px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest ${statusInfo.bg} ${statusInfo.color}`}>
                {statusInfo.label}
              </span>
            </div>
            <p className="text-gray-500 font-medium">Placed on {new Date(order.createdAt).toLocaleDateString()} at {new Date(order.createdAt).toLocaleTimeString()}</p>
          </div>
          <div className="text-left md:text-right">
             <p className="text-xs font-black text-gray-400 uppercase tracking-widest mb-1">Status Summary</p>
             <div className={`flex items-center md:justify-end gap-2 text-lg font-black ${statusInfo.color}`}>
                {statusInfo.icon}
                <span className="capitalize">{order.status.replace('_', ' ')}</span>
             </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Items */}
            <div className="bg-white rounded-[2.5rem] shadow-sm border border-gray-100 overflow-hidden">
              <div className="px-8 py-6 border-b border-gray-100">
                <h3 className="text-lg font-black text-gray-900 uppercase tracking-tight flex items-center gap-2">
                   <MdOutlineReceiptLong className="text-amber-500" />
                   Order Items
                </h3>
              </div>
              <div className="divide-y divide-gray-50">
                {order.items.map((item, i) => (
                  <div key={i} className="p-6 flex items-center gap-6">
                    <img 
                      src={item.image || 'https://via.placeholder.com/80?text=Panel'} 
                      alt={item.name} 
                      className="w-20 h-20 rounded-2xl object-cover border border-gray-100"
                    />
                    <div className="flex-1">
                      <h4 className="font-black text-gray-900 mb-1">{item.name}</h4>
                      <p className="text-xs text-gray-400 font-bold uppercase tracking-widest">Qty: {item.quantity} · PKR {item.price.toLocaleString()} each</p>
                    </div>
                    <div className="text-right">
                       <p className="font-black text-gray-900">PKR {(item.price * item.quantity).toLocaleString()}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="p-8 bg-gray-50/50 space-y-3">
                 <div className="flex justify-between text-sm font-bold text-gray-500">
                    <span>Subtotal</span>
                    <span>PKR {order.subtotal?.toLocaleString()}</span>
                 </div>
                 <div className="flex justify-between text-sm font-bold text-gray-500">
                    <span>Shipping Fee</span>
                    <span>PKR {order.shippingCost?.toLocaleString()}</span>
                 </div>
                 <div className="flex justify-between text-xl font-black text-gray-900 pt-3 border-t border-gray-100">
                    <span>Total Amount</span>
                    <span className="text-amber-500">PKR {order.total?.toLocaleString()}</span>
                 </div>
              </div>
            </div>

            {/* Status History */}
            {order.statusHistory?.length > 0 && (
              <div className="bg-white rounded-[2.5rem] shadow-sm border border-gray-100 p-8">
                <h3 className="text-lg font-black text-gray-900 mb-8 uppercase tracking-tight flex items-center gap-2">
                   <MdOutlineWatchLater className="text-amber-500" />
                   Activity Log
                </h3>
                <div className="space-y-8 relative before:absolute before:inset-0 before:left-3 before:w-0.5 before:bg-gray-50">
                   {order.statusHistory.map((history, i) => (
                     <div key={i} className="relative pl-10">
                        <div className={`absolute left-0 top-1 w-6 h-6 rounded-full border-4 border-white shadow-sm flex items-center justify-center text-[10px] ${getStatusInfo(history.status).bg} ${getStatusInfo(history.status).color}`}>
                           {getStatusInfo(history.status).icon}
                        </div>
                        <div>
                           <div className="flex items-center gap-3 mb-1">
                              <span className="font-black text-sm text-gray-900 uppercase tracking-tight">{history.status.replace('_', ' ')}</span>
                              <span className="text-[10px] text-gray-400 font-bold">{new Date(history.timestamp).toLocaleString()}</span>
                           </div>
                           <p className="text-sm text-gray-500 font-medium">{history.note}</p>
                        </div>
                     </div>
                   ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            {/* Delivery Info */}
            <div className="bg-white rounded-[2.5rem] shadow-sm border border-gray-100 p-8">
              <h3 className="text-sm font-black text-gray-400 uppercase tracking-[0.2em] mb-6 flex items-center gap-2">
                 <MdOutlineLocationOn className="text-amber-500" size={18} />
                 Shipping Details
              </h3>
              <div className="space-y-4">
                 <div>
                    <p className="text-xs font-black text-gray-400 uppercase tracking-widest mb-1">Customer</p>
                    <p className="text-sm font-bold text-gray-900">{order.customer.name}</p>
                 </div>
                 <div>
                    <p className="text-xs font-black text-gray-400 uppercase tracking-widest mb-1">Address</p>
                    <p className="text-sm font-bold text-gray-900 leading-relaxed">
                       {order.customer.address.street}<br />
                       {order.customer.address.city}, {order.customer.address.state}<br />
                       {order.customer.address.postalCode}
                    </p>
                 </div>
                 <div>
                    <p className="text-xs font-black text-gray-400 uppercase tracking-widest mb-1">Phone</p>
                    <p className="text-sm font-bold text-gray-900">{order.customer.phone}</p>
                 </div>
              </div>
            </div>

            {/* Payment Info */}
            <div className="bg-white rounded-[2.5rem] shadow-sm border border-gray-100 p-8">
              <h3 className="text-sm font-black text-gray-400 uppercase tracking-[0.2em] mb-6 flex items-center gap-2">
                 <MdOutlinePayment className="text-amber-500" size={18} />
                 Payment Method
              </h3>
              <div className="space-y-4">
                 <div className="flex items-center gap-3 bg-gray-50 p-4 rounded-2xl border border-gray-100">
                    <div className="w-10 h-10 bg-white rounded-xl shadow-sm flex items-center justify-center font-black text-amber-500">
                       {order.paymentMethod === 'COD' ? '💵' : '🏦'}
                    </div>
                    <div>
                       <p className="text-xs font-black text-gray-900">{order.paymentMethod}</p>
                       <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">{order.paymentStatus}</p>
                    </div>
                 </div>
                 {order.notes && (
                   <div>
                      <p className="text-xs font-black text-gray-400 uppercase tracking-widest mb-1 text-xs">Note</p>
                      <p className="text-xs font-medium text-gray-500 italic">"{order.notes}"</p>
                   </div>
                 )}
              </div>
            </div>

            {/* Help */}
            <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-[2.5rem] p-8 text-white shadow-xl shadow-gray-900/20">
               <h3 className="font-black mb-2" style={{ fontFamily: "'Outfit', sans-serif" }}>Need Assistance?</h3>
               <p className="text-xs text-gray-300 font-medium mb-6 leading-relaxed">If you have any questions about your order, our support team is here to help you 24/7.</p>
               <Link to="/contact" className="inline-block w-full text-center py-3 bg-white text-gray-900 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-amber-500 hover:text-white transition-all">
                  CONTACT SUPPORT
               </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
