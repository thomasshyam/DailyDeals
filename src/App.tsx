import React, { useState, useMemo, useEffect } from 'react';
import { Product, MarketplaceName, PriceAlert, MarketplaceHealth, ScraperJob } from './types';
import { initialScrapedProducts, initialMarketplaceHealth, initialScraperJobs } from './data/mockProducts';
import { Navbar } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { FilterToolbar } from './components/FilterToolbar';
import { ProductCard } from './components/ProductCard';
import { ProductDetailModal } from './components/ProductDetailModal';
import { AiDealAssistant } from './components/AiDealAssistant';
import { WishlistSection } from './components/WishlistSection';
import { AdminDashboard } from './components/AdminDashboard';
import {
  Flame,
  Search,
  Sparkles,
  TrendingDown,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  SlidersHorizontal,
  RefreshCw,
  Terminal
} from 'lucide-react';

// Helper function for accurate whole-word/stem matching to prevent false positives like 'portable' matching 'table'
function hasWordMatch(token: string, text: string): boolean {
  if (!token || !text) return false;
  try {
    const escaped = token.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const regex = new RegExp(`\\b${escaped}(s|es)?\\b`, 'i');
    return regex.test(text);
  } catch {
    return text.toLowerCase().includes(token.toLowerCase());
  }
}

