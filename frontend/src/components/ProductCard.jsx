import React from 'react';
import { Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { addToCart } from '../store/cartSlice';
import { ShoppingBag, Star, AlertTriangle, Check } from 'lucide-react';

const getProductImage = (product) => {
  if (product.images && product.images.length > 0 && product.images[0]) {
    return product.images[0];
  }
  if (product.imageUrl) return product.imageUrl;

  const name = (product.name || '').toLowerCase();
  const flavor = (product.flavor || '').toLowerCase();

  if (
    name.includes('citrus') ||
    flavor.includes('citrus') ||
    flavor.includes('lemon') ||
    flavor.includes('lime') ||
    flavor.includes('orange') ||
    flavor.includes('tropic') ||
    flavor.includes('mango') ||
    flavor.includes('peach')
  ) {
    return '/images/pouch_citrus.png';
  }

  if (
    name.includes('berry') ||
    flavor.includes('berry') ||
    flavor.includes('cherry') ||
    flavor.includes('grape') ||
    flavor.includes('dragonfruit') ||
    flavor.includes('raspberry') ||
    flavor.includes('blackberry') ||
    flavor.includes('blackcurrant')
  ) {
    return '/images/pouch_berry.png';
  }

  if (
    name.includes('coffee') ||
    flavor.includes('coffee') ||
    flavor.includes('espresso') ||
    flavor.includes('mocha') ||
    flavor.includes('vanilla')
  ) {
    return '/images/pouch_coffee.png';
  }

  return '/images/pouch_mint.png';
};

export const ProductCard = ({ product }) => {
  const dispatch = useDispatch();

  const handleAddToCart = (e) => {
    e.preventDefault();
    dispatch(addToCart(product));
  };

  const productImage = getProductImage(product);

  return (
    <div className="group bg-slate-900/70 border border-slate-800 rounded-2xl overflow-hidden hover:border-cyan-500/50 transition duration-300 flex flex-col h-full shadow-lg relative hover:shadow-cyan-500/5">
      
      {/* Strength Pill Badge */}
      <div className="absolute top-3 left-3 z-10 flex items-center gap-1 bg-slate-950/80 backdrop-blur border border-slate-700 px-2.5 py-1 rounded-full text-[10px] font-bold text-cyan-400">
        <span>{product.strengthMg}mg</span>
        <span className="text-slate-400 font-normal">Strength</span>
      </div>

      {/* Stock status badge */}
      {product.stock < 10 && product.stock > 0 && (
        <div className="absolute top-3 right-3 z-10 px-2 py-0.5 bg-amber-950/80 backdrop-blur border border-amber-700/50 rounded-full text-[9px] font-bold text-amber-400">
          Low Stock
        </div>
      )}

      {/* Image thumbnail */}
      <Link to={`/product/${product.slug}`} className="block relative aspect-square overflow-hidden bg-slate-950">
        <img
          src={productImage}
          alt={product.name}
          className="w-full h-full object-cover object-center group-hover:scale-110 transition duration-700"
          onError={(e) => { e.target.src = FLAVOR_IMAGES['default']; }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition duration-300" />
      </Link>

      {/* Details */}
      <div className="p-4 flex flex-col flex-1">
        <div className="text-[11px] text-slate-400 font-semibold tracking-wider uppercase mb-1">
          {product.brand?.name || 'Nicotine Pouch'}
        </div>

        <Link to={`/product/${product.slug}`} className="text-sm font-semibold text-white hover:text-cyan-400 transition line-clamp-1 mb-1">
          {product.name}
        </Link>

        {/* Flavor tag */}
        {product.flavor && (
          <span className="text-[10px] text-slate-500 mb-2">{product.flavor} • {product.pouchesPerCan || 20} pouches</span>
        )}

        {/* Rating */}
        <div className="flex items-center gap-1 text-xs text-amber-400 mb-3">
          <div className="flex items-center gap-0.5">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className={`w-3 h-3 ${i < Math.round(product.averageRating || 5) ? 'fill-amber-400' : 'text-slate-700'}`} />
            ))}
          </div>
          <span className="font-bold text-slate-200">{product.averageRating || 5.0}</span>
          <span className="text-slate-500 text-[10px]">({product.numReviews || 0})</span>
        </div>

        {/* Price & Add to Cart */}
        <div className="mt-auto pt-3 border-t border-slate-800/80 flex items-center justify-between">
          <div>
            <span className="text-base font-extrabold text-white">${product.price?.toFixed(2)}</span>
            <span className="text-[10px] text-slate-400 ml-1">CAD</span>
          </div>

          <button
            onClick={handleAddToCart}
            className="bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-bold px-3.5 py-2 rounded-xl text-xs flex items-center gap-1.5 transition shadow-md shadow-cyan-900/20 hover:shadow-cyan-500/20"
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            <span>Add</span>
          </button>
        </div>
      </div>
    </div>
  );
};
