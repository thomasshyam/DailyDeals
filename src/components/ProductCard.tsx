import React from 'react';
import { Product } from '../types';
import { Heart, Star, TrendingDown, TrendingUp, Minus, AlertTriangle, Sparkles, ExternalLink, Zap } from 'lucide-react';
import { GenuineDiscountBadge } from './GenuineDiscountBadge';
import { getSpecificProductUrl } from '../utils/productUrls';

interface ProductCardProps {
  product: Product;
  onViewDeal: (product: Product) => void;
  isWishlisted: boolean;
  onToggleWishlist: (productId: string) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onViewDeal,
  isWishlisted,
  onToggleWishlist,
}) => {
  const { analysis, offers } = product;
  const bestOffer = offers?.length > 0 ? offers.reduce((a, b) => (b.dealScore > a.dealScore ? b : a), offers[0]) : null;

  // Deal score color styling
  const getDealScoreBadge = (score: number) => {
    if (score >= 90) {
      return {
        bg: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
        text: '🔥 EXCELLENT DEAL',
      };
    }
    if (score >= 75) {
      return {
        bg: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/30',
        text: '🟢 GREAT DEAL',
      };
    }
    if (score >= 60) {
      return {
        bg: 'bg-amber-500/10 text-amber-400 border-amber-500/30',
        text: '🟡 FAIR / AVERAGE',
      };
    }
    return {
      bg: 'bg-rose-500/10 text-rose-400 border-rose-500/30',
      text: '🔴 POOR DEAL',
    };
  };

  const scoreBadge = getDealScoreBadge(analysis.dealScore);

  const getMarketplaceColor = (mp: string) => {
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
    <div
      id={`product-card-${product.id}`}
      className="group bg-[#0c0c0e] rounded-3xl border border-slate-800/60 hover:border-indigo-500/40 shadow-xl hover:shadow-2xl hover:shadow-indigo-500/5 transition-all duration-300 flex flex-col overflow-hidden"
    >
      {/* Image & Badges Container */}
      <div className="relative aspect-[4/3] bg-[#141418] overflow-hidden">
        <img
          src={product.image}
          alt={product.title}
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500 opacity-90 group-hover:opacity-100"
          loading="lazy"
        />

        {/* Floating Top Badges */}
        <div className="absolute top-2.5 left-2.5 flex flex-col gap-1.5 z-10">
          {analysis.isFlashDeal && (
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-mono font-extrabold bg-amber-500 text-slate-950 shadow-md uppercase tracking-wider">
              <Zap className="w-3 h-3 fill-current" />
              FLASH DROP
            </span>
          )}

          {analysis.historicalDiscount >= 12 ? (
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-mono font-extrabold bg-emerald-500 text-slate-950 shadow-md uppercase tracking-wider">
              🔥 {analysis.historicalDiscount}% GENUINE DROP
            </span>
          ) : analysis.isMisleadingDiscount ? (
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-amber-500 text-slate-950 shadow-md uppercase tracking-wider">
              <AlertTriangle className="w-3 h-3" />
              INFLATED MRP
            </span>
          ) : null}
        </div>

        {/* Wishlist Button */}
        <button
          id={`wishlist-toggle-${product.id}`}
          onClick={(e) => {
            e.stopPropagation();
            onToggleWishlist(product.id);
          }}
          className={`absolute top-2.5 right-2.5 w-8 h-8 rounded-full flex items-center justify-center backdrop-blur-md transition-all cursor-pointer z-10 border ${
            isWishlisted
              ? 'bg-rose-600 text-white border-rose-500 shadow-md shadow-rose-500/30 scale-105'
              : 'bg-slate-900/80 hover:bg-slate-900 text-slate-400 hover:text-rose-400 border-slate-800'
          }`}
          aria-label={isWishlisted ? 'Remove from watchlist' : 'Add to watchlist'}
        >
          <Heart className={`w-3.5 h-3.5 ${isWishlisted ? 'fill-current' : ''}`} />
        </button>

        {/* Marketplace Pill overlay */}
        <div className="absolute bottom-2.5 left-2.5 z-10">
          <span
            className={`px-2 py-0.5 rounded-lg text-[10px] font-mono font-bold border backdrop-blur-md shadow-sm ${getMarketplaceColor(
              product.primaryMarketplace
            )}`}
          >
            {product.primaryMarketplace}
          </span>
        </div>

        {/* Last updated tag */}
        <div className="absolute bottom-2.5 right-2.5 text-[10px] text-slate-400 font-mono bg-slate-950/80 backdrop-blur-sm px-1.5 py-0.5 rounded-md border border-slate-800">
          {product.lastUpdated}
        </div>
      </div>

      {/* Card Body */}
      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          {/* Brand & Rating */}
          <div className="flex items-center justify-between gap-2 mb-1.5">
            <span className="text-[10px] font-mono uppercase font-bold text-slate-500 tracking-wider">
              {product.brand}
            </span>
            <div className="flex items-center gap-1 text-xs font-semibold text-slate-300">
              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
              <span className="font-mono">{product.rating}</span>
              <span className="text-slate-500 text-[11px] font-mono">({(product.reviewCount / 1000).toFixed(1)}k)</span>
            </div>
          </div>

          {/* Product Title */}
          <h3
            onClick={() => onViewDeal(product)}
            className="text-sm font-bold text-white line-clamp-2 hover:text-indigo-400 cursor-pointer transition-colors leading-snug mb-2.5"
            title={product.title}
          >
            {product.title}
          </h3>

          {/* Price Row */}
          <div className="flex items-baseline flex-wrap gap-x-2 gap-y-0.5 mb-2.5">
            <span className="text-xl font-black font-mono text-white tracking-tight">
              ₹{product.currentPrice.toLocaleString('en-IN')}
            </span>
            <span className="text-xs line-through text-slate-500 font-mono">
              ₹{product.mrp.toLocaleString('en-IN')}
            </span>
            <span className="text-xs font-bold text-emerald-400 font-mono">
              {analysis.advertisedDiscount}% OFF
            </span>
          </div>

          {/* Advertised vs Real Discount Audit */}
          <div className="mb-3">
            <GenuineDiscountBadge analysis={analysis} variant="compact" />
          </div>

          {/* Price Intelligence Stats: 30D Low & Price Movement */}
          <div className="grid grid-cols-2 gap-2 py-2 px-2.5 bg-[#121215] rounded-2xl border border-slate-800/80 text-xs mb-3">
            <div>
              <span className="block text-[10px] text-slate-500 uppercase font-mono font-semibold">30D Low</span>
              <span className="font-mono font-bold text-emerald-400 text-xs">
                ₹{analysis.thirtyDay.low.toLocaleString('en-IN')}
              </span>
            </div>

            <div>
              <span className="block text-[10px] text-slate-500 uppercase font-mono font-semibold">Trajectory</span>
              <div className="flex items-center gap-1 mt-0.5">
                {analysis.priceTrend === 'FALLING' ? (
                  <>
                    <TrendingDown className="w-3 h-3 text-emerald-400" />
                    <span className="text-emerald-400 font-bold text-xs font-mono">Falling ↓</span>
                  </>
                ) : analysis.priceTrend === 'RISING' ? (
                  <>
                    <TrendingUp className="w-3 h-3 text-amber-400" />
                    <span className="text-amber-400 font-bold text-xs font-mono">Rising ↑</span>
                  </>
                ) : (
                  <>
                    <Minus className="w-3 h-3 text-slate-400" />
                    <span className="text-slate-300 font-semibold text-xs font-mono">Stable</span>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Footer: Deal Score & View Deal CTA */}
        <div>
          <div className="flex items-center justify-between mb-3 pt-2 border-t border-slate-800/80">
            <div className="flex items-center gap-1.5">
              <span className="text-[11px] text-slate-400 font-mono">Deal Score:</span>
              <span className="text-sm font-black font-mono text-emerald-400">
                {analysis.dealScore}
              </span>
              <span className="text-[11px] text-slate-500 font-mono">/100</span>
            </div>
            <span
              className={`text-[10px] font-mono font-extrabold px-2 py-0.5 rounded-md border uppercase tracking-wider ${scoreBadge.bg}`}
            >
              {scoreBadge.text}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <button
              id={`view-deal-btn-${product.id}`}
              onClick={() => onViewDeal(product)}
              className="w-full py-2 px-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs transition-colors flex items-center justify-center gap-1 cursor-pointer shadow-md shadow-indigo-600/20"
            >
              <span>View Deal</span>
            </button>

            <a
              href={getSpecificProductUrl(product)}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-2 px-3 rounded-xl bg-[#141418] hover:bg-[#1a1a20] text-slate-300 hover:text-white font-bold text-xs transition-colors flex items-center justify-center gap-1 border border-slate-800"
            >
              <span>Buy Direct</span>
              <ExternalLink className="w-3 h-3 text-slate-400" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
