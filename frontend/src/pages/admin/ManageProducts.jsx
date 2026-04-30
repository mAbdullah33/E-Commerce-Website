import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import * as productApi from '../../api/productApi';
import { MdEdit, MdDelete, MdAdd, MdSearch, MdFilterList } from 'react-icons/md';
import toast from 'react-hot-toast';

export default function ManageProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');

  useEffect(() => {
    fetchProducts();
  }, [categoryFilter]);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const params = categoryFilter !== 'All' ? { category: categoryFilter } : {};
      const data = await productApi.getProducts(params);
      setProducts(data.products || []);
    } catch (error) {
      toast.error('Failed to load products');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await productApi.deleteProduct(id);
        toast.success('Product deleted successfully');
        setProducts(products.filter(p => p._id !== id));
      } catch (error) {
        toast.error('Failed to delete product');
      }
    }
  };

  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
        <div className="flex items-center gap-4 flex-1">
          <div className="relative flex-1 max-w-md">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
              <MdSearch size={22} />
            </span>
            <input
              type="text"
              placeholder="Search products..."
              className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-100 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-400 transition-all font-medium"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="relative">
            <select
              className="pl-12 pr-6 py-3 bg-gray-50 border border-gray-100 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-400 appearance-none font-bold text-gray-700 cursor-pointer"
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
            >
              <option value="All">All Categories</option>
              <option value="PVC Panel">PVC Panel</option>
              <option value="Hard Panel">Hard Panel</option>
              <option value="Accessories">Accessories</option>
            </select>
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-amber-500 pointer-events-none">
              <MdFilterList size={20} />
            </span>
          </div>
        </div>
        <Link
          to="/admin/products/new"
          className="flex items-center gap-2 px-6 py-3 bg-amber-500 hover:bg-amber-600 text-white font-black text-sm rounded-2xl transition-all hover:shadow-lg hover:shadow-amber-500/20 active:scale-95"
        >
          <MdAdd size={22} />
          ADD NEW PRODUCT
        </Link>
      </div>

      {/* Products Table */}
      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="px-8 py-5 text-xs font-black text-gray-500 uppercase tracking-widest">Product</th>
                <th className="px-6 py-5 text-xs font-black text-gray-500 uppercase tracking-widest">Category</th>
                <th className="px-6 py-5 text-xs font-black text-gray-500 uppercase tracking-widest">Price</th>
                <th className="px-6 py-5 text-xs font-black text-gray-500 uppercase tracking-widest">Stock</th>
                <th className="px-6 py-5 text-xs font-black text-gray-500 uppercase tracking-widest">Status</th>
                <th className="px-8 py-5 text-xs font-black text-gray-500 uppercase tracking-widest text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {loading ? (
                [...Array(5)].map((_, i) => (
                  <tr key={i} className="animate-pulse">
                    <td className="px-8 py-5"><div className="w-40 h-6 bg-gray-100 rounded" /></td>
                    <td className="px-6 py-5"><div className="w-24 h-6 bg-gray-100 rounded" /></td>
                    <td className="px-6 py-5"><div className="w-16 h-6 bg-gray-100 rounded" /></td>
                    <td className="px-6 py-5"><div className="w-16 h-6 bg-gray-100 rounded" /></td>
                    <td className="px-6 py-5"><div className="w-20 h-6 bg-gray-100 rounded" /></td>
                    <td className="px-8 py-5"><div className="w-20 h-6 bg-gray-100 rounded ml-auto" /></td>
                  </tr>
                ))
              ) : filteredProducts.length === 0 ? (
                <tr>
                  <td colSpan="6" className="px-8 py-20 text-center">
                    <div className="text-4xl mb-4">📦</div>
                    <p className="font-bold text-gray-500">No products found matching your search.</p>
                  </td>
                </tr>
              ) : (
                filteredProducts.map((product) => (
                  <tr key={product._id} className="hover:bg-gray-50/50 transition-colors group">
                    <td className="px-8 py-5">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl overflow-hidden border border-gray-100 flex-shrink-0">
                          <img 
                            src={product.images[0]?.url || 'https://via.placeholder.com/100'} 
                            alt={product.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="min-w-0">
                          <p className="font-bold text-gray-900 truncate max-w-[200px]">{product.name}</p>
                          <p className="text-xs text-gray-500 font-medium">PKR {product.price.toLocaleString()}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-5 font-bold text-xs text-amber-600 uppercase tracking-wide">
                      {product.category}
                    </td>
                    <td className="px-6 py-5 font-black text-gray-900">
                      PKR {product.price.toLocaleString()}
                    </td>
                    <td className="px-6 py-5">
                      <span className={`px-2.5 py-1 rounded-lg text-xs font-black tracking-wide ${product.stock > 10 ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'}`}>
                        {product.stock} Units
                      </span>
                    </td>
                    <td className="px-6 py-5">
                      <span className={`flex items-center gap-1.5 text-xs font-black uppercase tracking-widest ${product.inStock ? 'text-emerald-500' : 'text-rose-500'}`}>
                        <span className={`w-2 h-2 rounded-full ${product.inStock ? 'bg-emerald-500' : 'bg-rose-500'}`} />
                        {product.inStock ? 'Active' : 'Out of Stock'}
                      </span>
                    </td>
                    <td className="px-8 py-5 text-right">
                      <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Link
                          to={`/admin/products/edit/${product._id}`}
                          className="p-2.5 bg-gray-100 text-gray-600 rounded-xl hover:bg-amber-500 hover:text-white transition-all"
                          title="Edit Product"
                        >
                          <MdEdit size={18} />
                        </Link>
                        <button
                          onClick={() => handleDelete(product._id)}
                          className="p-2.5 bg-gray-100 text-gray-600 rounded-xl hover:bg-red-500 hover:text-white transition-all"
                          title="Delete Product"
                        >
                          <MdDelete size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
