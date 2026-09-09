import React, { useState, useMemo, useRef } from 'react';
import { PriceRecord } from '../types';
import { TrendingDown, TrendingUp, Minus } from 'lucide-react';

interface PriceChartProps {
  priceHistory: PriceRecord[];
  currentPrice: number;
  currencySymbol?: string;
}

export const PriceChart: React.FC<PriceChartProps> = ({
  priceHistory,
  currentPrice,
  currencySymbol = '₹',
}) => {
  const [timeRange, setTimeRange] = useState<'10D' | '30D' | '60D'>('30D');
  const [hoverIndex, setHoverIndex] = useState<number | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Slice history based on range
  const activeRecords = useMemo(() => {
    const days = timeRange === '10D' ? 10 : timeRange === '30D' ? 30 : 60;
    return priceHistory.slice(Math.max(0, priceHistory.length - days));
  }, [priceHistory, timeRange]);

  // Statistics for active period
  const stats = useMemo(() => {
    if (!activeRecords.length) {
      return { low: currentPrice, high: currentPrice, avg: currentPrice, changePct: 0 };
    }
    const prices = activeRecords.map((r) => r.price);
    const low = Math.min(...prices);
    const high = Math.max(...prices);
    const avg = Math.round(prices.reduce((a, b) => a + b, 0) / prices.length);
    const firstPrice = activeRecords[0].price;
    const lastPrice = activeRecords[activeRecords.length - 1].price;
    const changePct = firstPrice > 0 ? Number((((lastPrice - firstPrice) / firstPrice) * 100).toFixed(1)) : 0;
    return { low, high, avg, changePct };
  }, [activeRecords, currentPrice]);

  // SVG dimensions
  const width = 600;
  const height = 220;
  const padding = { top: 20, right: 30, bottom: 30, left: 55 };

  const chartWidth = width - padding.left - padding.right;
  const chartHeight = height - padding.top - padding.bottom;

  // Min and max for scaling
  const minPrice = Math.max(0, Math.floor(stats.low * 0.96));
  const maxPrice = Math.ceil(stats.high * 1.04);
  const priceRange = maxPrice - minPrice || 1;

  // Generate points
  const points = useMemo(() => {
    if (!activeRecords.length) return [];
    return activeRecords.map((record, index) => {
      const x = padding.left + (index / (activeRecords.length - 1 || 1)) * chartWidth;
      const y = padding.top + chartHeight - ((record.price - minPrice) / priceRange) * chartHeight;
      return { x, y, record };
    });
  }, [activeRecords, chartWidth, chartHeight, minPrice, priceRange, padding.left, padding.top]);

  // SVG path definition
  const pathD = useMemo(() => {
    if (!points.length) return '';
    return points.reduce((acc, point, index) => {
      if (index === 0) return `M ${point.x} ${point.y}`;
      // Smooth curve using cubic bezier
      const prev = points[index - 1];
      const cx1 = prev.x + (point.x - prev.x) / 2;
      const cy1 = prev.y;
      const cx2 = prev.x + (point.x - prev.x) / 2;
      const cy2 = point.y;
      return `${acc} C ${cx1} ${cy1}, ${cx2} ${cy2}, ${point.x} ${point.y}`;
    }, '');
  }, [points]);

  // Area under path
  const areaD = useMemo(() => {
    if (!points.length || !pathD) return '';
    const lastPoint = points[points.length - 1];
    const firstPoint = points[0];
    const bottomY = padding.top + chartHeight;
    return `${pathD} L ${lastPoint.x} ${bottomY} L ${firstPoint.x} ${bottomY} Z`;
  }, [points, pathD, chartHeight, padding.top]);

  // Average line Y coordinate
  const avgY = padding.top + chartHeight - ((stats.avg - minPrice) / priceRange) * chartHeight;

  // Lowest price coordinate
  const lowestPoint = useMemo(() => {
    if (!points.length) return null;
    return points.reduce((min, p) => (p.record.price < min.record.price ? p : min), points[0]);
  }, [points]);

  const activeHoverPoint = hoverIndex !== null && points[hoverIndex] ? points[hoverIndex] : null;

  const handleMouseMove = (e: React.MouseEvent<SVGSVGElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const clientX = e.clientX - rect.left;
    // Scale to SVG coordinate
    const svgX = (clientX / rect.width) * width;
    if (svgX < padding.left || svgX > width - padding.right || points.length < 2) {
      setHoverIndex(null);
      return;
    }
    const relativeX = svgX - padding.left;
    const step = chartWidth / (points.length - 1);
    const index = Math.round(relativeX / step);
    const clampedIndex = Math.max(0, Math.min(points.length - 1, index));
    setHoverIndex(clampedIndex);
  };

  return (
    <div className="bg-[#0c0c0e] border border-slate-800/60 rounded-3xl p-5 text-white shadow-xl" ref={containerRef}>
      {/* Header controls */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
        <div>
          <div className="flex items-center gap-2">
            <h4 className="text-sm font-bold text-white tracking-wide uppercase font-mono">Price Intelligence Telemetry</h4>
            <span className="text-[10px] bg-indigo-500/10 text-indigo-400 font-mono px-2.5 py-0.5 rounded-full border border-indigo-500/20 font-bold tracking-wider">
              60D AUDIT
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Verified price data tracking past changes and baseline stability
          </p>
        </div>

        {/* Time range selector */}
        <div className="inline-flex rounded-xl bg-[#141418] p-1 border border-slate-800">
          {(['10D', '30D', '60D'] as const).map((range) => (
            <button
              key={range}
              onClick={() => {
                setTimeRange(range);
                setHoverIndex(null);
              }}
              className={`px-3 py-1 text-xs font-semibold rounded-lg font-mono transition-all cursor-pointer ${
                timeRange === range
                  ? 'bg-indigo-600 text-white shadow-sm font-bold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {range === '10D' ? '10 Days' : range === '30D' ? '1 Month' : '2 Months'}
            </button>
          ))}
        </div>
      </div>

      {/* SVG Chart */}
      <div className="relative w-full aspect-[2.7/1] min-h-[220px]">
        <svg
          viewBox={`0 0 ${width} ${height}`}
          className="w-full h-full overflow-visible select-none"
          onMouseMove={handleMouseMove}
          onMouseLeave={() => setHoverIndex(null)}
        >
          <defs>
            <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#6366f1" stopOpacity="0.35" />
              <stop offset="85%" stopColor="#6366f1" stopOpacity="0.02" />
              <stop offset="100%" stopColor="#6366f1" stopOpacity="0.0" />
            </linearGradient>
            <linearGradient id="strokeGradient" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#818cf8" />
              <stop offset="100%" stopColor="#34d399" />
            </linearGradient>
          </defs>

          {/* Grid lines */}
          {[0, 0.33, 0.66, 1].map((pct, i) => {
            const y = padding.top + chartHeight * pct;
            const price = Math.round(maxPrice - pct * priceRange);
            return (
              <g key={i}>
                <line
                  x1={padding.left}
                  y1={y}
                  x2={width - padding.right}
                  y2={y}
                  stroke="#1e293b"
                  strokeDasharray="3 3"
                  strokeWidth="0.8"
                />
                <text
                  x={padding.left - 8}
                  y={y + 3}
                  textAnchor="end"
                  fill="#64748b"
                  fontSize="10"
                  fontFamily="JetBrains Mono, monospace"
                >
                  {currencySymbol}
                  {price >= 1000 ? `${(price / 1000).toFixed(price % 1000 === 0 ? 0 : 1)}k` : price}
                </text>
              </g>
            );
          })}

          {/* 30-Day Average Benchmark Line */}
          <line
            x1={padding.left}
            y1={avgY}
            x2={width - padding.right}
            y2={avgY}
            stroke="#f59e0b"
            strokeDasharray="4 4"
            strokeWidth="1.2"
            opacity="0.8"
          />
          <text
            x={width - padding.right}
            y={avgY - 4}
            textAnchor="end"
            fill="#fbbf24"
            fontSize="9"
            fontWeight="600"
            fontFamily="JetBrains Mono, monospace"
          >
            AVG: {currencySymbol}{stats.avg.toLocaleString('en-IN')}
          </text>

          {/* Area Fill */}
          <path d={areaD} fill="url(#chartGradient)" />

          {/* Main Price Line */}
          <path
            d={pathD}
            fill="none"
            stroke="url(#strokeGradient)"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Lowest point indicator */}
          {lowestPoint && (
            <g>
              <circle
                cx={lowestPoint.x}
                cy={lowestPoint.y}
                r="4.5"
                fill="#10b981"
                stroke="#090d16"
                strokeWidth="2"
              />
              <text
                x={lowestPoint.x}
                y={lowestPoint.y + 14}
                textAnchor="middle"
                fill="#34d399"
                fontSize="9"
                fontWeight="700"
                fontFamily="JetBrains Mono, monospace"
              >
                LOW {currencySymbol}{lowestPoint.record.price.toLocaleString('en-IN')}
              </text>
            </g>
          )}

          {/* Scrubber vertical line and active point */}
          {activeHoverPoint && (
            <g>
              <line
                x1={activeHoverPoint.x}
                y1={padding.top}
                x2={activeHoverPoint.x}
                y2={padding.top + chartHeight}
                stroke="#818cf8"
                strokeWidth="1.5"
                strokeDasharray="2 2"
              />
              <circle
                cx={activeHoverPoint.x}
                cy={activeHoverPoint.y}
                r="6"
                fill="#818cf8"
                stroke="#0c0c0e"
                strokeWidth="2"
              />
            </g>
          )}
        </svg>

        {/* Floating Tooltip during hover */}
        {activeHoverPoint && (
          <div
            className="absolute pointer-events-none z-10 px-3 py-2 rounded-xl bg-[#050505] border border-indigo-500/40 text-xs shadow-2xl backdrop-blur-sm -translate-x-1/2 -translate-y-full mb-3 font-mono"
            style={{
              left: `${(activeHoverPoint.x / width) * 100}%`,
              top: `${(activeHoverPoint.y / height) * 100}%`,
            }}
          >
            <div className="text-[10px] text-slate-400 font-mono">{activeHoverPoint.record.timestamp}</div>
            <div className="text-sm font-bold font-mono text-emerald-400">
              {currencySymbol}{activeHoverPoint.record.price.toLocaleString('en-IN')}
            </div>
            {stats.avg > 0 && (
              <div className="text-[10px] text-slate-300">
                {activeHoverPoint.record.price < stats.avg ? (
                  <span className="text-emerald-400 font-semibold">
                    ↓ {Math.round(((stats.avg - activeHoverPoint.record.price) / stats.avg) * 100)}% vs period avg
                  </span>
                ) : activeHoverPoint.record.price > stats.avg ? (
                  <span className="text-amber-400 font-semibold">
                    ↑ {Math.round(((activeHoverPoint.record.price - stats.avg) / stats.avg) * 100)}% above avg
                  </span>
                ) : (
                  <span>At average price</span>
                )}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Summary statistics footer */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4 mt-3 border-t border-slate-800/80 text-xs">
        <div className="bg-[#121215] p-2.5 rounded-2xl border border-slate-800/80">
          <span className="block text-[10px] font-mono text-slate-400 uppercase">Lowest ({timeRange})</span>
          <span className="text-sm font-bold font-mono text-emerald-400">
            {currencySymbol}{stats.low.toLocaleString('en-IN')}
          </span>
        </div>

        <div className="bg-[#121215] p-2.5 rounded-2xl border border-slate-800/80">
          <span className="block text-[10px] font-mono text-slate-400 uppercase">Highest ({timeRange})</span>
          <span className="text-sm font-bold font-mono text-slate-300">
            {currencySymbol}{stats.high.toLocaleString('en-IN')}
          </span>
        </div>

        <div className="bg-[#121215] p-2.5 rounded-2xl border border-slate-800/80">
          <span className="block text-[10px] font-mono text-slate-400 uppercase">Period Average</span>
          <span className="text-sm font-bold font-mono text-amber-400">
            {currencySymbol}{stats.avg.toLocaleString('en-IN')}
          </span>
        </div>

        <div className="bg-[#121215] p-2.5 rounded-2xl border border-slate-800/80">
          <span className="block text-[10px] font-mono text-slate-400 uppercase">Trend Movement</span>
          <div className="flex items-center gap-1 mt-0.5">
            {stats.changePct < 0 ? (
              <>
                <TrendingDown className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-sm font-bold font-mono text-emerald-400">
                  {stats.changePct}% Drop
                </span>
              </>
            ) : stats.changePct > 0 ? (
              <>
                <TrendingUp className="w-3.5 h-3.5 text-amber-400" />
                <span className="text-sm font-bold font-mono text-amber-400">
                  +{stats.changePct}% Rise
                </span>
              </>
            ) : (
              <>
                <Minus className="w-3.5 h-3.5 text-slate-400" />
                <span className="text-sm font-bold font-mono text-slate-300">Stable</span>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
