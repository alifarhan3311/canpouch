import React, { useEffect, useState } from 'react';
import API from '../api/axios';
import { ShieldCheck, AlertTriangle } from 'lucide-react';

const AdminComplianceCenter = () => {
  const [rules, setRules] = useState([]);

  useEffect(() => {
    const fetchRules = async () => {
      try {
        const res = await API.get('/compliance/rules');
        setRules(res.data.data?.rules || []);
      } catch (err) {
        console.error(err);
      }
    };
    fetchRules();
  }, []);

  const toggleRestriction = async (provinceCode, currentRestricted) => {
    try {
      await API.put(`/compliance/rules/${provinceCode}`, { isRestricted: !currentRestricted });
      setRules(rules.map((r) => (r.provinceCode === provinceCode ? { ...r, isRestricted: !currentRestricted } : r)));
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <ShieldCheck className="w-8 h-8 text-cyan-400" />
        <div>
          <h1 className="text-2xl font-bold text-white">Compliance Center</h1>
          <p className="text-xs text-slate-400">Canadian Provincial Rule Engine & Tax Administration Matrix</p>
        </div>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-950 text-slate-400 uppercase">
            <tr>
              <th className="p-3">Province</th>
              <th className="p-3">Min Legal Age</th>
              <th className="p-3">Tax Rate</th>
              <th className="p-3">Tax Name</th>
              <th className="p-3">Shipping Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800 text-slate-300">
            {rules.map((r) => (
              <tr key={r.provinceCode}>
                <td className="p-3 font-bold text-white">{r.provinceName} ({r.provinceCode})</td>
                <td className="p-3 font-semibold text-cyan-400">{r.minAge}+</td>
                <td className="p-3">{(r.taxRate * 100).toFixed(2)}%</td>
                <td className="p-3">{r.taxName}</td>
                <td className="p-3">
                  <button
                    onClick={() => toggleRestriction(r.provinceCode, r.isRestricted)}
                    className={`px-3 py-1 rounded-full text-[10px] font-bold ${
                      r.isRestricted ? 'bg-red-950 text-red-400 border border-red-800' : 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                    }`}
                  >
                    {r.isRestricted ? 'Restricted (Blocked)' : 'Enabled for Checkout'}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminComplianceCenter;
