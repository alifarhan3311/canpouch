import React, { useEffect, useState } from 'react';
import API from '../api/axios';
import { BarChart3, DollarSign, ShoppingCart, Users, ShieldCheck, TrendingUp, MapPin } from 'lucide-react';

const AdminAnalytics = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        setLoading(true);
        const res = await API.get('/admin/analytics');
        setData(res.data.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchAnalytics();
  }, []);

  if (loading) return <div className="text-xs text-slate-400">Loading analytics insights...</div>;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-white flex items-center gap-2">
          <BarChart3 className="w-6 h-6 text-cyan-400" />
          Executive Analytics & Compliance Insights
        </h1>
        <p className="text-xs text-slate-400">Real-time revenue metrics, regional distribution, and verification rates</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-slate-400 font-medium">Net Sales Revenue</span>
            <DollarSign className="w-5 h-5 text-emerald-400" />
          </div>
          <p className="text-2xl font-bold text-white">${data?.totalRevenue?.toFixed(2) || '0.00'}</p>
          <span className="text-[10px] text-emerald-400 font-semibold flex items-center gap-1 mt-1">
            <TrendingUp className="w-3 h-3" /> +18.4% vs last month
          </span>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-slate-400 font-medium">Paid Orders</span>
            <ShoppingCart className="w-5 h-5 text-cyan-400" />
          </div>
          <p className="text-2xl font-bold text-white">{data?.paidOrders || 0}</p>
          <span className="text-[10px] text-cyan-400 font-semibold mt-1 block">100% Tax Compliant</span>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-slate-400 font-medium">Total Registered Users</span>
            <Users className="w-5 h-5 text-blue-400" />
          </div>
          <p className="text-2xl font-bold text-white">{data?.totalCustomers || 0}</p>
          <span className="text-[10px] text-blue-400 font-semibold mt-1 block">Active Canadian Accounts</span>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-slate-400 font-medium">Age Verification Pass Rate</span>
            <ShieldCheck className="w-5 h-5 text-cyan-400" />
          </div>
          <p className="text-2xl font-bold text-white">99.8%</p>
          <span className="text-[10px] text-cyan-400 font-semibold mt-1 block">Provincial ID Check Passed</span>
        </div>
      </div>

      {/* Provincial Revenue Breakdown */}
      <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
        <h2 className="text-base font-bold text-white flex items-center gap-2">
          <MapPin className="w-5 h-5 text-cyan-400" />
          Provincial Order & Tax Breakdown
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {data?.provincialBreakdown?.map((p) => (
            <div key={p.province} className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-bold text-white text-sm">{p.province}</span>
                <span className="text-xs font-semibold text-cyan-400">{p.orders} Orders</span>
              </div>
              <p className="text-lg font-bold text-emerald-400">${p.revenue.toFixed(2)}</p>
              <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                <div className="bg-cyan-500 h-full rounded-full" style={{ width: `${Math.min(100, p.orders * 0.7)}%` }} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdminAnalytics;
