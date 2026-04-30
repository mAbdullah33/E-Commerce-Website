import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import axios from '../api/axios';
import toast from 'react-hot-toast';

export default function CartPage() {
  const { items, dispatch, totalItems, totalPrice } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [settings, setSettings] = useState({ shippingFee: 200, freeShippingThreshold: 5000 });

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const { data } = await axios.get('/settings');
        if (data.success) setSettings(data.config);
      } catch (error) { console.error('Settings fetch error', error); }
    };
    fetchSettings();
  }, []);

  const updateQty = (item, qty) => {
    if (qty < 1) {
      dispatch({ type: 'REMOVE_ITEM', payload: item._id });
      toast('Item removed from cart');
    } else {
      if (qty > (item.stock || 999)) {
        toast.error(`Only ${item.stock} in stock!`, { icon: '⚠️' });
        return;
      }
      dispatch({ type: 'UPDATE_QTY', payload: { id: item._id, qty } });
    }
  };

  const handleCheckout = () => {
    if (!user) {
      toast.error('Please login to place an order.');
      navigate('/login?redirect=checkout');
      return;
    }
    navigate('/checkout');
  };

  const shippingFee = totalPrice >= settings.freeShippingThreshold ? 0 : settings.shippingFee;
  const grandTotal = totalPrice + shippingFee;

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-8xl mb-4">🛒</div>
          <h2 className="text-2xl font-black text-gray-900 mb-2">Your cart is empty</h2>
          <p className="text-gray-500 mb-6">Add some beautiful panels to get started!</p>
          <Link to="/products/pvc-panels" className="px-7 py-3.5 bg-amber-500 text-white font-bold rounded-xl hover:bg-amber-600 transition-colors inline-block">
            Browse Products
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-black text-gray-900" style={{ fontFamily: "'Outfit', sans-serif" }}>
            Shopping Cart
          </h1>
          <span className="text-sm text-gray-500 bg-white border border-gray-200 px-3 py-1.5 rounded-full font-medium">
            {totalItems} {totalItems === 1 ? 'item' : 'items'}
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-4">
            {items.map(item => (
              <div key={item._id} className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 hover:border-amber-200 transition-colors">
                <div className="flex gap-4 items-start">
                  <Link to={`/product/${item._id}`} className="flex-shrink-0">
                    <img
                      src={item.images[0]}
                      alt={item.name}
                      className="w-20 h-20 sm:w-24 sm:h-24 object-cover rounded-xl hover:opacity-90 transition-opacity"
                      onError={e => { e.target.src = 'https://via.placeholder.com/96?text=Panel'; }}
                    />
                  </Link>

                  <div className="flex-1 min-w-0">
                    <Link to={`/product/${item._id}`}>
                      <h3 className="font-bold text-gray-900 hover:text-amber-600 transition-colors text-sm sm:text-base">
                        {item.name}
                      </h3>
                    </Link>
                    <p className="text-xs text-gray-400 mt-0.5 capitalize">{item.category === 'pvc' ? 'PVC Panel' : 'Hard Panel'}</p>
                    <p className="text-xs text-gray-500 mt-1">{item.dimensions} · {item.thickness}</p>

                    <div className="flex items-center justify-between mt-3">
                      <div className="flex items-center bg-gray-50 border border-gray-200 rounded-xl overflow-hidden">
                        <button onClick={() => updateQty(item, item.quantity - 1)} className="w-9 h-9 flex items-center justify-center hover:bg-gray-200 transition-colors font-bold text-gray-700">−</button>
                        <span className="w-10 text-center text-sm font-black text-gray-900">{item.quantity}</span>
                        <button onClick={() => updateQty(item, item.quantity + 1)} className="w-9 h-9 flex items-center justify-center hover:bg-gray-200 transition-colors font-bold text-gray-700">+</button>
                      </div>
                      <div className="text-right">
                        <div className="font-black text-gray-900">PKR {(item.price * item.quantity).toLocaleString()}</div>
                        <div className="text-xs text-gray-400">@ PKR {item.price.toLocaleString()}</div>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => { dispatch({ type: 'REMOVE_ITEM', payload: item._id }); toast('Item removed'); }}
                    className="flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-lg text-gray-300 hover:text-red-500 hover:bg-red-50 transition-all"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </div>
            ))}

            <div className="flex items-center justify-between pt-2">
              <Link to="/products/pvc-panels" className="flex items-center gap-1.5 text-sm text-amber-600 font-semibold hover:underline">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                Continue Shopping
              </Link>
              <button onClick={() => { dispatch({ type: 'CLEAR' }); toast('Cart cleared'); }} className="text-sm text-gray-400 hover:text-red-500 font-medium transition-colors">
                Clear Cart
              </button>
            </div>
          </div>

          <div className="lg:col-span-1">
            <div className="bg-white rounded-[2.5rem] p-8 shadow-sm border border-gray-100 sticky top-24 overflow-hidden relative">
              <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500 opacity-[0.03] -mr-16 -mt-16 rounded-full text-xs" />
              <h2 className="text-xl font-black text-gray-900 mb-6 flex items-center gap-2">
                 <span className="w-1.5 h-6 bg-amber-500 rounded-full inline-block"></span>
                 Order Summary
              </h2>
              <div className="space-y-4 mb-6">
                <div className="flex justify-between text-sm font-bold text-gray-400 uppercase tracking-widest">
                  <span>Subtotal</span>
                  <span className="text-gray-900">PKR {totalPrice.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm font-bold text-gray-400 uppercase tracking-widest">
                  <span>Delivery</span>
                  <span className={`font-black ${shippingFee === 0 ? 'text-green-600' : 'text-gray-900'}`}>
                    {shippingFee === 0 ? 'FREE' : `PKR ${shippingFee}`}
                  </span>
                </div>
              </div>

              {totalPrice < settings.freeShippingThreshold && (
                <div className="bg-amber-50 border border-amber-100 rounded-2xl p-4 mb-6">
                  <p className="text-xs text-amber-700 font-black uppercase tracking-tight mb-2">
                    Free Delivery Goal 🚀
                  </p>
                  <p className="text-[10px] text-gray-500 font-bold mb-3">Add <strong>PKR {(settings.freeShippingThreshold - totalPrice).toLocaleString()}</strong> more for free delivery.</p>
                  <div className="h-2 bg-amber-100 rounded-full overflow-hidden">
                    <div className="h-full bg-amber-500 rounded-full transition-all duration-700" style={{ width: `${Math.min(100, (totalPrice / settings.freeShippingThreshold) * 100)}%` }} />
                  </div>
                </div>
              )}

              <div className="border-t border-gray-100 pt-6 mb-8">
                <div className="flex justify-between items-end">
                  <span className="font-black text-gray-400 text-xs uppercase tracking-[0.2em]">Grand Total</span>
                  <div className="text-right">
                    <span className="font-black text-2xl text-amber-500 block">PKR {grandTotal.toLocaleString()}</span>
                    {shippingFee === 0 && <p className="text-[10px] text-green-600 font-black uppercase tracking-widest mt-1 animate-pulse">Free shipping applied!</p>}
                  </div>
                </div>
              </div>

              <button 
                onClick={handleCheckout}
                className="w-full py-4 bg-gray-900 text-white font-black rounded-2xl hover:bg-amber-500 shadow-xl shadow-gray-900/10 hover:shadow-amber-500/20 transition-all active:scale-95 text-xs tracking-widest uppercase mb-4"
              >
                Proceed to Checkout →
              </button>

              <div className="flex items-center justify-center gap-4 mt-4 pt-4 border-t border-gray-50">
                {['🔒 Secure', '🚚 Fast', '↩️ Returns'].map(b => (
                  <span key={b} className="text-xs text-gray-400">{b}</span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}