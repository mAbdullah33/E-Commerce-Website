import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import HeroSlider from '../components/HeroSlider';
import ProductCard from '../components/ProductCard';
import * as productApi from '../api/productApi';

const stats = [
  { value: '500+', label: 'Designs Available' },
  { value: '10K+', label: 'Happy Customers' },
  { value: '15+', label: 'Years Experience' },
  { value: '100%', label: 'Waterproof' },
];

const features = [
  {
    icon: '🛡️',
    title: 'Waterproof & Durable',
    desc: 'All our panels are 100% waterproof, perfect for kitchens and bathrooms.',
  },
  {
    icon: '⚡',
    title: 'Easy Installation',
    desc: 'Simple DIY installation with our tongue and groove system.',
  },
  {
    icon: '🎨',
    title: '500+ Designs',
    desc: 'From modern minimalist to classic traditional — we have every style.',
  },
  {
    icon: '🚚',
    title: 'Fast Delivery',
    desc: 'Same day dispatch. Free delivery on orders above PKR 5,000.',
  },
];

const categories = [
  {
    title: 'PVC Wall Panels',
    desc: 'Lightweight, versatile 3D panels',
    image: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=600&q=80',
    to: '/products/pvc-panels',
    tag: '200+ Designs',
    color: 'from-amber-500/80',
  },
  {
    title: 'Hard Panels',
    desc: 'Commercial grade, maximum durability',
    image: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=600&q=80',
    to: '/products/hard-panels',
    tag: '50+ Designs',
    color: 'from-slate-700/80',
  },
  {
    title: 'Hot Sale',
    desc: 'Clearance deals — up to 30% off',
    image: 'https://images.unsplash.com/photo-1615873968403-89e068629265?w=600&q=80',
    to: '/hot-sale',
    tag: '🔥 Limited Time',
    color: 'from-rose-600/80',
  },
];

