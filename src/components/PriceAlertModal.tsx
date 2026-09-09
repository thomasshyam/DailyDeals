import React, { useState } from 'react';
import { Product, PriceAlert } from '../types';
import { X, Bell, ShieldCheck, Check, ArrowDown } from 'lucide-react';

interface PriceAlertModalProps {
  product: Product;
  isOpen: boolean;
  onClose: () => void;
  onSaveAlert: (alert: PriceAlert) => void;
}

export const PriceAlertModal: React.FC<PriceAlertModalProps> = ({
  product,
  isOpen,
  onClose,
  onSaveAlert,
}) => {
  const [alertType, setAlertType] = useState<'ANY_DROP' | 'TARGET_PRICE' | 'PERCENT_DROP'>('TARGET_PRICE');
  const [targetPrice, setTargetPrice] = useState<number>(
    Math.round(product.currentPrice * 0.95)
  );
  const [percentDrop, setPercentDrop] = useState<number>(10);
  const [email, setEmail] = useState<string>('thomas.shyam@wiseware.ai');
  const [isSuccess, setIsSuccess] = useState<boolean>(false);

  if (!isOpen) return null;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    let finalTargetPrice = targetPrice;

    if (alertType === 'ANY_DROP') {
      finalTargetPrice = product.currentPrice - 100;
    } else if (alertType === 'PERCENT_DROP') {
      finalTargetPrice = Math.round(product.currentPrice * (1 - percentDrop / 100));
    }

    const newAlert: PriceAlert = {
      id: `alert-${Date.now()}`,
      productId: product.id,
      productTitle: product.title,
      productImage: product.image,
      marketplace: product.primaryMarketplace,
      currentPrice: product.currentPrice,
      targetPrice: finalTargetPrice,
      alertType,
      percentDropTarget: alertType === 'PERCENT_DROP' ? percentDrop : undefined,
      email,
      createdAt: new Date().toISOString().split('T')[0],
      status: 'ACTIVE',
    };

    onSaveAlert(newAlert);
    setIsSuccess(true);
    setTimeout(() => {
      setIsSuccess(false);
      onClose();
    }, 1200);
  };

  const handlePresetPercentage = (pct: number) => {
    setAlertType('PERCENT_DROP');
    setPercentDrop(pct);
    setTargetPrice(Math.round(product.currentPrice * (1 - pct / 100)));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-[#0c0c0e] rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-800 text-slate-100 relative">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-white p-1.5 rounded-xl hover:bg-[#141418] transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-2xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 flex items-center justify-center flex-shrink-0">
            <Bell className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white font-mono uppercase tracking-wider">Set Price Drop Alert</h3>
            <p className="text-xs text-slate-400">Hourly automated price crawl across stores</p>
          </div>
        </div>

        {/* Product mini pill */}
        <div className="flex items-center gap-3 p-3 bg-[#141418] rounded-2xl border border-slate-800 mb-5">
          <img
            src={product.image}
            alt={product.title}
            className="w-12 h-12 object-cover rounded-xl flex-shrink-0 bg-black/40"
          />
          <div className="min-w-0 flex-1">
            <h4 className="text-xs font-semibold text-white truncate">{product.title}</h4>
            <div className="flex items-center gap-2 mt-0.5">
              <span className="text-xs font-bold font-mono text-emerald-400">
                Current: ₹{product.currentPrice.toLocaleString('en-IN')}
              </span>
              <span className="text-[10px] text-slate-500 font-mono">
                (30D Low: ₹{product.analysis.thirtyDay.low.toLocaleString('en-IN')})
              </span>
            </div>
          </div>
        </div>

        {isSuccess ? (
          <div className="py-8 text-center animate-in zoom-in-95 duration-200">
            <div className="w-12 h-12 bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 rounded-full flex items-center justify-center mx-auto mb-3">
              <Check className="w-6 h-6" />
            </div>
            <h4 className="text-sm font-bold text-white font-mono">Price Alert Activated!</h4>
            <p className="text-xs text-slate-400 mt-1">
              You will receive an instant notification when this product drops below your threshold.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSave} className="space-y-4">
            {/* Condition radio options */}
            <div className="space-y-2">
              <label className="block text-xs font-mono font-bold text-slate-400 uppercase tracking-wider">
                Notify me when price drops to:
              </label>

              {/* Preset buttons */}
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => handlePresetPercentage(5)}
                  className={`py-2 px-3 rounded-xl text-xs font-mono font-semibold border transition-all cursor-pointer ${
                    alertType === 'PERCENT_DROP' && percentDrop === 5
                      ? 'bg-indigo-600 text-white border-indigo-500 shadow-md shadow-indigo-600/20'
                      : 'bg-[#141418] text-slate-400 border-slate-800 hover:text-white hover:bg-[#1a1a20]'
                  }`}
                >
                  5% Drop
                  <span className="block text-[10px] opacity-75 font-mono">
                    ₹{Math.round(product.currentPrice * 0.95).toLocaleString('en-IN')}
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => handlePresetPercentage(10)}
                  className={`py-2 px-3 rounded-xl text-xs font-mono font-semibold border transition-all cursor-pointer ${
                    alertType === 'PERCENT_DROP' && percentDrop === 10
                      ? 'bg-indigo-600 text-white border-indigo-500 shadow-md shadow-indigo-600/20'
                      : 'bg-[#141418] text-slate-400 border-slate-800 hover:text-white hover:bg-[#1a1a20]'
                  }`}
                >
                  10% Drop
                  <span className="block text-[10px] opacity-75 font-mono">
                    ₹{Math.round(product.currentPrice * 0.9).toLocaleString('en-IN')}
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setAlertType('ANY_DROP');
                  }}
                  className={`py-2 px-3 rounded-xl text-xs font-mono font-semibold border transition-all cursor-pointer ${
                    alertType === 'ANY_DROP'
                      ? 'bg-indigo-600 text-white border-indigo-500 shadow-md shadow-indigo-600/20'
                      : 'bg-[#141418] text-slate-400 border-slate-800 hover:text-white hover:bg-[#1a1a20]'
                  }`}
                >
                  Any Drop
                  <span className="block text-[10px] opacity-75 font-mono">Any discount</span>
                </button>
              </div>

              {/* Custom input */}
              <div className="pt-2">
                <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
                  <span>Custom Target Price:</span>
                  <span className="font-mono font-bold text-indigo-400">
                    ₹{targetPrice.toLocaleString('en-IN')}
                  </span>
                </div>
                <div className="relative">
                  <span className="absolute left-3 top-2.5 text-sm font-bold text-slate-500">₹</span>
                  <input
                    type="number"
                    value={targetPrice}
                    onChange={(e) => {
                      setAlertType('TARGET_PRICE');
                      setTargetPrice(Number(e.target.value));
                    }}
                    max={product.currentPrice - 1}
                    min={1}
                    className="w-full pl-8 pr-4 py-2 bg-[#141418] border border-slate-800 rounded-xl text-sm font-mono font-bold text-white focus:outline-none focus:border-indigo-500"
                    placeholder="Enter target price"
                  />
                </div>
              </div>
            </div>

            {/* Email input */}
            <div>
              <label className="block text-xs font-mono font-bold text-slate-400 uppercase tracking-wider mb-1">
                Notification Email
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3.5 py-2 bg-[#141418] border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-indigo-500"
                placeholder="your.email@example.com"
              />
            </div>

            <div className="flex items-center gap-2 text-[11px] text-slate-400 pt-1">
              <ShieldCheck className="w-4 h-4 text-emerald-400 flex-shrink-0" />
              <span>Zero spam guarantee. Strictly transactional price drop alerts.</span>
            </div>

            {/* Submit */}
            <button
              type="submit"
              className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs transition-colors cursor-pointer shadow-md shadow-indigo-600/25"
            >
              Start Tracking Price
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
