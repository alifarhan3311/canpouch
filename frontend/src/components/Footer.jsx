import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, Lock, FileText, CheckCircle2 } from 'lucide-react';

export const Footer = () => {
  return (
    <footer className="bg-slate-950 border-t border-slate-800 text-slate-400 text-xs mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          
          {/* Col 1 */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-cyan-500 flex items-center justify-center font-bold text-slate-950 text-sm">
                CP
              </div>
              <span className="text-lg font-bold text-white tracking-tight">CanPouch.ca</span>
            </div>
            <p className="text-slate-400 text-xs leading-relaxed">
              Canada’s dedicated adult compliant platform for tobacco-free nicotine pouches. Serving verified adult consumers across all 13 provinces and territories.
            </p>
            <div className="flex items-center gap-2 text-[11px] text-cyan-400 font-semibold">
              <ShieldCheck className="w-4 h-4" />
              <span>100% Age Verified & Tax Compliant</span>
            </div>
          </div>

          {/* Col 2 */}
          <div>
            <h4 className="text-white font-semibold mb-4 text-sm">Compliance & Legal</h4>
            <ul className="space-y-2.5 text-xs">
              <li><Link to="/policy/age-verification" className="hover:text-cyan-400 transition">Age Verification Policy</Link></li>
              <li><Link to="/policy/provincial-rules" className="hover:text-cyan-400 transition">Provincial Legal Ages</Link></li>
              <li><Link to="/policy/terms" className="hover:text-cyan-400 transition">Terms of Service</Link></li>
              <li><Link to="/policy/privacy" className="hover:text-cyan-400 transition">Privacy Policy</Link></li>
              <li><Link to="/policy/shipping" className="hover:text-cyan-400 transition">Shipping & Tax Rules</Link></li>
            </ul>
          </div>

          {/* Col 3 */}
          <div>
            <h4 className="text-white font-semibold mb-4 text-sm">Categories & Brands</h4>
            <ul className="space-y-2.5 text-xs">
              <li><Link to="/shop?category=mint-menthol" className="hover:text-cyan-400 transition">Mint & Menthol Pouches</Link></li>
              <li><Link to="/shop?category=citrus-fruit" className="hover:text-cyan-400 transition">Citrus Blends</Link></li>
              <li><Link to="/shop?brand=zyn" className="hover:text-cyan-400 transition">ZYN Nicotine Pouches</Link></li>
              <li><Link to="/shop?brand=velo" className="hover:text-cyan-400 transition">VELO Pouches</Link></li>
              <li><Link to="/blog" className="hover:text-cyan-400 transition">Educational Resources</Link></li>
            </ul>
          </div>

          {/* Col 4 */}
          <div className="space-y-3">
            <h4 className="text-white font-semibold text-sm">Health Canada Compliance Statement</h4>
            <div className="p-3 bg-slate-900 border border-slate-800 rounded-xl text-[11px] leading-relaxed text-slate-300">
              This site strictly adheres to Canadian federal and provincial regulations. Nicotine pouches contain nicotine, an addictive substance. Products sold are intended exclusively for verified adults of legal age in their respective province. No health or therapeutic claims are made or implied.
            </div>
          </div>
        </div>

        <div className="pt-8 border-t border-slate-900 flex flex-col sm:flex-row items-center justify-between gap-4 text-slate-500 text-[11px]">
          <p>© 2026 CanPouch.ca Enterprise Platform. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <span>Secure 256-bit SSL Encryption</span>
            <span>•</span>
            <span>Age Verified Access</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
