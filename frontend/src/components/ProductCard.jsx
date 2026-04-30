import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import toast from 'react-hot-toast';

const StarIcon = ({ filled }) => (
  <svg className={`w-3.5 h-3.5 ${filled ? 'text-amber-400' : 'text-gray-300'}`} fill="currentColor" viewBox="0 0 20 20">
    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
  </svg>
);

export default function ProductCard({ product, view = 'grid' }) {
  const { dispatch: cartDispatch } = useCart();
  const { dispatch: wishDispatch, isWishlisted } = useWishlist();
  const [imgError, setImgError] = useState(false);
  const [adding, setAdding] = useState(false);

  const wishlisted = isWishlisted(product._id);

  const handleAddToCart = (e) => {
    e.preventDefault();
    if (!product.inStock) return;
    setAdding(true);
    cartDispatch({ type: 'ADD_ITEM', payload: product });
    toast.success(`${product.name} added to cart!`, {
      icon: '🛒',
      duration: 2000,
    });
    setTimeout(() => setAdding(false), 600);
  };

  const handleWishlist = (e) => {
    e.preventDefault();
    wishDispatch({ type: 'TOGGLE', payload: product });
    toast(wishlisted ? 'Removed from wishlist' : 'Added to wishlist ❤️', {
      duration: 1800,
    });
  };

  if (view === 'list') {
    return (
      <Link to={`/product/${product.slug}`} className="flex gap-4 bg-white rounded-2xl border border-gray-100 hover:border-amber-200 hover:shadow-md transition-all p-4 group">
        <div className="w-28 h-28 flex-shrink-0 rounded-xl overflow-hidden bg-gray-100">
          <img
            src={imgError ? 'https://via.placeholder.com/120x120?text=Panel' : product.images[0]?.url}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            onError={() => setImgError(true)}
          />
        </div>
        <div className="flex-1 flex flex-col justify-between">
          <div>
            <div className="flex items-start justify-between gap-2">
              <h3 className="font-bold text-gray-900 text-sm group-hover:text-amber-600 transition-colors">{product.name}</h3>
              <button onClick={handleWishlist} className={`p-1.5 rounded-lg hover:bg-rose-50 transition-colors flex-shrink-0 ${wishlisted ? 'text-rose-500' : 'text-gray-400'}`}>
                <svg className="w-4 h-4" fill={wishlisted ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </button>
            </div>
            <p className="text-xs text-gray-500 mt-1 line-clamp-2">{product.description}</p>
          </div>
          <div className="flex items-center justify-between mt-2">
            <div>
              <div className="font-black text-lg text-gray-900">PKR {product.price.toLocaleString()}</div>
              <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${product.inStock ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-600'}`}>
                {product.inStock ? 'In Stock' : 'Out of Stock'}
              </span>
            </div>
            <button
              onClick={handleAddToCart}
              disabled={!product.inStock}
              className="px-4 py-2 bg-amber-500 text-white text-xs font-bold rounded-xl hover:bg-amber-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Add to Cart
            </button>
          </div>
        </div>
      </Link>
    );
  }

  return (
    <Link
      to={`/product/${product.slug}`}
      className="group relative bg-white rounded-2xl border border-gray-100 hover:border-amber-200 hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col"
    >
      {/* Badges */}
      <div className="absolute top-3 left-3 z-10 flex flex-col gap-1.5">
        {product.isNewDesign && (
          <span className="px-2.5 py-1 bg-emerald-500 text-white text-xs font-bold rounded-lg leading-none">NEW</span>
        )}
        {product.isHotSale && (
          <span className="px-2.5 py-1 bg-red-500 text-white text-xs font-bold rounded-lg leading-none">🔥 SALE</span>
        )}
        {!product.inStock && (
          <span className="px-2.5 py-1 bg-gray-500 text-white text-xs font-bold rounded-lg leading-none">OUT</span>
        )}
      </div>

      {/* Wishlist button */}
      <button
        onClick={handleWishlist}
        className={`absolute top-3 right-3 z-10 w-8 h-8 rounded-xl flex items-center justify-center transition-all shadow-sm
          ${wishlisted
            ? 'bg-rose-50 text-rose-500'
            : 'bg-white/90 text-gray-400 hover:text-rose-500 hover:bg-rose-50'
          }`}
      >
        <svg className="w-4 h-4" fill={wishlisted ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
        </svg>
      </button>

      {/* Image */}
      <div className="relative h-52 bg-gray-50 overflow-hidden">
        <img
          src={imgError ? 'https://via.placeholder.com/400x300?text=PVC+Panel' : product.images[0]?.url}
          alt={product.name}
          loading="lazy"
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          onError={() => setImgError(true)}
        />
      </div>

      {/* Info */}
      <div className="flex flex-col flex-1 p-4">
        {/* Category tag */}
        <span className="text-xs font-semibold text-amber-600 uppercase tracking-wider mb-1">
          {product.category}
        </span>

        <h3 className="font-bold text-gray-900 text-sm mb-1 group-hover:text-amber-600 transition-colors line-clamp-2">
          {product.name}
        </h3>

        {/* Rating */}
        <div className="flex items-center gap-1 mb-3">
          {[1, 2, 3, 4, 5].map(i => (
            <StarIcon key={i} filled={i <= Math.round(product.ratings?.average || 0)} />
          ))}
          <span className="text-xs text-gray-500 ml-1">({product.ratings?.count || 0})</span>
        </div>

        <div className="mt-auto">
          {/* Price */}
          <div className="flex items-center justify-between mb-3">
            <div>
              <span className="text-xl font-black text-gray-900">
                PKR {product.price.toLocaleString()}
              </span>
              <span className="text-xs text-gray-500 block">per panel</span>
            </div>
            <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
              product.inStock ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-600'
            }`}>
              {product.inStock ? '✓ In Stock' : '✗ Out of Stock'}
            </span>
          </div>

          {/* Add to cart */}
          <button
            onClick={handleAddToCart}
            disabled={!product.inStock || adding}
            className={`w-full py-2.5 rounded-xl text-sm font-bold transition-all duration-200
              ${adding
                ? 'bg-green-500 text-white scale-95'
                : product.inStock
                  ? 'bg-amber-500 text-white hover:bg-amber-600 active:scale-95'
                  : 'bg-gray-100 text-gray-400 cursor-not-allowed'
              }`}
          >
            {adding ? '✓ Added!' : product.inStock ? 'Add to Cart' : 'Out of Stock'}
          </button>
        </div>
      </div>
    </Link>
  );
}