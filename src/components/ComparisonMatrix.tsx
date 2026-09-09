import React from 'react';
import { MarketplaceOffer } from '../types';
import { Award, ExternalLink, ShieldCheck, Check } from 'lucide-react';

interface ComparisonMatrixProps {
  offers: MarketplaceOffer[];
  productTitle: string;
}

export const ComparisonMatrix: React.FC<ComparisonMatrixProps> = ({ offers, productTitle }) => {
  if (!offers || offers.length === 0) {
    return (
      <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-500 text-center">
        Cross-marketplace offers are being indexed for this product.
      </div>
    );
  }

  // Find best offer based on dealScore and price
  const bestOffer = offers.reduce((best, curr) => {
    if (curr.dealScore > best.dealScore) return curr;
    if (curr.dealScore === best.dealScore && curr.price < best.price) return curr;
    return best;
  }, offers[0]);

  const getMarketplaceBadgeColor = (marketplace: string) => {
    switch (marketplace) {
      case 'Amazon':
        return 'bg-[#1c160e] text-amber-400 border-amber-500/30';
      case 'Flipkart':
        return 'bg-[#0e1626] text-blue-400 border-blue-500/30';
      case 'Myntra':
        return 'bg-[#220e18] text-rose-400 border-rose-500/30';
      default:
        return 'bg-[#141418] text-slate-300 border-slate-800';
    }
  };

  return (
    <div className="bg-[#0c0c0e] border border-slate-800/60 rounded-3xl p-5 shadow-xl text-slate-200">
      <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
        <div>
          <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono flex items-center gap-2">
            Cross-Marketplace Price Matrix
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Real-time offer indexing across Amazon, Flipkart, Myntra & authorized retailers
          </p>
        </div>

        {bestOffer && (
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-xs font-mono font-bold border border-emerald-500/30">
            <Award className="w-3.5 h-3.5 text-emerald-400" />
            <span>🏆 Best Deal: {bestOffer.marketplace} (₹{bestOffer.price.toLocaleString('en-IN')})</span>
          </div>
        )}
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="border-b border-slate-800 bg-[#131316] text-slate-400 uppercase text-[10px] font-mono tracking-wider">
              <th className="py-3 px-3">Marketplace</th>
              <th className="py-3 px-3">Current Price</th>
              <th className="py-3 px-3">30D Avg Price</th>
              <th className="py-3 px-3">Savings vs Avg</th>
              <th className="py-3 px-3">Deal Score</th>
              <th className="py-3 px-3">Seller & Stock</th>
              <th className="py-3 px-3 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60 font-medium">
            {offers.map((offer) => {
              const isBest = offer.marketplace === bestOffer.marketplace;
              const savings = offer.thirtyDayAvg > offer.price ? offer.thirtyDayAvg - offer.price : 0;
              const savingsPct = offer.thirtyDayAvg > 0 ? Math.round((savings / offer.thirtyDayAvg) * 100) : 0;

              return (
                <tr
                  key={offer.marketplace}
                  className={`hover:bg-[#141418] transition-colors ${
                    isBest ? 'bg-emerald-500/5' : ''
                  }`}
                >
                  {/* Marketplace */}
                  <td className="py-3 px-3">
                    <div className="flex items-center gap-2">
                      <span
                        className={`px-2.5 py-1 rounded-lg text-xs font-bold font-mono border ${getMarketplaceBadgeColor(
                          offer.marketplace
                        )}`}
                      >
                        {offer.marketplace}
                      </span>
                      {isBest && (
                        <span className="text-[10px] font-mono font-bold text-emerald-400 bg-emerald-500/20 px-1.5 py-0.5 rounded border border-emerald-500/30">
                          BEST DEAL
                        </span>
                      )}
                    </div>
                  </td>

                  {/* Price */}
                  <td className="py-3 px-3">
                    <span className="text-sm font-black font-mono text-white">
                      ₹{offer.price.toLocaleString('en-IN')}
                    </span>
                    <span className="block text-[10px] line-through text-slate-500 font-mono">
                      MRP ₹{offer.mrp.toLocaleString('en-IN')}
                    </span>
                  </td>

                  {/* 30D Avg */}
                  <td className="py-3 px-3 font-mono text-slate-400">
                    ₹{offer.thirtyDayAvg.toLocaleString('en-IN')}
                  </td>

                  {/* Savings */}
                  <td className="py-3 px-3">
                    {savings > 0 ? (
                      <span className="text-emerald-400 font-bold font-mono">
                        ↓ ₹{savings.toLocaleString('en-IN')} ({savingsPct}%)
                      </span>
                    ) : (
                      <span className="text-slate-500 font-mono">Normal</span>
                    )}
                  </td>

                  {/* Deal Score */}
                  <td className="py-3 px-3">
                    <div className="flex items-center gap-1.5">
                      <span
                        className={`font-mono font-bold px-2 py-0.5 rounded-md text-xs border ${
                          offer.dealScore >= 85
                            ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                            : offer.dealScore >= 70
                            ? 'bg-indigo-500/10 text-indigo-400 border-indigo-500/30'
                            : 'bg-amber-500/10 text-amber-400 border-amber-500/30'
                        }`}
                      >
                        {offer.dealScore}/100
                      </span>
                    </div>
                  </td>

                  {/* Seller & Stock */}
                  <td className="py-3 px-3">
                    <div className="text-slate-200 text-xs font-medium">{offer.seller}</div>
                    <div className="flex items-center gap-1 text-[11px] text-emerald-400 font-mono">
                      <ShieldCheck className="w-3 h-3 text-emerald-400" />
                      <span>{offer.sellerRating} ★ • In Stock</span>
                    </div>
                  </td>

                  {/* Action */}
                  <td className="py-3 px-3 text-right">
                    {(() => {
                      const targetUrl = (offer.url && offer.url !== 'https://flipkart.com' && offer.url !== 'https://amazon.in')
                        ? offer.url
                        : (offer.marketplace === 'Amazon'
                            ? `https://www.amazon.in/s?k=${encodeURIComponent(productTitle)}`
                            : offer.marketplace === 'Flipkart'
                            ? `https://www.flipkart.com/search?q=${encodeURIComponent(productTitle)}`
                            : offer.marketplace === 'Croma'
                            ? `https://www.croma.com/search/?text=${encodeURIComponent(productTitle)}`
                            : `https://www.myntra.com/${encodeURIComponent(productTitle.replace(/\s+/g, '-').toLowerCase())}`);
                      return (
                        <a
                          href={targetUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                            isBest
                              ? 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-md shadow-emerald-600/20'
                              : 'bg-[#141418] hover:bg-[#1a1a20] text-slate-300 hover:text-white border border-slate-800'
                          }`}
                        >
                          <span>Buy on {offer.marketplace}</span>
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      );
                    })()}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
