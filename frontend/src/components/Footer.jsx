// Full 4-col footer


import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-400">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-14 pb-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 mb-10">
          {/* Brand */}
          <div>
            <Link to="/" className="flex items-center gap-3 mb-4">
              <div className="w-9 h-9 bg-gradient-to-br from-amber-500 to-orange-600 rounded-xl flex items-center justify-center">
                <span className="text-white font-black text-base">P</span>
              </div>
              <div>
                <div className="font-black text-white text-base" style={{ fontFamily: "'Outfit', sans-serif" }}>Mehmood Traders</div>
                <div className="text-xs text-amber-500 font-semibold tracking-widest uppercase">PVC Panels</div>
              </div>
            </Link>
            <p className="text-sm leading-relaxed mb-4">
              Pakistan's trusted source for premium PVC and hard wall panels since 2010.
            </p>
            <div className="flex gap-3">
              {['f', 'in', 'W', 'YT'].map((s, i) => (
                <button key={i} className="w-8 h-8 bg-gray-800 hover:bg-amber-500 rounded-lg flex items-center justify-center text-xs font-bold transition-colors text-gray-400 hover:text-white">
                  {s}
                </button>
              ))}
            </div>
          </div>

          {/* Quick links */}
          <div>
            <h4 className="text-white font-bold text-sm mb-4 uppercase tracking-wider">Quick Links</h4>
            <ul className="space-y-2.5">
              {[
                { label: 'Home', to: '/' },
                { label: 'PVC Panels', to: '/products/pvc-panels' },
                { label: 'Hard Panels', to: '/products/hard-panels' },
                { label: 'Hot Sale 🔥', to: '/hot-sale' },
                { label: 'Contact Us', to: '/contact' },
              ].map(({ label, to }) => (
                <li key={to}>
                  <Link to={to} className="text-sm hover:text-amber-400 transition-colors">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Products */}
          <div>
            <h4 className="text-white font-bold text-sm mb-4 uppercase tracking-wider">Products</h4>
            <ul className="space-y-2.5 text-sm">
              {['Marble Finish Panels', '3D Textured Panels', 'Wooden Panels', 'Geometric Panels', 'Brick Pattern Panels', 'Gloss Panels'].map(item => (
                <li key={item}>
                  <Link to="/products/pvc-panels" className="hover:text-amber-400 transition-colors">{item}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-white font-bold text-sm mb-4 uppercase tracking-wider">Contact</h4>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-2">
                <span>📍</span>
                <span>Phool Mandi Chowk, Opposite to Meezan Bank, Shahdra Lahore, Pakistan</span>
              </li>
              <li className="flex items-center gap-2">
                <span>📞</span>
                <a href="tel:03214836360" className="hover:text-amber-400">0321-4836360</a>
              </li>
              <li className="flex items-center gap-2">
                <span>📧</span>
                <a href="mailto:info@mehmoodtraders.pk" className="hover:text-amber-400">info@mehmoodtraders.pk</a>
              </li>
              <li className="flex items-center gap-2">
                <span>🕐</span>
                <span>Mon–Sat, 9am–7pm</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-6 border-t border-gray-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
          <span>© {new Date().getFullYear()} PanelCraft. All rights reserved.</span>
          <div className="flex gap-4">
            <a href="#" className="hover:text-amber-400 transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-amber-400 transition-colors">Terms of Service</a>
            <a href="#" className="hover:text-amber-400 transition-colors">Shipping Policy</a>
          </div>
        </div>
      </div>
    </footer>
  );
}