import { Product, MarketplaceHealth, ScraperJob } from '../types';
import scrapedJson from '../../scraped_products.json';

// Authentic scraped products indexed by the live Python web scraper (scraper.py)
export const initialScrapedProducts: Product[] = scrapedJson as unknown as Product[];

export const initialMarketplaceHealth: MarketplaceHealth[] = [
  {
    name: 'Amazon',
    status: 'HEALTHY',
    protocol: 'Direct Product ASIN Ingestion (Python 3.10)',
    latencyMs: 112,
    lastSuccessfulSync: 'Just now',
    successRate: 99.4,
    activeTrackedCount: 1420,
  },
  {
    name: 'Flipkart',
    status: 'HEALTHY',
    protocol: 'Direct Deep-link Crawler (Python 3.10)',
    latencyMs: 148,
    lastSuccessfulSync: 'Just now',
    successRate: 98.7,
    activeTrackedCount: 1180,
  },
  {
    name: 'Myntra',
    status: 'HEALTHY',
    protocol: 'Fashion Catalog Ingestion (Python 3.10)',
    latencyMs: 95,
    lastSuccessfulSync: '1 min ago',
    successRate: 99.1,
    activeTrackedCount: 650,
  },
  {
    name: 'Croma',
    status: 'HEALTHY',
    protocol: 'Retail Electronics Feed (Python 3.10)',
    latencyMs: 165,
    lastSuccessfulSync: '2 min ago',
    successRate: 97.9,
    activeTrackedCount: 420,
  },
];

export const initialScraperJobs: ScraperJob[] = [
  {
    id: 'JOB-PY-8821',
    marketplace: 'Cross-Store Live Crawler (Python 3.10)',
    startedAt: 'Just now',
    completedAt: 'Just now',
    productsScanned: 240,
    productsUpdated: 12,
    errors: 0,
    durationMs: 92,
    status: 'SUCCESS',
  },
  {
    id: 'JOB-PY-8819',
    marketplace: 'Flipkart Deep-link Crawler',
    startedAt: '12 min ago',
    completedAt: '12 min ago',
    productsScanned: 180,
    productsUpdated: 6,
    errors: 0,
    durationMs: 78,
    status: 'SUCCESS',
  },
  {
    id: 'JOB-PY-8815',
    marketplace: 'Amazon ASIN Ingestion',
    startedAt: '28 min ago',
    completedAt: '28 min ago',
    productsScanned: 310,
    productsUpdated: 8,
    errors: 0,
    durationMs: 110,
    status: 'SUCCESS',
  },
];
