import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { removeFromCart, updateQuantity, clearCart } from '../store/cartSlice';
import { Minus, Plus, Trash2, ShoppingBag, ArrowRight, AlertTriangle } from 'lucide-react';

const CartPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { cartItems } = useSelector((state) => state.cart);

  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

  if (cartItems.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 text-center">
        <ShoppingBag className="w-16 h-16 text-slate-600 mx-auto mb-4" />
        <h1 className="text-2xl font-bold text-white mb-2">Your Cart is Empty</h1>
        <p className="text-sm text-slate-400 mb-6">Browse our selection of premium nicotine pouches.</p>
        <Link to="/shop" className="inline-flex items-center gap-2 bg-cyan-600 hover:bg-cyan-500 text-white font-bold px-6 py-3 rounded-xl text-sm transition">
          Continue Shopping <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
      <h1 className="text-2xl sm:text-3xl font-bold text-white mb-8">Shopping Cart ({cartItems.length} items)</h1>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-2 space-y-4">
          {cartItems.map((item) => (
            <div key={item._id} className="flex gap-4 p-4 rounded-2xl bg-slate-900/70 border border-slate-800">
              <Link to={`/product/${item.slug}`} className="w-20 h-20 sm:w-24 sm:h-24 rounded-xl bg-slate-950 overflow-hidden shrink-0">
                <img src={item.images?.[0] || 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=200'} alt={item.name} className="w-full h-full object-cover" />
              </Link>

              <div className="flex-1 min-w-0">
                <Link to={`/product/${item.slug}`} className="text-sm font-semibold text-white hover:text-cyan-400 transition line-clamp-1">
                  {item.name}
                </Link>
                <p className="text-xs text-slate-400 mt-0.5">{item.brand?.name} • {item.strengthMg}mg • {item.flavor}</p>

                <div className="flex items-center justify-between mt-3">
                  <div className="flex items-center bg-slate-950 border border-slate-700 rounded-lg">
                    <button onClick={() => dispatch(updateQuantity({ id: item._id, quantity: item.quantity - 1 }))} className="px-2.5 py-1.5 text-slate-400 hover:text-white">
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <span className="px-3 text-xs font-bold text-white">{item.quantity}</span>
                    <button onClick={() => dispatch(updateQuantity({ id: item._id, quantity: item.quantity + 1 }))} className="px-2.5 py-1.5 text-slate-400 hover:text-white">
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div className="flex items-center gap-4">
                    <span className="text-sm font-bold text-white">${(item.price * item.quantity).toFixed(2)}</span>
                    <button onClick={() => dispatch(removeFromCart(item._id))} className="text-red-400 hover:text-red-300 transition">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}

          <button onClick={() => dispatch(clearCart())} className="text-xs text-red-400 hover:text-red-300 font-medium mt-2">
            Clear Entire Cart
          </button>
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div className="sticky top-24 p-6 rounded-2xl bg-slate-900 border border-slate-800">
            <h3 className="text-lg font-bold text-white mb-5">Order Summary</h3>

            <div className="space-y-3 text-sm mb-6">
              <div className="flex justify-between text-slate-300">
                <span>Subtotal</span>
                <span className="font-semibold text-white">${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-slate-300">
                <span>Shipping</span>
                <span className={`font-semibold ${subtotal > 75 ? 'text-emerald-400' : 'text-white'}`}>
                  {subtotal > 75 ? 'FREE' : '$9.99'}
                </span>
              </div>
              <div className="flex justify-between text-slate-400 text-xs">
                <span>Tax</span>
                <span>Calculated at checkout</span>
              </div>
              <div className="pt-3 border-t border-slate-800 flex justify-between font-bold text-white text-base">
                <span>Estimated Total</span>
                <span>${(subtotal + (subtotal > 75 ? 0 : 9.99)).toFixed(2)} CAD</span>
              </div>
            </div>

            {subtotal < 75 && (
              <p className="text-[11px] text-cyan-400 mb-4 text-center">
                Add ${(75 - subtotal).toFixed(2)} more for free shipping!
              </p>
            )}

            <button
              onClick={() => navigate('/checkout')}
              className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold py-3.5 rounded-xl text-sm flex items-center justify-center gap-2 shadow-lg shadow-cyan-900/30 transition"
            >
              Proceed to Checkout
              <ArrowRight className="w-4 h-4" />
            </button>

            <div className="mt-4 p-3 rounded-lg bg-red-950/30 border border-red-900/40">
              <div className="flex items-start gap-2 text-[10px] text-red-300/80">
                <AlertTriangle className="w-3.5 h-3.5 text-red-400 shrink-0 mt-0.5" />
                <span>Age verification will be required at checkout. Nicotine pouches are for adults only.</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;
