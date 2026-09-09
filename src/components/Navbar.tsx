import React from 'react';
import {
  ShieldCheck,
  Search,
  Bell,
  Sparkles,
  Server,
  RefreshCw,
  Menu,
  X,
  Flame,
  CheckCircle2
} from 'lucide-react';

interface NavbarProps {
  currentTab: 'deals' | 'explore' | 'assistant' | 'wishlist' | 'admin';
  setCurrentTab: (tab: 'deals' | 'explore' | 'assistant' | 'wishlist' | 'admin') => void;
  wishlistCount: number;
  activeAlertsCount: number;
  searchQuery?: string;
  setSearchQuery?: (q: string) => void;
  onSearchFocus: () => void;
  onTriggerScrape?: () => void;
  isScraping?: boolean;
  lastSyncTime?: string;
  onSearchSubmit?: (q: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  setCurrentTab,
  wishlistCount,
  activeAlertsCount,
  searchQuery = '',
  setSearchQuery,
  onSearchFocus,
  onTriggerScrape,
  isScraping = false,
  lastSyncTime = 'Live',
  onSearchSubmit,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);
  const [mobileSearchActive, setMobileSearchActive] = React.useState(false);

  const handleTabClick = (tab: 'deals' | 'explore' | 'assistant' | 'wishlist' | 'admin') => {
    setCurrentTab(tab);
    setMobileMenuOpen(false);
    setMobileSearchActive(false);
  };

