import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { addToCart } from '../store/cartSlice';
import { motion } from 'framer-motion';
import API from '../api/axios';
import { ShoppingBag, Star, AlertTriangle, Shield, Minus, Plus, ChevronRight, Truck, ShieldCheck, RotateCcw } from 'lucide-react';

const FLAVOR_FALLBACKS = {
  'mint': '/images/pouch_mint.png',
  'menthol': '/images/pouch_mint.png',
  'citrus': '/images/pouch_citrus.png',
  'berry': '/images/pouch_berry.png',
  'coffee': '/images/pouch_coffee.png',
  'wintergreen': '/images/pouch_mint.png',
  'default': '/images/pouch_mint.png'
};

const getFlavorImage = (flavor, name = '') => {
  const f = (flavor || '').toLowerCase();
  const n = (name || '').toLowerCase();

  if (n.includes('citrus') || f.includes('citrus') || f.includes('lemon') || f.includes('lime') || f.includes('orange') || f.includes('tropic') || f.includes('mango')) {
    return '/images/pouch_citrus.png';
  }
  if (n.includes('berry') || f.includes('berry') || f.includes('cherry') || f.includes('grape') || f.includes('dragonfruit') || f.includes('raspberry')) {
    return '/images/pouch_berry.png';
  }
  if (n.includes('coffee') || f.includes('coffee') || f.includes('espresso') || f.includes('mocha') || f.includes('vanilla')) {
    return '/images/pouch_coffee.png';
  }
  return '/images/pouch_mint.png';
};

