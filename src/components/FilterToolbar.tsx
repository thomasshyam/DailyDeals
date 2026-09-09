import React from 'react';
import { MarketplaceName } from '../types';
import { Filter, SlidersHorizontal, ArrowUpDown, Check, ShieldCheck, X, Search, LayoutGrid, List } from 'lucide-react';

interface FilterToolbarProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  selectedCategory: string;
  setSelectedCategory: (cat: string) => void;
  selectedMarketplace: MarketplaceName | 'All';
  setSelectedMarketplace: (mp: MarketplaceName | 'All') => void;
  minDealScore: number;
  setMinDealScore: (score: number) => void;
  maxPrice: number;
  setMaxPrice: (price: number) => void;
  genuineOnly: boolean;
  setGenuineOnly: (val: boolean) => void;
  sortBy: 'dealScore' | 'historicalDrop' | 'priceAsc' | 'priceDesc' | 'rating';
  setSortBy: (sort: 'dealScore' | 'historicalDrop' | 'priceAsc' | 'priceDesc' | 'rating') => void;
  totalCount: number;
  filteredCount?: number;
  onResetFilters: () => void;
  onSearchSubmit?: (query: string) => void;
  isSearchingLive?: boolean;
  viewMode?: 'grid' | 'list';
  setViewMode?: (mode: 'grid' | 'list') => void;
}

