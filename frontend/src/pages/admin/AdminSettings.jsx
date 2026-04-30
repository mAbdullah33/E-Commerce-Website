import { useState, useEffect } from 'react';
import axios from '../../api/axios';
import toast from 'react-hot-toast';
import { MdSave, MdRefresh, MdLocalShipping, MdOutlineShoppingBag, MdUpdate } from 'react-icons/md';

export default function AdminSettings() {
  const [config, setConfig] = useState({
    shippingFee: 200,
    freeShippingThreshold: 5000,
    companyPhone: '0300-1234567',
    companyEmail: 'support@panelcraft.com',
    taxPercentage: 0
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const { data } = await axios.get('/settings');
        if (data.success && Object.keys(data.config).length > 0) {
          setConfig(prev => ({ ...prev, ...data.config }));
        }
      } catch (error) {
        console.error('Failed to fetch settings:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchSettings();
  }, []);

  const handleChange = (e) => {
    const { name, value, type } = e.target;
    setConfig(prev => ({
      ...prev,
      [name]: type === 'number' ? Number(value) : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await axios.put('/settings', { config });
      toast.success('System settings updated successfully');
    } catch (error) {
      toast.error('Failed to update settings');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="p-20 text-center"><div className="w-10 h-10 border-4 border-amber-500 border-t-transparent rounded-full animate-spin mx-auto"></div></div>;

  return (
    <div className="max-w-4xl mx-auto animate-fade-in p-2">
      <header className="mb-10 flex items-center justify-between">
         <div>
            <h1 className="text-3xl font-black text-gray-900 mb-1" style={{ fontFamily: "'Outfit', sans-serif" }}>Store Configuration</h1>
            <p className="text-gray-500 font-medium">Manage global rules and contact information for your store.</p>
         </div>
         <div className="p-4 bg-amber-50 rounded-2xl text-amber-600">
            <MdUpdate size={28} />
         </div>
      </header>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Shipping Section */}
        <section className="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm overflow-hidden">
          <div className="p-8 border-b border-gray-50 bg-gray-50/30 flex items-center gap-3">
             <div className="w-10 h-10 bg-white rounded-xl shadow-sm flex items-center justify-center text-amber-500">
                <MdLocalShipping size={22} />
             </div>
             <h3 className="text-xl font-black text-gray-900" style={{ fontFamily: "'Outfit', sans-serif" }}>Shipping Logistics</h3>
          </div>
          <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] pl-1">Standard Shipping Fee (PKR)</label>
              <input
                type="number"
                name="shippingFee"
                value={config.shippingFee}
                onChange={handleChange}
                className="w-full px-5 py-4 bg-gray-50 border border-gray-100 rounded-2xl text-sm focus:outline-none focus:ring-4 focus:ring-amber-500/10 focus:bg-white transition-all font-bold"
              />
              <p className="text-[10px] text-gray-400 font-medium pl-1">Default fee applied to all regular orders.</p>
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] pl-1">Free Shipping Threshold (PKR)</label>
              <input
                type="number"
                name="freeShippingThreshold"
                value={config.freeShippingThreshold}
                onChange={handleChange}
                className="w-full px-5 py-4 bg-gray-50 border border-gray-100 rounded-2xl text-sm focus:outline-none focus:ring-4 focus:ring-amber-500/10 focus:bg-white transition-all font-bold"
              />
              <p className="text-[10px] text-gray-400 font-medium pl-1">Orders above this amount will have zero shipping cost.</p>
            </div>
          </div>
        </section>

        {/* Store Info Section */}
        <section className="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm overflow-hidden">
          <div className="p-8 border-b border-gray-50 bg-gray-50/30 flex items-center gap-3">
             <div className="w-10 h-10 bg-white rounded-xl shadow-sm flex items-center justify-center text-blue-500">
                <MdOutlineShoppingBag size={22} />
             </div>
             <h3 className="text-xl font-black text-gray-900" style={{ fontFamily: "'Outfit', sans-serif" }}>Contact Information</h3>
          </div>
          <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] pl-1">Support Phone Number</label>
              <input
                type="text"
                name="companyPhone"
                value={config.companyPhone}
                onChange={handleChange}
                className="w-full px-5 py-4 bg-gray-50 border border-gray-100 rounded-2xl text-sm focus:outline-none focus:ring-4 focus:ring-amber-500/10 focus:bg-white transition-all font-bold"
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] pl-1">Support Email Address</label>
              <input
                type="email"
                name="companyEmail"
                value={config.companyEmail}
                onChange={handleChange}
                className="w-full px-5 py-4 bg-gray-50 border border-gray-100 rounded-2xl text-sm focus:outline-none focus:ring-4 focus:ring-amber-500/10 focus:bg-white transition-all font-bold"
              />
            </div>
          </div>
        </section>

        {/* Save Button */}
        <div className="flex items-center justify-end gap-4 pt-4">
           <button 
             type="button" 
             onClick={() => window.location.reload()}
             className="px-8 py-4 bg-white border border-gray-100 text-gray-400 font-black rounded-2xl hover:text-gray-900 transition-all text-xs tracking-widest flex items-center gap-2"
           >
              <MdRefresh size={18} />
              DISCARD
           </button>
           <button 
             type="submit" 
             disabled={saving}
             className="px-12 py-4 bg-gray-900 text-white font-black rounded-2xl shadow-xl shadow-gray-900/10 hover:bg-amber-500 hover:shadow-amber-500/30 transition-all active:scale-95 text-xs tracking-widest flex items-center gap-2"
           >
              {saving ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <MdSave size={18} />
              )}
              {saving ? 'SAVING...' : 'SAVE CONFIGURATION'}
           </button>
        </div>
      </form>
    </div>
  );
}