  const handleSearchChange = (val: string) => {
    if (setSearchQuery) {
      setSearchQuery(val);
      if (val && currentTab !== 'explore') {
        setCurrentTab('explore');
      }
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-[#070709]/90 backdrop-blur-2xl border-b border-white/[0.08] text-slate-200 transition-all">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-2 sm:gap-4">
          {/* Brand Logo */}
          <div
            id="brand-logo"
            onClick={() => handleTabClick('deals')}
            className="flex items-center gap-2.5 sm:gap-3 cursor-pointer select-none group flex-shrink-0"
          >
            <div className="w-9 h-9 sm:w-10 sm:h-10 bg-indigo-600 rounded-2xl flex items-center justify-center font-bold text-white shadow-lg shadow-indigo-600/30 group-hover:scale-105 transition-transform border border-indigo-400/30">
              <ShieldCheck className="w-5 h-5 text-emerald-300" />
            </div>
            <div>
              <div className="flex items-center gap-1.5 sm:gap-2">
                <span className="font-extrabold text-base sm:text-lg tracking-tight text-white font-mono">
                  TrueDeal
                </span>
                <span className="text-[9px] sm:text-[10px] font-mono uppercase px-1.5 sm:px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-bold tracking-wider hidden xs:inline-block">
                  LIVE CRAWLER
                </span>
              </div>
              <p className="text-[10px] sm:text-[11px] text-slate-400 font-mono hidden md:block">
                Python Scraper • Real Amazon & Flipkart
              </p>
            </div>
          </div>

          {/* Center Navigation Links for medium and larger screens */}
          <nav className="hidden md:flex items-center gap-1 lg:gap-1.5">
            <button
              id="nav-tab-deals"
              onClick={() => handleTabClick('deals')}
              className={`flex items-center gap-1.5 px-2.5 lg:px-3.5 py-1.5 rounded-xl text-xs font-mono font-semibold tracking-wide transition-all cursor-pointer ${
                currentTab === 'deals'
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                  : 'text-slate-400 hover:text-white hover:bg-white/[0.05]'
              }`}
            >
              <Flame className="w-3.5 h-3.5 text-rose-400" />
              <span>Deals</span>
            </button>

            <button
              id="nav-tab-explore"
              onClick={() => handleTabClick('explore')}
              className={`px-2.5 lg:px-3.5 py-1.5 rounded-xl text-xs font-mono font-semibold tracking-wide transition-all cursor-pointer ${
                currentTab === 'explore'
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                  : 'text-slate-400 hover:text-white hover:bg-white/[0.05]'
              }`}
            >
              <span>Catalog</span>
            </button>

            <button
              id="nav-tab-assistant"
              onClick={() => handleTabClick('assistant')}
              className={`flex items-center gap-1.5 px-2.5 lg:px-3.5 py-1.5 rounded-xl text-xs font-mono font-semibold tracking-wide transition-all cursor-pointer ${
                currentTab === 'assistant'
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                  : 'text-slate-400 hover:text-white hover:bg-white/[0.05]'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-indigo-300" />
              <span className="hidden lg:inline">AI Deal</span>
              <span>Assistant</span>
            </button>

            <button
              id="nav-tab-wishlist"
              onClick={() => handleTabClick('wishlist')}
              className={`relative flex items-center gap-1.5 px-2.5 lg:px-3.5 py-1.5 rounded-xl text-xs font-mono font-semibold tracking-wide transition-all cursor-pointer ${
                currentTab === 'wishlist'
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                  : 'text-slate-400 hover:text-white hover:bg-white/[0.05]'
              }`}
            >
              <Bell className="w-3.5 h-3.5 text-amber-400" />
              <span className="hidden lg:inline">Watchlist</span>
              {(wishlistCount > 0 || activeAlertsCount > 0) && (
                <span className="w-4 h-4 rounded-full bg-amber-500 text-slate-950 font-bold text-[10px] flex items-center justify-center font-mono">
                  {wishlistCount + activeAlertsCount}
                </span>
              )}
            </button>

            <button
              id="nav-tab-admin"
              onClick={() => handleTabClick('admin')}
              className={`flex items-center gap-1.5 px-2.5 lg:px-3 py-1.5 rounded-xl text-xs font-mono font-semibold tracking-wide transition-all cursor-pointer ${
                currentTab === 'admin'
                  ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/30'
                  : 'text-slate-400 hover:text-white hover:bg-white/[0.05]'
              }`}
            >
              <Server className="w-3.5 h-3.5 text-emerald-400" />
              <span className="hidden lg:inline">Feed</span>
              <span>Health</span>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            </button>
          </nav>

          {/* Right Action Controls: Search + Live Scraper Trigger + Currency */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Quick Search Input (Desktop / Tablet) */}
            <div className="hidden sm:flex items-center relative w-44 md:w-56 lg:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-indigo-400 pointer-events-none" />
              <input
                id="nav-search-input"
                type="text"
                value={searchQuery}
                onChange={(e) => handleSearchChange(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && onSearchSubmit && searchQuery.trim()) {
                    onSearchSubmit(searchQuery);
                  }
                }}
                placeholder="Search products..."
                className="w-full pl-9 pr-8 py-1.5 rounded-xl bg-white/[0.04] hover:bg-white/[0.07] focus:bg-[#121217] border border-white/[0.08] focus:border-indigo-500/50 text-xs font-mono text-white placeholder:text-slate-500 transition-all focus:outline-none"
              />
              {searchQuery ? (
                <button
                  id="nav-clear-search-btn"
                  onClick={() => handleSearchChange('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white p-0.5 cursor-pointer"
                  title="Clear search"
                >
                  <X className="w-3 h-3" />
                </button>
              ) : (
                <kbd className="hidden lg:inline-block absolute right-2.5 top-1/2 -translate-y-1/2 px-1.5 py-0.2 text-[10px] font-mono bg-black/40 border border-white/[0.1] rounded text-slate-400 pointer-events-none">
                  /
                </kbd>
              )}
            </div>

            {/* Mobile Search Toggle Button */}
            <button
              id="mobile-search-toggle"
              onClick={() => setMobileSearchActive(!mobileSearchActive)}
              className="sm:hidden p-2 rounded-xl bg-white/[0.04] text-slate-400 hover:text-white border border-white/[0.08] cursor-pointer"
              aria-label="Toggle search bar"
            >
              <Search className="w-4 h-4 text-indigo-400" />
            </button>

            {/* Live Python Scrape Button */}
            {onTriggerScrape && (
              <button
                id="header-scrape-trigger"
                onClick={onTriggerScrape}
                disabled={isScraping}
                className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-xs font-mono font-bold transition-all cursor-pointer disabled:opacity-50 shadow-sm"
                title="Trigger live Python web scraper"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isScraping ? 'animate-spin text-emerald-300' : ''}`} />
                <span className="hidden xl:inline">
                  {isScraping ? 'Scraping Live...' : 'Scrape Live'}
                </span>
              </button>
            )}

            {/* Currency badge (hidden on very small screens) */}
            <div className="hidden sm:flex items-center gap-1.5 text-xs font-mono text-slate-300 bg-white/[0.04] px-2.5 py-1.5 rounded-xl border border-white/[0.08]">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-emerald-400 font-bold">₹ INR</span>
            </div>

            {/* Mobile Hamburger toggle */}
            <div className="flex md:hidden items-center">
              <button
                id="mobile-menu-toggle"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 text-slate-300 hover:text-white bg-white/[0.05] rounded-xl border border-white/[0.1] cursor-pointer"
                aria-label="Toggle menu"
              >
                {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Search Expandable Bar */}
      {mobileSearchActive && (
        <div className="sm:hidden px-4 py-2.5 bg-[#0c0c0f] border-t border-white/[0.08] animate-in slide-in-from-top-1">
          <div className="relative flex items-center">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-indigo-400 pointer-events-none" />
            <input
              id="mobile-search-input-field"
              type="text"
              value={searchQuery}
              onChange={(e) => handleSearchChange(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && onSearchSubmit && searchQuery.trim()) {
                  onSearchSubmit(searchQuery);
                }
              }}
              placeholder="Search products by name, brand..."
              autoFocus
              className="w-full pl-9 pr-8 py-2 rounded-xl bg-[#141418] border border-slate-700 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-indigo-500"
            />
            {searchQuery && (
              <button
                onClick={() => handleSearchChange('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white p-1 cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>
      )}

      {/* Mobile Menu Dropdown / Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-white/[0.08] bg-[#0c0c0f] px-4 pt-3 pb-5 space-y-2.5 shadow-2xl animate-in slide-in-from-top-2">
          {/* Quick Stats Banner in Mobile Menu */}
          <div className="p-2.5 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-between text-xs font-mono">
            <div className="flex items-center gap-1.5 text-emerald-400">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Python Scraper: Active</span>
            </div>
            <span className="text-slate-400 text-[11px]">{lastSyncTime}</span>
          </div>

          <div className="grid grid-cols-2 gap-2 pt-1">
            <button
              onClick={() => handleTabClick('deals')}
              className={`p-2.5 rounded-xl text-xs font-mono font-bold flex items-center gap-2 ${
                currentTab === 'deals' ? 'bg-indigo-600 text-white' : 'bg-white/[0.04] text-slate-300'
              }`}
            >
              <Flame className="w-4 h-4 text-rose-400" />
              <span>Best Deals</span>
            </button>
            <button
              onClick={() => handleTabClick('explore')}
              className={`p-2.5 rounded-xl text-xs font-mono font-bold flex items-center gap-2 ${
                currentTab === 'explore' ? 'bg-indigo-600 text-white' : 'bg-white/[0.04] text-slate-300'
              }`}
            >
              <Search className="w-4 h-4 text-indigo-400" />
              <span>Catalog</span>
            </button>
            <button
              onClick={() => handleTabClick('assistant')}
              className={`p-2.5 rounded-xl text-xs font-mono font-bold flex items-center gap-2 ${
                currentTab === 'assistant' ? 'bg-indigo-600 text-white' : 'bg-white/[0.04] text-slate-300'
              }`}
            >
              <Sparkles className="w-4 h-4 text-indigo-300" />
              <span>AI Assistant</span>
            </button>
            <button
              onClick={() => handleTabClick('wishlist')}
              className={`p-2.5 rounded-xl text-xs font-mono font-bold flex items-center justify-between ${
                currentTab === 'wishlist' ? 'bg-indigo-600 text-white' : 'bg-white/[0.04] text-slate-300'
              }`}
            >
              <span className="flex items-center gap-1.5">
                <Bell className="w-4 h-4 text-amber-400" />
                <span>Watchlist</span>
              </span>
              <span className="text-[10px] bg-amber-500/20 text-amber-300 px-1.5 py-0.2 rounded font-mono">
                {wishlistCount + activeAlertsCount}
              </span>
            </button>
          </div>

          <button
            onClick={() => handleTabClick('admin')}
            className={`w-full flex items-center justify-between p-2.5 rounded-xl text-xs font-mono font-bold ${
              currentTab === 'admin' ? 'bg-emerald-600 text-white' : 'bg-white/[0.04] text-slate-300'
            }`}
          >
            <span className="flex items-center gap-2">
              <Server className="w-4 h-4 text-emerald-400" />
              <span>Scraper Telemetry & Feed Health</span>
            </span>
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          </button>

          {onTriggerScrape && (
            <button
              onClick={() => {
                onTriggerScrape();
                setMobileMenuOpen(false);
              }}
              disabled={isScraping}
              className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-xs font-mono font-bold"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isScraping ? 'animate-spin' : ''}`} />
              <span>{isScraping ? 'Scraping Live Feeds...' : 'Run Live Python Scrape Now'}</span>
            </button>
          )}
        </div>
      )}
    </header>
  );
};
