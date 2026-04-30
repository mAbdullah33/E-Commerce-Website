import { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import * as productApi from '../../api/productApi';
import { 
  MdSave, 
  MdClose, 
  MdAddPhotoAlternate, 
  MdDelete,
  MdArrowBack
} from 'react-icons/md';
import toast from 'react-hot-toast';

export default function ProductForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = !!id;

  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(isEdit);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    originalPrice: '',
    category: 'PVC Panel',
    stock: '',
    isNewDesign: false,
    isFeatured: false,
    isHotSale: false,
    specifications: {
      size: '10ft x 1ft',
      thickness: '8.5mm',
      material: 'PVC',
      finish: 'Matte',
      color: '',
      pattern: ''
    }
  });

  const [images, setImages] = useState([]); // File objects for upload
  const [previews, setPreviews] = useState([]); // Preview URLs
  const [existingImages, setExistingImages] = useState([]); // Already on server

  useEffect(() => {
    if (isEdit) {
      const fetchProduct = async () => {
        try {
          const data = await productApi.getProducts({ _id: id }); // Standard getProducts might return array
          // Since getProducts returns {products: []}, we might need a dedicated getProductById
          // Backend has router.get('/:id', getProduct);
          // Let's assume we can fetch it somehow or update productApi
          
          const response = await fetch(`${import.meta.env.VITE_API_URL}/products/${id}`);
          const productData = await response.json();
          
          if (productData.success) {
            const p = productData.product;
            setFormData({
              name: p.name,
              description: p.description,
              price: p.price,
              originalPrice: p.originalPrice || '',
              category: p.category,
              stock: p.stock,
              isNewDesign: p.isNewDesign,
              isFeatured: p.isFeatured,
              isHotSale: p.isHotSale,
              specifications: p.specifications || formData.specifications
            });
            setExistingImages(p.images || []);
          }
        } catch (error) {
          toast.error('Failed to load product data');
          navigate('/admin/products');
        } finally {
          setFetching(false);
        }
      };
      fetchProduct();
    }
  }, [id, isEdit, navigate]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: { ...prev[parent], [child]: value }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: type === 'checkbox' ? checked : value
      }));
    }
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setImages(prev => [...prev, ...files]);
    
    const newPreviews = files.map(file => URL.createObjectURL(file));
    setPreviews(prev => [...prev, ...newPreviews]);
  };

  const removeNewImage = (index) => {
    setImages(images.filter((_, i) => i !== index));
    URL.revokeObjectURL(previews[index]);
    setPreviews(previews.filter((_, i) => i !== index));
  };

  const removeExistingImage = async (publicId) => {
    if (window.confirm('Remove this image?')) {
      try {
        await productApi.deleteProductImage(id, publicId);
        setExistingImages(existingImages.filter(img => img.publicId !== publicId));
        toast.success('Image removed');
      } catch (error) {
        toast.error('Failed to remove image');
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const data = new FormData();
    // Append standard fields
    Object.keys(formData).forEach(key => {
      if (key === 'specifications') {
        data.append(key, JSON.stringify(formData[key]));
      } else {
        data.append(key, formData[key]);
      }
    });

    // Append images
    images.forEach(image => {
      data.append('images', image);
    });

    try {
      if (isEdit) {
        await productApi.updateProduct(id, data);
        toast.success('Product updated successfully');
      } else {
        await productApi.createProduct(data);
        toast.success('Product created successfully');
      }
      navigate('/admin/products');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-amber-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto pb-20 animate-fade-in">
      {/* Navigation */}
      <div className="flex items-center justify-between mb-8">
        <Link to="/admin/products" className="flex items-center gap-2 text-gray-500 hover:text-amber-500 transition-colors font-bold text-sm">
          <MdArrowBack size={20} />
          BACK TO PRODUCTS
        </Link>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Info */}
          <div className="lg:col-span-2 space-y-6">
            <section className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm space-y-6">
              <h3 className="text-lg font-black text-gray-900 mb-4" style={{ fontFamily: "'Outfit', sans-serif" }}>Basic Information</h3>
              
              <div className="space-y-2">
                <label className="text-xs font-black text-gray-500 uppercase tracking-widest pl-1">Product Name</label>
                <input
                  required
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full px-5 py-3.5 bg-gray-50 border border-gray-100 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-400 transition-all font-medium"
                  placeholder="Premium Marble Gray PVC Panel"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-black text-gray-500 uppercase tracking-widest pl-1">Description</label>
                <textarea
                  required
                  rows="6"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  className="w-full px-5 py-3.5 bg-gray-50 border border-gray-100 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-400 transition-all font-medium resize-none"
                  placeholder="Detailed product description..."
                ></textarea>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-black text-gray-500 uppercase tracking-widest pl-1">Category</label>
                  <select
                    required
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    className="w-full px-5 py-3.5 bg-gray-50 border border-gray-100 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-400 font-bold text-gray-700"
                  >
                    <option value="PVC Panel">PVC Panel</option>
                    <option value="Hard Panel">Hard Panel</option>
                    <option value="Accessories">Accessories</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-black text-gray-500 uppercase tracking-widest pl-1">Stock Quantity</label>
                  <input
                    required
                    type="number"
                    name="stock"
                    value={formData.stock}
                    onChange={handleChange}
                    className="w-full px-5 py-3.5 bg-gray-50 border border-gray-100 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-400 font-bold"
                  />
                </div>
              </div>
            </section>

            <section className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm space-y-6">
              <h3 className="text-lg font-black text-gray-900 mb-4" style={{ fontFamily: "'Outfit', sans-serif" }}>Pricing</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-black text-gray-500 uppercase tracking-widest pl-1">Sale Price (PKR)</label>
                  <input
                    required
                    type="number"
                    name="price"
                    value={formData.price}
                    onChange={handleChange}
                    className="w-full px-5 py-3.5 bg-gray-50 border border-gray-100 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-400 font-bold"
                    placeholder="1500"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-black text-gray-500 uppercase tracking-widest pl-1">Original Price (optional)</label>
                  <input
                    type="number"
                    name="originalPrice"
                    value={formData.originalPrice}
                    onChange={handleChange}
                    className="w-full px-5 py-3.5 bg-gray-50 border border-gray-100 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-400 font-bold"
                    placeholder="2000"
                  />
                </div>
              </div>
            </section>

            <section className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm space-y-6">
              <h3 className="text-lg font-black text-gray-900 mb-4" style={{ fontFamily: "'Outfit', sans-serif" }}>Specifications</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {Object.keys(formData.specifications).map(key => (
                  <div key={key} className="space-y-2">
                    <label className="text-xs font-black text-gray-500 uppercase tracking-widest pl-1">{key}</label>
                    <input
                      type="text"
                      name={`specifications.${key}`}
                      value={formData.specifications[key]}
                      onChange={handleChange}
                      className="w-full px-5 py-3.5 bg-gray-50 border border-gray-100 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-400 font-medium"
                    />
                  </div>
                ))}
              </div>
            </section>
          </div>

          {/* Sidebar Info */}
          <div className="space-y-8">
            <section className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm space-y-6">
              <h3 className="text-lg font-black text-gray-900 mb-4" style={{ fontFamily: "'Outfit', sans-serif" }}>Post Options</h3>
              <div className="space-y-4">
                {[
                  { id: 'isNewDesign', label: 'New Design' },
                  { id: 'isFeatured', label: 'Featured Product' },
                  { id: 'isHotSale', label: 'Hot Sale' },
                ].map(item => (
                  <label key={item.id} className="flex items-center gap-3 cursor-pointer group">
                    <input
                      type="checkbox"
                      name={item.id}
                      checked={formData[item.id]}
                      onChange={handleChange}
                      className="w-5 h-5 accent-amber-500 rounded-lg"
                    />
                    <span className="text-sm font-bold text-gray-600 group-hover:text-gray-900 transition-colors uppercase tracking-wide">{item.label}</span>
                  </label>
                ))}
              </div>
            </section>

            <section className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm space-y-6">
              <h3 className="text-lg font-black text-gray-900 mb-4" style={{ fontFamily: "'Outfit', sans-serif" }}>Images</h3>
              
              <div className="relative group overflow-hidden bg-gray-50 border-2 border-dashed border-gray-200 rounded-3xl aspect-[4/3] flex flex-col items-center justify-center transition-all hover:border-amber-400 hover:bg-amber-50">
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleImageChange}
                  className="absolute inset-0 opacity-0 cursor-pointer z-10"
                />
                <MdAddPhotoAlternate size={48} className="text-gray-300 group-hover:text-amber-400 transition-colors mb-2" />
                <p className="text-sm font-bold text-gray-400 group-hover:text-amber-600 transition-colors uppercase tracking-widest px-4 text-center">Drag & Drop or Click</p>
              </div>

              {/* Previews */}
              <div className="grid grid-cols-2 gap-3 mt-4">
                {/* Existing Images */}
                {existingImages.map((img, i) => (
                  <div key={`existing-${i}`} className="relative group rounded-xl overflow-hidden aspect-square border-2 border-amber-500">
                    <img src={img.url} className="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={() => removeExistingImage(img.publicId)}
                      className="absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded-lg opacity-0 group-hover:opacity-100 transition-all scale-90"
                    >
                      <MdDelete size={16} />
                    </button>
                    <span className="absolute bottom-2 left-2 bg-amber-500 text-[10px] text-white px-2 py-0.5 rounded-full font-black">STORED</span>
                  </div>
                ))}
                
                {/* New Images */}
                {previews.map((url, i) => (
                  <div key={`new-${i}`} className="relative group rounded-xl overflow-hidden aspect-square border-2 border-emerald-400">
                    <img src={url} className="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={() => removeNewImage(i)}
                      className="absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded-lg opacity-0 group-hover:opacity-100 transition-all scale-90"
                    >
                      <MdClose size={16} />
                    </button>
                    <span className="absolute bottom-2 left-2 bg-emerald-500 text-[10px] text-white px-2 py-0.5 rounded-full font-black">NEW</span>
                  </div>
                ))}
              </div>
            </section>

            <button
              type="submit"
              disabled={loading}
              className={`w-full py-4 rounded-3xl font-black text-white shadow-xl shadow-amber-500/30 flex items-center justify-center gap-3 transition-all active:scale-95
                ${loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-gray-900 bg-gradient-to-r from-gray-900 to-gray-800 hover:from-amber-600 hover:to-amber-500'}`}
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <>
                  <MdSave size={20} />
                  {isEdit ? 'UPDATE PRODUCT' : 'CREATE PRODUCT'}
                </>
              )}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
