import React from 'react';
import { Search, ArrowRight, TrendingDown, Sparkles, CheckCircle2, ShieldCheck, Zap, Layers, Activity } from 'lucide-react';
import { MarketplaceName, Product } from '../types';

interface HeroSectionProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  selectedMarketplace: MarketplaceName | 'All';
  setSelectedMarketplace: (mp: MarketplaceName | 'All') => void;
  onExploreClick: () => void;
  featuredProduct: Product;
  onViewFeatured: (product: Product) => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  searchQuery,
  setSearchQuery,
  selectedMarketplace,
  setSelectedMarketplace,
  onExploreClick,
  featuredProduct,
  onViewFeatured,
}) => {
  const marketplaces: (MarketplaceName | 'All')[] = ['All', 'Amazon', 'Flipkart', 'Myntra'];

  return (
    <section className="relative overflow-hidden bg-[#050505] text-white pt-6 pb-10 px-4 sm:px-6 lg:px-8 border-b border-slate-800/60">
      {/* Subtle ambient lighting */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-10 w-96 h-96 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Main Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-5">
          {/* Bento Cell 1: Core Value Prop & Bento Search (lg:col-span-7) */}
          <div className="lg:col-span-7 bg-[#0c0c0e] rounded-3xl p-6 sm:p-8 border border-slate-800/60 shadow-2xl relative overflow-hidden flex flex-col justify-between">
            <div className="space-y-4">
              {/* Telemetry pill */}
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-mono font-bold uppercase tracking-wider">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                <span>Anti-Deceptive Pricing Protocol v2.4</span>
              </div>

              {/* Headline */}
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-white leading-[1.15]">
                Expose Fake Discounts.{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-300 to-emerald-400">
                  Know the Real Price.
                </span>
              </h1>

              <p className="text-xs sm:text-sm text-slate-400 max-w-xl leading-relaxed">
                60-day historical price audits across <strong className="text-slate-200">Amazon</strong>, <strong className="text-slate-200">Flipkart</strong>, and <strong className="text-slate-200">Myntra</strong>. We flag artificial MRP spikes and score true savings from 0 to 100.
              </p>
            </div>

            {/* Bento Search Module */}
            <div className="mt-6 pt-5 border-t border-slate-800/80 space-y-3">
              <div className="flex items-center gap-2 px-3.5 py-2.5 bg-[#131316] rounded-2xl border border-slate-800 focus-within:border-indigo-500/50 transition-colors">
                <Search className="w-4 h-4 text-indigo-400 flex-shrink-0" />
                <input
                  id="hero-search-input"
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search iPhone 16, Lenovo Ryzen 7, Sony WH-1000XM5, Nike..."
                  className="w-full bg-transparent text-xs text-white placeholder:text-slate-500 focus:outline-none"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="text-[11px] text-slate-400 hover:text-white px-2 py-0.5 rounded font-mono"
                  >
                    Clear
                  </button>
                )}
              </div>

              {/* Store Filter Pills & Explore Action */}
              <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
                <div className="flex items-center gap-1.5 flex-wrap">
                  <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest mr-1">Retailer:</span>
                  {marketplaces.map((mp) => (
                    <button
                      key={mp}
                      id={`hero-filter-${mp.toLowerCase()}`}
                      onClick={() => setSelectedMarketplace(mp)}
                      className={`px-3 py-1 rounded-xl text-xs font-semibold font-mono transition-all cursor-pointer ${
                        selectedMarketplace === mp
                          ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                          : 'bg-[#141418] text-slate-400 hover:text-slate-200 border border-slate-800/60'
                      }`}
                    >
                      {mp}
                    </button>
                  ))}
                </div>

                <button
                  onClick={onExploreClick}
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-indigo-400 hover:text-indigo-300 transition-colors cursor-pointer py-1 group"
                >
                  <span>Explore 24k+ Deals</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                </button>
              </div>
            </div>
          </div>

          {/* Bento Cell 2: Verified #1 Deal Spotlight (lg:col-span-5) */}
          <div
            onClick={() => onViewFeatured(featuredProduct)}
            className="lg:col-span-5 bg-[#0c0c0e] rounded-3xl p-6 border border-slate-800/60 shadow-2xl relative overflow-hidden flex flex-col justify-between hover:border-indigo-500/40 transition-all cursor-pointer group"
          >
            {/* Ambient inner glow */}
            <div className="absolute top-0 right-0 w-48 h-48 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none" />

            <div>
              <div className="flex items-center justify-between gap-2 mb-4">
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-mono text-[10px] font-bold tracking-widest uppercase">
                  <Sparkles className="w-3 h-3 text-emerald-400 fill-current" />
                  Today's Verified #1 Deal
                </span>

                <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest">
                  Score: <strong className="text-emerald-400 text-xs">{featuredProduct.analysis.dealScore}/100</strong>
                </span>
              </div>

              {/* Product preview */}
              <div className="flex items-start gap-4">
                <img
                  src={featuredProduct.image}
                  alt={featuredProduct.title}
                  className="w-24 h-24 sm:w-28 sm:h-28 object-cover rounded-2xl border border-slate-800 flex-shrink-0 group-hover:scale-105 transition-transform duration-300"
                />
                <div className="min-w-0 flex-1">
                  <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 font-bold">
                    {featuredProduct.primaryMarketplace}
                  </span>
                  <h3 className="text-sm sm:text-base font-bold text-white line-clamp-2 leading-snug mt-1.5 group-hover:text-indigo-400 transition-colors">
                    {featuredProduct.title}
                  </h3>

                  <div className="flex items-baseline gap-2 mt-2">
                    <span className="text-xl sm:text-2xl font-black font-mono text-emerald-400">
                      ₹{featuredProduct.currentPrice.toLocaleString('en-IN')}
                    </span>
                    <span className="text-xs line-through text-slate-500 font-mono">
                      ₹{featuredProduct.mrp.toLocaleString('en-IN')}
                    </span>
                  </div>
                </div>
              </div>

              {/* Telemetry Breakdown Box */}
              <div className="mt-4 p-3.5 rounded-2xl bg-[#121215] border border-slate-800/80 space-y-2 text-xs">
                <div className="flex items-center justify-between text-slate-400">
                  <span>Seller Advertised Claim:</span>
                  <span className="font-mono text-slate-300">{featuredProduct.analysis.advertisedDiscount}% OFF MRP</span>
                </div>

                <div className="flex items-center justify-between text-emerald-400 font-semibold">
                  <span className="flex items-center gap-1">
                    <TrendingDown className="w-3.5 h-3.5" />
                    Verified Genuine Drop:
                  </span>
                  <span className="font-mono font-bold">
                    ↓ {featuredProduct.analysis.historicalDiscount}% Below 30D Baseline
                  </span>
                </div>

                {/* Progress bar to 60D Low */}
                <div className="pt-2 border-t border-slate-800">
                  <div className="flex justify-between text-[10px] font-mono text-slate-500 mb-1">
                    <span>Proximity to 60-Day Low</span>
                    <span className="text-emerald-400 font-bold">98.4% Matched</span>
                  </div>
                  <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                    <div className="w-[98%] h-full bg-emerald-400 rounded-full" />
                  </div>
                </div>
              </div>
            </div>

            {/* Inspect CTA */}
            <div className="mt-4 flex items-center justify-between pt-2">
              <span className="inline-flex items-center gap-1.5 text-xs text-emerald-400 font-bold">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span>Verified Historical Low</span>
              </span>

              <span className="text-xs font-bold text-indigo-400 group-hover:translate-x-1 transition-transform flex items-center gap-1">
                <span>Inspect Price Audit</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </span>
            </div>
          </div>

          {/* Bento Cell 3: Anti-Deceptive Shield Telemetry (lg:col-span-4) */}
          <div className="lg:col-span-4 bg-[#0c0c0e] rounded-3xl p-5 border border-slate-800/60 shadow-xl flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between text-xs text-slate-500 font-mono mb-2">
                <span className="uppercase tracking-widest flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                  Shield Status
                </span>
                <span className="text-emerald-400 font-bold">ACTIVE</span>
              </div>
              <h4 className="text-base font-bold text-white mb-1">Anti-Deceptive Detection</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Flags artificial MRP inflation within 48 hours prior to promotional sales events.
              </p>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-800/60">
              <div className="flex items-baseline justify-between">
                <span className="text-2xl font-light text-white font-mono tracking-tight">89.4%</span>
                <span className="text-[10px] text-emerald-400 font-mono font-bold">Audit Accuracy</span>
              </div>
              {/* Segmented telemetry bar */}
              <div className="flex gap-1 h-1.5 w-full mt-2">
                <div className="flex-1 bg-emerald-400 rounded-full" />
                <div className="flex-1 bg-emerald-400 rounded-full" />
                <div className="flex-1 bg-emerald-400 rounded-full" />
                <div className="flex-1 bg-emerald-400 rounded-full" />
                <div className="flex-1 bg-slate-800 rounded-full" />
              </div>
            </div>
          </div>

          {/* Bento Cell 4: Multi-Store Arbitrage Telemetry (lg:col-span-4) */}
          <div className="lg:col-span-4 bg-[#0c0c0e] rounded-3xl p-5 border border-slate-800/60 shadow-xl flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between text-xs text-slate-500 font-mono mb-2">
                <span className="uppercase tracking-widest flex items-center gap-1.5">
                  <Activity className="w-3.5 h-3.5 text-indigo-400" />
                  Live Feeds
                </span>
                <span className="text-indigo-400 font-mono font-bold">3 PLATFORMS</span>
              </div>
              <h4 className="text-base font-bold text-white mb-1">Cross-Store Arbitrage</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Continuous SKU parity matching across Amazon India, Flipkart SuperCoins, and Myntra.
              </p>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-800/60">
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="text-slate-400">Max Delta Uncovered:</span>
                <span className="text-amber-400 font-bold">₹4,200 Difference</span>
              </div>
              <div className="flex items-center justify-between text-[11px] text-slate-500 font-mono mt-1">
                <span>Latency: 42ms</span>
                <span className="text-emerald-400 font-bold">● Synchronized</span>
              </div>
            </div>
          </div>

          {/* Bento Cell 5: Quick Exploration CTA Bento Tile (lg:col-span-4) */}
          <div
            onClick={onExploreClick}
            className="lg:col-span-4 bg-indigo-600 rounded-3xl p-5 text-white shadow-xl shadow-indigo-600/15 flex flex-col justify-between relative overflow-hidden cursor-pointer group"
          >
            {/* Ambient circular decor */}
            <div className="absolute -right-6 -bottom-6 w-32 h-32 bg-white/10 rounded-full blur-xl group-hover:scale-125 transition-transform" />

            <div>
              <div className="flex items-center justify-between text-xs font-mono text-indigo-200 mb-2">
                <span className="uppercase tracking-widest">Instant Discovery</span>
                <Zap className="w-4 h-4 fill-current" />
              </div>
              <h4 className="text-lg font-bold text-white">Explore Verified Catalog</h4>
              <p className="text-xs text-indigo-100/80 mt-1 leading-relaxed">
                Filter by genuine discount %, minimum deal score, budget limits, and specific marketplace.
              </p>
            </div>

            <div className="mt-4 pt-2 flex items-center justify-between">
              <span className="text-xs font-bold text-white font-mono">24,520 Live Records</span>
              <div className="w-8 h-8 rounded-xl bg-white/20 flex items-center justify-center text-white group-hover:translate-x-1 transition-transform">
                <ArrowRight className="w-4 h-4" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

