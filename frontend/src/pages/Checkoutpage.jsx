import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import axios from '../api/axios';
import * as orderApi from '../api/orderApi';
import toast from 'react-hot-toast';

const steps = ['Cart', 'Shipping', 'Payment', 'Confirm'];

const cities = [
  'Lahore', 'Karachi', 'Islamabad', 'Rawalpindi', 'Faisalabad',
  'Multan', 'Gujranwala', 'Peshawar', 'Quetta', 'Sialkot',
];

function StepIndicator({ current }) {
  return (
    <div className="flex items-center justify-center mb-10">
      {steps.map((step, i) => (
        <div key={step} className="flex items-center">
          <div className={`flex items-center gap-2 ${i <= current ? 'text-amber-600' : 'text-gray-400'}`}>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-black transition-all
              ${i < current ? 'bg-green-500 text-white'
                : i === current ? 'bg-amber-500 text-white ring-4 ring-amber-100'
                : 'bg-gray-100 text-gray-400'}`}>
              {i < current ? '✓' : i + 1}
            </div>
            <span className={`hidden sm:block text-sm font-semibold ${i === current ? 'text-amber-600' : i < current ? 'text-green-600' : 'text-gray-400'}`}>
              {step}
            </span>
          </div>
          {i < steps.length - 1 && (
            <div className={`w-12 sm:w-20 h-0.5 mx-2 transition-colors ${i < current ? 'bg-green-400' : 'bg-gray-200'}`} />
          )}
        </div>
      ))}
    </div>
  );
}

function OrderSummaryPanel({ items, totalPrice, settings }) {
  const shipping = totalPrice >= settings.freeShippingThreshold ? 0 : settings.shippingFee;
  return (
    <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm p-8 sticky top-24 overflow-hidden relative">
      <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500 opacity-[0.03] -mr-16 -mt-16 rounded-full" />
      <h3 className="font-black text-gray-900 mb-6 flex items-center gap-2 text-lg">
        <span className="w-1.5 h-6 bg-amber-500 rounded-full inline-block"></span>
        Order Summary
      </h3>
      <div className="space-y-4 mb-6 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
        {items.map(item => (
          <div key={item._id} className="flex gap-4 items-center group">
            <div className="w-16 h-16 rounded-2xl overflow-hidden bg-gray-50 flex-shrink-0 border border-gray-50 group-hover:border-amber-200 transition-all">
                <img
                  src={item.images?.[0]?.url || 'https://via.placeholder.com/64'}
                  alt={item.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  onError={e => { e.target.src = 'https://via.placeholder.com/64'; }}
                />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-black text-gray-900 truncate uppercase tracking-tight">{item.name}</p>
              <p className="text-[10px] text-gray-400 font-extrabold uppercase tracking-widest mt-0.5">Quantity: {item.quantity}</p>
            </div>
            <span className="text-xs font-black text-gray-900 flex-shrink-0 bg-gray-50 px-2 py-1 rounded-lg">
              {(item.price * item.quantity).toLocaleString()}
            </span>
          </div>
        ))}
      </div>
      <div className="border-t border-gray-100 pt-6 space-y-3">
        <div className="flex justify-between text-xs font-bold text-gray-400 uppercase tracking-widest">
          <span>Subtotal</span>
          <span className="text-gray-900">PKR {totalPrice.toLocaleString()}</span>
        </div>
        <div className="flex justify-between text-xs font-bold text-gray-400 uppercase tracking-widest">
          <span>Delivery</span>
          <span className={`font-black ${shipping === 0 ? 'text-green-600' : 'text-gray-900'}`}>
            {shipping === 0 ? 'FREE' : `PKR ${shipping}`}
          </span>
        </div>
        <div className="flex justify-between font-black text-lg pt-4 border-t border-gray-100">
          <span className="text-gray-900">Total</span>
          <span className="text-amber-500">PKR {(totalPrice + shipping).toLocaleString()}</span>
        </div>
      </div>
    </div>
  );
}

export default function CheckoutPage() {
  const { items, totalPrice, dispatch } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [placedOrder, setPlacedOrder] = useState(null);
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

  const [shipping, setShipping] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    address: '',
    city: '',
    postalCode: '',
    notes: '',
  });
  
  const [payment, setPayment] = useState({ method: 'COD' });

  const shipping_fee = totalPrice >= settings.freeShippingThreshold ? 0 : settings.shippingFee;
  const grandTotal = totalPrice + shipping_fee;

  // Update shipping when user is available
  useEffect(() => {
    if (user) {
      setShipping(s => ({
        ...s,
        name: user.name || s.name,
        email: user.email || s.email,
        phone: user.phone || s.phone
      }));
    }
  }, [user]);

  if (items.length === 0 && !placedOrder) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-7xl mb-6">🛒</div>
          <h2 className="text-3xl font-black text-gray-900 mb-2" style={{ fontFamily: "'Outfit', sans-serif" }}>Your cart is empty</h2>
          <p className="text-gray-500 font-medium mb-8">Add components first before attempting checkout.</p>
          <Link to="/products/pvc-panels" className="px-10 py-4 bg-gray-900 text-white font-black rounded-2xl hover:bg-amber-500 hover:shadow-xl hover:shadow-amber-500/20 transition-all active:scale-95 text-xs tracking-widest uppercase shadow-lg shadow-gray-900/10">
            BROWSE CATALOG
          </Link>
        </div>
      </div>
    );
  }

  const validateShipping = () => {
    const { name, email, phone, address, city, postalCode } = shipping;
    if (!name || !email || !phone || !address || !city || !postalCode) {
      toast.error('Please fill all required fields');
      return false;
    }
    if (!/\S+@\S+\.\S+/.test(email)) {
      toast.error('Please enter a valid email');
      return false;
    }
    return true;
  };

  const handlePlaceOrder = async () => {
    setLoading(true);
    try {
      const orderData = {
        customer: {
          name: shipping.name,
          email: shipping.email,
          phone: shipping.phone,
          address: {
            street: shipping.address,
            city: shipping.city,
            state: 'Punjab', // Default for now
            postalCode: shipping.postalCode,
            country: 'Pakistan'
          }
        },
        items: items.map(i => ({
          product: i._id,
          name: i.name,
          image: i.images?.[0]?.url || '',
          price: i.price,
          quantity: i.quantity
        })),
        subtotal: totalPrice,
        shippingCost: shipping_fee,
        total: grandTotal,
        paymentMethod: payment.method,
        notes: shipping.notes
      };

      const response = await orderApi.createOrder(orderData);
      if (response.success) {
        setPlacedOrder(response.order);
        dispatch({ type: 'CLEAR' });
        setStep(3);
        toast.success('Awesome! Your order is placed 🚀', { duration: 5000 });
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Transaction failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-100 shadow-sm">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-4">
          <div className="flex items-center justify-between">
            <Link to="/" className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-br from-amber-500 to-orange-600 rounded-xl flex items-center justify-center">
                <span className="text-white font-black text-sm">P</span>
              </div>
              <span className="font-black text-gray-900" style={{ fontFamily: "'Outfit', sans-serif" }}>PanelCraft</span>
            </Link>
            <span className="text-sm text-gray-500 font-medium">Secure Checkout 🔒</span>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10">
        <StepIndicator current={step} />

        {/* Step 1: Shipping */}
        {step === 1 && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 sm:p-8">
                <h2 className="text-xl font-black text-gray-900 mb-6">Shipping Information</h2>
                <div className="space-y-5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1.5">Full Name *</label>
                      <input
                        type="text"
                        value={shipping.name}
                        onChange={e => setShipping(s => ({ ...s, name: e.target.value }))}
                        placeholder="Muhammad Ali"
                        className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1.5">Email *</label>
                      <input
                        type="email"
                        value={shipping.email}
                        onChange={e => setShipping(s => ({ ...s, email: e.target.value }))}
                        placeholder="you@email.com"
                        className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">Phone Number *</label>
                    <input
                      type="tel"
                      value={shipping.phone}
                      onChange={e => setShipping(s => ({ ...s, phone: e.target.value }))}
                      placeholder="03XX-XXXXXXX"
                      className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">Street Address *</label>
                    <input
                      type="text"
                      value={shipping.address}
                      onChange={e => setShipping(s => ({ ...s, address: e.target.value }))}
                      placeholder="House # 123, Street 5, Block X"
                      className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent"
                    />
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1.5">City *</label>
                      <select
                        value={shipping.city}
                        onChange={e => setShipping(s => ({ ...s, city: e.target.value }))}
                        className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400 bg-white"
                      >
                        <option value="">Select City</option>
                        {cities.map(c => <option key={c} value={c}>{c}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1.5">Postal Code</label>
                      <input
                        type="text"
                        value={shipping.postalCode}
                        onChange={e => setShipping(s => ({ ...s, postalCode: e.target.value }))}
                        placeholder="54000"
                        className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">Order Notes (optional)</label>
                    <textarea
                      value={shipping.notes}
                      onChange={e => setShipping(s => ({ ...s, notes: e.target.value }))}
                      rows={3}
                      placeholder="Any special delivery instructions..."
                      className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent resize-none"
                    />
                  </div>
                </div>

                <div className="flex gap-4 mt-8">
                  <Link to="/cart" className="flex-1 py-3.5 border-2 border-gray-200 text-gray-700 font-bold rounded-xl hover:bg-gray-50 text-center transition-colors text-sm">
                    ← Back to Cart
                  </Link>
                  <button
                    onClick={() => { if (validateShipping()) setStep(2); }}
                    className="flex-2 flex-1 py-3.5 bg-amber-500 text-white font-bold rounded-xl hover:bg-amber-600 transition-colors text-sm"
                  >
                    Continue to Payment →
                  </button>
                </div>
              </div>
            </div>
            <div><OrderSummaryPanel items={items} totalPrice={totalPrice} settings={settings} /></div>
          </div>
        )}

        {/* Step 2: Payment */}
        {step === 2 && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm p-8 sm:p-10">
                <h2 className="text-2xl font-black text-gray-900 mb-8" style={{ fontFamily: "'Outfit', sans-serif" }}>Payment Method</h2>

                <div className="space-y-4 mb-10">
                  {[
                    { id: 'COD', label: 'Cash on Delivery', desc: 'Pay when your order arrives', icon: '💵' },
                    { id: 'bank_transfer', label: 'Bank Transfer', desc: 'Secure bank payment', icon: '🏦' },
                  ].map(({ id, label, desc, icon }) => (
                    <label
                      key={id}
                      className={`flex items-center gap-5 p-6 rounded-2xl border-2 cursor-pointer transition-all active:scale-[0.99]
                        ${payment.method === id ? 'border-amber-500 bg-amber-50 shadow-md shadow-amber-500/5' : 'border-gray-100 hover:border-gray-200 bg-gray-50/30'}`}
                    >
                      <input
                        type="radio"
                        name="payment"
                        value={id}
                        checked={payment.method === id}
                        onChange={() => setPayment({ method: id })}
                        className="accent-amber-500 w-5 h-5"
                      />
                      <span className="text-3xl grayscale group-hover:grayscale-0 transition-all">{icon}</span>
                      <div>
                        <div className="font-black text-gray-900 text-sm tracking-tight">{label}</div>
                        <div className="text-xs text-gray-500 font-medium">{desc}</div>
                      </div>
                    </label>
                  ))}
                </div>

                <div className="bg-gray-900 rounded-3xl p-6 mb-8 text-white relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-white opacity-[0.05] -mr-16 -mt-16 rounded-full" />
                  <h4 className="text-xs font-black text-amber-500 uppercase tracking-widest mb-3">Shipping Summary</h4>
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-sm font-black">{shipping.name}</p>
                      <p className="text-xs text-gray-400 mt-1 leading-relaxed">{shipping.address}, {shipping.city}</p>
                      <p className="text-xs text-gray-400">{shipping.phone}</p>
                    </div>
                    <button onClick={() => setStep(1)} className="px-3 py-1 bg-white/10 hover:bg-white/20 rounded-lg text-[10px] font-black uppercase tracking-widest transition-colors">
                      Edit
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <button onClick={() => setStep(1)} className="py-4 border-2 border-gray-100 text-gray-400 font-black rounded-2xl hover:bg-gray-50 hover:text-gray-600 transition-all text-xs tracking-widest uppercase">
                    ← Back
                  </button>
                  <button
                    onClick={handlePlaceOrder}
                    disabled={loading}
                    className="py-4 bg-amber-500 text-white font-black rounded-2xl hover:bg-amber-600 shadow-xl shadow-amber-500/20 transition-all text-xs tracking-widest uppercase flex items-center justify-center gap-2 disabled:opacity-70 active:scale-95"
                  >
                    {loading ? (
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <>Place Order • PKR {grandTotal.toLocaleString()}</>
                    )}
                  </button>
                </div>
              </div>
            </div>
            <div><OrderSummaryPanel items={items} totalPrice={totalPrice} settings={settings} /></div>
          </div>
        )}

        {/* Step 3: Success */}
        {step === 3 && placedOrder && (
          <div className="max-w-2xl mx-auto animate-fade-in">
            <div className="bg-white rounded-[3rem] border border-gray-100 shadow-xl shadow-gray-200/50 p-8 sm:p-16 text-center relative overflow-hidden">
               <div className="absolute top-0 left-0 w-full h-2 bg-green-500" />
              
              <div className="w-24 h-24 bg-green-100 text-green-500 rounded-[2rem] flex items-center justify-center mx-auto mb-8 animate-bounce-subtle">
                <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              
              <h2 className="text-3xl sm:text-4xl font-black text-gray-900 mb-2" style={{ fontFamily: "'Outfit', sans-serif" }}>
                Success! Order Placed 🎉
              </h2>
              <p className="text-gray-500 font-medium mb-8">Thank you for your trust, {placedOrder.customer.name.split(' ')[0]}!</p>
              
              <div className="bg-amber-50 border border-amber-100 rounded-3xl p-6 mb-10 inline-block w-full max-w-sm">
                <p className="text-[10px] font-black text-amber-600 uppercase tracking-widest mb-1">Your Order Number</p>
                <span className="font-black text-amber-900 text-2xl tracking-tighter" style={{ fontFamily: "'Outfit', sans-serif" }}>{placedOrder.orderNumber}</span>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-10 text-left">
                <div className="bg-gray-50 p-4 rounded-2xl">
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Payment</p>
                  <p className="text-sm font-black text-gray-900 uppercase tracking-tight">{placedOrder.paymentMethod.replace('_', ' ')}</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-2xl">
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Estimated Arrival</p>
                  <p className="text-sm font-black text-green-600 uppercase tracking-tight">2–4 Business Days</p>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <Link to="/dashboard" className="flex-1 py-4 bg-gray-900 text-white font-black rounded-2xl hover:bg-amber-500 transition-all active:scale-95 text-xs tracking-widest uppercase shadow-lg shadow-gray-900/10">
                  VIEW ORDERS
                </Link>
                <Link to="/" className="flex-1 py-4 border-2 border-gray-100 text-gray-400 font-black rounded-2xl hover:bg-gray-50 hover:text-gray-600 transition-all text-xs tracking-widest uppercase">
                  CONTINUE SHOPPING
                </Link>
              </div>
              
              <p className="mt-10 text-xs text-gray-400 font-medium leading-relaxed max-w-sm mx-auto">
                A confirmation email has been sent to <strong>{placedOrder.customer.email}</strong>. Our team will verify your order shortly.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}