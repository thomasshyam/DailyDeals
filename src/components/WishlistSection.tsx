import React from 'react';
import { Product, PriceAlert } from '../types';
import { Heart, Bell, Trash2, ExternalLink, ArrowRight, TrendingDown, CheckCircle2 } from 'lucide-react';

interface WishlistSectionProps {
  wishlistProducts: Product[];
  alerts: PriceAlert[];
  onRemoveWishlist: (productId: string) => void;
  onRemoveAlert: (alertId: string) => void;
  onViewProduct: (product: Product) => void;
  onExploreClick: () => void;
}

export const WishlistSection: React.FC<WishlistSectionProps> = ({
  wishlistProducts,
  alerts,
  onRemoveWishlist,
  onRemoveAlert,
  onViewProduct,
  onExploreClick,
}) => {
  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Active Price Drop Alerts */}
      <div className="bg-[#0c0c0e] rounded-3xl border border-slate-800/60 p-6 shadow-xl text-slate-200">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 flex items-center justify-center">
              <Bell className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white font-mono uppercase tracking-wide">
                Active Price Drop Subscriptions
              </h3>
              <p className="text-xs text-slate-400">
                Automated monitors checking hourly feeds across Amazon, Flipkart, Myntra
              </p>
            </div>
          </div>
          <span className="text-xs font-mono font-bold bg-[#141418] text-indigo-300 border border-indigo-500/30 px-2.5 py-1 rounded-full">
            {alerts.length} Active {alerts.length === 1 ? 'Monitor' : 'Monitors'}
          </span>
        </div>

        {alerts.length === 0 ? (
          <div className="py-10 text-center bg-[#121216] rounded-2xl border border-dashed border-slate-800">
            <Bell className="w-8 h-8 text-slate-600 mx-auto mb-2" />
            <p className="text-sm font-semibold text-slate-300">No active price drop alerts set</p>
            <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1 mb-4">
              Click "Set Price Drop Alert" on any product to get notified as soon as a genuine dip happens.
            </p>
            <button
              onClick={onExploreClick}
              className="px-4 py-2 bg-indigo-600 text-white rounded-xl text-xs font-mono font-bold hover:bg-indigo-500 transition-colors cursor-pointer shadow-md shadow-indigo-600/20"
            >
              Browse Catalog
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {alerts.map((alert) => {
              const diff = alert.currentPrice - alert.targetPrice;
              return (
                <div
                  key={alert.id}
                  className="p-4 rounded-2xl border border-slate-800 bg-[#121216] hover:border-indigo-500/40 shadow-md transition-all flex flex-col justify-between"
                >
                  <div className="flex items-start gap-3">
                    <img
                      src={alert.productImage}
                      alt={alert.productTitle}
                      className="w-12 h-12 rounded-xl object-cover border border-slate-800 flex-shrink-0 bg-black/40"
                    />
                    <div className="min-w-0 flex-1">
                      <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                        {alert.marketplace}
                      </span>
                      <h4 className="text-xs font-bold text-white truncate mt-1">
                        {alert.productTitle}
                      </h4>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-xs text-slate-400">Current:</span>
                        <span className="text-xs font-mono font-bold text-white">
                          ₹{alert.currentPrice.toLocaleString('en-IN')}
                        </span>
                      </div>
                    </div>

                    <button
                      onClick={() => onRemoveAlert(alert.id)}
                      className="text-slate-500 hover:text-rose-400 p-1 transition-colors cursor-pointer"
                      title="Cancel alert"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="mt-3 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs">
                    <div>
                      <span className="text-[10px] font-mono text-slate-400 uppercase block">Target Trigger</span>
                      <span className="font-mono font-bold text-emerald-400">
                        ₹{alert.targetPrice.toLocaleString('en-IN')}
                      </span>
                    </div>

                    <span className="text-[10px] font-mono font-medium text-slate-400 bg-[#1a1a22] border border-slate-800 px-2 py-0.5 rounded-lg">
                      Needs ₹{diff.toLocaleString('en-IN')} drop
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Saved Wishlist Products */}
      <div className="bg-[#0c0c0e] rounded-3xl border border-slate-800/60 p-6 shadow-xl text-slate-200">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-rose-500/10 text-rose-400 border border-rose-500/20 flex items-center justify-center">
              <Heart className="w-4 h-4 fill-current text-rose-500" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white font-mono uppercase tracking-wide">
                Saved Watchlist Products
              </h3>
              <p className="text-xs text-slate-400">
                Products pinned for historical tracking & price drop comparisons
              </p>
            </div>
          </div>
          <span className="text-xs font-mono font-bold bg-[#141418] text-rose-400 border border-rose-500/30 px-2.5 py-1 rounded-full">
            {wishlistProducts.length} Saved
          </span>
        </div>

        {wishlistProducts.length === 0 ? (
          <div className="py-10 text-center bg-[#121216] rounded-2xl border border-dashed border-slate-800">
            <Heart className="w-8 h-8 text-slate-600 mx-auto mb-2" />
            <p className="text-sm font-semibold text-slate-300">Your watchlist is currently empty</p>
            <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1 mb-4">
              Tap the heart icon on any product card across the catalog to monitor its daily price trajectory.
            </p>
            <button
              onClick={onExploreClick}
              className="px-4 py-2 bg-indigo-600 text-white rounded-xl text-xs font-mono font-bold hover:bg-indigo-500 transition-colors cursor-pointer shadow-md shadow-indigo-600/20"
            >
              Explore Today's Deals
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {wishlistProducts.map((p) => (
              <div
                key={p.id}
                className="bg-[#121216] rounded-2xl border border-slate-800 p-4 hover:border-indigo-500/40 transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="relative aspect-video rounded-xl bg-[#0c0c0e] overflow-hidden mb-3 border border-slate-800/80">
                    <img
                      src={p.image}
                      alt={p.title}
                      className="w-full h-full object-cover"
                    />
                    <button
                      onClick={() => onRemoveWishlist(p.id)}
                      className="absolute top-2 right-2 p-1.5 bg-[#0c0c0e]/80 rounded-full text-rose-400 hover:bg-rose-500/20 transition-colors shadow-sm border border-slate-700"
                      title="Remove from wishlist"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                    <span className="absolute bottom-2 left-2 text-[10px] font-mono font-bold bg-[#0c0c0e]/90 text-white px-2 py-0.5 rounded backdrop-blur-sm border border-slate-700">
                      {p.primaryMarketplace}
                    </span>
                  </div>

                  <span className="text-[10px] font-mono font-bold text-slate-500 uppercase tracking-wider">
                    {p.brand}
                  </span>
                  <h4 className="text-xs font-bold text-white line-clamp-2 mt-0.5 mb-2">
                    {p.title}
                  </h4>

                  <div className="flex items-baseline gap-2 mb-2">
                    <span className="text-base font-black font-mono text-white">
                      ₹{p.currentPrice.toLocaleString('en-IN')}
                    </span>
                    <span className="text-xs line-through text-slate-500 font-mono">
                      ₹{p.mrp.toLocaleString('en-IN')}
                    </span>
                    <span className="text-xs font-bold text-emerald-400 font-mono">
                      {p.analysis.advertisedDiscount}% OFF
                    </span>
                  </div>

                  <div className="text-[11px] p-2 bg-[#0c0c0e] rounded-xl border border-slate-800 text-slate-400 flex items-center justify-between font-mono">
                    <span>30D Low:</span>
                    <span className="font-bold text-emerald-400">
                      ₹{p.analysis.thirtyDay.low.toLocaleString('en-IN')}
                    </span>
                  </div>
                </div>

                <div className="mt-3 pt-3 border-t border-slate-800/80 flex items-center gap-2">
                  <button
                    onClick={() => onViewProduct(p)}
                    className="flex-1 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-mono font-bold transition-colors cursor-pointer shadow-md shadow-indigo-600/20"
                  >
                    Inspect Deal
                  </button>

                  <a
                    href={p.affiliateUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 rounded-xl bg-[#141418] hover:bg-[#1e1e26] text-slate-300 hover:text-white border border-slate-800 transition-colors"
                    title="Buy now on store"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </a>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
