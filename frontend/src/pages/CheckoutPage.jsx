import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { clearCart } from '../store/cartSlice';
import API from '../api/axios';
import { ShieldCheck, AlertCircle, Lock, CreditCard, CheckCircle2 } from 'lucide-react';

const PROVINCES = [
  { code: 'AB', name: 'Alberta (5% GST)', minAge: 18, taxRate: 0.05, taxName: 'GST' },
  { code: 'BC', name: 'British Columbia (12% PST+GST)', minAge: 19, taxRate: 0.12, taxName: 'PST+GST' },
  { code: 'MB', name: 'Manitoba (12% PST+GST)', minAge: 19, taxRate: 0.12, taxName: 'PST+GST' },
  { code: 'NB', name: 'New Brunswick (15% HST)', minAge: 19, taxRate: 0.15, taxName: 'HST' },
  { code: 'NL', name: 'Newfoundland and Labrador (15% HST)', minAge: 19, taxRate: 0.15, taxName: 'HST' },
  { code: 'NS', name: 'Nova Scotia (15% HST)', minAge: 19, taxRate: 0.15, taxName: 'HST' },
  { code: 'NT', name: 'Northwest Territories (5% GST)', minAge: 19, taxRate: 0.05, taxName: 'GST' },
  { code: 'NU', name: 'Nunavut (5% GST)', minAge: 19, taxRate: 0.05, taxName: 'GST' },
  { code: 'ON', name: 'Ontario (13% HST)', minAge: 19, taxRate: 0.13, taxName: 'HST' },
  { code: 'PE', name: 'Prince Edward Island (15% HST)', minAge: 19, taxRate: 0.15, taxName: 'HST' },
  { code: 'QC', name: 'Quebec (14.975% QST+GST)', minAge: 21, taxRate: 0.14975, taxName: 'QST+GST' },
  { code: 'SK', name: 'Saskatchewan (11% PST+GST)', minAge: 19, taxRate: 0.11, taxName: 'PST+GST' },
  { code: 'YT', name: 'Yukon (5% GST)', minAge: 19, taxRate: 0.05, taxName: 'GST' }
];

const CheckoutPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { cartItems } = useSelector((state) => state.cart);
  const { user, isAuthenticated } = useSelector((state) => state.auth);
  const { verifiedProvince, verifiedDob } = useSelector((state) => state.compliance);

  const [street, setStreet] = useState(user?.addresses?.[0]?.street || '100 Yonge Street');
  const [city, setCity] = useState(user?.addresses?.[0]?.city || 'Toronto');
  const [province, setProvince] = useState(verifiedProvince || 'ON');
  const [postalCode, setPostalCode] = useState(user?.addresses?.[0]?.postalCode || 'M5H 1H1');
  const [dob, setDob] = useState(verifiedDob || '1998-01-01');
  const [errorMsg, setErrorMsg] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(null);

  const selectedProvObj = PROVINCES.find((p) => p.code === province) || PROVINCES[8];
  const itemsPrice = cartItems.reduce((sum, i) => sum + i.price * i.quantity, 0);
  const taxPrice = Number((itemsPrice * selectedProvObj.taxRate).toFixed(2));
  const shippingPrice = itemsPrice > 75 ? 0 : 9.99;
  const totalPrice = Number((itemsPrice + taxPrice + shippingPrice).toFixed(2));

  if (cartItems.length === 0 && !orderSuccess) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-24 text-center">
        <p className="text-lg text-slate-400">Your cart is empty.</p>
        <Link to="/shop" className="text-cyan-400 font-semibold mt-4 inline-block">Return to Shop</Link>
      </div>
    );
  }

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (!isAuthenticated) {
      setErrorMsg('Please sign in or register to complete your order.');
      return;
    }

    setIsSubmitting(true);
    try {
      const orderPayload = {
        orderItems: cartItems.map((item) => ({
          product: item._id,
          name: item.name,
          quantity: item.quantity
        })),
        shippingAddress: {
          street,
          city,
          province,
          postalCode,
          country: 'Canada'
        },
        dateOfBirth: dob,
        paymentMethodToken: 'MOCK_TOKEN_CANPOUCH_2026'
      };

      const res = await API.post('/orders', orderPayload);
      setOrderSuccess(res.data.data);
      dispatch(clearCart());
    } catch (err) {
      setErrorMsg(err.response?.data?.message || 'Failed to place order. Check age & province compliance.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (orderSuccess) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-16 text-center">
        <div className="w-16 h-16 bg-emerald-950 border border-emerald-500/40 rounded-full flex items-center justify-center mx-auto mb-4 text-emerald-400">
          <CheckCircle2 className="w-10 h-10" />
        </div>
        <h1 className="text-3xl font-bold text-white mb-2">Order Confirmed!</h1>
        <p className="text-sm text-slate-300 mb-6">
          Order Number: <strong className="text-cyan-400">{orderSuccess.orderNumber}</strong>
        </p>
        <div className="p-6 bg-slate-900 border border-slate-800 rounded-2xl text-left mb-6 text-xs text-slate-300 space-y-2">
          <p><strong>Total Paid:</strong> ${orderSuccess.totalPrice.toFixed(2)} CAD</p>
          <p><strong>Applied Tax:</strong> {orderSuccess.appliedTaxName} ({(orderSuccess.appliedTaxRate * 100).toFixed(1)}%)</p>
          <p><strong>Shipping Address:</strong> {orderSuccess.shippingAddress?.street}, {orderSuccess.shippingAddress?.city}, {orderSuccess.shippingAddress?.province} {orderSuccess.shippingAddress?.postalCode}</p>
          <p><strong>Age Verified Record:</strong> Mandatory Dob Checked & Logged</p>
        </div>
        <Link to="/dashboard" className="bg-cyan-600 hover:bg-cyan-500 text-white font-bold px-8 py-3 rounded-xl text-sm inline-block">
          View Order History in Dashboard
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
      <div className="flex items-center gap-2 mb-8">
        <Lock className="w-5 h-5 text-cyan-400" />
        <h1 className="text-2xl sm:text-3xl font-bold text-white">Age-Verified Checkout</h1>
      </div>

      {errorMsg && (
        <div className="mb-6 p-4 bg-red-950/80 border border-red-800 rounded-xl text-red-200 text-xs flex items-start gap-2">
          <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
          <span>{errorMsg}</span>
        </div>
      )}

      <form onSubmit={handlePlaceOrder} className="grid lg:grid-cols-3 gap-8">
        {/* Left Col: Customer & Shipping Details */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* DOB & Age Verification */}
          <div className="p-6 bg-slate-900/80 border border-slate-800 rounded-2xl">
            <div className="flex items-center gap-2 text-white font-bold text-sm mb-4">
              <ShieldCheck className="w-4 h-4 text-cyan-400" />
              <span>1. Canadian Legal Age Re-Verification</span>
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Date of Birth (Mandatory)</label>
                <input
                  type="date"
                  value={dob}
                  onChange={(e) => setDob(e.target.value)}
                  required
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2.5 text-xs text-white"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Destination Province</label>
                <select
                  value={province}
                  onChange={(e) => setProvince(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2.5 text-xs text-white"
                >
                  {PROVINCES.map((p) => (
                    <option key={p.code} value={p.code}>{p.name}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Shipping Address */}
          <div className="p-6 bg-slate-900/80 border border-slate-800 rounded-2xl space-y-4">
            <h3 className="text-white font-bold text-sm">2. Canadian Shipping Address</h3>
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Street Address</label>
              <input
                type="text"
                value={street}
                onChange={(e) => setStreet(e.target.value)}
                required
                placeholder="100 Yonge Street"
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2.5 text-xs text-white"
              />
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">City</label>
                <input
                  type="text"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  required
                  placeholder="Toronto"
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2.5 text-xs text-white"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Postal Code</label>
                <input
                  type="text"
                  value={postalCode}
                  onChange={(e) => setPostalCode(e.target.value)}
                  required
                  placeholder="M5H 1H1"
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2.5 text-xs text-white"
                />
              </div>
            </div>
          </div>

          {/* Payment Method Interface */}
          <div className="p-6 bg-slate-900/80 border border-slate-800 rounded-2xl">
            <h3 className="text-white font-bold text-sm mb-3">3. Payment Method (Pluggable Abstraction Layer)</h3>
            <div className="p-4 bg-slate-950 border border-cyan-500/40 rounded-xl flex items-center justify-between text-xs text-slate-200">
              <div className="flex items-center gap-3">
                <CreditCard className="w-5 h-5 text-cyan-400" />
                <div>
                  <p className="font-semibold text-white">Credit Card / Debit (CAD)</p>
                  <p className="text-[10px] text-slate-400">Processed via Payment Abstraction Service (Moneris/Stripe Compatible)</p>
                </div>
              </div>
              <span className="text-cyan-400 text-[10px] font-bold uppercase bg-cyan-950 px-2 py-1 rounded">Sandbox Active</span>
            </div>
          </div>
        </div>

        {/* Right Col: Summary */}
        <div className="lg:col-span-1">
          <div className="p-6 bg-slate-900 border border-slate-800 rounded-2xl sticky top-24 space-y-4">
            <h3 className="text-lg font-bold text-white">Summary</h3>

            <div className="divide-y divide-slate-800 text-xs">
              {cartItems.map((item) => (
                <div key={item._id} className="py-2.5 flex justify-between">
                  <span className="text-slate-300">{item.name} x {item.quantity}</span>
                  <span className="font-semibold text-white">${(item.price * item.quantity).toFixed(2)}</span>
                </div>
              ))}
            </div>

            <div className="pt-3 border-t border-slate-800 space-y-2 text-xs">
              <div className="flex justify-between text-slate-300">
                <span>Subtotal</span>
                <span>${itemsPrice.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-slate-300">
                <span>Provincial Tax ({selectedProvObj.taxName})</span>
                <span>${taxPrice.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-slate-300">
                <span>Shipping</span>
                <span>{shippingPrice === 0 ? 'FREE' : `$${shippingPrice.toFixed(2)}`}</span>
              </div>
              <div className="pt-3 border-t border-slate-800 flex justify-between font-extrabold text-white text-base">
                <span>Total</span>
                <span className="text-cyan-400">${totalPrice.toFixed(2)} CAD</span>
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold py-3.5 rounded-xl text-sm shadow-lg shadow-cyan-900/30 transition disabled:opacity-50"
            >
              {isSubmitting ? 'Processing Order...' : `Pay $${totalPrice.toFixed(2)} CAD`}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default CheckoutPage;
