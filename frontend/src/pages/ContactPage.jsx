import { useState } from 'react';
import toast from 'react-hot-toast';
import * as contactApi from '../api/contactApi';
import { MdEmail, MdPhone, MdLocationOn, MdSend } from 'react-icons/md';

export default function ContactPage() {
  const [form, setForm] = useState({ name: '', email: '', phone: '', subject: 'General Inquiry', message: '' });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) {
      toast.error('Please fill all required fields');
      return;
    }
    setLoading(true);
    try {
      const response = await contactApi.submitContact(form);
      if (response.success) {
        toast.success(response.message || 'Message sent! We\'ll get back to you soon.', { icon: '✅', duration: 4000 });
        setForm({ name: '', email: '', phone: '', subject: 'General Inquiry', message: '' });
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to send message. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const contactInfos = [
    { icon: <MdLocationOn size={24} />, title: 'Address', lines: ['PanelCraft Showroom', 'Main Boulevard, Gulberg III', 'Lahore, Pakistan'], color: 'text-amber-500' },
    { icon: <MdPhone size={24} />, title: 'Phone', lines: ['0300-1234567', '0321-7654321', 'Mon–Sat 9am–7pm'], color: 'text-emerald-500' },
    { icon: <MdEmail size={24} />, title: 'Email', lines: ['info@panelcraft.pk', 'orders@panelcraft.pk'], color: 'text-blue-500' },
  ];

  return (
    <div className="min-h-screen bg-gray-50/50 animate-fade-in">
      {/* Header Section */}
      <div className="bg-gray-900 bg-gradient-to-r from-gray-900 to-gray-800 text-white py-20 text-center relative overflow-hidden">
        <div className="absolute inset-0 opacity-10" style={{
          backgroundImage: 'repeating-linear-gradient(45deg, #fff 0, #fff 1px, transparent 0, transparent 50%)',
          backgroundSize: '20px 20px'
        }} />
        <div className="relative">
          <h1 className="text-4xl sm:text-6xl font-black mb-4 tracking-tight" style={{ fontFamily: "'Outfit', sans-serif" }}>Get In Touch</h1>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto px-4 font-medium">Have a project in mind? Our team of interior specialists is ready to help you transform your space with premium panels.</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-10 mb-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Info Side */}
          <div className="lg:col-span-4 space-y-6">
            {contactInfos.map((info, i) => (
              <div key={i} className="bg-white p-6 rounded-[2.5rem] shadow-sm border border-gray-100 hover:shadow-xl hover:shadow-gray-200/50 transition-all group overflow-hidden relative">
                <div className={`absolute top-0 right-0 w-24 h-24 ${info.color} opacity-[0.03] -mr-8 -mt-8 rounded-full group-hover:scale-150 transition-transform duration-500`} />
                <div className={`w-12 h-12 ${info.color} bg-opacity-10 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                  {info.icon}
                </div>
                <h3 className="text-lg font-black text-gray-900 mb-2" style={{ fontFamily: "'Outfit', sans-serif" }}>{info.title}</h3>
                {info.lines.map(l => <p key={l} className="text-gray-500 font-medium text-sm leading-relaxed">{l}</p>)}
              </div>
            ))}

            {/* Social Links Card */}
            <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-gray-100 text-center">
              <h3 className="text-lg font-black text-gray-900 mb-4" style={{ fontFamily: "'Outfit', sans-serif" }}>Follow Our Updates</h3>
              <div className="flex justify-center gap-4">
                {['f', 'I', 'W'].map((s, i) => (
                  <button key={i} className="w-12 h-12 rounded-2xl bg-gray-50 text-gray-400 hover:bg-amber-500 hover:text-white hover:shadow-lg hover:shadow-amber-500/20 transition-all font-black text-lg active:scale-95">
                    {s}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Form Side */}
          <div className="lg:col-span-8">
            <div className="bg-white rounded-[3rem] p-8 sm:p-12 shadow-sm border border-gray-100 h-full relative overflow-hidden">
               <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500 opacity-[0.02] -mr-20 -mt-20 rounded-full" />
              
              <h2 className="text-3xl font-black text-gray-900 mb-2" style={{ fontFamily: "'Outfit', sans-serif" }}>Drop Us a Line</h2>
              <p className="text-gray-500 font-medium mb-10">Use the form below to send us your inquiry and we'll respond within 24 hours.</p>

              <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">Your Name</label>
                    <input
                      type="text"
                      required
                      value={form.name}
                      onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                      placeholder="e.g. Hassan Ahmed"
                      className="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-400 focus:bg-white transition-all font-medium"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">Email Address</label>
                    <input
                      type="email"
                      required
                      value={form.email}
                      onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                      placeholder="example@email.com"
                      className="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-400 focus:bg-white transition-all font-medium"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">Phone Number</label>
                    <input
                      type="tel"
                      value={form.phone}
                      onChange={e => setForm(f => ({ ...f, phone: e.target.value }))}
                      placeholder="0300-XXXXXXX"
                      className="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-400 focus:bg-white transition-all font-medium"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">Inquiry Subject</label>
                    <select
                       value={form.subject}
                       onChange={e => setForm(f => ({ ...f, subject: e.target.value }))}
                       className="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-400 focus:bg-white transition-all font-bold text-gray-700 cursor-pointer"
                    >
                      <option value="General Inquiry">General Inquiry</option>
                      <option value="Product Quotation">Product Quotation</option>
                      <option value="Installation Service">Installation Service</option>
                      <option value="Bulk Order">Bulk Order</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">Describe your project</label>
                  <textarea
                    required
                    rows={6}
                    value={form.message}
                    onChange={e => setForm(f => ({ ...f, message: e.target.value }))}
                    placeholder="Tell us everything about your requirements..."
                    className="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-400 focus:bg-white transition-all font-medium resize-none shadow-inner"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-5 bg-gray-900 bg-gradient-to-r from-gray-900 to-gray-800 hover:from-amber-600 hover:to-amber-500 text-white font-black rounded-[1.5rem] shadow-xl shadow-gray-200 hover:shadow-amber-500/30 transition-all active:scale-95 flex items-center justify-center gap-3 group border-none"
                >
                  {loading ? (
                    <div className="w-6 h-6 border-3 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <>
                      SEND YOUR MESSAGE
                      <MdSend size={20} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>

        {/* Map Section */}
        <div className="mt-12 bg-white rounded-[3rem] overflow-hidden shadow-sm border border-gray-100 h-[400px] relative group border-none">
          <div className="absolute inset-0 bg-gray-100 flex items-center justify-center">
             <img 
               src="https://images.unsplash.com/photo-1526778548025-fa2f459cd5c1?w=1200&q=80" 
               className="w-full h-full object-cover opacity-40 group-hover:scale-105 transition-transform duration-[2000ms]"
               alt="Map Background"
             />
             <div className="absolute inset-0 bg-gradient-to-t from-white via-white/50 to-transparent" />
             <div className="relative text-center max-w-sm px-6">
                <div className="w-16 h-16 bg-rose-500 rounded-3xl flex items-center justify-center text-white shadow-xl shadow-rose-500/30 mx-auto mb-6 animate-bounce">
                  <MdLocationOn size={32} />
                </div>
                <h3 className="text-xl font-black text-gray-900 mb-2" style={{ fontFamily: "'Outfit', sans-serif" }}>Visit Our Showroom</h3>
                <p className="text-gray-500 font-bold text-sm mb-6">Main Boulevard, Gulberg III, Lahore, Pakistan. OPEN 09:00 - 19:00</p>
                <a
                    href="https://maps.google.com/?q=Gulberg+III+Lahore"
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 px-8 py-3.5 bg-gray-900 text-white text-xs font-black rounded-2xl hover:bg-amber-500 hover:shadow-lg hover:shadow-amber-500/20 transition-all active:scale-95"
                  >
                    DIRECTIONS IN GOOGLE MAPS
                  </a>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}