// Filtered hot sale grid

// HotSalePage.jsx
import { useState, useEffect } from 'react';
import ProductCard from '../components/ProductCard';
import * as productApi from '../api/productApi';

export default function HotSalePage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHotSale = async () => {
      try {
        const data = await productApi.getHotSaleProducts();
        setProducts(data.products || []);
      } catch (error) {
        console.error('Failed to fetch hot sale products:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchHotSale();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Banner */}
      <div className="bg-gradient-to-r from-rose-600 to-amber-500 text-white py-14 text-center relative overflow-hidden">
        <div className="absolute inset-0 opacity-10" style={{
          backgroundImage: 'repeating-linear-gradient(45deg, #fff 0, #fff 1px, transparent 0, transparent 50%)',
          backgroundSize: '20px 20px'
        }} />
        <div className="relative">
          <div className="text-5xl mb-3">🔥</div>
          <h1 className="text-4xl sm:text-5xl font-black mb-3" style={{ fontFamily: "'Outfit', sans-serif" }}>
            Hot Sale
          </h1>
          <p className="text-rose-50 text-lg opacity-90 font-medium tracking-wide">Limited time offers — grab them before they're gone!</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map(n => (
              <div key={n} className="bg-white rounded-3xl p-4 h-[350px] animate-pulse border border-gray-100" />
            ))}
          </div>
        ) : products.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {products.map(p => <ProductCard key={p._id} product={p} />)}
          </div>
        ) : (
          <div className="text-center py-20 bg-white rounded-[2.5rem] border border-gray-100 shadow-sm">
            <div className="text-5xl mb-4 opacity-50">🏷️</div>
            <h3 className="text-xl font-black text-gray-900 mb-1">No Hot Sale Items</h3>
            <p className="text-gray-500 font-medium">Check back later for incredible deals!</p>
          </div>
        )}
      </div>
    </div>
  );
}