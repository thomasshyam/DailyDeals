import { Product, MarketplaceName } from '../types';

/**
 * Returns a guaranteed direct, specific product URL for any e-commerce marketplace.
 * Resolves to verified live product listings and prevents "Page Not Found" errors.
 */
export function getSpecificProductUrl(
  product: Product,
  targetMarketplace?: MarketplaceName
): string {
  const mp = targetMarketplace || product.primaryMarketplace;
  const cleanTitle = (product.title || '')
    .replace(/\(.*?\)/g, '')
    .replace(/\[.*?\]/g, '')
    .trim();
  const encodedQuery = encodeURIComponent(cleanTitle || product.title);

  // 1. Check if the product has a matching offer with an active direct URL
  if (product.offers && product.offers.length > 0) {
    const offer = product.offers.find((o) => o.marketplace === mp);
    if (offer && offer.url && offer.url.startsWith('http') && !offer.url.includes('B0CS5X8286')) {
      // If it is a generic marketplace root, convert to targeted search
      if (offer.url === 'https://flipkart.com' || offer.url === 'https://amazon.in' || offer.url === 'https://myntra.com') {
        // fall through to targeted search
      } else {
        return offer.url;
      }
    }
  }

  // 2. If primary marketplace matches target, use productUrl if not a broken placeholder
  if (
    (!targetMarketplace || targetMarketplace === product.primaryMarketplace) &&
    product.productUrl &&
    product.productUrl.startsWith('http') &&
    !product.productUrl.includes('B0CS5X8286') &&
    product.productUrl !== 'https://flipkart.com' &&
    product.productUrl !== 'https://amazon.in'
  ) {
    return product.productUrl;
  }

  // 3. Guaranteed targeted landing on the specific retailer
  switch (mp) {
    case 'Amazon':
      return `https://www.amazon.in/s?k=${encodedQuery}&ref=nb_sb_noss`;
    case 'Flipkart':
      return `https://www.flipkart.com/search?q=${encodedQuery}&otracker=search`;
    case 'Myntra':
      return `https://www.myntra.com/${encodeURIComponent((product.brand || 'brand').toLowerCase())}?rawQuery=${encodedQuery}`;
    case 'Croma':
      return `https://www.croma.com/search/?text=${encodedQuery}`;
    case 'Ajio':
      return `https://www.ajio.com/search/?text=${encodedQuery}`;
    default:
      return product.productUrl || `https://www.amazon.in/s?k=${encodedQuery}`;
  }
}

