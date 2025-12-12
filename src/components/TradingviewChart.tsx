// components/TradingviewChart.tsx
'use client';

import React, { useEffect, useRef } from 'react';
import useColorMode from '@/hooks/useColorMode';

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
  const widgetRef = useRef<any>(null); // To store the widget instance

  const [colorMode] = useColorMode();

  // Update live prices
  useEffect(() => {
    if (bidRef.current) bidRef.current.textContent = bid.toFixed(5);
    if (askRef.current) askRef.current.textContent = ask.toFixed(5);
    if (spreadRef.current) {
      spreadRef.current.textContent = ((ask - bid) * 10000).toFixed(1);
    }
  }, [bid, ask]);


  // Load TradingView only when symbol changes
  useEffect(() => {
    if (!containerRef.current) return;

    // Clean up previous widget
    if (widgetRef.current) {
      widgetRef.current.remove();
      widgetRef.current = null;
    }

    containerRef.current.innerHTML = '<div id="tv_container" class="w-full h-full"></div>';

    const script = document.createElement('script');
    script.src = 'https://s3.tradingview.com/tv.js';
    script.async = true;
    script.onload = () => {
      new (window as any).TradingView.widget({
        container_id: "tv_container",
        width: "100%",
        height: "100%",
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
    <div className="relative w-full bg-black rounded-2xl overflow-hidden border border-gray-800">
      <div className="h-[calc(75vh)] w-full relative">
        <div className="absolute top-0 right-0 z-50 flex items-center gap-3 bg-black/90 backdrop-blur-md px-5 py-3 rounded-xl border border-gray-700 shadow-2xl">
          <button
            onClick={() => onTrade('sell', 0.10)}
            className="px-10 py-3 text-white font-bold text-xs bg-gradient-to-r from-red-400 via-rose-600 to-red-700 hover:from-red-200 hover:via-rose-500 hover:to-red-600 rounded-lg shadow-lg hover:shadow-red-500/50 transition-all duration-300 transform hover:scale-105 active:scale-95 border-red-500/30"
          >
            SELL
          </button>
          <button
            onClick={() => onTrade('buy', 0.10)}
            className="px-10 py-3 text-white font-bold text-xs bg-gradient-to-r from-cyan-500 via-blue-600 to-blue-700 hover:from-cyan-400 hover:via-blue-500 hover:to-blue-600 rounded-lg shadow-lg hover:shadow-cyan-500/25 transition-all duration-300 transform hover:scale-105 active:scale-95 border-cyan-500/30"
          >
            BUY 
          </button>
        </div>
              
        <div ref={containerRef} className="absolute inset-0" />
      </div>
    </div>
  );
}