const ProductDetailPage = () => {
  const { slug } = useParams();
  const dispatch = useDispatch();
  const [product, setProduct] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [activeImg, setActiveImg] = useState(0);

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      try {
        const res = await API.get(`/products/${slug}`);
        setProduct(res.data.data);
        if (res.data.data?._id) {
          const revRes = await API.get(`/reviews/product/${res.data.data._id}`);
          setReviews(revRes.data.data || []);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [slug]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-32">
        <div className="w-10 h-10 border-2 border-cyan-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="text-center py-32 text-slate-400">
        <p className="text-xl">Product not found.</p>
        <Link to="/shop" className="text-cyan-400 mt-4 inline-block">← Back to Shop</Link>
      </div>
    );
  }

  const handleAddToCart = () => {
    dispatch(addToCart({ ...product, quantity }));
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-1.5 text-xs text-slate-500 mb-8">
        <Link to="/" className="hover:text-white transition">Home</Link>
        <ChevronRight className="w-3 h-3" />
        <Link to="/shop" className="hover:text-white transition">Shop</Link>
        <ChevronRight className="w-3 h-3" />
        <span className="text-slate-300">{product.name}</span>
      </nav>

      <div className="grid lg:grid-cols-2 gap-10 lg:gap-14">
        {/* Image Gallery */}
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5 }}>
          <div className="aspect-square rounded-2xl bg-slate-900 border border-slate-800 overflow-hidden mb-4 shadow-2xl">
            <img
              src={(product.images && product.images[activeImg]) || (product.images && product.images[0]) || product.imageUrl || getFlavorImage(product.flavor)}
              alt={product.name}
              className="w-full h-full object-cover hover:scale-105 transition duration-500"
              onError={(e) => { e.target.src = FLAVOR_FALLBACKS['default']; }}
            />
          </div>
          {product.images.length > 1 && (
            <div className="flex gap-3">
              {product.images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setActiveImg(i)}
                  className={`w-16 h-16 rounded-xl border overflow-hidden transition ${activeImg === i ? 'border-cyan-500' : 'border-slate-700 hover:border-slate-500'}`}
                >
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </motion.div>

        {/* Product Info */}
        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5, delay: 0.1 }}>
          <div className="flex items-center gap-2 mb-3">
            <span className="text-xs font-semibold text-cyan-400 bg-cyan-950/50 border border-cyan-500/30 px-2.5 py-1 rounded-full">
              {product.brand?.name}
            </span>
            <span className="text-xs text-slate-400">{product.category?.name}</span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-bold text-white mb-3">{product.name}</h1>

          {/* Rating */}
          <div className="flex items-center gap-2 mb-4">
            <div className="flex items-center gap-0.5">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  className={`w-4 h-4 ${star <= Math.round(product.averageRating) ? 'text-amber-400 fill-amber-400' : 'text-slate-600'}`}
                />
              ))}
            </div>
            <span className="text-sm font-semibold text-white">{product.averageRating}</span>
            <span className="text-xs text-slate-400">({product.numReviews} reviews)</span>
          </div>

          {/* Price */}
          <div className="flex items-baseline gap-3 mb-6">
            <span className="text-3xl font-extrabold text-white">${product.price.toFixed(2)}</span>
            {product.compareAtPrice && (
              <span className="text-lg text-slate-500 line-through">${product.compareAtPrice.toFixed(2)}</span>
            )}
            <span className="text-xs text-slate-400">CAD</span>
          </div>

          {/* Product Specs */}
          <div className="grid grid-cols-2 gap-3 mb-6">
            <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
              <p className="text-[10px] text-slate-400 uppercase">Nicotine Strength</p>
              <p className="text-sm font-bold text-white">{product.strengthMg}mg</p>
            </div>
            <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
              <p className="text-[10px] text-slate-400 uppercase">Pouches / Can</p>
              <p className="text-sm font-bold text-white">{product.pouchesPerCan}</p>
            </div>
            <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
              <p className="text-[10px] text-slate-400 uppercase">Flavor</p>
              <p className="text-sm font-bold text-white">{product.flavor}</p>
            </div>
            <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
              <p className="text-[10px] text-slate-400 uppercase">In Stock</p>
              <p className={`text-sm font-bold ${product.stock > 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                {product.stock > 0 ? `${product.stock} available` : 'Out of Stock'}
              </p>
            </div>
          </div>

          <p className="text-sm text-slate-300 leading-relaxed mb-6">{product.description}</p>

          {/* Quantity & Add to Cart */}
          <div className="flex items-center gap-4 mb-6">
            <div className="flex items-center bg-slate-900 border border-slate-700 rounded-xl">
              <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="px-3 py-2.5 text-slate-300 hover:text-white">
                <Minus className="w-4 h-4" />
              </button>
              <span className="px-4 text-sm font-bold text-white min-w-[40px] text-center">{quantity}</span>
              <button onClick={() => setQuantity(quantity + 1)} className="px-3 py-2.5 text-slate-300 hover:text-white">
                <Plus className="w-4 h-4" />
              </button>
            </div>

            <button
              onClick={handleAddToCart}
              disabled={product.stock === 0}
              className="flex-1 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold py-3.5 rounded-xl text-sm flex items-center justify-center gap-2 shadow-lg shadow-cyan-900/30 transition disabled:opacity-50"
            >
              <ShoppingBag className="w-4 h-4" />
              Add to Cart — ${(product.price * quantity).toFixed(2)}
            </button>
          </div>

          {/* Mandatory Warnings */}
          <div className="p-4 rounded-xl bg-red-950/30 border border-red-900/50 space-y-2">
            <div className="flex items-center gap-2 text-red-400 font-semibold text-xs">
              <AlertTriangle className="w-4 h-4" />
              <span>Health Canada Compliance Notices</span>
            </div>
            {(product.warnings || []).map((w, i) => (
              <p key={i} className="text-[11px] text-red-300/80 leading-relaxed">{w}</p>
            ))}
          </div>

          {/* Delivery Promise */}
          <div className="mt-6 grid grid-cols-3 gap-3">
            <div className="flex items-center gap-2 p-3 rounded-xl bg-slate-900/60 border border-slate-800">
              <Truck className="w-4 h-4 text-cyan-400 shrink-0" />
              <span className="text-[10px] text-slate-300 font-medium">Free Shipping $50+</span>
            </div>
            <div className="flex items-center gap-2 p-3 rounded-xl bg-slate-900/60 border border-slate-800">
              <ShieldCheck className="w-4 h-4 text-cyan-400 shrink-0" />
              <span className="text-[10px] text-slate-300 font-medium">Age Verified</span>
            </div>
            <div className="flex items-center gap-2 p-3 rounded-xl bg-slate-900/60 border border-slate-800">
              <RotateCcw className="w-4 h-4 text-cyan-400 shrink-0" />
              <span className="text-[10px] text-slate-300 font-medium">Easy Returns</span>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Reviews Section */}
      <section className="mt-16">
        <h2 className="text-xl font-bold text-white mb-6">Customer Reviews ({reviews.length})</h2>
        {reviews.length === 0 ? (
          <p className="text-sm text-slate-400">No approved reviews yet for this product.</p>
        ) : (
          <div className="space-y-4">
            {reviews.map((review) => (
              <div key={review._id} className="p-5 rounded-xl bg-slate-900/70 border border-slate-800">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold text-white">{review.userName}</span>
                    <div className="flex items-center gap-0.5">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star key={star} className={`w-3 h-3 ${star <= review.rating ? 'text-amber-400 fill-amber-400' : 'text-slate-600'}`} />
                      ))}
                    </div>
                  </div>
                  <span className="text-[10px] text-slate-500">{new Date(review.createdAt).toLocaleDateString()}</span>
                </div>
                <p className="text-xs text-slate-300">{review.comment}</p>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default ProductDetailPage;
