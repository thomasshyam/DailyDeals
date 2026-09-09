import React, { useState } from 'react';
import { Product, PriceAlert } from '../types';
import {
  X,
  Star,
  ShieldCheck,
  TrendingDown,
  TrendingUp,
  ExternalLink,
  Bell,
  Heart,
  Award,
  CheckCircle2,
  AlertCircle,
  Zap,
  Info,
} from 'lucide-react';
import { PriceChart } from './PriceChart';
import { ComparisonMatrix } from './ComparisonMatrix';
import { GenuineDiscountBadge } from './GenuineDiscountBadge';
import { PriceAlertModal } from './PriceAlertModal';
import { getSpecificProductUrl } from '../utils/productUrls';

interface ProductDetailModalProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
  isWishlisted: boolean;
  onToggleWishlist: (id: string) => void;
  onSaveAlert: (alert: PriceAlert) => void;
}

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({
  product,
  isOpen,
  onClose,
  isWishlisted,
  onToggleWishlist,
  onSaveAlert,
}) => {
  const [alertModalOpen, setAlertModalOpen] = useState(false);

  if (!isOpen || !product) return null;

  const { analysis } = product;

  // Recommendation Badge
  const getRecommendationBadge = () => {
    switch (analysis.recommendation) {
      case 'BUY_NOW':
        return {
          bg: 'bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 shadow-emerald-500/10',
          title: '🟢 STRONG BUY RECOMMENDATION',
          sub: analysis.recommendationReason,
        };
      case 'WAIT':
        return {
          bg: 'bg-amber-500/15 border border-amber-500/30 text-amber-300 shadow-amber-500/10',
          title: '🟡 RECOMMEND WAITING',
          sub: analysis.recommendationReason,
        };
      case 'DONT_BUY':
        return {
          bg: 'bg-rose-500/15 border border-rose-500/30 text-rose-300 shadow-rose-500/10',
          title: '🔴 INFLATED / POOR TIMING',
          sub: analysis.recommendationReason,
        };
    }
  };

  const rec = getRecommendationBadge();

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 md:p-6 bg-black/85 backdrop-blur-md overflow-y-auto">
        <div
          id="product-detail-modal-container"
          className="bg-[#0c0c0e] rounded-3xl max-w-5xl w-full max-h-[92vh] flex flex-col shadow-2xl border border-slate-800 text-slate-100 overflow-hidden relative animate-in fade-in zoom-in-95 duration-200 my-auto"
        >
          {/* Modal Header Bar */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800/80 bg-[#111115]">
            <div className="flex items-center gap-2">
              <span className="text-[11px] uppercase font-mono font-bold text-slate-400 tracking-wider">
                {product.brand} • {product.category}
              </span>
              <span className="text-slate-600">|</span>
              <span className="text-xs text-slate-400 font-mono">ID: {product.id}</span>
            </div>

            <div className="flex items-center gap-2">
              <button
                id="modal-toggle-wishlist"
                onClick={() => onToggleWishlist(product.id)}
                className={`p-2 rounded-xl border transition-all cursor-pointer ${
                  isWishlisted
                    ? 'bg-rose-500/15 border-rose-500/30 text-rose-400 shadow-sm'
                    : 'bg-[#141418] border-slate-800 text-slate-400 hover:text-rose-400 hover:bg-[#1a1a20]'
                }`}
                title={isWishlisted ? 'Saved in Watchlist' : 'Add to Watchlist'}
              >
                <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-current text-rose-500' : ''}`} />
              </button>

              <button
                id="modal-close-btn"
                onClick={onClose}
                className="p-2 rounded-xl bg-[#141418] border border-slate-800 text-slate-400 hover:text-white hover:bg-[#1a1a20] transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Modal Scrollable Body */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {/* Top Overview: Image + Core Pricing & Verdict */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
              {/* Product Image */}
              <div className="md:col-span-4 flex flex-col">
                <div className="relative aspect-square rounded-2xl bg-[#141418] border border-slate-800 overflow-hidden group">
                  <img
                    src={product.image}
                    alt={product.title}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover object-center"
                  />
                  <div className="absolute top-3 left-3 flex flex-col gap-1">
                    <span className="px-2.5 py-1 rounded-md text-xs font-mono font-bold bg-[#0c0c0e]/90 text-white shadow-sm backdrop-blur-sm border border-slate-700">
                      {product.primaryMarketplace}
                    </span>
                    {analysis.isFlashDeal && (
                      <span className="px-2.5 py-1 rounded-md text-xs font-mono font-extrabold bg-amber-500 text-slate-950 shadow-sm">
                        ⚡ FLASH DEAL
                      </span>
                    )}
                  </div>
                </div>

                {/* Seller validation card */}
                <div className="mt-3 p-3 bg-[#121216] rounded-xl border border-slate-800 text-xs">
                  <div className="flex items-center justify-between text-slate-400 mb-1">
                    <span>Primary Seller</span>
                    <span className="font-semibold text-white">{product.primarySeller}</span>
                  </div>
                  <div className="flex items-center justify-between text-slate-400">
                    <span>Verified Update</span>
                    <span className="font-mono text-emerald-400">{product.lastUpdated}</span>
                  </div>
                </div>
              </div>

              {/* Product Info & Intelligence Verdict */}
              <div className="md:col-span-8 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-1.5">
                    <div className="flex items-center gap-1 text-xs font-mono font-bold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
                      <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                      <span>{product.rating}</span>
                      <span className="text-slate-400 font-normal">
                        ({product.reviewCount.toLocaleString()} reviews)
                      </span>
                    </div>
                    <span className="text-slate-600">•</span>
                    <span className="text-xs font-medium text-slate-400 font-mono">
                      Marketplace: {product.primaryMarketplace}
                    </span>
                  </div>

                  <h1 className="text-xl sm:text-2xl font-bold text-white leading-snug mb-3">
                    {product.title}
                  </h1>

                  {/* Pricing Matrix Header */}
                  <div className="p-4 bg-[#141418] border border-slate-800 text-white rounded-2xl shadow-lg mb-4">
                    <div className="flex flex-wrap items-baseline justify-between gap-2 mb-2">
                      <div className="flex items-baseline gap-3">
                        <span className="text-3xl font-black font-mono tracking-tight text-white">
                          ₹{product.currentPrice.toLocaleString('en-IN')}
                        </span>
                        <span className="text-sm line-through text-slate-500 font-mono">
                          MRP ₹{product.mrp.toLocaleString('en-IN')}
                        </span>
                        <span className="text-sm font-bold text-emerald-400 font-mono">
                          {analysis.advertisedDiscount}% OFF MRP
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        <div className="text-right">
                          <span className="block text-[10px] uppercase font-mono font-bold text-slate-400">
                            Deal Confidence Score
                          </span>
                          <span className="text-xl font-black font-mono text-emerald-400">
                            {analysis.dealScore}/100
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Recommendation Banner */}
                    <div className={`p-3 rounded-xl shadow-md ${rec.bg}`}>
                      <div className="text-xs font-black font-mono tracking-wider uppercase">{rec.title}</div>
                      <p className="text-xs font-medium opacity-95 mt-0.5 leading-relaxed">{rec.sub}</p>
                    </div>
                  </div>

                  {/* 10-day, 30-day, 60-day price intelligence metrics from PRD */}
                  <div className="grid grid-cols-3 gap-2 sm:gap-3 mb-4">
                    {/* 10-day report */}
                    <div className="p-3 bg-[#121216] rounded-xl border border-slate-800">
                      <span className="block text-[10px] uppercase font-mono font-bold text-slate-400 mb-0.5">
                        10-Day Trend
                      </span>
                      <span className="text-sm font-bold font-mono text-white block">
                        ₹{analysis.tenDay.avg.toLocaleString('en-IN')}
                      </span>
                      <div className="text-[11px] font-mono font-semibold mt-1">
                        {analysis.tenDay.changePct <= 0 ? (
                          <span className="text-emerald-400">
                            ↓ {Math.abs(analysis.tenDay.changePct)}% vs 10D
                          </span>
                        ) : (
                          <span className="text-amber-400">
                            ↑ {analysis.tenDay.changePct}% vs 10D
                          </span>
                        )}
                      </div>
                    </div>

                    {/* 30-day report */}
                    <div className="p-3 bg-[#151522] rounded-xl border border-indigo-500/30">
                      <span className="block text-[10px] uppercase font-mono font-bold text-indigo-400 mb-0.5">
                        30-Day Benchmark
                      </span>
                      <span className="text-sm font-bold font-mono text-white block">
                        ₹{analysis.thirtyDay.avg.toLocaleString('en-IN')}
                      </span>
                      <div className="text-[11px] font-mono font-bold mt-1">
                        {analysis.thirtyDay.changePct <= 0 ? (
                          <span className="text-emerald-400">
                            ↓ {Math.abs(analysis.thirtyDay.changePct)}% vs 30D
                          </span>
                        ) : (
                          <span className="text-amber-400">
                            ↑ {analysis.thirtyDay.changePct}% vs 30D
                          </span>
                        )}
                      </div>
                    </div>

                    {/* 60-day report */}
                    <div className="p-3 bg-[#121216] rounded-xl border border-slate-800">
                      <span className="block text-[10px] uppercase font-mono font-bold text-slate-400 mb-0.5">
                        60-Day Trend
                      </span>
                      <span className="text-sm font-bold font-mono text-white block">
                        ₹{analysis.sixtyDay.avg.toLocaleString('en-IN')}
                      </span>
                      <div className="text-[11px] font-mono font-semibold mt-1">
                        {analysis.sixtyDay.changePct <= 0 ? (
                          <span className="text-emerald-400">
                            ↓ {Math.abs(analysis.sixtyDay.changePct)}% vs 60D
                          </span>
                        ) : (
                          <span className="text-amber-400">
                            ↑ {analysis.sixtyDay.changePct}% vs 60D
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Action CTA Bar */}
                <div className="flex flex-wrap items-center gap-3 pt-2">
                  <a
                    id="modal-buy-now-cta"
                    href={getSpecificProductUrl(product)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 min-w-[200px] py-3 px-5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-sm transition-all shadow-md shadow-indigo-600/25 flex items-center justify-center gap-2"
                  >
                    <span>Buy on {product.primaryMarketplace} (₹{product.currentPrice.toLocaleString('en-IN')})</span>
                    <ExternalLink className="w-4 h-4" />
                  </a>

                  <button
                    id="modal-set-alert-btn"
                    onClick={() => setAlertModalOpen(true)}
                    className="py-3 px-4 rounded-xl bg-[#141418] hover:bg-[#1a1a20] text-slate-200 font-bold text-xs transition-colors flex items-center gap-1.5 cursor-pointer border border-slate-800"
                  >
                    <Bell className="w-4 h-4 text-indigo-400" />
                    <span>Set Price Drop Alert</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Genuine Discount Detailed Audit Banner */}
            <GenuineDiscountBadge analysis={analysis} variant="detailed" />

            {/* Interactive Price Chart with 10D / 30D / 60D selector */}
            <div>
              <PriceChart
                priceHistory={product.priceHistory}
                currentPrice={product.currentPrice}
              />
            </div>

            {/* Cross-Marketplace Comparison Table */}
            <div>
              <ComparisonMatrix offers={product.offers} productTitle={product.title} />
            </div>

            {/* Technical Specifications */}
            {product.specs && Object.keys(product.specs).length > 0 && (
              <div className="bg-[#121216] rounded-2xl p-5 border border-slate-800">
                <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-400 mb-3">
                  Product Specifications & Verified Attributes
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs">
                  {Object.entries(product.specs).map(([key, value]) => (
                    <div
                      key={key}
                      className="flex items-start justify-between p-2.5 rounded-xl bg-[#0c0c0e] border border-slate-800/80"
                    >
                      <span className="font-mono text-slate-400 mr-2">{key}:</span>
                      <span className="font-semibold text-white text-right">{value}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Embedded Alert Modal */}
      <PriceAlertModal
        product={product}
        isOpen={alertModalOpen}
        onClose={() => setAlertModalOpen(false)}
        onSaveAlert={onSaveAlert}
      />
    </>
  );
};