export default function HomePage() {
  const [featured, setFeatured] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        const data = await productApi.getFeaturedProducts();
        setFeatured(data.products || []);
      } catch (error) {
        console.error('Failed to fetch featured products:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchFeatured();
  }, []);

  return (
    <div>
      {/* Hero */}
      <HeroSlider />

      {/* Stats Bar */}
      <div className="bg-gradient-to-r from-amber-500 to-orange-500 text-white py-6">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-2 sm:grid-cols-4 gap-4">
          {stats.map(({ value, label }) => (
            <div key={label} className="text-center">
              <div className="text-2xl sm:text-3xl font-black">{value}</div>
              <div className="text-xs sm:text-sm font-medium text-amber-100">{label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Categories */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-10">
          <span className="text-amber-600 font-bold text-sm uppercase tracking-widest">Browse By Category</span>
          <h2 className="text-3xl sm:text-4xl font-black text-gray-900 mt-2" style={{ fontFamily: "'Outfit', sans-serif" }}>
            Find Your Perfect Panel
          </h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          {categories.map((cat) => (
            <Link
              key={cat.to}
              to={cat.to}
              className="relative h-64 sm:h-72 rounded-2xl overflow-hidden group shadow-md hover:shadow-xl transition-shadow"
            >
              <img
                src={cat.image}
                alt={cat.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className={`absolute inset-0 bg-gradient-to-t ${cat.color} to-transparent/10`} />
              <div className="absolute inset-0 p-6 flex flex-col justify-end text-white">
                <span className="text-xs font-bold bg-white/20 backdrop-blur-sm rounded-full px-3 py-1 w-fit mb-2">
                  {cat.tag}
                </span>
                <h3 className="text-xl font-black">{cat.title}</h3>
                <p className="text-sm text-white/80 mt-1">{cat.desc}</p>
                <div className="mt-3 flex items-center gap-1.5 text-sm font-bold text-white group-hover:gap-3 transition-all">
                  Shop Now
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="bg-gray-50 py-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map(({ icon, title, desc }) => (
              <div key={title} className="bg-white rounded-2xl p-6 text-center shadow-sm hover:shadow-md transition-shadow">
                <div className="text-4xl mb-3">{icon}</div>
                <h3 className="font-bold text-gray-900 mb-1">{title}</h3>
                <p className="text-sm text-gray-500">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Company History */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <span className="text-amber-600 font-bold text-sm uppercase tracking-widest">Our Story</span>
            <h2 className="text-3xl sm:text-4xl font-black text-gray-900 mt-2 mb-6" style={{ fontFamily: "'Outfit', sans-serif" }}>
              15 Years of Transforming Interiors
            </h2>
            <p className="text-gray-600 leading-relaxed mb-4">
              PanelCraft was founded in 2010 with a simple mission: to make beautiful, durable wall panels accessible to every home and business in Pakistan. What started as a small workshop in Lahore has grown into one of the country's leading interior wall panel suppliers.
            </p>
            <p className="text-gray-600 leading-relaxed mb-6">
              We source our materials directly from certified manufacturers and maintain strict quality control at every stage. Our 500+ design catalog is updated quarterly to keep up with global interior trends.
            </p>
            <div className="flex flex-wrap gap-4">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-amber-500" />
                <span className="text-sm font-semibold text-gray-700">ISO Certified Materials</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-amber-500" />
                <span className="text-sm font-semibold text-gray-700">Fire & Water Resistant</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-amber-500" />
                <span className="text-sm font-semibold text-gray-700">10 Year Warranty</span>
              </div>
            </div>
            <Link
              to="/contact"
              className="inline-block mt-8 px-7 py-3.5 bg-amber-500 text-white font-bold rounded-xl hover:bg-amber-600 transition-colors"
            >
              Get in Touch
            </Link>
          </div>
          <div className="relative">
            <img
              src="https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=700&q=80"
              alt="Our showroom"
              className="rounded-2xl shadow-xl w-full h-80 object-cover"
            />
            <div className="absolute -bottom-5 -left-5 bg-amber-500 text-white rounded-2xl p-5 shadow-xl">
              <div className="text-3xl font-black">15+</div>
              <div className="text-sm font-semibold text-amber-100">Years in Business</div>
            </div>
          </div>
        </div>
      </section>

      {/* Popular Designs */}
      <section className="bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-10">
            <div>
              <span className="text-amber-600 font-bold text-sm uppercase tracking-widest">Best Sellers</span>
              <h2 className="text-3xl sm:text-4xl font-black text-gray-900 mt-1" style={{ fontFamily: "'Outfit', sans-serif" }}>
                Popular Designs
              </h2>
            </div>
            <Link
              to="/products/pvc-panels"
              className="hidden sm:flex items-center gap-2 text-amber-600 font-bold hover:underline text-sm"
            >
              View All
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {loading ? (
              [...Array(4)].map((_, i) => (
                <div key={i} className="bg-white rounded-3xl p-4 h-[350px] animate-pulse border border-gray-100" />
              ))
            ) : featured.length > 0 ? (
              featured.slice(0, 8).map(product => (
                <ProductCard key={product._id} product={product} />
              ))
            ) : (
              <p className="col-span-full text-center text-gray-500 font-bold">No featured products available.</p>
            )}
          </div>
          <div className="text-center mt-10 sm:hidden">
            <Link
              to="/products/pvc-panels"
              className="inline-block px-7 py-3 bg-amber-500 text-white font-bold rounded-xl hover:bg-amber-600 transition-colors"
            >
              View All Products
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <section
        className="relative py-20 overflow-hidden"
        style={{ background: 'linear-gradient(135deg, #1e293b 0%, #334155 100%)' }}
      >
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: 'repeating-linear-gradient(45deg, #fff 0, #fff 1px, transparent 0, transparent 50%)',
            backgroundSize: '20px 20px'
          }} />
        </div>
        <div className="relative max-w-4xl mx-auto px-4 text-center text-white">
          <div className="text-5xl mb-4">🏠</div>
          <h2 className="text-3xl sm:text-4xl font-black mb-4" style={{ fontFamily: "'Outfit', sans-serif" }}>
            Ready to Upgrade Your Walls?
          </h2>
          <p className="text-gray-300 text-lg mb-8">
            Get a free consultation and quote for your project. We deliver across Pakistan.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              to="/contact"
              className="px-8 py-4 bg-amber-500 text-white font-bold rounded-xl hover:bg-amber-400 transition-colors shadow-lg"
            >
              Get Free Quote
            </Link>
            <Link
              to="/products/pvc-panels"
              className="px-8 py-4 bg-white/10 border border-white/30 text-white font-bold rounded-xl hover:bg-white/20 transition-colors"
            >
              Browse All Panels
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}