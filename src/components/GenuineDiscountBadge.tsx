import React from 'react';
import { AlertTriangle, CheckCircle2, TrendingDown } from 'lucide-react';
import { DealAnalysis } from '../types';

interface GenuineDiscountBadgeProps {
  analysis: DealAnalysis;
  variant?: 'compact' | 'detailed';
}

export const GenuineDiscountBadge: React.FC<GenuineDiscountBadgeProps> = ({
  analysis,
  variant = 'compact',
}) => {
  const { advertisedDiscount, historicalDiscount, isMisleadingDiscount, misleadingReason } = analysis;

  if (variant === 'compact') {
    if (isMisleadingDiscount) {
      return (
        <div
          title={misleadingReason}
          className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-400 text-[10px] font-mono font-bold"
        >
          <AlertTriangle className="w-3 h-3 text-amber-400 flex-shrink-0" />
          <span>Claimed {advertisedDiscount}% | Real {Math.max(0, historicalDiscount)}%</span>
        </div>
      );
    }

    if (historicalDiscount >= 10) {
      return (
        <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-[10px] font-mono font-bold">
          <TrendingDown className="w-3 h-3 text-emerald-400 flex-shrink-0" />
          <span>↓ {historicalDiscount}% vs 30D Avg</span>
        </div>
      );
    }

    return (
      <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg bg-[#141418] border border-slate-800 text-slate-400 text-[10px] font-mono">
        <span>{advertisedDiscount}% OFF MRP</span>
      </div>
    );
  }

  // Detailed view (for product modal or detail cards)
  return (
    <div className={`p-4 rounded-2xl border ${
      isMisleadingDiscount 
        ? 'bg-[#18130e] border-amber-500/30 text-amber-200' 
        : 'bg-[#0d1612] border-emerald-500/30 text-emerald-200'
    }`}>
      <div className="flex items-start gap-3">
        <div className={`p-2 rounded-xl flex-shrink-0 ${
          isMisleadingDiscount ? 'bg-amber-500/20 text-amber-400' : 'bg-emerald-500/20 text-emerald-400'
        }`}>
          {isMisleadingDiscount ? (
            <AlertTriangle className="w-5 h-5" />
          ) : (
            <CheckCircle2 className="w-5 h-5" />
          )}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mb-2">
            <span className="text-[10px] font-mono uppercase font-bold tracking-widest text-slate-400">
              Genuine Discount Audit
            </span>
            {isMisleadingDiscount ? (
              <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">
                ⚠️ Misleading Advertised Sale
              </span>
            ) : (
              <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                ✓ Verified Genuine Price Drop
              </span>
            )}
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 my-2.5 text-xs">
            <div className="bg-[#0c0c0e] p-2.5 rounded-xl border border-slate-800">
              <span className="block text-slate-500 text-[10px] font-mono mb-0.5">Advertised MRP Cut</span>
              <span className="text-base font-bold text-white font-mono">{advertisedDiscount}% OFF</span>
            </div>

            <div className="bg-[#0c0c0e] p-2.5 rounded-xl border border-slate-800">
              <span className="block text-slate-500 text-[10px] font-mono mb-0.5">Real 30-Day Drop</span>
              <span className={`text-base font-bold font-mono ${
                historicalDiscount > 10 ? 'text-emerald-400' : 'text-white'
              }`}>
                {historicalDiscount > 0 ? `↓ ${historicalDiscount}%` : '0%'}
              </span>
            </div>

            <div className="col-span-2 sm:col-span-1 bg-[#0c0c0e] p-2.5 rounded-xl border border-slate-800">
              <span className="block text-slate-500 text-[10px] font-mono mb-0.5">30-Day Baseline Avg</span>
              <span className="text-base font-bold text-slate-200 font-mono">
                ₹{analysis.thirtyDay.avg.toLocaleString('en-IN')}
              </span>
            </div>
          </div>

          <p className="text-xs text-slate-300 leading-relaxed mt-1">
            {isMisleadingDiscount
              ? misleadingReason || 'Seller marked up the MRP to advertise a steep discount, but current price is very close to regular everyday pricing.'
              : `Current price is genuinely discounted below the 30-day baseline average of ₹${analysis.thirtyDay.avg.toLocaleString('en-IN')}. This represents true savings.`}
          </p>
        </div>
      </div>
    </div>
  );
};
