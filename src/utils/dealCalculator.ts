import { DealAnalysis, DealQuality, BuyRecommendation, PriceRecord } from '../types';

export function calculateDealAnalysis(
  currentPrice: number,
  mrp: number,
  priceHistory: PriceRecord[],
  rating: number = 4.5,
  sellerRating: number = 4.7
): DealAnalysis {
  const historyLen = priceHistory.length;
  const prices = priceHistory.map((p) => p.price);

  // 10-day slice
  const tenDaySlice = prices.slice(Math.max(0, historyLen - 10));
  const tenDayAvg = Math.round(tenDaySlice.reduce((a, b) => a + b, 0) / (tenDaySlice.length || 1));
  const tenDayLow = Math.min(...tenDaySlice, currentPrice);
  const tenDayHigh = Math.max(...tenDaySlice, currentPrice);
  const tenDayChangePct = tenDayAvg > 0 ? Number((((currentPrice - tenDayAvg) / tenDayAvg) * 100).toFixed(1)) : 0;

  // 30-day slice
  const thirtyDaySlice = prices.slice(Math.max(0, historyLen - 30));
  const thirtyDayAvg = Math.round(thirtyDaySlice.reduce((a, b) => a + b, 0) / (thirtyDaySlice.length || 1));
  const thirtyDayLow = Math.min(...thirtyDaySlice, currentPrice);
  const thirtyDayHigh = Math.max(...thirtyDaySlice, currentPrice);
  const thirtyDayChangePct = thirtyDayAvg > 0 ? Number((((currentPrice - thirtyDayAvg) / thirtyDayAvg) * 100).toFixed(1)) : 0;

  // 60-day slice
  const sixtyDaySlice = prices.slice(Math.max(0, historyLen - 60));
  const sixtyDayAvg = Math.round(sixtyDaySlice.reduce((a, b) => a + b, 0) / (sixtyDaySlice.length || 1));
  const sixtyDayLow = Math.min(...sixtyDaySlice, currentPrice);
  const sixtyDayHigh = Math.max(...sixtyDaySlice, currentPrice);
  const sixtyDayChangePct = sixtyDayAvg > 0 ? Number((((currentPrice - sixtyDayAvg) / sixtyDayAvg) * 100).toFixed(1)) : 0;

  const lowestEver = sixtyDayLow;
  const highestEver = Math.max(sixtyDayHigh, mrp);

  // Advertised discount vs MRP
  const advertisedDiscount = mrp > 0 ? Math.round(((mrp - currentPrice) / mrp) * 100) : 0;

  // Genuine Historical discount vs 30-Day Average
  const rawHistDiscount = thirtyDayAvg > 0 ? ((thirtyDayAvg - currentPrice) / thirtyDayAvg) * 100 : 0;
  const historicalDiscount = Math.round(rawHistDiscount);

  // Misleading discount check
  // E.g. MRP was artificially set high to claim 40%+ OFF, but actual price is only 5% lower than normal average
  const isMisleadingDiscount = advertisedDiscount >= 35 && historicalDiscount < 12;
  let misleadingReason = undefined;
  if (isMisleadingDiscount) {
    misleadingReason = `Seller advertises ${advertisedDiscount}% off MRP (₹${mrp.toLocaleString('en-IN')}), but the price is only ${Math.max(0, historicalDiscount)}% below its 30-day market average (₹${thirtyDayAvg.toLocaleString('en-IN')}).`;
  }

  // Flash deal: dropped > 15% in last 3 days
  const threeDaysAgoPrice = prices.length >= 3 ? prices[prices.length - 3] : thirtyDayAvg;
  const isFlashDeal = threeDaysAgoPrice > 0 && (threeDaysAgoPrice - currentPrice) / threeDaysAgoPrice >= 0.15;

  // Price glitch / abnormal error: > 75% drop below 60d avg
  const isUnusualPrice = sixtyDayAvg > 0 && (sixtyDayAvg - currentPrice) / sixtyDayAvg > 0.75;

  // Deal Score Calculation (0 - 100)
  // 1. Historical Discount (25 pts): 20% discount = max pts
  const histDiscPts = Math.min(25, Math.max(0, (rawHistDiscount / 20) * 25));

  // 2. 30-Day Position (25 pts): closest to 30-day low gets 25 pts
  const range30 = thirtyDayHigh - thirtyDayLow || 1;
  const pos30 = (thirtyDayHigh - currentPrice) / range30; // 1 = at lowest, 0 = at highest
  const pos30Pts = Math.min(25, Math.max(0, pos30 * 25));

  // 3. 60-Day Position (20 pts)
  const range60 = sixtyDayHigh - sixtyDayLow || 1;
  const pos60 = (sixtyDayHigh - currentPrice) / range60;
  const pos60Pts = Math.min(20, Math.max(0, pos60 * 20));

  // 4. Recent Drop velocity (15 pts)
  const dropPct = tenDayAvg > 0 ? (tenDayAvg - currentPrice) / tenDayAvg : 0;
  const dropPts = Math.min(15, Math.max(0, dropPct > 0 ? (dropPct / 0.15) * 15 : 5));

  // 5. Product Rating (10 pts)
  const ratingPts = Math.min(10, Math.max(0, (rating / 5) * 10));

  // 6. Seller Reliability (5 pts)
  const sellerPts = Math.min(5, Math.max(0, (sellerRating / 5) * 5));

  let dealScore = Math.round(histDiscPts + pos30Pts + pos60Pts + dropPts + ratingPts + sellerPts);
  dealScore = Math.min(100, Math.max(15, dealScore));

  // Deal Quality
  let dealQuality: DealQuality = 'AVERAGE';
  if (dealScore >= 85) dealQuality = 'EXCELLENT';
  else if (dealScore >= 70) dealQuality = 'GOOD';
  else if (dealScore >= 50) dealQuality = 'AVERAGE';
  else dealQuality = 'POOR';

  // Buy Recommendation
  let recommendation: BuyRecommendation = 'WAIT';
  let recommendationReason = '';

  if (dealScore >= 80 && currentPrice <= thirtyDayLow * 1.04) {
    recommendation = 'BUY_NOW';
    recommendationReason = `Current price (₹${currentPrice.toLocaleString('en-IN')}) is near the 60-day historical low (₹${lowestEver.toLocaleString('en-IN')}) and ${Math.abs(historicalDiscount)}% below the 30-day average.`;
  } else if (dealScore >= 68 && rawHistDiscount > 5) {
    recommendation = 'BUY_NOW';
    recommendationReason = `Solid price dip of ${Math.abs(historicalDiscount)}% below 30-day average with positive deal score. Good time to buy.`;
  } else if (currentPrice > thirtyDayAvg * 1.05) {
    recommendation = 'DONT_BUY';
    recommendationReason = `Price is currently ${Math.abs(thirtyDayChangePct)}% higher than its 30-day typical average (₹${thirtyDayAvg.toLocaleString('en-IN')}). High chance of a price correction.`;
  } else {
    recommendation = 'WAIT';
    recommendationReason = `Current price is close to the 30-day baseline average (₹${thirtyDayAvg.toLocaleString('en-IN')}). Consider waiting for seasonal sales or setting a price alert.`;
  }

  // Price trend
  let priceTrend: 'FALLING' | 'RISING' | 'STABLE' = 'STABLE';
  if (tenDayChangePct <= -2) priceTrend = 'FALLING';
  else if (tenDayChangePct >= 2) priceTrend = 'RISING';

  return {
    dealScore,
    dealQuality,
    recommendation,
    recommendationReason,
    advertisedDiscount,
    historicalDiscount,
    isMisleadingDiscount,
    misleadingReason,
    isFlashDeal,
    isUnusualPrice,
    tenDay: {
      avg: tenDayAvg,
      low: tenDayLow,
      high: tenDayHigh,
      changePct: tenDayChangePct,
    },
    thirtyDay: {
      avg: thirtyDayAvg,
      low: thirtyDayLow,
      high: thirtyDayHigh,
      changePct: thirtyDayChangePct,
    },
    sixtyDay: {
      avg: sixtyDayAvg,
      low: sixtyDayLow,
      high: sixtyDayHigh,
      changePct: sixtyDayChangePct,
    },
    currentPrice,
    mrp,
    lowestEver,
    highestEver,
    priceTrend,
  };
}