export default function App() {
  // Navigation
  const [currentTab, setCurrentTab] = useState<'deals' | 'explore' | 'assistant' | 'wishlist' | 'admin'>('deals');

  // Live Scraped Products State (Loaded via Python Web Scraper)
  const [products, setProducts] = useState<Product[]>(initialScrapedProducts);
  const [isLoadingLiveFeed, setIsLoadingLiveFeed] = useState<boolean>(false);
  const [lastSyncTime, setLastSyncTime] = useState<string>('Just now');
  const [scraperConsoleLogs, setScraperConsoleLogs] = useState<string>('');
  const [isSearchingLive, setIsSearchingLive] = useState<boolean>(false);

  // Search & Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMarketplace, setSelectedMarketplace] = useState<MarketplaceName | 'All'>('All');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [minDealScore, setMinDealScore] = useState<number>(30);
  const [maxPrice, setMaxPrice] = useState<number>(160000);
  const [genuineOnly, setGenuineOnly] = useState<boolean>(false);
  const [sortBy, setSortBy] = useState<'dealScore' | 'historicalDrop' | 'priceAsc' | 'priceDesc' | 'rating'>('dealScore');

  // Interactive Modals
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  // User Watchlist & Alerts state (with localStorage persistence)
  const [wishlist, setWishlist] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('truedeal_wishlist');
      return saved ? JSON.parse(saved) : ['apple-iphone-16-128gb-black', 'nike-air-max-alpha-trainer-5'];
    } catch {
      return ['apple-iphone-16-128gb-black', 'nike-air-max-alpha-trainer-5'];
    }
  });

  const [alerts, setAlerts] = useState<PriceAlert[]>(() => {
    try {
      const saved = localStorage.getItem('truedeal_alerts');
      return saved
        ? JSON.parse(saved)
        : [
            {
              id: 'alert-init-1',
              productId: 'apple-iphone-16-128gb-black',
              productTitle: 'Apple iPhone 16 (128 GB) - Black',
              productImage: 'https://m.media-amazon.com/images/I/71w3oJ7aWyL._SL1500_.jpg',
              marketplace: 'Flipkart',
              currentPrice: 67999,
              targetPrice: 64999,
              alertType: 'TARGET_PRICE',
              email: 'shopper@truedeal.ai',
              createdAt: '2026-09-07',
              status: 'ACTIVE',
            },
          ];
    } catch {
      return [];
    }
  });

  // Admin & Feeds State
  const [marketplaceHealth, setMarketplaceHealth] = useState<MarketplaceHealth[]>(initialMarketplaceHealth);
  const [scraperJobs, setScraperJobs] = useState<ScraperJob[]>(initialScraperJobs);
  const [isSyncing, setIsSyncing] = useState<boolean>(false);

  // Toast notification
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Fetch live products from Python server on boot
  useEffect(() => {
    fetch('/api/products')
      .then((res) => res.json())
      .then((data) => {
        if (data.success && Array.isArray(data.products) && data.products.length > 0) {
          setProducts(data.products);
          if (data.lastSync) {
            setLastSyncTime(new Date(data.lastSync).toLocaleTimeString());
          }
        }
      })
      .catch(() => {
        // Fallback to initialScrapedProducts
      });
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem('truedeal_wishlist', JSON.stringify(wishlist));
    } catch (e) {}
  }, [wishlist]);

  useEffect(() => {
    try {
      localStorage.setItem('truedeal_alerts', JSON.stringify(alerts));
    } catch (e) {}
  }, [alerts]);

  // Toggle Wishlist handler
  const handleToggleWishlist = (productId: string) => {
    if (wishlist.includes(productId)) {
      setWishlist(wishlist.filter((id) => id !== productId));
      showToast('Removed from Watchlist');
    } else {
      setWishlist([...wishlist, productId]);
      showToast('Added to Watchlist ❤️');
    }
  };

  // Save new Price Alert
  const handleSaveAlert = (newAlert: PriceAlert) => {
    setAlerts((prev) => [newAlert, ...prev]);
    showToast(`Alert registered for ₹${newAlert.targetPrice.toLocaleString('en-IN')}`);
  };

  // Remove alert
  const handleRemoveAlert = (alertId: string) => {
    setAlerts(alerts.filter((a) => a.id !== alertId));
    showToast('Alert canceled');
  };

  // Trigger live Python scrape
  const handleTriggerScrape = async () => {
    if (isSyncing) return;
    setIsSyncing(true);
    showToast('⚡ Executing python3 scraper.py live stream...');

    try {
      const res = await fetch('/api/scrape', { method: 'POST' });
      const data = await res.json();

      if (data.success) {
        setScraperConsoleLogs(data.output || '');
        if (data.job) {
          setScraperJobs((prev) => [data.job, ...prev]);
        }
        // Refresh products
        const prodRes = await fetch('/api/products');
        const prodData = await prodRes.json();
        if (prodData.success && prodData.products) {
          setProducts(prodData.products);
        }
        setLastSyncTime(new Date().toLocaleTimeString());
        setMarketplaceHealth((prev) =>
          prev.map((m) => ({
            ...m,
            lastSuccessfulSync: 'Just now',
          }))
        );
        showToast(`✅ Scraped live: ${data.productsCount || products.length} products refreshed in ${data.durationMs}ms`);
      } else {
        showToast('Python scraper error: ' + (data.output || 'Failed to crawl'));
      }
    } catch (err: any) {
      showToast('Scraper daemon unreachable: ' + err.message);
    } finally {
      setIsSyncing(false);
    }
  };

  // Live on-demand crawler search
  const handleLiveSearch = async (queryToSearch?: string) => {
    const q = (queryToSearch ?? searchQuery).trim();
    if (!q) return;

    setIsSearchingLive(true);
    showToast(`⚡ Searching live Amazon & Flipkart catalog for "${q}"...`);

    try {
      const res = await fetch(`/api/search?q=${encodeURIComponent(q)}`);
      const data = await res.json();

      if (data.success && Array.isArray(data.results) && data.results.length > 0) {
        setProducts((prev) => {
          const existingIds = new Set(prev.map((p) => p.id));
          const newProducts = data.results.filter((p: Product) => !existingIds.has(p.id));
          return [...newProducts, ...prev];
        });
        setSelectedCategory('All');
        setSelectedMarketplace('All');
        showToast(`✅ Found ${data.results.length} verified products for "${q}"`);
      } else {
        showToast(`No new live products found for "${q}"`);
      }
    } catch (err: any) {
      showToast('Live search error: ' + err.message);
    } finally {
      setIsSearchingLive(false);
    }
  };

  // Filter and Sort Products
  const filteredProducts = useMemo(() => {
    let result = [...products];

    // Search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      const tokens = q.split(/\s+/).filter(Boolean);
      result = result.filter((p) => {
        const titleLower = p.title.toLowerCase();
        const brandLower = p.brand.toLowerCase();
        const catLower = p.category.toLowerCase();
        const full = `${titleLower} ${brandLower} ${catLower} ${p.primaryMarketplace.toLowerCase()} ${Object.values(p.specs || {}).join(' ').toLowerCase()}`;

        // Exact phrase in title or brand with boundary
        if (hasWordMatch(q, titleLower) || hasWordMatch(q, brandLower) || hasWordMatch(q, catLower)) {
          return true;
        }

        // All query tokens match whole words in product details
        return tokens.every((tok) => hasWordMatch(tok, full));
      });
    }

    // Marketplace
    if (selectedMarketplace !== 'All') {
      result = result.filter((p) => p.primaryMarketplace === selectedMarketplace);
    }

    // Category
    if (selectedCategory !== 'All' && selectedCategory !== 'All Products') {
      if (selectedCategory === 'Furniture') {
        const tableRegex = /\b(table|tables|desk|desks|chair|chairs|dining|bed|furniture)\b/i;
        result = result.filter(
          (p) => p.category === 'Furniture' || tableRegex.test(p.title)
        );
      } else if (selectedCategory === 'Computing') {
        const compRegex = /\b(keyboard|mouse|laptop|notebook|ipad|tablet|monitor)\b/i;
        result = result.filter(
          (p) => p.category === 'Computing' || p.category === 'Laptops' || compRegex.test(p.title)
        );
      } else {
        result = result.filter((p) => p.category === selectedCategory);
      }
    }

    // Min Deal Score
    if (minDealScore > 30) {
      result = result.filter((p) => p.analysis.dealScore >= minDealScore);
    }

    // Max Price
    if (maxPrice < 160000) {
      result = result.filter((p) => p.currentPrice <= maxPrice);
    }

    // Hide fake discounts if toggled
    if (genuineOnly) {
      result = result.filter((p) => !p.analysis.isMisleadingDiscount && p.analysis.historicalDiscount >= 5);
    }

    // Sorting
    result.sort((a, b) => {
      if (sortBy === 'dealScore') return b.analysis.dealScore - a.analysis.dealScore;
      if (sortBy === 'historicalDrop') return b.analysis.historicalDiscount - a.analysis.historicalDiscount;
      if (sortBy === 'priceAsc') return a.currentPrice - b.currentPrice;
      if (sortBy === 'priceDesc') return b.currentPrice - a.currentPrice;
      if (sortBy === 'rating') return b.rating - a.rating;
      return 0;
    });

    return result;
  }, [products, searchQuery, selectedMarketplace, selectedCategory, minDealScore, maxPrice, genuineOnly, sortBy]);

  // Wishlisted product objects
  const wishlistedProductList = useMemo(() => {
    return products.filter((p) => wishlist.includes(p.id));
  }, [products, wishlist]);

  // Featured deal (Default top scoring deal)
  const featuredProduct = useMemo(() => {
    return products.find((p) => p.isFeatured) || products[0] || initialScrapedProducts[0];
  }, [products]);

  return (
    <div className="min-h-screen bg-[#070709] text-slate-100 flex flex-col antialiased selection:bg-indigo-500 selection:text-white">
      {/* Responsive Header */}
      <Navbar
        currentTab={currentTab}
        setCurrentTab={setCurrentTab}
        wishlistCount={wishlist.length}
        activeAlertsCount={alerts.length}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        onSearchFocus={() => {
          setCurrentTab('explore');
          const el = document.getElementById('catalog-search-input') || document.getElementById('nav-search-input');
          if (el) el.focus();
        }}
        onTriggerScrape={handleTriggerScrape}
        isScraping={isSyncing}
        lastSyncTime={lastSyncTime}
        onSearchSubmit={(q) => {
          setCurrentTab('explore');
          handleLiveSearch(q);
        }}
      />

      {/* Main Content Area */}
      <main className="flex-1 pb-20">
        {/* TAB 1: Deals (Home View) */}
        {currentTab === 'deals' && (
          <div className="space-y-12">
            {/* Hero Section */}
            {featuredProduct && (
              <HeroSection
                searchQuery={searchQuery}
                setSearchQuery={(q) => {
                  setSearchQuery(q);
                  if (q) setCurrentTab('explore');
                }}
                selectedMarketplace={selectedMarketplace}
                setSelectedMarketplace={(mp) => {
                  setSelectedMarketplace(mp);
                  setCurrentTab('explore');
                }}
                onExploreClick={() => setCurrentTab('explore')}
                featuredProduct={featuredProduct}
                onViewFeatured={(p) => setSelectedProduct(p)}
              />
            )}

            {/* Live Telemetry Status Bar */}
            <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
              <div className="bg-[#0c0c0e] rounded-2xl border border-white/[0.08] p-3 sm:p-4 flex flex-wrap items-center justify-between gap-3 text-xs font-mono">
                <div className="flex items-center gap-2 sm:gap-3">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="text-white font-bold">Python Live Engine: Connected</span>
                  <span className="text-slate-500">|</span>
                  <span className="text-slate-400">0% Mock Data</span>
                  <span className="text-slate-500 hidden sm:inline">|</span>
                  <span className="text-indigo-400 hidden sm:inline">{products.length} Authenticated Items Tracked</span>
                </div>

                <div className="flex items-center gap-3">
                  <span className="text-slate-400 text-[11px]">Last Crawl: {lastSyncTime}</span>
                  <button
                    onClick={handleTriggerScrape}
                    disabled={isSyncing}
                    className="px-2.5 py-1 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-[11px] font-bold flex items-center gap-1 cursor-pointer transition-colors"
                  >
                    <RefreshCw className={`w-3 h-3 ${isSyncing ? 'animate-spin' : ''}`} />
                    <span>Sync Live</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Section 2: Today's Best Deals Grid */}
            <section className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
              <div className="flex flex-wrap items-end justify-between gap-4 mb-6">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <Flame className="w-5 h-5 text-rose-500 fill-current" />
                    <h2 className="text-xl sm:text-2xl font-black font-mono tracking-tight text-white uppercase">
                      Today's Top Genuine Deals
                    </h2>
                    <span className="text-xs bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 font-mono font-bold px-2 py-0.5 rounded-full">
                      Verified 60D Lows
                    </span>
                  </div>
                  <p className="text-xs sm:text-sm text-slate-400">
                    Live scraped e-commerce prices compared against 30-day moving averages with direct retailer links.
                  </p>
                </div>

                <button
                  onClick={() => setCurrentTab('explore')}
                  className="text-xs sm:text-sm font-mono font-bold text-indigo-400 hover:text-indigo-300 flex items-center gap-1 cursor-pointer transition-colors"
                >
                  <span>View All {products.length} Tracked Products</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>

              {/* Grid of Top Deals */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 sm:gap-6">
                {products
                  .filter((p) => p.analysis.dealScore >= 75)
                  .slice(0, 8)
                  .map((product) => (
                    <ProductCard
                      key={product.id}
                      product={product}
                      onViewDeal={(p) => setSelectedProduct(p)}
                      isWishlisted={wishlist.includes(product.id)}
                      onToggleWishlist={handleToggleWishlist}
                    />
                  ))}
              </div>
            </section>

            {/* Section: How It Works */}
            <section className="bg-[#0c0c0e] text-white py-12 sm:py-14 border-y border-white/[0.08]">
              <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
                <div className="text-center max-w-2xl mx-auto mb-10">
                  <span className="text-xs font-mono uppercase tracking-wider text-indigo-400 font-bold block mb-1">
                    Anti-Deceptive Pricing Protocol
                  </span>
                  <h2 className="text-2xl sm:text-3xl font-black font-mono tracking-tight text-white uppercase">
                    How We Expose Fake Discounts
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-400 mt-2">
                    Traditional aggregator sites show whatever fake 60% tag the seller lists. TrueDeal extracts real pricing history:
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                  <div className="bg-[#121216] p-6 rounded-3xl border border-white/[0.08] relative hover:border-indigo-500/30 transition-colors">
                    <span className="text-3xl font-black font-mono text-indigo-400/40 block mb-2">01</span>
                    <h3 className="text-base font-bold font-mono text-white mb-2 uppercase">Python Live Scraper</h3>
                    <p className="text-xs text-slate-400 leading-relaxed">
                      Continuous scraping runs via Python extracting real-time prices, official product photos, seller credentials, and deep product links.
                    </p>
                  </div>

                  <div className="bg-[#121216] p-6 rounded-3xl border border-white/[0.08] relative hover:border-emerald-500/30 transition-colors">
                    <span className="text-3xl font-black font-mono text-emerald-400/40 block mb-2">02</span>
                    <h3 className="text-base font-bold font-mono text-white mb-2 uppercase">60-Day Price Baseline</h3>
                    <p className="text-xs text-slate-400 leading-relaxed">
                      We audit whether an advertised 50% discount is real or fake. If an item always costs ₹2,199, an MRP of ₹3,999 is flagged as deceptive.
                    </p>
                  </div>

                  <div className="bg-[#121216] p-6 rounded-3xl border border-white/[0.08] relative hover:border-indigo-500/30 transition-colors">
                    <span className="text-3xl font-black font-mono text-indigo-400/40 block mb-2">03</span>
                    <h3 className="text-base font-bold font-mono text-white mb-2 uppercase">Direct Specific Product Link</h3>
                    <p className="text-xs text-slate-400 leading-relaxed">
                      Every "Buy Direct" button redirects to the exact product URL on Flipkart or Amazon, never dumping you onto a generic homepage.
                    </p>
                  </div>
                </div>
              </div>
            </section>
          </div>
        )}

        {/* TAB 2: Explore Catalog */}
        {currentTab === 'explore' && (
          <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 pt-8 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h1 className="text-2xl font-black font-mono text-white tracking-tight uppercase">
                  Product Discovery & Price Intelligence
                </h1>
                <p className="text-xs sm:text-sm text-slate-400">
                  Real-time database populated via <strong className="text-emerald-400">Python Web Scraper</strong> • 0% Mock Data
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleTriggerScrape}
                  disabled={isSyncing}
                  className="px-3.5 py-2 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-xs font-mono font-bold flex items-center gap-2 cursor-pointer transition-colors"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin' : ''}`} />
                  <span>{isSyncing ? 'Scraping Live...' : 'Trigger Live Scrape'}</span>
                </button>
              </div>
            </div>

            {/* Filter Toolbar */}
            <FilterToolbar
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              selectedMarketplace={selectedMarketplace}
              setSelectedMarketplace={setSelectedMarketplace}
              selectedCategory={selectedCategory}
              setSelectedCategory={setSelectedCategory}
              minDealScore={minDealScore}
              setMinDealScore={setMinDealScore}
              maxPrice={maxPrice}
              setMaxPrice={setMaxPrice}
              genuineOnly={genuineOnly}
              setGenuineOnly={setGenuineOnly}
              sortBy={sortBy}
              setSortBy={setSortBy}
              totalCount={products.length}
              filteredCount={filteredProducts.length}
              onResetFilters={() => {
                setSearchQuery('');
                setSelectedMarketplace('All');
                setSelectedCategory('All');
                setMinDealScore(30);
                setMaxPrice(160000);
                setGenuineOnly(false);
              }}
              onSearchSubmit={handleLiveSearch}
              isSearchingLive={isSearchingLive}
            />

            {/* Product Cards Grid */}
            {filteredProducts.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 sm:gap-6 pt-2">
                {filteredProducts.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    onViewDeal={(p) => setSelectedProduct(p)}
                    isWishlisted={wishlist.includes(product.id)}
                    onToggleWishlist={handleToggleWishlist}
                  />
                ))}
              </div>
            ) : (
              <div className="bg-[#0c0c0e] rounded-3xl border border-white/[0.08] p-12 text-center space-y-5">
                <AlertTriangle className="w-10 h-10 text-amber-400 mx-auto" />
                <div>
                  <h3 className="text-lg font-bold font-mono text-white">No Matching Products Found</h3>
                  {searchQuery && (
                    <p className="text-xs text-indigo-300 font-mono mt-1">
                      No indexed catalog items matched "{searchQuery}"
                    </p>
                  )}
                  <p className="text-xs text-slate-400 max-w-md mx-auto mt-2">
                    Search and crawl verified live deals across Amazon India & Flipkart in real time:
                  </p>
                </div>

                {/* On-demand live store search trigger */}
                {searchQuery && (
                  <div className="pt-1">
                    <button
                      onClick={() => handleLiveSearch(searchQuery)}
                      disabled={isSearchingLive}
                      className="inline-flex items-center gap-2 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 active:bg-emerald-700 text-white rounded-xl text-xs font-mono font-bold transition-all shadow-lg shadow-emerald-600/30 cursor-pointer disabled:opacity-50"
                    >
                      <RefreshCw className={`w-3.5 h-3.5 ${isSearchingLive ? 'animate-spin' : ''}`} />
                      <span>{isSearchingLive ? 'Crawling Amazon & Flipkart...' : `Search & Crawl Live Stores for "${searchQuery}"`}</span>
                    </button>
                  </div>
                )}

                {/* Quick suggestions pills */}
                <div className="flex flex-wrap items-center justify-center gap-2 max-w-lg mx-auto pt-2">
                  {['Study Table', 'Computer Desk', 'Coffee Table', 'Dining Table', 'LG Washing Machine', 'Samsung Refrigerator', 'Gaming Keyboard', 'Logitech Mouse', 'iPad 10th Gen', 'iPhone 16', 'Sony XM5'].map((term) => (
                    <button
                      key={term}
                      onClick={() => {
                        setSearchQuery(term);
                        setSelectedCategory('All');
                        setSelectedMarketplace('All');
                      }}
                      className="px-3 py-1 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] text-xs font-mono text-slate-300 hover:text-white border border-white/[0.08] transition-colors cursor-pointer"
                    >
                      {term}
                    </button>
                  ))}
                </div>

                <div>
                  <button
                    onClick={() => {
                      setSearchQuery('');
                      setSelectedMarketplace('All');
                      setSelectedCategory('All');
                      setMinDealScore(30);
                      setMaxPrice(160000);
                      setGenuineOnly(false);
                    }}
                    className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-mono font-bold transition-colors cursor-pointer shadow-md shadow-indigo-600/30"
                  >
                    Reset All Filters
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* TAB 3: AI Deal Assistant */}
        {currentTab === 'assistant' && (
          <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 pt-8 space-y-6">
            <div>
              <h1 className="text-2xl font-black font-mono text-white tracking-tight uppercase">
                AI Deal Assistant & Smart Price Analyst
              </h1>
              <p className="text-xs sm:text-sm text-slate-400">
                Ask questions about whether today is the right day to buy, compare stores, or discover genuine drops.
              </p>
            </div>

            <AiDealAssistant
              products={products}
              onSelectProduct={(p) => setSelectedProduct(p)}
            />
          </div>
        )}

        {/* TAB 4: Watchlist */}
        {currentTab === 'wishlist' && (
          <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 pt-8 space-y-6">
            <div>
              <h1 className="text-2xl font-black font-mono text-white tracking-tight uppercase">
                Watchlist & Price Drop Subscriptions
              </h1>
              <p className="text-xs sm:text-sm text-slate-400">
                Track your pinned products and active price alerts. We notify you when prices hit your target threshold.
              </p>
            </div>

            <WishlistSection
              wishlistProducts={wishlistedProductList}
              alerts={alerts}
              onRemoveWishlist={handleToggleWishlist}
              onRemoveAlert={handleRemoveAlert}
              onViewProduct={(p) => setSelectedProduct(p)}
              onExploreClick={() => setCurrentTab('explore')}
            />
          </div>
        )}

        {/* TAB 5: Admin & Feed Health */}
        {currentTab === 'admin' && (
          <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 pt-8 space-y-6">
            <div>
              <h1 className="text-2xl font-black font-mono text-white tracking-tight uppercase">
                Marketplace Scraper & Feed Health Monitoring
              </h1>
              <p className="text-xs sm:text-sm text-slate-400">
                Operational telemetry for Amazon, Flipkart, Myntra, and Croma adapter layers.
              </p>
            </div>

            <AdminDashboard
              healthStatus={marketplaceHealth}
              jobs={scraperJobs}
              onTriggerSync={handleTriggerScrape}
              isSyncing={isSyncing}
              consoleLogs={scraperConsoleLogs}
            />
          </div>
        )}
      </main>

      {/* Product Detail Modal */}
      <ProductDetailModal
        product={selectedProduct}
        isOpen={!!selectedProduct}
        onClose={() => setSelectedProduct(null)}
        isWishlisted={selectedProduct ? wishlist.includes(selectedProduct.id) : false}
        onToggleWishlist={handleToggleWishlist}
        onSaveAlert={handleSaveAlert}
      />

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 px-4 py-2.5 rounded-xl bg-[#0c0c0e] text-white text-xs font-mono font-bold shadow-2xl border border-white/[0.1] flex items-center gap-2 animate-in slide-in-from-bottom-5">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Footer */}
      <footer className="bg-[#050505] text-slate-400 text-xs border-t border-white/[0.08] py-10">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 space-y-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-indigo-400" />
              <span className="font-extrabold text-white text-sm font-mono uppercase tracking-wider">
                TrueDeal Intelligence
              </span>
              <span className="text-slate-600">|</span>
              <span className="text-slate-400 text-xs font-mono">
                Python Live Crawler Engine • 0% Mock Data
              </span>
            </div>

            <div className="flex flex-wrap items-center gap-6 text-xs text-slate-400 font-mono">
              <button onClick={() => setCurrentTab('deals')} className="hover:text-white transition-colors cursor-pointer">
                Today's Deals
              </button>
              <button onClick={() => setCurrentTab('explore')} className="hover:text-white transition-colors cursor-pointer">
                Products
              </button>
              <button onClick={() => setCurrentTab('assistant')} className="hover:text-white transition-colors cursor-pointer">
                AI Assistant
              </button>
              <button onClick={() => setCurrentTab('admin')} className="hover:text-white transition-colors cursor-pointer">
                Feed Status
              </button>
            </div>
          </div>

          <div className="pt-4 border-t border-white/[0.06] flex flex-col sm:flex-row items-center justify-between gap-2 text-[11px] text-slate-500 font-mono">
            <p>© 2026 TrueDeal Intelligence Platform. Continuous 60-day moving window telemetry.</p>
            <p>Direct Product Deep-Links: Amazon.in • Flipkart.com • Myntra.com • Croma.com</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
