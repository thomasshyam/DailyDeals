import React from 'react';
import { Product } from '../types';
import { Heart, Star, TrendingDown, TrendingUp, Minus, AlertTriangle, ExternalLink, ShieldCheck, LineChart } from 'lucide-react';
import { getSpecificProductUrl } from '../utils/productUrls';

interface ProductListViewProps {
  products: Product[];
  onViewDeal: (product: Product) => void;
  wishlistIds: string[];
  onToggleWishlist: (productId: string) => void;
}

export const ProductListView: React.FC<ProductListViewProps> = ({
  products,
  onViewDeal,
  wishlistIds,
  onToggleWishlist,
}) => {
  const getDealScoreBadge = (score: number) => {
    if (score >= 90) {
      return {
        bg: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30',
        label: '🔥 Elite Deal',
      };
    }
    if (score >= 75) {
      return {
        bg: 'bg-indigo-500/15 text-indigo-400 border-indigo-500/30',
        label: '🟢 Great Deal',
      };
    }
    if (score >= 60) {
      return {
        bg: 'bg-amber-500/15 text-amber-400 border-amber-500/30',
        label: '🟡 Fair Deal',
      };
    }
    return {
      bg: 'bg-rose-500/15 text-rose-400 border-rose-500/30',
      label: '🔴 Inflated MRP',
    };
  };

  const getMarketplaceBadge = (mp: string) => {
    switch (mp) {
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
    <div id="product-list-view-container" className="w-full overflow-hidden rounded-2xl border border-slate-800 bg-[#0e0e12] shadow-xl">
      <div className="overflow-x-auto">
        <table id="all-products-table" className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-slate-800 bg-[#13131a] text-xs font-semibold uppercase tracking-wider text-slate-400">
              <th scope="col" className="py-3.5 pl-4 pr-3 sm:pl-6 w-[340px]">Product & Brand</th>
              <th scope="col" className="px-3 py-3.5 hidden md:table-cell">Category</th>
              <th scope="col" className="px-3 py-3.5">Store</th>
              <th scope="col" className="px-3 py-3.5">Deal Price</th>
              <th scope="col" className="px-3 py-3.5">True Savings</th>
              <th scope="col" className="px-3 py-3.5 hidden sm:table-cell">Anti-Deceptive Score</th>
              <th scope="col" className="px-3 py-3.5 hidden lg:table-cell">Price Trend</th>
              <th scope="col" className="py-3.5 pl-3 pr-4 sm:pr-6 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60 text-sm text-slate-200">
            {products.map((product) => {
              const { analysis } = product;
              const isWishlisted = wishlistIds.includes(product.id);
              const scoreBadge = getDealScoreBadge(analysis.dealScore);
              const directStoreUrl = getSpecificProductUrl(product);

              return (
                <tr
                  key={product.id}
                  id={`product-row-${product.id}`}
                  className="hover:bg-slate-800/30 transition-colors group cursor-pointer"
                  onClick={() => onViewDeal(product)}
                >
                  {/* Product Title & Thumbnail */}
                  <td className="py-4 pl-4 pr-3 sm:pl-6">
                    <div className="flex items-center gap-3.5">
                      <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-xl border border-slate-800 bg-[#16161e]">
                        <img
                          src={product.image}
                          alt={product.title}
                          className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-300"
                          loading="lazy"
                        />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <span className="text-[11px] font-medium text-indigo-400 uppercase tracking-wider">{product.brand}</span>
                          <div className="flex items-center gap-0.5 text-xs text-amber-400">
                            <Star className="w-3 h-3 fill-amber-400" />
                            <span className="font-semibold">{product.rating}</span>
                            <span className="text-slate-500 text-[10px]">({product.reviewCount?.toLocaleString()})</span>
                          </div>
                        </div>
                        <h4 className="font-semibold text-slate-100 text-sm line-clamp-1 group-hover:text-indigo-400 transition-colors">
                          {product.title}
                        </h4>
                        <div className="text-xs text-slate-500 truncate max-w-xs mt-0.5">
                          {Object.values(product.specs || {}).slice(0, 2).join(' • ')}
                        </div>
                      </div>
                    </div>
                  </td>

                  {/* Category */}
                  <td className="px-3 py-4 text-xs font-medium text-slate-400 hidden md:table-cell whitespace-nowrap">
                    <span className="px-2.5 py-1 rounded-md bg-slate-800/80 border border-slate-700/60">
                      {product.category}
                    </span>
                  </td>

                  {/* Marketplace */}
                  <td className="px-3 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-semibold border ${getMarketplaceBadge(product.primaryMarketplace)}`}>
                      {product.primaryMarketplace}
                    </span>
                  </td>

                  {/* Deal Price & MRP */}
                  <td className="px-3 py-4 whitespace-nowrap">
                    <div className="flex flex-col">
                      <span className="font-bold text-base text-slate-50">
                        ₹{product.currentPrice.toLocaleString('en-IN')}
                      </span>
                      <span className="text-xs text-slate-500 line-through">
                        MRP ₹{product.mrp.toLocaleString('en-IN')}
                      </span>
                    </div>
                  </td>

                  {/* True Savings */}
                  <td className="px-3 py-4 whitespace-nowrap">
                    {analysis.isMisleadingDiscount ? (
                      <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-semibold bg-rose-500/10 text-rose-400 border border-rose-500/30">
                        <AlertTriangle className="w-3 h-3 shrink-0" />
                        <span>Fake -{analysis.advertisedDiscount}%</span>
                      </div>
                    ) : (
                      <div className="flex flex-col">
                        <span className="font-bold text-emerald-400 text-sm">
                          -{analysis.advertisedDiscount}% OFF
                        </span>
                        {analysis.historicalDiscount > 0 && (
                          <span className="text-[11px] text-emerald-500 font-medium">
                            ₹{(analysis.thirtyDay.avg - product.currentPrice).toLocaleString('en-IN')} below 30D avg
                          </span>
                        )}
                      </div>
                    )}
                  </td>

                  {/* Anti-Deceptive Score */}
                  <td className="px-3 py-4 whitespace-nowrap hidden sm:table-cell">
                    <div className="flex items-center gap-2">
                      <span className={`px-2.5 py-1 rounded-lg text-xs font-bold border ${scoreBadge.bg}`}>
                        {analysis.dealScore}/100
                      </span>
                      <span className="text-xs text-slate-400 font-medium hidden xl:inline">
                        {scoreBadge.label}
                      </span>
                    </div>
                  </td>

                  {/* Price Trend */}
                  <td className="px-3 py-4 whitespace-nowrap hidden lg:table-cell">
                    <div className="flex items-center gap-1.5">
                      {analysis.priceTrend === 'FALLING' && (
                        <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-400">
                          <TrendingDown className="w-3.5 h-3.5" /> 60D Low
                        </span>
                      )}
                      {analysis.priceTrend === 'RISING' && (
                        <span className="inline-flex items-center gap-1 text-xs font-semibold text-amber-400">
                          <TrendingUp className="w-3.5 h-3.5" /> Rising
                        </span>
                      )}
                      {analysis.priceTrend === 'STABLE' && (
                        <span className="inline-flex items-center gap-1 text-xs font-semibold text-slate-400">
                          <Minus className="w-3.5 h-3.5" /> Stable
                        </span>
                      )}
                    </div>
                  </td>

                  {/* Actions */}
                  <td className="py-4 pl-3 pr-4 sm:pr-6 text-right whitespace-nowrap" onClick={(e) => e.stopPropagation()}>
                    <div className="flex items-center justify-end gap-2">
                      {/* Wishlist Button */}
                      <button
                        id={`wishlist-row-${product.id}`}
                        onClick={() => onToggleWishlist(product.id)}
                        className={`p-2 rounded-lg border transition-colors ${
                          isWishlisted
                            ? 'bg-rose-500/20 border-rose-500/40 text-rose-400'
                            : 'bg-slate-800/70 border-slate-700 text-slate-400 hover:text-slate-200'
                        }`}
                        title={isWishlisted ? 'Remove from Wishlist' : 'Add to Wishlist'}
                      >
                        <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-rose-400' : ''}`} />
                      </button>

                      {/* View Audit Button */}
                      <button
                        id={`view-audit-${product.id}`}
                        onClick={() => onViewDeal(product)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-600/20 border border-indigo-500/40 text-indigo-300 text-xs font-medium hover:bg-indigo-600/30 transition-colors"
                      >
                        <LineChart className="w-3.5 h-3.5" />
                        <span className="hidden sm:inline">Audit</span>
                      </button>

                      {/* Direct Store Link */}
                      <a
                        id={`buy-row-${product.id}`}
                        href={directStoreUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-emerald-600 text-white text-xs font-semibold hover:bg-emerald-500 transition-colors shadow-sm"
                      >
                        <span>Buy</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
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
