// Wishlist grid + Move to Cart

import { Link } from 'react-router-dom';
import { useWishlist } from '../context/WishlistContext';
import { useCart } from '../context/CartContext';
import toast from 'react-hot-toast';

export default function WishlistPage() {
  const { items, dispatch } = useWishlist();
  const { dispatch: cartDispatch } = useCart();

  const moveToCart = (item) => {
    cartDispatch({ type: 'ADD_ITEM', payload: item });
    dispatch({ type: 'REMOVE', payload: item._id });
    toast.success('Moved to cart!', { icon: '🛒' });
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-8xl mb-4">❤️</div>
          <h2 className="text-2xl font-black text-gray-900 mb-2">Your wishlist is empty</h2>
          <p className="text-gray-500 mb-6">Save your favorite designs here!</p>
          <Link to="/products/pvc-panels" className="px-7 py-3.5 bg-amber-500 text-white font-bold rounded-xl hover:bg-amber-600">
            Browse Products
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <h1 className="text-3xl font-black text-gray-900 mb-8" style={{ fontFamily: "'Outfit', sans-serif" }}>
          My Wishlist ({items.length})
        </h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {items.map(item => (
            <div key={item._id} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden group">
              <Link to={`/product/${item.slug}`}>
                <img
                  src={item.images?.[0]?.url || 'https://via.placeholder.com/400x300'}
                  alt={item.name}
                  className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-500"
                  onError={e => { e.target.src = 'https://via.placeholder.com/400x300'; }}
                />
              </Link>
              <div className="p-5">
                <Link to={`/product/${item.slug}`}>
                  <h3 className="font-bold text-gray-900 hover:text-amber-600 transition-colors mb-1 line-clamp-1">{item.name}</h3>
                </Link>
                <div className="text-lg font-black text-gray-900 mb-3">PKR {item.price.toLocaleString()}</div>
                <div className="flex gap-2">
                  <button
                    onClick={() => moveToCart(item)}
                    disabled={!item.stock}
                    className="flex-1 py-2 bg-amber-500 text-white text-sm font-bold rounded-xl hover:bg-amber-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    Move to Cart
                  </button>
                  <button
                    onClick={() => { dispatch({ type: 'REMOVE', payload: item._id }); toast('Removed from wishlist'); }}
                    className="w-9 h-9 flex items-center justify-center border border-gray-200 rounded-xl hover:bg-red-50 hover:border-red-200 hover:text-red-500 transition-colors text-gray-400"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}