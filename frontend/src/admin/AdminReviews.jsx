import React, { useEffect, useState } from 'react';
import API from '../api/axios';
import { Star, CheckCircle, XCircle, ShieldAlert, MessageSquare } from 'lucide-react';

const AdminReviews = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchPending = async () => {
    try {
      setLoading(true);
      const res = await API.get('/reviews/pending');
      setReviews(res.data.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPending();
  }, []);

  const handleModerate = async (reviewId, status) => {
    try {
      await API.put(`/reviews/${reviewId}/moderate`, { status, rejectionReason: status === 'rejected' ? 'Prohibited health claim flag' : undefined });
      setReviews(reviews.filter((r) => r._id !== reviewId));
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to moderate review');
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white flex items-center gap-2">
          <Star className="w-6 h-6 text-amber-400" />
          Review Compliance Moderation Queue
        </h1>
        <p className="text-xs text-slate-400">Filter prohibited medical claims, smoking cessation claims, or unverified Statements before publishing</p>
      </div>

      <div className="p-4 bg-amber-950/40 border border-amber-800/60 rounded-xl text-amber-200 text-xs flex items-start gap-2.5">
        <ShieldAlert className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
        <div>
          <p className="font-bold">Health Canada Compliance Guardrail:</p>
          <p className="text-[11px] text-amber-300/80">Reviews must NOT make therapeutic claims such as "cured my addiction" or "helped me quit smoking". Only general flavor and pouch size feedback is compliant.</p>
        </div>
      </div>

      {loading ? (
        <div className="p-8 text-center text-xs text-slate-400">Loading pending reviews...</div>
      ) : reviews.length === 0 ? (
        <div className="p-12 text-center bg-slate-900 border border-slate-800 rounded-2xl space-y-2">
          <MessageSquare className="w-8 h-8 text-emerald-400 mx-auto" />
          <p className="text-sm font-bold text-white">Review Moderation Queue Clear</p>
          <p className="text-xs text-slate-400">All customer reviews have been reviewed and moderated.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {reviews.map((r) => (
            <div key={r._id} className="p-5 bg-slate-900 border border-slate-800 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-lg">
              <div className="space-y-1 max-w-xl">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-cyan-400">{r.product?.name || 'Nicotine Pouch Product'}</span>
                  <div className="flex items-center text-amber-400">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className={`w-3 h-3 ${i < r.rating ? 'fill-amber-400' : 'text-slate-700'}`} />
                    ))}
                  </div>
                </div>
                <p className="text-xs text-white font-medium bg-slate-950 p-3 rounded-xl border border-slate-800/80">"{r.comment}"</p>
                <p className="text-[10px] text-slate-400">Submitted by <span className="text-slate-200 font-semibold">{r.userName}</span></p>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={() => handleModerate(r._id, 'approved')}
                  className="px-4 py-2 bg-emerald-950 hover:bg-emerald-900 text-emerald-400 border border-emerald-800 rounded-xl text-xs font-bold flex items-center gap-1.5 transition"
                >
                  <CheckCircle className="w-4 h-4" /> Approve
                </button>
                <button
                  onClick={() => handleModerate(r._id, 'rejected')}
                  className="px-4 py-2 bg-red-950 hover:bg-red-900 text-red-400 border border-red-800 rounded-xl text-xs font-bold flex items-center gap-1.5 transition"
                >
                  <XCircle className="w-4 h-4" /> Reject
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminReviews;
