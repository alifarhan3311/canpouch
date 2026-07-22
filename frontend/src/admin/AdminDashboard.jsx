import React, { useEffect, useState } from 'react';
import API from '../api/axios';
import { DollarSign, ShoppingCart, Package, Users, ShieldAlert, Star } from 'lucide-react';

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await API.get('/admin/dashboard-stats');
        setStats(res.data.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) return <div className="text-xs text-slate-400">Loading admin metrics...</div>;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-white">Enterprise Admin Dashboard</h1>
        <p className="text-xs text-slate-400">Platform overview, sales metrics, and compliance status</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-slate-400">Total Revenue</span>
            <DollarSign className="w-5 h-5 text-emerald-400" />
          </div>
          <p className="text-2xl font-bold text-white">${stats?.totalRevenue?.toFixed(2) || '0.00'}</p>
          <span className="text-[10px] text-emerald-400">CAD Tax Included</span>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-slate-400">Total Orders</span>
            <ShoppingCart className="w-5 h-5 text-cyan-400" />
          </div>
          <p className="text-2xl font-bold text-white">{stats?.totalOrders || 0}</p>
          <span className="text-[10px] text-slate-400">Age Verified</span>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-slate-400">Products</span>
            <Package className="w-5 h-5 text-blue-400" />
          </div>
          <p className="text-2xl font-bold text-white">{stats?.totalProducts || 0}</p>
          <span className="text-[10px] text-slate-400">Active SKUs</span>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-slate-400">Pending Reviews</span>
            <ShieldAlert className="w-5 h-5 text-amber-400" />
          </div>
          <p className="text-2xl font-bold text-white">{stats?.pendingReviews || 0}</p>
          <span className="text-[10px] text-amber-400 font-semibold">Requires Moderation</span>
        </div>
      </div>

      {/* Recent Orders */}
      <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800">
        <h2 className="text-lg font-bold text-white mb-4">Recent Customer Orders</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950 text-slate-400 uppercase">
              <tr>
                <th className="p-3">Order Number</th>
                <th className="p-3">Customer</th>
                <th className="p-3">Total</th>
                <th className="p-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800 text-slate-300">
              {stats?.recentOrders?.map((order) => (
                <tr key={order._id}>
                  <td className="p-3 font-bold text-white">{order.orderNumber}</td>
                  <td className="p-3">{order.user?.firstName} {order.user?.lastName}</td>
                  <td className="p-3 font-semibold text-cyan-400">${order.totalPrice?.toFixed(2)}</td>
                  <td className="p-3 capitalize">{order.orderStatus}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
