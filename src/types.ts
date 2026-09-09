export type MarketplaceName = 'Amazon' | 'Flipkart' | 'Myntra' | 'Ajio' | 'Croma';

export type DealQuality = 'EXCELLENT' | 'GOOD' | 'AVERAGE' | 'POOR';

export type BuyRecommendation = 'BUY_NOW' | 'WAIT' | 'DONT_BUY';

export interface PriceRecord {
  timestamp: string; // ISO date string (YYYY-MM-DD)
  price: number;
  seller?: string;
  availability?: 'IN_STOCK' | 'LOW_STOCK' | 'OUT_OF_STOCK';
}

export interface MarketplaceOffer {
  marketplace: MarketplaceName;
  price: number;
  mrp: number;
  url: string;
  seller: string;
  sellerRating: number;
  availability: 'IN_STOCK' | 'LOW_STOCK' | 'OUT_OF_STOCK';
  thirtyDayAvg: number;
  sixtyDayAvg: number;
  lowestPrice: number;
  highestPrice: number;
  dealScore: number;
  lastUpdated: string;
  inStock: boolean;
}

export interface DealAnalysis {
  dealScore: number; // 0 - 100
  dealQuality: DealQuality;
  recommendation: BuyRecommendation;
  recommendationReason: string;
  advertisedDiscount: number; // % off MRP
  historicalDiscount: number; // % off 30-day average
  isMisleadingDiscount: boolean;
  misleadingReason?: string;
  isFlashDeal: boolean;
  isUnusualPrice: boolean; // potential pricing glitch
  tenDay: {
    avg: number;
    low: number;
    high: number;
    changePct: number;
  };
  thirtyDay: {
    avg: number;
    low: number;
    high: number;
    changePct: number;
  };
  sixtyDay: {
    avg: number;
    low: number;
    high: number;
    changePct: number;
  };
  currentPrice: number;
  mrp: number;
  lowestEver: number;
  highestEver: number;
  priceTrend: 'FALLING' | 'RISING' | 'STABLE';
}

export interface Product {
  id: string;
  title: string;
  brand: string;
  category: 'Mobiles' | 'Laptops' | 'Audio' | 'Fashion' | 'Footwear' | 'Appliances' | 'Smartwatches' | 'Furniture' | 'Home & Kitchen' | string;
  image: string;
  rating: number;
  reviewCount: number;
  mrp: number;
  currentPrice: number;
  primaryMarketplace: MarketplaceName;
  primarySeller: string;
  productUrl: string;
  affiliateUrl: string;
  lastUpdated: string;
  priceHistory: PriceRecord[]; // 60 days of daily data
  offers: MarketplaceOffer[]; // Cross-marketplace offers
  analysis: DealAnalysis;
  specs: Record<string, string>;
  isFeatured?: boolean;
}

export interface PriceAlert {
  id: string;
  productId: string;
  productTitle: string;
  productImage: string;
  marketplace: MarketplaceName;
  currentPrice: number;
  targetPrice: number;
  alertType: 'ANY_DROP' | 'TARGET_PRICE' | 'PERCENT_DROP';
  percentDropTarget?: number;
  email: string;
  createdAt: string;
  status: 'ACTIVE' | 'TRIGGERED';
}

export interface ScraperJob {
  id: string;
  marketplace: MarketplaceName | string;
  startedAt: string;
  completedAt: string;
  productsScanned: number;
  productsUpdated: number;
  errors: number;
  durationMs: number;
  status: 'SUCCESS' | 'WARNING' | 'FAILED';
  logs?: string[];
}

export interface MarketplaceHealth {
  name: MarketplaceName;
  status: 'HEALTHY' | 'DELAYED' | 'DOWN';
  protocol: string;
  latencyMs: number;
  lastSuccessfulSync: string;
  successRate: number;
  activeTrackedCount: number;
}