export const FilterToolbar: React.FC<FilterToolbarProps> = ({
  searchQuery,
  setSearchQuery,
  selectedCategory,
  setSelectedCategory,
  selectedMarketplace,
  setSelectedMarketplace,
  minDealScore,
  setMinDealScore,
  maxPrice,
  setMaxPrice,
  genuineOnly,
  setGenuineOnly,
  sortBy,
  setSortBy,
  totalCount,
  filteredCount,
  onResetFilters,
  onSearchSubmit,
  isSearchingLive = false,
  viewMode = 'grid',
  setViewMode,
}) => {
  const categories = [
    { label: 'All Products', value: 'All' },
    { label: '🪥 Personal Care & Grooming', value: 'Personal Care' },
    { label: '🪑 Furniture & Tables', value: 'Furniture' },
    { label: '🍳 Home Appliances', value: 'Appliances' },
    { label: '⌨️ Computing & Tech', value: 'Computing' },
    { label: '💻 Laptops', value: 'Laptops' },
    { label: '📱 Mobiles', value: 'Mobiles' },
    { label: '🎧 Audio', value: 'Audio' },
    { label: '👟 Footwear', value: 'Footwear' },
    { label: '👕 Fashion', value: 'Fashion' },
    { label: '⌚ Smartwatches', value: 'Smartwatches' },
  ];

  const marketplaces: (MarketplaceName | 'All')[] = ['All', 'Amazon', 'Flipkart', 'Myntra'];

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && onSearchSubmit && searchQuery.trim()) {
      onSearchSubmit(searchQuery);
    }
  };

  return (
    <div className="bg-[#0c0c0e] rounded-3xl border border-slate-800/60 p-5 shadow-xl space-y-4 text-slate-200">
      {/* Search Bar Row */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
        <div className="relative flex-1 flex items-center">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-indigo-400 pointer-events-none" />
          <input
            id="catalog-search-input"
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Search all products: study tables, desks, laptops, smartphones, shoes, appliances..."
            className="w-full pl-10 pr-24 py-2.5 rounded-2xl bg-[#141418] border border-slate-800 focus:border-indigo-500 focus:outline-none text-xs sm:text-sm text-white placeholder:text-slate-500 transition-colors"
          />
          <div className="absolute right-2.5 top-1/2 -translate-y-1/2 flex items-center gap-1.5">
            {searchQuery && (
              <button
                id="clear-catalog-search-btn"
                onClick={() => setSearchQuery('')}
                className="p-1 rounded-full text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                title="Clear search"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
            {onSearchSubmit && searchQuery.trim() && (
              <button
                id="catalog-live-search-submit-btn"
                onClick={() => onSearchSubmit(searchQuery)}
                disabled={isSearchingLive}
                className="px-2.5 py-1 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-[11px] font-mono font-bold transition-all flex items-center gap-1 cursor-pointer disabled:opacity-50"
              >
                {isSearchingLive ? '...' : 'Search'}
              </button>
            )}
          </div>
        </div>

        {/* Count & Reset */}
        <div className="flex items-center justify-between sm:justify-end gap-3 flex-shrink-0">
          <span className="text-xs font-mono text-slate-400">
            {typeof filteredCount === 'number' ? (
              <>
                <strong className="text-emerald-400 font-bold">{filteredCount}</strong> of {totalCount} deals
              </>
            ) : (
              <>
                Showing <strong className="text-white font-bold">{totalCount}</strong> verified deals
              </>
            )}
          </span>
          {(searchQuery || selectedCategory !== 'All' || selectedMarketplace !== 'All' || minDealScore > 30 || maxPrice < 160000 || genuineOnly) && (
            <button
              onClick={onResetFilters}
              className="px-2.5 py-1 rounded-lg bg-indigo-500/10 hover:bg-indigo-500/20 text-xs text-indigo-400 hover:text-indigo-300 font-bold font-mono transition-colors cursor-pointer border border-indigo-500/20"
            >
              Reset Filters
            </button>
          )}
        </div>
      </div>

      {/* Categories Row with Quick Sort Pills */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-3 border-t border-slate-800/80 pt-3">
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 max-w-full scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat.value}
              onClick={() => setSelectedCategory(cat.value)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                selectedCategory === cat.value
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20'
                  : 'bg-[#141418] text-slate-400 hover:text-slate-200 border border-slate-800/60'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Quick Sort Options */}
        <div className="flex items-center gap-1.5 flex-shrink-0">
          <span className="text-[10px] uppercase font-mono font-bold text-slate-500 hidden xl:inline">Sort:</span>
          <button
            onClick={() => setSortBy('priceAsc')}
            className={`px-2.5 py-1 rounded-lg text-xs font-semibold font-mono transition-all cursor-pointer border ${
              sortBy === 'priceAsc'
                ? 'bg-indigo-600/20 text-indigo-300 border-indigo-500/40 font-bold'
                : 'bg-[#141418] text-slate-400 border-slate-800 hover:text-slate-200'
            }`}
            title="Sort by lowest price first"
          >
            Price: Low to High (₹ ↑)
          </button>
          <button
            onClick={() => setSortBy('priceDesc')}
            className={`px-2.5 py-1 rounded-lg text-xs font-semibold font-mono transition-all cursor-pointer border ${
              sortBy === 'priceDesc'
                ? 'bg-indigo-600/20 text-indigo-300 border-indigo-500/40 font-bold'
                : 'bg-[#141418] text-slate-400 border-slate-800 hover:text-slate-200'
            }`}
            title="Sort by highest price first"
          >
            Price: High to Low (₹ ↓)
          </button>
        </div>
      </div>

      {/* Second Row: Detailed Controls */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 items-center">
        {/* Store selector */}
        <div>
          <label className="block text-[10px] uppercase font-mono font-bold text-slate-400 tracking-wider mb-1">
            Marketplace Store
          </label>
          <div className="flex rounded-xl bg-[#141418] p-1 border border-slate-800 text-xs">
            {marketplaces.map((mp) => (
              <button
                key={mp}
                onClick={() => setSelectedMarketplace(mp)}
                className={`flex-1 py-1.5 rounded-lg font-semibold font-mono transition-all cursor-pointer text-center text-xs ${
                  selectedMarketplace === mp
                    ? 'bg-indigo-600 text-white font-bold shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {mp}
              </button>
            ))}
          </div>
        </div>

        {/* Minimum Deal Score Slider */}
        <div>
          <div className="flex items-center justify-between text-[10px] font-mono font-bold text-slate-400 mb-1">
            <span className="uppercase tracking-wider">Min Deal Score</span>
            <span className="font-mono text-emerald-400 font-bold">{minDealScore}+</span>
          </div>
          <input
            type="range"
            min={30}
            max={90}
            step={5}
            value={minDealScore}
            onChange={(e) => setMinDealScore(Number(e.target.value))}
            className="w-full accent-emerald-500 cursor-pointer h-1.5 bg-slate-800 rounded-lg appearance-none"
          />
          <div className="flex justify-between text-[10px] font-mono text-slate-500 mt-1">
            <span>Any (30)</span>
            <span>Good (70)</span>
            <span>Elite (90+)</span>
          </div>
        </div>

        {/* Price Cap Filter */}
        <div>
          <div className="flex items-center justify-between text-[10px] font-mono font-bold text-slate-400 mb-1">
            <span className="uppercase tracking-wider">Budget Cap</span>
            <span className="font-mono text-white font-bold">
              {maxPrice >= 160000 ? 'No Limit' : `₹${maxPrice.toLocaleString('en-IN')}`}
            </span>
          </div>
          <input
            type="range"
            min={500}
            max={160000}
            step={1000}
            value={maxPrice}
            onChange={(e) => setMaxPrice(Number(e.target.value))}
            className="w-full accent-indigo-500 cursor-pointer h-1.5 bg-slate-800 rounded-lg appearance-none"
          />
          <div className="flex justify-between text-[10px] font-mono text-slate-500 mt-1">
            <span>₹500</span>
            <span>₹80k</span>
            <span>₹1.6L+</span>
          </div>
        </div>

        {/* Sort & Anti-Fake Toggle */}
        <div className="space-y-2">
          {/* Genuine Only Checkbox */}
          <label className="flex items-center gap-2 p-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-xs font-bold text-emerald-300 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={genuineOnly}
              onChange={(e) => setGenuineOnly(e.target.checked)}
              className="w-4 h-4 rounded text-emerald-500 accent-emerald-500 cursor-pointer"
            />
            <ShieldCheck className="w-4 h-4 text-emerald-400 flex-shrink-0" />
            <span>Hide Inflated MRP Sales</span>
          </label>

          {/* Sort Selector */}
          <div className="flex items-center gap-2">
            <ArrowUpDown className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="w-full text-xs font-semibold text-slate-200 bg-[#141418] border border-slate-800 rounded-xl py-1.5 px-2.5 focus:outline-none focus:border-indigo-500"
            >
              <option value="dealScore">Deal Score: Highest First</option>
              <option value="historicalDrop">Biggest 30D Drop %</option>
              <option value="priceAsc">Price: Low to High</option>
              <option value="priceDesc">Price: High to Low</option>
              <option value="rating">Customer Rating</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );
};
