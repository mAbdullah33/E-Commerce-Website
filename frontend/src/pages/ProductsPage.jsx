// Filters sidebar + Sort + Grid/List + Pagination

import { useState, useMemo, useEffect } from 'react';
import ProductCard from '../components/ProductCard';
import * as productApi from '../api/productApi';
import toast from 'react-hot-toast';

const GridIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
  </svg>
);
const ListIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
  </svg>
);
const FilterIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
  </svg>
);

const ITEMS_PER_PAGE = 6;

export default function ProductsPage({ category = 'PVC Panel' }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    stock: 'all',    // 'all' | 'in' | 'out'
    isNew: false,
    minPrice: 0,
    maxPrice: 5000,
    sort: 'default',  // 'default' | 'price-asc' | 'price-desc' | 'rating'
  });
  const [view, setView] = useState('grid');
  const [page, setPage] = useState(1);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const params = {
          category,
          minPrice: filters.minPrice,
          maxPrice: filters.maxPrice,
          sort: filters.sort === 'default' ? '' : filters.sort,
        };
        if (filters.stock === 'in') params.inStock = true;
        if (filters.stock === 'out') params.inStock = false;
        if (filters.isNew) params.isNewDesign = true;

        const data = await productApi.getProducts(params);
        setProducts(data.products || []);
      } catch (error) {
        console.error('Error fetching products:', error);
        toast.error('Failed to load products');
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [category, filters]);

  const totalPages = Math.ceil(products.length / ITEMS_PER_PAGE);
  const paginated = products.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);

  const updateFilter = (key, val) => {
    setFilters(f => ({ ...f, [key]: val }));
    setPage(1);
  };

  const resetFilters = () => {
    setFilters({ stock: 'all', isNew: false, minPrice: 0, maxPrice: 5000, sort: 'default' });
    setPage(1);
  };

  const activeFilterCount = [
    filters.stock !== 'all',
    filters.isNew,
    filters.minPrice > 0 || filters.maxPrice < 5000,
  ].filter(Boolean).length;

  const FilterSidebar = () => (
    <div className="space-y-6">
      {/* Stock */}
      <div>
        <h4 className="font-bold text-gray-900 text-sm mb-3 uppercase tracking-wide">Availability</h4>
        <div className="space-y-2">
          {[
            { val: 'all', label: 'All Products' },
            { val: 'in', label: 'In Stock' },
            { val: 'out', label: 'Out of Stock' },
          ].map(({ val, label }) => (
            <label key={val} className="flex items-center gap-2.5 cursor-pointer group">
              <input
                type="radio"
                name="stock"
                value={val}
                checked={filters.stock === val}
                onChange={() => updateFilter('stock', val)}
                className="accent-amber-500"
              />
              <span className={`text-sm ${filters.stock === val ? 'text-amber-600 font-semibold' : 'text-gray-600 group-hover:text-gray-900'}`}>
                {label}
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* New Designs */}
      <div>
        <h4 className="font-bold text-gray-900 text-sm mb-3 uppercase tracking-wide">Design Type</h4>
        <label className="flex items-center gap-2.5 cursor-pointer">
          <input
            type="checkbox"
            checked={filters.isNew}
            onChange={e => updateFilter('isNew', e.target.checked)}
            className="accent-amber-500 w-4 h-4"
          />
          <span className="text-sm text-gray-700 font-medium">New Designs Only</span>
          <span className="ml-auto text-xs bg-emerald-100 text-emerald-700 font-bold px-2 py-0.5 rounded-full">NEW</span>
        </label>
      </div>

      {/* Price Range */}
      <div>
        <h4 className="font-bold text-gray-900 text-sm mb-3 uppercase tracking-wide">Price Range</h4>
        <div className="space-y-3">
          <div className="flex items-center justify-between text-sm">
            <span className="text-amber-600 font-bold">PKR {filters.minPrice.toLocaleString()}</span>
            <span className="text-amber-600 font-bold">PKR {filters.maxPrice.toLocaleString()}</span>
          </div>
          <input
            type="range"
            min={0}
            max={5000}
            step={100}
            value={filters.maxPrice}
            onChange={e => updateFilter('maxPrice', Number(e.target.value))}
            className="w-full accent-amber-500"
          />
          <div className="flex gap-2">
            <input
              type="number"
              placeholder="Min"
              value={filters.minPrice || ''}
              onChange={e => updateFilter('minPrice', Number(e.target.value) || 0)}
              className="w-1/2 border border-gray-200 rounded-lg px-3 py-1.5 text-xs"
            />
            <input
              type="number"
              placeholder="Max"
              value={filters.maxPrice || ''}
              onChange={e => updateFilter('maxPrice', Number(e.target.value) || 5000)}
              className="w-1/2 border border-gray-200 rounded-lg px-3 py-1.5 text-xs"
            />
          </div>
        </div>
      </div>

      {/* Reset */}
      {activeFilterCount > 0 && (
        <button
          onClick={resetFilters}
          className="w-full py-2.5 border border-gray-200 rounded-xl text-sm font-semibold text-gray-600 hover:bg-gray-50 transition-colors"
        >
          Clear All Filters ({activeFilterCount})
        </button>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Page Header */}
      <div className="bg-gradient-to-r from-gray-900 to-gray-700 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2 text-sm text-gray-400 mb-3">
            <a href="/" className="hover:text-white">Home</a>
            <span>/</span>
            <span className="text-white capitalize">{category === 'PVC Panel' ? 'PVC Panels' : 'Hard Panels'}</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black" style={{ fontFamily: "'Outfit', sans-serif" }}>
            {category === 'PVC Panel' ? 'PVC Wall Panels' : 'Hard Panels'}
          </h1>
          <p className="text-gray-300 mt-2">
            {loading ? 'Searching...' : `${products.length} products found`}
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex gap-8">
          {/* Desktop Sidebar */}
          <aside className="hidden lg:block w-64 flex-shrink-0">
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 sticky top-24">
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-black text-gray-900">Filters</h3>
                {activeFilterCount > 0 && (
                  <span className="text-xs bg-amber-100 text-amber-700 font-bold px-2 py-0.5 rounded-full">
                    {activeFilterCount} active
                  </span>
                )}
              </div>
              <FilterSidebar />
            </div>
          </aside>

          {/* Main Content */}
          <div className="flex-1 min-w-0">
            {/* Toolbar */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm px-4 py-3 flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                {/* Mobile filter button */}
                <button
                  onClick={() => setMobileFiltersOpen(true)}
                  className="lg:hidden flex items-center gap-2 px-3 py-2 rounded-xl bg-gray-100 text-sm font-semibold hover:bg-gray-200 transition-colors"
                >
                  <FilterIcon />
                  Filters
                  {activeFilterCount > 0 && (
                    <span className="w-5 h-5 bg-amber-500 text-white text-xs rounded-full flex items-center justify-center font-bold">
                      {activeFilterCount}
                    </span>
                  )}
                </button>

                <span className="text-sm text-gray-500">
                  {loading ? 'Loading products...' : (
                    <>Showing <strong>{paginated.length}</strong> of <strong>{products.length}</strong></>
                  )}
                </span>
              </div>

              <div className="flex items-center gap-3">
                {/* Sort */}
                <select
                  value={filters.sort}
                  onChange={e => updateFilter('sort', e.target.value)}
                  className="border border-gray-200 rounded-xl px-3 py-2 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-amber-400 bg-white"
                >
                  <option value="default">Sort: Default</option>
                  <option value="price-asc">Price: Low → High</option>
                  <option value="price-desc">Price: High → Low</option>
                  <option value="rating">Highest Rated</option>
                </select>

                {/* View toggle */}
                <div className="flex items-center bg-gray-100 rounded-xl p-1">
                  <button
                    onClick={() => setView('grid')}
                    className={`p-1.5 rounded-lg transition-colors ${view === 'grid' ? 'bg-white shadow text-amber-600' : 'text-gray-400 hover:text-gray-700'}`}
                  >
                    <GridIcon />
                  </button>
                  <button
                    onClick={() => setView('list')}
                    className={`p-1.5 rounded-lg transition-colors ${view === 'list' ? 'bg-white shadow text-amber-600' : 'text-gray-400 hover:text-gray-700'}`}
                  >
                    <ListIcon />
                  </button>
                </div>
              </div>
            </div>

            {/* Products grid/list */}
            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="bg-white rounded-3xl p-4 h-[400px] animate-pulse border border-gray-100" />
                ))}
              </div>
            ) : paginated.length === 0 ? (
              <div className="bg-white rounded-2xl p-16 text-center shadow-sm">
                <div className="text-6xl mb-4">🔍</div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">No products found</h3>
                <p className="text-gray-500 mb-6">Try adjusting your filters</p>
                <button onClick={resetFilters} className="px-6 py-3 bg-amber-500 text-white font-bold rounded-xl hover:bg-amber-600 transition-colors">
                  Reset Filters
                </button>
              </div>
            ) : (
              <div className={
                view === 'grid'
                  ? 'grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5'
                  : 'flex flex-col gap-4'
              }>
                {paginated.map(product => (
                  <ProductCard key={product._id} product={product} view={view} />
                ))}
              </div>
            )}

            {/* Pagination */}
            {!loading && totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 mt-10">
                <button
                  onClick={() => setPage(p => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="px-4 py-2 rounded-xl border border-gray-200 text-sm font-semibold disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
                >
                  ← Prev
                </button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
                  <button
                    key={p}
                    onClick={() => setPage(p)}
                    className={`w-10 h-10 rounded-xl text-sm font-bold transition-colors ${
                      p === page
                        ? 'bg-amber-500 text-white shadow-md'
                        : 'border border-gray-200 text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    {p}
                  </button>
                ))}
                <button
                  onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                  className="px-4 py-2 rounded-xl border border-gray-200 text-sm font-semibold disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
                >
                  Next →
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Filter Drawer */}
      {mobileFiltersOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black/50" onClick={() => setMobileFiltersOpen(false)} />
          <div className="absolute right-0 top-0 bottom-0 w-80 bg-white shadow-2xl overflow-y-auto">
            <div className="flex items-center justify-between p-5 border-b">
              <h3 className="font-black text-gray-900">Filters</h3>
              <button
                onClick={() => setMobileFiltersOpen(false)}
                className="p-2 rounded-xl hover:bg-gray-100"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="p-5">
              <FilterSidebar />
              <button
                onClick={() => setMobileFiltersOpen(false)}
                className="w-full mt-6 py-3 bg-amber-500 text-white font-bold rounded-xl hover:bg-amber-600 transition-colors"
              >
                Apply Filters ({products.length} products)
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}