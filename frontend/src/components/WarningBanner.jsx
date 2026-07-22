import React from 'react';
import { AlertTriangle } from 'lucide-react';

export const WarningBanner = () => {
  return (
    <div className="bg-red-950/90 border-b border-red-800/50 text-red-200 py-2.5 px-4 text-xs sm:text-sm font-semibold tracking-wide flex items-center justify-center gap-2 text-center shadow-inner">
      <AlertTriangle className="w-4 h-4 text-red-400 shrink-0 animate-pulse" />
      <span>
        <strong className="text-red-100 uppercase">WARNING:</strong> This product contains nicotine. Nicotine is an addictive chemical. FOR ADULTS ONLY (18+/19+/21+ depending on province).
      </span>
    </div>
  );
};
