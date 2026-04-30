import { useState, useEffect } from 'react';
import { getAllOrders, updateOrderStatus, deleteOrder } from '../../api/orderApi';
import toast from 'react-hot-toast';
import { MdOutlineReceiptLong, MdSearch, MdFilterList, MdDeleteOutline, MdOutlineLocalShipping, MdVisibility, MdClose } from 'react-icons/md';

export default function ManageOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const data = await getAllOrders();
      setOrders(data.orders || []);
    } catch (error) {
      toast.error('Failed to load orders');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (orderId, newStatus) => {
    setUpdating(true);
    try {
      const response = await updateOrderStatus(orderId, newStatus);
      if (response.success) {
        toast.success(`Order #${response.order.orderNumber} updated to ${newStatus}`);
        setOrders(orders.map(o => o._id === orderId ? response.order : o));
        if (selectedOrder?._id === orderId) setSelectedOrder(response.order);
      }
    } catch (error) {
      toast.error('Update failed');
    } finally {
      setUpdating(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this order record?')) return;
    try {
      await deleteOrder(id);
      toast.success('Order record deleted');
      setOrders(orders.filter(o => o._id !== id));
      if (selectedOrder?._id === id) setSelectedOrder(null);
    } catch (error) {
      toast.error('Deletion failed');
    }
  };

  const statusOptions = ['pending', 'confirmed', 'processing', 'out_for_delivery', 'delivered', 'cancelled', 'returned'];

  const statusColors = {
    pending: 'bg-amber-100 text-amber-700',
    confirmed: 'bg-blue-100 text-blue-700',
    processing: 'bg-indigo-100 text-indigo-700',
    out_for_delivery: 'bg-orange-100 text-orange-700',
    delivered: 'bg-green-100 text-green-700',
    cancelled: 'bg-red-100 text-red-700',
    returned: 'bg-gray-100 text-gray-700',
  };

  const filteredOrders = orders.filter(o => {
    const matchesSearch = o.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         o.customer.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || o.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="p-6 sm:p-10 animate-fade-in">
      <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 mb-10">
        <div>
          <h1 className="text-3xl font-black text-gray-900 mb-2" style={{ fontFamily: "'Outfit', sans-serif" }}>Manage Orders</h1>
          <p className="text-gray-500 font-medium">View and update customer order statuses</p>
        </div>
        <div className="flex bg-white rounded-2xl p-2 shadow-sm border border-gray-100">
           <div className="px-6 py-2 text-center border-r border-gray-100">
              <div className="text-xl font-black text-gray-900">{orders.length}</div>
              <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Total</div>
           </div>
           <div className="px-6 py-2 text-center">
              <div className="text-xl font-black text-amber-500">{orders.filter(o => o.status === 'pending').length}</div>
              <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Pending</div>
           </div>
        </div>
      </header>

      {/* Filters */}
      <div className="bg-white p-4 rounded-3xl shadow-sm border border-gray-100 mb-8 flex flex-col sm:flex-row gap-4 items-center">
        <div className="relative flex-1 w-full">
          <MdSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Search by Order # or Customer..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-gray-50 border-none rounded-2xl text-sm focus:ring-2 focus:ring-amber-400 transition-all font-medium"
          />
        </div>
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <MdFilterList className="text-gray-400" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="flex-1 sm:w-48 py-3 bg-gray-50 border-none rounded-2xl text-sm font-bold text-gray-700 focus:ring-2 focus:ring-amber-400 transition-all cursor-pointer"
          >
            <option value="all">All Statuses</option>
            {statusOptions.map(s => <option key={s} value={s} className="capitalize">{s.replace('_', ' ')}</option>)}
          </select>
        </div>
        <button onClick={fetchOrders} className="p-3 bg-gray-900 text-white rounded-2xl hover:bg-amber-500 transition-all active:scale-95">
          <MdOutlineLocalShipping size={20} />
        </button>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-[2.5rem] shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left">
            <thead>
              <tr className="bg-gray-50/50 border-b border-gray-100 uppercase tracking-widest text-[10px] font-black text-gray-400">
                <th className="px-8 py-5">Order Info</th>
                <th className="px-8 py-5">Customer</th>
                <th className="px-8 py-5">Amount</th>
                <th className="px-8 py-5">Status</th>
                <th className="px-8 py-5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {loading ? (
                <tr><td colSpan="5" className="p-20 text-center"><div className="w-8 h-8 border-4 border-amber-500 border-t-transparent rounded-full animate-spin mx-auto"></div></td></tr>
              ) : filteredOrders.length > 0 ? (
                filteredOrders.map((order) => (
                  <tr key={order._id} className="hover:bg-gray-50/30 transition-colors group">
                    <td className="px-8 py-5">
                      <div className="font-black text-gray-900 text-xs tracking-tight mb-0.5">{order.orderNumber}</div>
                      <div className="text-[10px] font-bold text-gray-400">{new Date(order.createdAt).toLocaleString()}</div>
                    </td>
                    <td className="px-8 py-5">
                      <div className="font-bold text-gray-800 text-sm">{order.customer.name}</div>
                      <div className="text-xs text-gray-400">{order.customer.city}</div>
                    </td>
                    <td className="px-8 py-5">
                      <div className="font-black text-gray-900 text-sm">PKR {order.total?.toLocaleString()}</div>
                      <div className="text-[10px] font-bold text-amber-600 uppercase tracking-widest">{order.paymentMethod}</div>
                    </td>
                    <td className="px-8 py-5">
                       <span className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${statusColors[order.status] || 'bg-gray-100 text-gray-500'}`}>
                         {order.status.replace('_', ' ')}
                       </span>
                    </td>
                    <td className="px-8 py-5 text-right flex items-center justify-end gap-2">
                       <button 
                         onClick={() => setSelectedOrder(order)}
                         className="p-2.5 text-gray-400 hover:text-amber-500 hover:bg-amber-50 rounded-xl transition-all"
                         title="View Details"
                       >
                         <MdVisibility size={20} />
                       </button>
                       <button 
                         onClick={() => handleDelete(order._id)}
                         className="p-2.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
                         title="Delete Order"
                       >
                         <MdDeleteOutline size={20} />
                       </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr><td colSpan="5" className="p-20 text-center text-gray-400 font-medium whitespace-nowrap">No orders match your criteria.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Order Details Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 animate-fade-in">
          <div className="absolute inset-0 bg-gray-900/40 backdrop-blur-sm" onClick={() => setSelectedOrder(null)} />
          <div className="bg-white w-full max-w-4xl rounded-[3rem] shadow-2xl overflow-hidden relative max-h-[90vh] flex flex-col">
            <header className="p-8 border-b border-gray-100 flex items-center justify-between sticky top-0 bg-white">
               <div>
                  <h2 className="text-2xl font-black text-gray-900 leading-none" style={{ fontFamily: "'Outfit', sans-serif" }}>
                    Order Details
                  </h2>
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mt-2">{selectedOrder.orderNumber}</p>
               </div>
               <button onClick={() => setSelectedOrder(null)} className="p-3 bg-gray-50 hover:bg-gray-100 rounded-2xl transition-all">
                  <MdClose size={24} className="text-gray-400" />
               </button>
            </header>

            <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
               <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mb-10">
                  {/* Status Update */}
                  <div className="space-y-4">
                     <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest">Update Order Status</h3>
                     <div className="flex flex-wrap gap-2">
                        {statusOptions.map((s) => (
                           <button
                             key={s}
                             disabled={updating}
                             onClick={() => handleStatusChange(selectedOrder._id, s)}
                             className={`px-4 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all
                               ${selectedOrder.status === s 
                                 ? statusColors[s] + ' ring-2 ring-offset-1 ring-current' 
                                 : 'bg-gray-50 text-gray-400 hover:bg-gray-100 hover:text-gray-600'}`}
                           >
                             {s.replace('_', ' ')}
                           </button>
                        ))}
                     </div>
                  </div>

                  {/* Customer Info */}
                  <div className="space-y-2 bg-gray-50/50 p-6 rounded-3xl border border-gray-100">
                     <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-2">Customer Details</h3>
                     <p className="text-sm font-black text-gray-900">{selectedOrder.customer.name}</p>
                     <p className="text-xs text-gray-500 font-bold">{selectedOrder.customer.email}</p>
                     <p className="text-xs text-gray-500 font-bold">{selectedOrder.customer.phone}</p>
                     <p className="text-xs text-gray-500 leading-relaxed mt-2 italic">"{selectedOrder.customer.address.street}, {selectedOrder.customer.address.city}"</p>
                  </div>
               </div>

               {/* Items List */}
               <div className="space-y-4">
                  <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest">Order Items ({selectedOrder.items.length})</h3>
                  <div className="bg-white border border-gray-100 rounded-3xl overflow-hidden shadow-inner">
                     {selectedOrder.items.map((item, idx) => (
                        <div key={idx} className="flex items-center gap-6 p-4 border-b border-gray-50 last:border-none">
                           <div className="w-16 h-16 bg-gray-50 rounded-2xl overflow-hidden border border-gray-50 flex-shrink-0">
                              <img src={item.image} className="w-full h-full object-cover" alt={item.name} />
                           </div>
                           <div className="flex-1 min-w-0">
                              <p className="text-sm font-black text-gray-900 truncate tracking-tight">{item.name}</p>
                              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">Price: PKR {item.price.toLocaleString()} • Qty: {item.quantity}</p>
                           </div>
                           <div className="text-right">
                              <p className="text-sm font-black text-gray-900">PKR {(item.price * item.quantity).toLocaleString()}</p>
                           </div>
                        </div>
                     ))}
                  </div>
               </div>

               {/* Summary */}
               <div className="mt-10 flex flex-col items-end gap-2 border-t border-gray-100 pt-6">
                  <div className="flex justify-between w-full max-w-xs text-xs font-bold text-gray-400 uppercase tracking-widest">
                     <span>Subtotal</span>
                     <span className="text-gray-900">PKR {selectedOrder.subtotal?.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between w-full max-w-xs text-xs font-bold text-gray-400 uppercase tracking-widest">
                     <span>Delivery</span>
                     <span className="text-gray-900">PKR {selectedOrder.shippingCost?.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between w-full max-w-xs font-black text-2xl text-amber-500 mt-2 border-t border-gray-100 pt-2">
                     <span className="text-gray-900">Total</span>
                     <span>PKR {selectedOrder.total?.toLocaleString()}</span>
                  </div>
               </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
