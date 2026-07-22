import React from 'react';
import { useParams } from 'react-router-dom';
import { ShieldCheck } from 'lucide-react';

const LegalPolicyPage = () => {
  const { type } = useParams();

  const titleMap = {
    'age-verification': 'Age Verification Policy',
    'provincial-rules': 'Canadian Provincial Rules & Taxes',
    'terms': 'Terms of Service',
    'privacy': 'Privacy Policy',
    'shipping': 'Shipping & Tax Policy'
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <div className="p-8 rounded-2xl bg-slate-900 border border-slate-800 space-y-6">
        <div className="flex items-center gap-2 text-cyan-400 font-bold text-sm">
          <ShieldCheck className="w-5 h-5" />
          <span>Canadian Compliance & Legal Framework</span>
        </div>

        <h1 className="text-3xl font-bold text-white">{titleMap[type] || 'Legal Policy'}</h1>

        <div className="text-xs text-slate-300 space-y-4 leading-relaxed">
          <p>
            CanPouch.ca operates in strict adherence to Health Canada, provincial laws, and consumer protection acts. All customers must undergo mandatory digital age verification prior to browsing or ordering.
          </p>
          <h3 className="text-sm font-bold text-white pt-2">1. Provincial Legal Ages</h3>
          <p>
            Legal purchasing ages vary by province: Alberta (18+), Quebec (21+), Ontario, British Columbia, Manitoba, New Brunswick, Nova Scotia, Newfoundland, PEI, Saskatchewan, Yukon, NWT, Nunavut (19+).
          </p>
          <h3 className="text-sm font-bold text-white pt-2">2. Tax Calculations</h3>
          <p>
            Provincial tax rates (GST, PST, HST, QST) are automatically computed at checkout based on destination shipping address.
          </p>
          <h3 className="text-sm font-bold text-white pt-2">3. Non-Health Claims Disclaimer</h3>
          <p>
            No health, therapeutic, or medical claims are expressed or implied on this platform. Nicotine is an addictive chemical.
          </p>
        </div>
      </div>
    </div>
  );
};

export default LegalPolicyPage;
