import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { ProductCard } from '../components/ProductCard';
import API from '../api/axios';
import { SlidersHorizontal, X } from 'lucide-react';

const STRENGTHS = [3, 4, 6, 9, 12];
const SORT_OPTIONS = [
  { value: 'newest', label: 'Newest First' },
  { value: 'price-asc', label: 'Price: Low → High' },
  { value: 'price-desc', label: 'Price: High → Low' },
  { value: 'rating', label: 'Top Rated' }
];

const ShopPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);

  const activeCategory = searchParams.get('category') || '';
  const activeBrand = searchParams.get('brand') || '';
  const activeStrength = searchParams.get('strength') || '';
  const activeSort = searchParams.get('sort') || 'newest';
  const activeSearch = searchParams.get('search') || '';
  const activeMinPrice = searchParams.get('minPrice') || '';
  const activeMaxPrice = searchParams.get('maxPrice') || '';

  useEffect(() => {
    const fetchFilters = async () => {
      try {
        const [catRes, brandRes] = await Promise.all([
          API.get('/products/categories'),
          API.get('/products/brands')
        ]);
        setCategories(catRes.data.data || []);
        setBrands(brandRes.data.data || []);
      } catch (err) {
        console.error(err);
      }
    };
    fetchFilters();
  }, []);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const params = new URLSearchParams();
        if (activeCategory) params.set('category', activeCategory);
        if (activeBrand) params.set('brand', activeBrand);
        if (activeStrength) params.set('strength', activeStrength);
        if (activeSort) params.set('sort', activeSort);
        if (activeSearch) params.set('search', activeSearch);
        if (activeMinPrice) params.set('minPrice', activeMinPrice);
        if (activeMaxPrice) params.set('maxPrice', activeMaxPrice);

        const res = await API.get(`/products?${params.toString()}`);
        setProducts(res.data.data || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, [activeCategory, activeBrand, activeStrength, activeSort, activeSearch, activeMinPrice, activeMaxPrice]);

  const setFilter = (key, value) => {
    const newParams = new URLSearchParams(searchParams);
    if (value) {
      newParams.set(key, value);
    } else {
      newParams.delete(key);
    }
    setSearchParams(newParams);
  };

  const clearAllFilters = () => {
    setSearchParams({});
  };

  const hasActiveFilters = activeCategory || activeBrand || activeStrength || activeSearch || activeMinPrice || activeMaxPrice;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
      {/* Page Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white">
            {activeSearch ? `Results for "${activeSearch}"` : 'All Nicotine Pouches'}
          </h1>
          <p className="text-sm text-slate-400 mt-1">{products.length} products found</p>
        </div>
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="lg:hidden flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-800 border border-slate-700 text-xs text-slate-200 font-medium"
        >
          <SlidersHorizontal className="w-4 h-4" />
          Filters
        </button>
      </div>

      <div className="flex gap-8">
        {/* Sidebar Filters */}
        <aside className={`${showFilters ? 'block' : 'hidden'} lg:block w-full lg:w-60 shrink-0 fixed lg:relative inset-0 z-40 lg:z-auto bg-slate-950 lg:bg-transparent p-6 lg:p-0 overflow-y-auto`}>
          <div className="flex items-center justify-between lg:hidden mb-4">
            <h3 className="text-lg font-bold text-white">Filters</h3>
            <button onClick={() => setShowFilters(false)}>
              <X className="w-5 h-5 text-slate-400" />
            </button>
          </div>

          <div className="space-y-6">
            {/* Sort */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-2 uppercase tracking-wider">Sort By</label>
              <select
                value={activeSort}
                onChange={(e) => setFilter('sort', e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:border-cyan-500 focus:outline-none"
              >
                {SORT_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
            </div>

            {/* Category */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-2 uppercase tracking-wider">Category</label>
              <div className="space-y-1.5">
                <button
                  onClick={() => setFilter('category', '')}
                  className={`block w-full text-left px-3 py-1.5 rounded-lg text-xs transition ${!activeCategory ? 'bg-cyan-950/60 text-cyan-400 font-semibold' : 'text-slate-400 hover:text-white hover:bg-slate-800'}`}
                >
                  All Categories
                </button>
                {categories.map((cat) => (
                  <button
                    key={cat._id}
                    onClick={() => setFilter('category', cat.slug)}
                    className={`block w-full text-left px-3 py-1.5 rounded-lg text-xs transition ${activeCategory === cat.slug ? 'bg-cyan-950/60 text-cyan-400 font-semibold' : 'text-slate-400 hover:text-white hover:bg-slate-800'}`}
                  >
                    {cat.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Brand */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-2 uppercase tracking-wider">Brand</label>
              <div className="space-y-1.5">
                <button
                  onClick={() => setFilter('brand', '')}
                  className={`block w-full text-left px-3 py-1.5 rounded-lg text-xs transition ${!activeBrand ? 'bg-cyan-950/60 text-cyan-400 font-semibold' : 'text-slate-400 hover:text-white hover:bg-slate-800'}`}
                >
                  All Brands
                </button>
                {brands.map((brand) => (
                  <button
                    key={brand._id}
                    onClick={() => setFilter('brand', brand.slug)}
                    className={`block w-full text-left px-3 py-1.5 rounded-lg text-xs transition ${activeBrand === brand.slug ? 'bg-cyan-950/60 text-cyan-400 font-semibold' : 'text-slate-400 hover:text-white hover:bg-slate-800'}`}
                  >
                    {brand.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Strength */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-2 uppercase tracking-wider">Nicotine Strength</label>
              <div className="flex flex-wrap gap-2">
                {STRENGTHS.map((s) => (
                  <button
                    key={s}
                    onClick={() => setFilter('strength', activeStrength === String(s) ? '' : String(s))}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition ${
                      activeStrength === String(s)
                        ? 'bg-cyan-600 border-cyan-500 text-white'
                        : 'bg-slate-900 border-slate-700 text-slate-400 hover:border-slate-500'
                    }`}
                  >
                    {s}mg
                  </button>
                ))}
              </div>
            </div>

            {/* Price Range */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-2 uppercase tracking-wider">Price Range (CAD)</label>
              <div className="flex gap-2">
                <input
                  type="number"
                  placeholder="Min"
                  value={activeMinPrice}
                  onChange={(e) => setFilter('minPrice', e.target.value)}
                  className="w-1/2 bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:border-cyan-500 focus:outline-none"
                />
                <input
                  type="number"
                  placeholder="Max"
                  value={activeMaxPrice}
                  onChange={(e) => setFilter('maxPrice', e.target.value)}
                  className="w-1/2 bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:border-cyan-500 focus:outline-none"
                />
              </div>
            </div>

            {hasActiveFilters && (
              <button
                onClick={clearAllFilters}
                className="w-full text-center px-4 py-2 rounded-lg bg-red-950/50 border border-red-800/50 text-red-400 text-xs font-medium hover:bg-red-950 transition"
              >
                Clear All Filters
              </button>
            )}
          </div>
        </aside>

        {/* Product Grid */}
        <div className="flex-1 min-w-0">
          {loading ? (
            <div className="flex items-center justify-center py-24">
              <div className="w-8 h-8 border-2 border-cyan-500 border-t-transparent rounded-full animate-spin" />
            </div>
          ) : products.length === 0 ? (
            <div className="text-center py-24">
              <p className="text-lg text-slate-400">No products found matching your criteria.</p>
              <button onClick={clearAllFilters} className="mt-4 text-sm text-cyan-400 hover:text-cyan-300 font-medium">
                Clear filters and try again
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
              {products.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ShopPage;
