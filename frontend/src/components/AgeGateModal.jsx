import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setAgeVerification } from '../store/complianceSlice';
import { ShieldCheck, AlertCircle } from 'lucide-react';
import API from '../api/axios';

const PROVINCES = [
  { code: 'AB', name: 'Alberta (18+)', minAge: 18 },
  { code: 'BC', name: 'British Columbia (19+)', minAge: 19 },
  { code: 'MB', name: 'Manitoba (19+)', minAge: 19 },
  { code: 'NB', name: 'New Brunswick (19+)', minAge: 19 },
  { code: 'NL', name: 'Newfoundland & Labrador (19+)', minAge: 19 },
  { code: 'NS', name: 'Nova Scotia (19+)', minAge: 19 },
  { code: 'NT', name: 'Northwest Territories (19+)', minAge: 19 },
  { code: 'NU', name: 'Nunavut (19+)', minAge: 19 },
  { code: 'ON', name: 'Ontario (19+)', minAge: 19 },
  { code: 'PE', name: 'Prince Edward Island (19+)', minAge: 19 },
  { code: 'QC', name: 'Quebec (21+)', minAge: 21 },
  { code: 'SK', name: 'Saskatchewan (19+)', minAge: 19 },
  { code: 'YT', name: 'Yukon (19+)', minAge: 19 }
];

export const AgeGateModal = () => {
  const dispatch = useDispatch();
  const { showAgeGateModal } = useSelector((state) => state.compliance);

  const [province, setProvince] = useState('ON');
  const [dob, setDob] = useState('1998-01-01');
  const [errorMsg, setErrorMsg] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);

  if (!showAgeGateModal) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setIsVerifying(true);

    try {
      const res = await API.post('/compliance/verify-age-province', { province, dateOfBirth: dob });
      if (res.data.data.allowed) {
        dispatch(setAgeVerification({ isVerified: true, province, dob }));
      } else {
        setErrorMsg(res.data.data.reason || 'Age verification failed.');
      }
    } catch (err) {
      setErrorMsg(err.response?.data?.message || 'Age verification check failed.');
    } finally {
      setIsVerifying(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-md">
      <div className="bg-slate-900 border border-slate-700/60 rounded-2xl p-6 sm:p-8 max-w-md w-full shadow-2xl relative text-slate-100">
        <div className="flex flex-col items-center text-center mb-6">
          <div className="w-14 h-14 bg-cyan-950/80 border border-cyan-500/40 rounded-full flex items-center justify-center mb-3">
            <ShieldCheck className="w-8 h-8 text-cyan-400" />
          </div>
          <h2 className="text-2xl font-bold tracking-tight text-white">Age Verification Required</h2>
          <p className="text-xs text-slate-400 mt-1">
            Canadian law requires age verification before entering. Products contain nicotine.
          </p>
        </div>

        {errorMsg && (
          <div className="mb-4 p-3 bg-red-950/80 border border-red-800 rounded-lg text-red-200 text-xs flex items-start gap-2">
            <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
            <span>{errorMsg}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">Select Province</label>
            <select
              value={province}
              onChange={(e) => setProvince(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2.5 text-sm text-white focus:outline-none focus:border-cyan-500"
            >
              {PROVINCES.map((p) => (
                <option key={p.code} value={p.code}>
                  {p.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">Date of Birth</label>
            <input
              type="date"
              value={dob}
              onChange={(e) => setDob(e.target.value)}
              required
              className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2.5 text-sm text-white focus:outline-none focus:border-cyan-500"
            />
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={isVerifying}
              className="w-full bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-semibold py-3 rounded-lg text-sm shadow-lg shadow-cyan-900/30 transition duration-200"
            >
              {isVerifying ? 'Verifying Legal Age...' : 'I Confirm Legal Age & Enter'}
            </button>
          </div>
        </form>

        <p className="text-[10px] text-slate-500 text-center mt-4 leading-relaxed">
          By clicking enter, you verify that you are of legal age to purchase nicotine products in your selected Canadian province.
        </p>
      </div>
    </div>
  );
};
