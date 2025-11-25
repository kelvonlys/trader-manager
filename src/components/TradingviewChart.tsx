// components/TradingviewChart.tsx
'use client';

import React, { useEffect, useRef } from 'react';

interface Props {
  symbol: string;
  bid: number;
  ask: number;
  onTrade: (side: 'buy' | 'sell', volume: number) => void;
}

export default function TradingViewChart({ symbol, bid, ask, onTrade }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const bidRef = useRef<HTMLSpanElement>(null);
  const askRef = useRef<HTMLSpanElement>(null);
  const spreadRef = useRef<HTMLSpanElement>(null);

  // Update live prices instantly
  useEffect(() => {
    if (bidRef.current) bidRef.current.textContent = bid.toFixed(5);
    if (askRef.current) askRef.current.textContent = ask.toFixed(5);
    if (spreadRef.current) {
      spreadRef.current.textContent = ((ask - bid) * 10000).toFixed(1);
    }
  }, [bid, ask]);

  // Load TradingView widget only when symbol changes
  useEffect(() => {
    if (!containerRef.current) return;

    // Clear and inject container
    containerRef.current.innerHTML = '<div id="tv_container" class="w-full h-full"></div>';

    const script = document.createElement('script');
    script.src = 'https://s3.tradingview.com/tv.js';
    script.async = true;
    script.onload = () => {
      new (window as any).TradingView.widget({
        container_id: "tv_container",
        width: "100%",
        height: "100%",                    // ← Full height
        symbol: symbol,
        interval: "5",
        timezone: "Etc/UTC",
        theme: "dark",
        style: "1",
        locale: "en",
        toolbar_bg: "#000000",
        enable_publishing: false,
        allow_symbol_change: false,
        hide_side_toolbar: false,
        backgroundColor: "#000000",
        gridColor: "#1e222d",
      });
    };

    document.head.appendChild(script);

    return () => {
      if (script.parentNode) document.head.removeChild(script);
    };
  }, [symbol]);

  return (
    <div className="relative w-full h-screen bg-black">   {/* ← FULL SCREEN, NO EXTRA SPACE */}

      {/* COMPACT TRADING PANEL — TOP RIGHT */}
      <div className="absolute top-0 right-0 z-50 flex items-center gap-3 bg-black/90 backdrop-blur-md px-5 py-3 rounded-xl border border-gray-700 shadow-2xl">
        <button
          onClick={() => onTrade('sell', 0.10)}
          className="px-7 py-3 bg-red-600 hover:bg-red-700 text-white font-bold rounded-lg text-sm transition-all shadow-lg"
        >
          SELL
        </button>
        <button
          onClick={() => onTrade('buy', 0.10)}
          className="px-7 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg text-sm transition-all shadow-lg"
        >
          BUY
        </button>
      </div>

      {/* OPTIONAL: Live price overlay (uncomment if you want it back) */}
      {false && (
        <div className="absolute top-4 left-4 z-50 flex items-center gap-6 bg-black/90 backdrop-blur-md px-6 py-3 rounded-xl border border-gray-700">
          <div className="text-red-400 font-medium">
            BID <span ref={bidRef} className="text-xl font-bold ml-2">{bid.toFixed(5)}</span>
          </div>
          <div className="text-green-400 font-medium">
            ASK <span ref={askRef} className="text-xl font-bold ml-2">{ask.toFixed(5)}</span>
          </div>
          <div className="text-gray-400">
            Spread <span ref={spreadRef} className="font-bold">{((ask - bid) * 10000).toFixed(1)}</span> pips
          </div>
        </div>
      )}

      {/* TRADINGVIEW CHART — FULL BLEED */}
      <div ref={containerRef} className="absolute inset-0 w-full h-full" />
    </div>
  );
}