import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import API from '../api/axios';
import { Package, ShieldCheck, Clock, MapPin, User } from 'lucide-react';

const CustomerDashboard = () => {
  const { user } = useSelector((state) => state.auth);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await API.get('/orders/my-orders');
        setOrders(res.data.data || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
      <div className="flex items-center gap-3 mb-8">
        <div className="w-12 h-12 rounded-full bg-cyan-950 border border-cyan-500/40 flex items-center justify-center text-cyan-400 font-bold text-lg">
          {user?.firstName?.[0]}
        </div>
        <div>
          <h1 className="text-2xl font-bold text-white">Hello, {user?.firstName}</h1>
          <p className="text-xs text-slate-400">Account Dashboard & Order History</p>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Orders List */}
        <div className="lg:col-span-2 space-y-4">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <Package className="w-5 h-5 text-cyan-400" />
            Your Orders ({orders.length})
          </h2>

          {loading ? (
            <p className="text-xs text-slate-400">Loading orders...</p>
          ) : orders.length === 0 ? (
            <div className="p-8 rounded-2xl bg-slate-900 border border-slate-800 text-center text-slate-400 text-xs">
              No orders placed yet.
            </div>
          ) : (
            orders.map((order) => (
              <div key={order._id} className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800 pb-3 text-xs">
                  <div>
                    <span className="font-bold text-white">Order #{order.orderNumber}</span>
                    <p className="text-[10px] text-slate-400">{new Date(order.createdAt).toLocaleDateString()}</p>
                  </div>
                  <span className="px-2.5 py-1 rounded-full text-[10px] font-bold capitalize bg-cyan-950 text-cyan-400 border border-cyan-500/30">
                    {order.orderStatus}
                  </span>
                </div>

                <div className="space-y-2 text-xs">
                  {order.orderItems?.map((item, i) => (
                    <div key={i} className="flex justify-between text-slate-300">
                      <span>{item.name} x {item.quantity}</span>
                      <span>${(item.price * item.quantity).toFixed(2)}</span>
                    </div>
                  ))}
                </div>

                <div className="pt-3 border-t border-slate-800 flex justify-between items-center text-xs font-bold text-white">
                  <span>Total Paid ({order.appliedTaxName} included)</span>
                  <span className="text-cyan-400">${order.totalPrice.toFixed(2)} CAD</span>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Profile Card */}
        <div className="lg:col-span-1">
          <div className="p-6 bg-slate-900 border border-slate-800 rounded-2xl space-y-4 text-xs">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <User className="w-4 h-4 text-cyan-400" /> Profile & Verification
            </h3>
            <div className="space-y-2 text-slate-300">
              <p><strong>Name:</strong> {user?.firstName} {user?.lastName}</p>
              <p><strong>Email:</strong> {user?.email}</p>
              <p><strong>Province:</strong> {user?.province}</p>
              <div className="pt-2">
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-950 text-emerald-400 text-[10px] font-bold border border-emerald-500/30">
                  <ShieldCheck className="w-3.5 h-3.5" /> Age Verified Status
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomerDashboard;
