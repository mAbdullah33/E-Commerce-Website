import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import * as productApi from '../api/productApi';
import ProductCard from '../components/ProductCard';
import toast from 'react-hot-toast';

const StarIcon = ({ filled, half }) => (
  <svg className={`w-5 h-5 ${filled || half ? 'text-amber-400' : 'text-gray-300'}`} fill="currentColor" viewBox="0 0 20 20">
    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
  </svg>
);

export default function ProductDetailPage() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [related, setRelated] = useState([]);
  const [loading, setLoading] = useState(true);
  const { dispatch: cartDispatch } = useCart();
  const { dispatch: wishDispatch, isWishlisted } = useWishlist();

  const [activeImg, setActiveImg] = useState(0);
  const [qty, setQty] = useState(1);
  const [imgError, setImgError] = useState(false);
  const [adding, setAdding] = useState(false);
  const [activeTab, setActiveTab] = useState('description');

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      try {
        const data = await productApi.getProductBySlug(slug);
        setProduct(data.product);
        
        // Fetch related products
        const relatedData = await productApi.getProducts({ 
          category: data.product.category, 
          limit: 4 
        });
        setRelated(relatedData.products.filter(p => p._id !== data.product._id));
      } catch (error) {
        console.error('Error fetching product:', error);
        toast.error('Failed to load product details');
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
    window.scrollTo(0, 0);
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-amber-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-gray-500 font-bold">Loading product details...</p>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="text-8xl mb-4">😕</div>
          <h2 className="text-2xl font-black text-gray-900 mb-2">Product Not Found</h2>
          <p className="text-gray-500 mb-6">This panel may have been removed.</p>
          <Link to="/products/pvc-panels" className="px-6 py-3 bg-amber-500 text-white font-bold rounded-xl hover:bg-amber-600">
            Back to Products
          </Link>
        </div>
      </div>
    );
  }

  const wishlisted = isWishlisted(product._id);

  const handleAddToCart = () => {
    if (!product.inStock) return;
    setAdding(true);
    cartDispatch({ type: 'ADD_ITEM', payload: { ...product, quantity: qty } });
    toast.success(`${qty}x ${product.name} added!`, { icon: '🛒' });
    setTimeout(() => setAdding(false), 800);
  };

  const handleBuyNow = () => {
    handleAddToCart();
    setTimeout(() => navigate('/cart'), 500);
  };

  const handleWishlist = () => {
    wishDispatch({ type: 'TOGGLE', payload: product });
    toast(wishlisted ? 'Removed from wishlist' : '❤️ Added to wishlist!');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Breadcrumb */}
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <Link to="/" className="hover:text-amber-600">Home</Link>
            <span>/</span>
            <Link
              to={`/products/${product.category === 'PVC Panel' ? 'pvc-panels' : 'hard-panels'}`}
              className="hover:text-amber-600 capitalize"
            >
              {product.category}
            </Link>
            <span>/</span>
            <span className="text-gray-900 font-medium truncate">{product.name}</span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Product layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          {/* Images */}
          <div>
            {/* Main image */}
            <div className="relative bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 mb-3">
              <img
                src={imgError ? 'https://via.placeholder.com/700x500?text=PVC+Panel' : product.images[activeImg]?.url}
                alt={product.name}
                className="w-full h-96 sm:h-[480px] object-cover"
                onError={() => setImgError(true)}
              />
              {product.isNewDesign && (
                <span className="absolute top-4 left-4 px-3 py-1.5 bg-emerald-500 text-white text-xs font-bold rounded-xl">
                  NEW DESIGN
                </span>
              )}
              {product.isHotSale && (
                <span className="absolute top-4 right-4 px-3 py-1.5 bg-red-500 text-white text-xs font-bold rounded-xl">
                  🔥 HOT SALE
                </span>
              )}
            </div>
            {/* Thumbnails */}
            {product.images.length > 1 && (
              <div className="flex gap-3">
                {product.images.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveImg(i)}
                    className={`w-20 h-20 rounded-xl overflow-hidden border-2 transition-all ${
                      activeImg === i ? 'border-amber-500 shadow-md scale-105' : 'border-gray-200 hover:border-amber-300'
                    }`}
                  >
                    <img src={img.url} alt={`View ${i + 1}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div>
            {/* Tags */}
            <div className="flex items-center gap-2 mb-3">
              <span className="px-2.5 py-1 bg-amber-100 text-amber-700 text-xs font-bold rounded-lg uppercase">
                {product.category}
              </span>
              <span className={`px-2.5 py-1 text-xs font-bold rounded-lg ${
                product.inStock ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-600'
              }`}>
                {product.inStock ? '✓ In Stock' : '✗ Out of Stock'}
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-black text-gray-900 mb-2" style={{ fontFamily: "'Outfit', sans-serif" }}>
              {product.name}
            </h1>

            {/* Rating */}
            <div className="flex items-center gap-2 mb-4">
              <div className="flex items-center">
                {[1, 2, 3, 4, 5].map(i => <StarIcon key={i} filled={i <= Math.round(product.ratings.average)} />)}
              </div>
              <span className="text-sm font-bold text-gray-700">{product.ratings.average}</span>
              <span className="text-sm text-gray-500">({product.ratings.count} reviews)</span>
            </div>

            {/* Price */}
            <div className="bg-amber-50 rounded-2xl p-5 mb-6">
              <div className="text-4xl font-black text-gray-900 mb-1">
                PKR {product.price.toLocaleString()}
              </div>
              {product.originalPrice > product.price && (
                <div className="text-gray-400 line-through text-lg">PKR {product.originalPrice.toLocaleString()}</div>
              )}
              <div className="text-sm text-gray-500">per panel · {product.specifications?.size || 'Standard'} coverage</div>
            </div>

            {/* Specs */}
            <div className="grid grid-cols-3 gap-3 mb-6">
              {[
                { label: 'Size', value: product.specifications?.size || 'N/A' },
                { label: 'Thickness', value: product.specifications?.thickness || 'N/A' },
                { label: 'Material', value: product.specifications?.material || 'PVC' },
              ].map(({ label, value }) => (
                <div key={label} className="bg-gray-50 rounded-xl p-3 text-center">
                  <div className="text-xs text-gray-500 uppercase tracking-wide mb-1">{label}</div>
                  <div className="text-sm font-bold text-gray-900">{value}</div>
                </div>
              ))}
            </div>

            {/* Quantity */}
            <div className="flex items-center gap-4 mb-6">
              <span className="text-sm font-semibold text-gray-700">Quantity:</span>
              <div className="flex items-center border border-gray-200 rounded-xl overflow-hidden">
                <button
                  onClick={() => setQty(q => Math.max(1, q - 1))}
                  className="w-10 h-10 flex items-center justify-center hover:bg-gray-100 transition-colors font-bold text-lg"
                >
                  −
                </button>
                <span className="w-12 text-center font-bold text-gray-900">{qty}</span>
                <button
                  onClick={() => setQty(q => q + 1)}
                  className="w-10 h-10 flex items-center justify-center hover:bg-gray-100 transition-colors font-bold text-lg"
                >
                  +
                </button>
              </div>
              <span className="text-sm text-gray-500">
                Total: <strong className="text-gray-900">PKR {(product.price * qty).toLocaleString()}</strong>
              </span>
            </div>

            {/* Actions */}
            <div className="flex gap-3 mb-6">
              <button
                onClick={handleAddToCart}
                disabled={!product.inStock || adding}
                className={`flex-1 py-3.5 rounded-xl font-bold transition-all text-sm sm:text-base
                  ${adding
                    ? 'bg-green-500 text-white'
                    : product.inStock
                      ? 'bg-amber-500 text-white hover:bg-amber-600 active:scale-95'
                      : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                  }`}
              >
                {adding ? '✓ Added to Cart!' : '🛒 Add to Cart'}
              </button>
              <button
                onClick={handleWishlist}
                className={`w-12 h-12 rounded-xl flex items-center justify-center border-2 transition-all
                  ${wishlisted
                    ? 'border-rose-300 bg-rose-50 text-rose-500'
                    : 'border-gray-200 text-gray-400 hover:border-rose-300 hover:text-rose-500 hover:bg-rose-50'
                  }`}
              >
                <svg className="w-5 h-5" fill={wishlisted ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </button>
            </div>

            <button
              onClick={handleBuyNow}
              disabled={!product.inStock}
              className="w-full py-3.5 border-2 border-gray-900 text-gray-900 font-bold rounded-xl hover:bg-gray-900 hover:text-white transition-all disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Buy Now →
            </button>

            {/* Trust badges */}
            <div className="grid grid-cols-3 gap-3 mt-6 pt-6 border-t border-gray-100">
              {[
                { icon: '🔒', label: 'Secure Payment' },
                { icon: '🚚', label: 'Fast Delivery' },
                { icon: '↩️', label: 'Easy Returns' },
              ].map(({ icon, label }) => (
                <div key={label} className="text-center">
                  <div className="text-xl mb-1">{icon}</div>
                  <div className="text-xs text-gray-500 font-medium">{label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="mt-12 bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="flex border-b border-gray-100">
            {['description', 'specifications', 'reviews'].map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`flex-1 sm:flex-none px-6 py-4 text-sm font-bold capitalize transition-colors
                  ${activeTab === tab
                    ? 'text-amber-600 border-b-2 border-amber-500'
                    : 'text-gray-500 hover:text-gray-700'
                  }`}
              >
                {tab}
              </button>
            ))}
          </div>
          <div className="p-6">
            {activeTab === 'description' && (
              <div className="prose max-w-none">
                <p className="text-gray-700 leading-relaxed">{product.description}</p>
                <h4 className="font-bold text-gray-900 mt-4 mb-2">Key Features:</h4>
                <ul className="space-y-2">
                  {['100% Waterproof & Moisture Resistant', 'Fire Retardant Material', 'Easy DIY Installation', 'No Painting Required', 'Low Maintenance'].map(feat => (
                    <li key={feat} className="flex items-center gap-2 text-sm text-gray-700">
                      <span className="text-green-500 font-bold">✓</span> {feat}
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {activeTab === 'specifications' && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {[
                  { label: 'Product Name', value: product.name },
                  { label: 'Category', value: product.category },
                  { label: 'Dimensions', value: product.specifications?.size },
                  { label: 'Thickness', value: product.specifications?.thickness },
                  { label: 'Material', value: product.specifications?.material },
                  { label: 'Finish', value: product.specifications?.finish },
                  { label: 'Color', value: product.specifications?.color },
                  { label: 'Installation', value: 'Tongue & Groove' },
                ].map(({ label, value }) => (
                  <div key={label} className="flex items-center gap-3 py-2.5 border-b border-gray-50">
                    <span className="text-sm text-gray-500 w-40 flex-shrink-0">{label}</span>
                    <span className="text-sm font-semibold text-gray-900">{value || 'N/A'}</span>
                  </div>
                ))}
              </div>
            )}
            {activeTab === 'reviews' && (
              <div>
                <div className="flex items-center gap-6 mb-6">
                  <div className="text-center">
                    <div className="text-5xl font-black text-gray-900">{product.ratings.average}</div>
                    <div className="flex justify-center mt-1">
                      {[1, 2, 3, 4, 5].map(i => <StarIcon key={i} filled={i <= Math.round(product.ratings.average)} />)}
                    </div>
                    <div className="text-sm text-gray-500 mt-1">{product.ratings.count} reviews</div>
                  </div>
                  <div className="flex-1 space-y-1.5">
                    {[5, 4, 3, 2, 1].map(star => (
                      <div key={star} className="flex items-center gap-2">
                        <span className="text-xs text-gray-500 w-3">{star}</span>
                        <div className="flex-1 bg-gray-100 rounded-full h-2">
                          <div
                            className="bg-amber-400 h-2 rounded-full"
                            style={{ width: `${star === 5 ? 65 : star === 4 ? 25 : star === 3 ? 7 : 3}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                {product.reviews && product.reviews.length > 0 ? (
                  <div className="space-y-6">
                    {product.reviews.map((review, i) => (
                      <div key={i} className="border-b border-gray-50 pb-6">
                        <div className="flex items-center justify-between mb-2">
                          <h5 className="font-bold text-gray-900">{review.name}</h5>
                          <span className="text-xs text-gray-400">{new Date(review.createdAt).toLocaleDateString()}</span>
                        </div>
                        <div className="flex mb-2">
                          {[1, 2, 3, 4, 5].map(i => <StarIcon key={i} filled={i <= review.rating} />)}
                        </div>
                        <p className="text-sm text-gray-600">{review.comment}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 text-sm">No reviews yet for this product.</p>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Related Products */}
        {related.length > 0 && (
          <section className="mt-14">
            <h2 className="text-2xl font-black text-gray-900 mb-6" style={{ fontFamily: "'Outfit', sans-serif" }}>
              Related Products
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {related.map(p => <ProductCard key={p._id} product={p} />)}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}