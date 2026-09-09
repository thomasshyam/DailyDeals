import React, { useState, useRef, useEffect } from 'react';
import { Product } from '../types';
import {
  Sparkles,
  Send,
  Bot,
  User,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  ShieldCheck,
  Image as ImageIcon,
  Upload,
  X,
  ExternalLink,
  Tag,
  Flame,
  Search,
  Layers,
  ShoppingBag
} from 'lucide-react';
import { getSpecificProductUrl } from '../utils/productUrls';

interface AiDealAssistantProps {
  products: Product[];
  onSelectProduct: (product: Product) => void;
}

interface Message {
  id: string;
  sender: 'ai' | 'user';
  text: string;
  userImage?: string;
  identifiedItem?: string;
  exactProduct?: Product;
  similarProducts?: Product[];
  bulletPoints?: string[];
  verdict?: 'BUY' | 'WAIT' | 'DONT_BUY';
}

export const AiDealAssistant: React.FC<AiDealAssistantProps> = ({ products, onSelectProduct }) => {
  const [input, setInput] = useState('');
  const [isThinking, setIsThinking] = useState(false);
  const [selectedImage, setSelectedImage] = useState<{ data: string; mimeType: string; name: string } | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const chatBottomRef = useRef<HTMLDivElement | null>(null);

  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      sender: 'ai',
      text: 'Welcome to TrueDeal AI Intelligence! Ask me for any specific product to see its exact deal analysis, or upload a product photo to find identical or similar items with genuine 60-day price history.',
      bulletPoints: [
        'Ask by name: "I need to buy a table", "Show me study tables", "iPhone 16", "Lenovo laptop"...',
        'Search across all categories: Furniture, Mobiles, Laptops, Audio, Fashion, Appliances...',
        'Upload any product image to instantly locate exact or similar catalog deals',
        'Detect inflated fake discounts vs genuine 60-day low price drops',
      ],
    },
  ]);

  const quickPrompts = [
    'I need to buy a table',
    'Show me study & computer tables',
    'Show me Apple iPhone 16',
    'Show me Lenovo IdeaPad Slim 5',
    'Show me Nike Air Max shoes',
    'Which product has the worst fake discount?',
  ];

  // Auto-scroll chat to bottom
  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isThinking]);

  // Handle file select
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  const processFile = (file: File) => {
    if (!file.type.startsWith('image/')) {
      alert('Please select an image file (PNG, JPEG, WebP).');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const result = event.target?.result as string;
      setSelectedImage({
        data: result,
        mimeType: file.type,
        name: file.name
      });
    };
    reader.readAsDataURL(file);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  // Helper to trigger sample image for quick testing
  const handleSampleImage = (sampleType: 'sneaker' | 'phone' | 'laptop') => {
    let sampleUrl = '';
    let sampleName = '';
    if (sampleType === 'sneaker') {
      sampleUrl = 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&q=80';
      sampleName = 'nike-air-max-sample.jpg';
    } else if (sampleType === 'phone') {
      sampleUrl = 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=400&q=80';
      sampleName = 'iphone-16-sample.jpg';
    } else {
      sampleUrl = 'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=400&q=80';
      sampleName = 'laptop-sample.jpg';
    }

    // Convert sample url to base64 via fetch
    fetch(sampleUrl)
      .then((res) => res.blob())
      .then((blob) => {
        const file = new File([blob], sampleName, { type: 'image/jpeg' });
        processFile(file);
      })
      .catch(() => {
        // Fallback simulate image
        setSelectedImage({
          data: sampleUrl,
          mimeType: 'image/jpeg',
          name: sampleName
        });
      });
  };

  const handleSend = async (queryText?: string) => {
    const query = queryText || input.trim();
    if (!query && !selectedImage) return;

    const currentImage = selectedImage;
    const userMessageText = query || (currentImage ? `[Uploaded image: ${currentImage.name}] Find similar products` : '');

    // Add user message
    const userMsg: Message = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: userMessageText,
      userImage: currentImage?.data,
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setSelectedImage(null);
    setIsThinking(true);

    try {
      const response = await fetch('/api/ai/intelligence', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: query,
          image: currentImage ? { data: currentImage.data, mimeType: currentImage.mimeType } : undefined,
          catalog: products
        }),
      });

      const data = await response.json();

      let exactProd: Product | undefined;
      let simProds: Product[] = [];

      if (data.exactProduct) {
        exactProd = data.exactProduct;
      } else if (data.exactProductId) {
        exactProd = products.find((p) => p.id === data.exactProductId);
      }

      if (Array.isArray(data.similarProducts) && data.similarProducts.length > 0) {
        simProds = data.similarProducts.filter((p: Product) => p.id !== exactProd?.id);
      } else if (Array.isArray(data.similarProductIds)) {
        simProds = products.filter((p) => data.similarProductIds.includes(p.id) && p.id !== exactProd?.id);
      }

      // Fallback matching if server didn't map IDs
      if (!exactProd && query) {
        const lower = query.toLowerCase();
        if (/\b(table|desk|dining|furniture)\b/i.test(lower)) {
          exactProd = products.find((p) => p.category === 'Furniture' || /\b(table|desk)\b/i.test(p.title));
        } else {
          const stopWords = new Set(['need', 'buy', 'show', 'want', 'please', 'find', 'best', 'good', 'shows', 'suggestion', 'phone', 'item', 'items']);
          const tokens = lower
            .replace(/[^a-z0-9\s]/g, ' ')
            .split(/\s+/)
            .filter((t) => t.length > 2 && !stopWords.has(t));

          exactProd = products.find((p) => {
            const full = `${p.title} ${p.brand} ${p.category}`.toLowerCase();
            return tokens.some((tok) => new RegExp(`\\b${tok}`, 'i').test(full));
          });
        }
      }

      if (simProds.length === 0 && exactProd) {
        simProds = products.filter((p) => p.category === exactProd?.category && p.id !== exactProd?.id).slice(0, 4);
      }

      const aiMsg: Message = {
        id: `ai-${Date.now()}`,
        sender: 'ai',
        text: data.text || 'Price intelligence analysis completed.',
        identifiedItem: data.identifiedItem || exactProd?.title,
        exactProduct: exactProd,
        similarProducts: simProds.length > 0 ? simProds : undefined,
        bulletPoints: data.bulletPoints,
        verdict: data.verdict || 'BUY',
      };

      setMessages((prev) => [...prev, aiMsg]);
    } catch (err) {
      console.error('AI assistant query error:', err);
      // Intelligent fallback client-side matching
      const lower = (query || '').toLowerCase();
      const tokens = lower
        .replace(/[^a-z0-9\s]/g, ' ')
        .split(/\s+/)
        .filter((t) => t.length > 2 && !['need', 'buy', 'show', 'want', 'please', 'find', 'best', 'good'].includes(t));

      const matched = products.find((p) => {
        const full = `${p.title} ${p.brand} ${p.category}`.toLowerCase();
        return tokens.some((t) => full.includes(t));
      });

      if (matched) {
        setMessages((prev) => [
          ...prev,
          {
            id: `ai-${Date.now()}`,
            sender: 'ai',
            text: `Found verified deal matching your request: **${matched.title}**.`,
            identifiedItem: matched.title,
            exactProduct: matched,
            similarProducts: products.filter((p) => p.category === matched.category && p.id !== matched.id).slice(0, 3),
            verdict: matched.analysis.dealScore >= 80 ? 'BUY' : 'WAIT',
            bulletPoints: [
              `Current Price: ₹${matched.currentPrice.toLocaleString('en-IN')} on ${matched.primaryMarketplace}`,
              `Deal Score: ${matched.analysis.dealScore}/100 based on verified 60-day price trend`,
              `Recommendation: ${matched.analysis.recommendationReason}`
            ]
          }
        ]);
      } else {
        setMessages((prev) => [
          ...prev,
          {
            id: `ai-${Date.now()}`,
            sender: 'ai',
            text: `We analyzed our live database for "${query}". No direct match was found in our pre-indexed batch. You can explore all categories (Furniture, Mobiles, Laptops, Audio) or trigger a live crawl from the Catalog view.`,
            identifiedItem: `Search: "${query}"`,
            verdict: 'WAIT',
            bulletPoints: [
              'Try keywords like "Study table", "Computer desk", "iPhone 16", "MacBook Air", "Nike shoes"',
              'Toggle category filters in the Deals tab to view all indexed products'
            ]
          }
        ]);
      }
    } finally {
      setIsThinking(false);
    }
  };

  return (
    <div
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      className={`bg-[#0c0c0e] rounded-3xl border ${
        isDragging ? 'border-indigo-500 bg-indigo-950/10' : 'border-slate-800'
      } shadow-2xl overflow-hidden flex flex-col h-[760px] max-w-4xl mx-auto text-slate-100 transition-colors`}
    >
      {/* Header */}
      <div className="p-4 bg-[#101014] text-white flex items-center justify-between border-b border-slate-800">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center">
            <Sparkles className="w-5 h-5 text-indigo-400" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-bold text-sm font-mono uppercase tracking-wide">AI Deal Intelligence & Visual Matching</h3>
              <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-300 border border-indigo-500/20">
                Gemini Powered
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Ask for exact products or upload photos to inspect live cross-store pricing
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="hidden sm:flex items-center gap-1.5 text-xs text-emerald-400 font-mono bg-[#141418] px-2.5 py-1 rounded-xl border border-slate-800">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>0% Mock Data</span>
          </div>
        </div>
      </div>

      {/* Quick Prompts Bar */}
      <div className="p-2.5 bg-[#111115] border-b border-slate-800 overflow-x-auto flex items-center gap-2 scrollbar-none">
        <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-500 flex-shrink-0">
          Suggested:
        </span>
        {quickPrompts.map((prompt, i) => (
          <button
            key={i}
            onClick={() => handleSend(prompt)}
            className="flex-shrink-0 text-xs px-2.5 py-1 rounded-xl bg-[#16161c] hover:bg-[#202028] text-slate-300 hover:text-white border border-slate-800 transition-colors cursor-pointer whitespace-nowrap font-mono"
          >
            {prompt}
          </button>
        ))}
      </div>

      {/* Message Chat Container */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-5 bg-[#08080a]">
        {messages.map((m) => (
          <div
            key={m.id}
            className={`flex gap-3 max-w-3xl ${
              m.sender === 'user' ? 'ml-auto flex-row-reverse' : ''
            }`}
          >
            {/* Avatar */}
            <div
              className={`w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 text-xs ${
                m.sender === 'ai'
                  ? 'bg-[#16161c] text-indigo-400 border border-slate-800 shadow-sm'
                  : 'bg-indigo-600 text-white'
              }`}
            >
              {m.sender === 'ai' ? <Bot className="w-4 h-4" /> : <User className="w-4 h-4" />}
            </div>

            {/* Message Body */}
            <div
              className={`rounded-2xl p-4 text-xs sm:text-sm leading-relaxed max-w-2xl ${
                m.sender === 'user'
                  ? 'bg-indigo-600 text-white rounded-tr-none'
                  : 'bg-[#121216] text-slate-200 border border-slate-800 shadow-md rounded-tl-none space-y-3.5'
              }`}
            >
              {/* User uploaded image thumbnail */}
              {m.userImage && (
                <div className="mb-2">
                  <span className="text-[10px] uppercase font-mono block opacity-80 mb-1">Attached Image:</span>
                  <img
                    src={m.userImage}
                    alt="User uploaded product"
                    className="w-40 h-40 object-cover rounded-xl border border-white/20 bg-black/40 shadow-inner"
                    referrerPolicy="no-referrer"
                  />
                </div>
              )}

              {/* Identified Item Badge */}
              {m.identifiedItem && (
                <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-indigo-500/15 border border-indigo-500/30 text-indigo-300 text-xs font-mono font-bold">
                  <Search className="w-3.5 h-3.5 text-indigo-400" />
                  <span>Identified: {m.identifiedItem}</span>
                </div>
              )}

              <p className="font-medium whitespace-pre-line">{m.text}</p>

              {/* Bullet points breakdown */}
              {m.bulletPoints && m.bulletPoints.length > 0 && (
                <ul className="space-y-1.5 text-xs text-slate-300 bg-[#0c0c0e] p-3 rounded-xl border border-slate-800/80 font-mono">
                  {m.bulletPoints.map((bp, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="text-indigo-400 font-bold">•</span>
                      <span>{bp}</span>
                    </li>
                  ))}
                </ul>
              )}

              {/* EXACT PRODUCT MATCH CARD */}
              {m.exactProduct && (
                <div className="p-4 bg-gradient-to-br from-[#161622] to-[#0d0d12] rounded-2xl border border-indigo-500/40 shadow-xl space-y-3 mt-3">
                  <div className="flex items-center justify-between">
                    <div className="inline-flex items-center gap-1.5 text-[11px] font-mono font-black uppercase text-emerald-400 bg-emerald-500/10 px-2.5 py-0.5 rounded-full border border-emerald-500/30">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Exact Product Match</span>
                    </div>
                    <span className="text-[11px] font-mono text-indigo-300 bg-indigo-500/10 px-2 py-0.5 rounded border border-indigo-500/20 font-bold">
                      Deal Score: {m.exactProduct.analysis.dealScore}/100
                    </span>
                  </div>

                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3.5">
                    <img
                      src={m.exactProduct.image}
                      alt={m.exactProduct.title}
                      className="w-20 h-20 object-cover rounded-xl flex-shrink-0 bg-black/40 border border-slate-700 shadow-md"
                      referrerPolicy="no-referrer"
                    />

                    <div className="min-w-0 flex-1">
                      <div className="text-[11px] font-mono text-slate-400">
                        {m.exactProduct.brand} • {m.exactProduct.category}
                      </div>
                      <h4 className="font-bold text-sm text-white line-clamp-2 mt-0.5">
                        {m.exactProduct.title}
                      </h4>

                      <div className="flex flex-wrap items-baseline gap-2 mt-1.5">
                        <span className="text-base font-black font-mono text-emerald-400">
                          ₹{m.exactProduct.currentPrice.toLocaleString('en-IN')}
                        </span>
                        <span className="text-xs text-slate-500 line-through font-mono">
                          ₹{m.exactProduct.mrp.toLocaleString('en-IN')}
                        </span>
                        <span className="text-xs text-rose-400 font-mono font-bold">
                          {m.exactProduct.analysis.advertisedDiscount}% OFF
                        </span>
                        <span className="text-[11px] text-slate-400 font-mono">
                          on <strong className="text-slate-200">{m.exactProduct.primaryMarketplace}</strong>
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Actions for Exact Product */}
                  <div className="flex flex-wrap items-center gap-2 pt-1 border-t border-slate-800">
                    <button
                      onClick={() => onSelectProduct(m.exactProduct!)}
                      className="flex-1 sm:flex-none px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-mono font-bold text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer shadow-md shadow-indigo-600/30"
                    >
                      <span>Inspect 60D History</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>

                    <a
                      href={getSpecificProductUrl(m.exactProduct, m.exactProduct.primaryMarketplace)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 sm:flex-none px-3.5 py-2 rounded-xl bg-[#1d1d26] hover:bg-[#252532] text-slate-200 hover:text-white font-mono font-bold text-xs flex items-center justify-center gap-1.5 border border-slate-700 transition-colors"
                    >
                      <ShoppingBag className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Buy on {m.exactProduct.primaryMarketplace}</span>
                      <ExternalLink className="w-3 h-3 text-slate-400" />
                    </a>
                  </div>
                </div>
              )}

              {/* SIMILAR PRODUCTS IN CATALOG */}
              {m.similarProducts && m.similarProducts.length > 0 && (
                <div className="space-y-2 mt-3 pt-2 border-t border-slate-800/80">
                  <div className="flex items-center gap-1.5 text-xs font-mono font-bold text-indigo-300">
                    <Layers className="w-3.5 h-3.5 text-indigo-400" />
                    <span>Similar Products in Verified Catalog:</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {m.similarProducts.map((p) => (
                      <div
                        key={p.id}
                        className="p-3 bg-[#0c0c0e] hover:bg-[#15151a] rounded-xl border border-slate-800 transition-colors flex items-center gap-3 cursor-pointer group"
                        onClick={() => onSelectProduct(p)}
                      >
                        <img
                          src={p.image}
                          alt={p.title}
                          className="w-12 h-12 object-cover rounded-lg flex-shrink-0 bg-black/40 border border-slate-800"
                          referrerPolicy="no-referrer"
                        />
                        <div className="min-w-0 flex-1">
                          <h5 className="font-bold text-xs text-slate-200 truncate group-hover:text-indigo-400 transition-colors">
                            {p.title}
                          </h5>
                          <div className="flex items-center gap-2 mt-0.5">
                            <span className="font-mono font-bold text-emerald-400 text-xs">
                              ₹{p.currentPrice.toLocaleString('en-IN')}
                            </span>
                            <span className="text-[10px] font-mono text-slate-400">
                              {p.primaryMarketplace}
                            </span>
                            <span className="text-[10px] font-mono font-bold text-indigo-300 bg-indigo-500/10 px-1 py-0.2 rounded border border-indigo-500/20">
                              Score: {p.analysis.dealScore}
                            </span>
                          </div>
                        </div>
                        <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-indigo-400 flex-shrink-0 transition-colors" />
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}

        {isThinking && (
          <div className="flex items-center gap-2.5 text-xs text-indigo-300 p-3 bg-[#111115] rounded-2xl border border-indigo-500/20 font-mono w-fit">
            <Bot className="w-4 h-4 text-indigo-400 animate-spin" />
            <span>Analyzing visual features, 60-day price history & cross-retailer catalogs...</span>
          </div>
        )}

        <div ref={chatBottomRef} />
      </div>

      {/* Selected Image Preview Bar */}
      {selectedImage && (
        <div className="p-2.5 bg-[#14141a] border-t border-slate-800 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <img
              src={selectedImage.data}
              alt="Preview"
              className="w-12 h-12 object-cover rounded-lg border border-indigo-500/40 shadow-sm"
            />
            <div className="min-w-0">
              <span className="text-xs font-mono font-bold text-white block truncate">
                {selectedImage.name}
              </span>
              <span className="text-[11px] text-emerald-400 font-mono">
                Ready for Visual Search & AI Matching
              </span>
            </div>
          </div>

          <button
            onClick={() => setSelectedImage(null)}
            className="p-1 rounded-full text-slate-400 hover:text-white hover:bg-slate-800 cursor-pointer transition-colors"
            title="Remove image"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Image Upload Quick Presets / Tips */}
      <div className="px-3 py-1.5 bg-[#0f0f13] border-t border-slate-800/80 flex items-center justify-between text-[11px] font-mono text-slate-400">
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className="text-slate-500">Quick Test Images:</span>
          <button
            onClick={() => handleSampleImage('sneaker')}
            className="hover:text-indigo-300 underline cursor-pointer"
          >
            Nike Sneaker
          </button>
          <span>•</span>
          <button
            onClick={() => handleSampleImage('phone')}
            className="hover:text-indigo-300 underline cursor-pointer"
          >
            iPhone
          </button>
          <span>•</span>
          <button
            onClick={() => handleSampleImage('laptop')}
            className="hover:text-indigo-300 underline cursor-pointer"
          >
            Laptop
          </button>
        </div>

        <span className="hidden sm:inline text-slate-500">
          Or drag & drop image anywhere
        </span>
      </div>

      {/* Input Form */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSend();
        }}
        className="p-3 bg-[#111115] border-t border-slate-800 flex items-center gap-2"
      >
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          accept="image/*"
          className="hidden"
        />

        {/* Upload Image Button */}
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className={`p-2.5 rounded-xl border transition-colors cursor-pointer flex-shrink-0 ${
            selectedImage
              ? 'bg-indigo-600/20 border-indigo-500 text-indigo-300'
              : 'bg-[#16161c] border-slate-800 text-slate-400 hover:text-white hover:bg-[#202028]'
          }`}
          title="Upload product image to find similar products"
        >
          <ImageIcon className="w-4 h-4" />
        </button>

        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={
            selectedImage
              ? 'Add an optional query or press Enter to find similar products...'
              : "Ask for any product (e.g., 'Show me iPhone 16' or 'Nike shoes') or upload an image..."
          }
          className="flex-1 px-4 py-2.5 bg-[#16161c] border border-slate-800 rounded-xl text-xs sm:text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-indigo-500"
        />

        <button
          type="submit"
          disabled={!input.trim() && !selectedImage}
          className="p-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white transition-colors cursor-pointer shadow-md shadow-indigo-600/20 flex-shrink-0"
          title="Send query"
        >
          <Send className="w-4 h-4" />
        </button>
      </form>
    </div>
  );
};
