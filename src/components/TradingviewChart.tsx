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
  const [volume, setVolume] = React.useState('0.10');

  // Update the numbers instantly without re-rendering the whole component
  useEffect(() => {
    if (bidRef.current) bidRef.current.textContent = bid.toFixed(5);
    if (askRef.current) askRef.current.textContent = ask.toFixed(5);
    if (spreadRef.current) {
      spreadRef.current.textContent = ((ask - bid) * 10000).toFixed(1);
    }
  }, [bid, ask]);

  // Load TradingView widget only once when symbol changes
  useEffect(() => {
    if (!containerRef.current) return;

    containerRef.current.innerHTML = '<div id="tv_container" class="w-full h-full"></div>';

    const script = document.createElement('script');
    script.src = 'https://s3.tradingview.com/tv.js';
    script.async = true;
    script.onload = () => {
      new (window as any).TradingView.widget({
        container_id: "tv_container",
        width: "100%",
        height: 640,
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
      document.head.removeChild(script);
    };
  }, [symbol]); // only re-run when symbol actually changes

  return (
    <div className="relative bg-black rounded-2xl overflow-hidden border border-gray-800">
      {/* LIVE PRICE OVERLAY — THIS MOVES SMOOTHLY NOW */}
      <div className="hidden absolute top-0 left-0 z-50 flex items-center gap-6 bg-black/95 backdrop-blur-sm px-6 py-3 rounded-xl border border-gray-700 shadow-2xl ">
        <div className="text-red-500 text-xs">
          BID <span ref={bidRef} className="text-lg font-bold ml-2">{bid.toFixed(5)}</span>
        </div>
        <div className="text-blue-500 text-xs">
          ASK <span ref={askRef} className="text-lg font-bold ml-2">{ask.toFixed(5)}</span>
        </div>
        <div className="text-gray-400 text-sm">
          Spread <span ref={spreadRef} className="font-bold">{((ask - bid) * 10000).toFixed(1)}</span> pips
        </div>
      </div>

      {/* COMPACT TRADING PANEL */}
      <div className="absolute top-0 right-0 z-50 flex items-center gap-3 bg-black/95 backdrop-blur-sm px-5 py-3 rounded-xl border border-gray-700">
        {/* <input
          type="text"
          value={volume}
          onChange={(e) => setVolume(e.target.value.replace(/[^0-9.]/g, ''))}
          className="w-20 px-3 py-2 bg-gray-900 text-white rounded border border-gray-600 focus:border-blue-500 outline-none text-sm"
        /> */}
        <button
          onClick={() => onTrade('sell', parseFloat(volume) || 0.1)}
          className="px-6 py-2 bg-red-600 hover:bg-red-700 text-white font-bold rounded text-sm transition"
        >
          SELL
        </button>
        <button
          onClick={() => onTrade('buy', parseFloat(volume) || 0.1)}
          className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded text-sm transition"
        >
          BUY
        </button>
      </div>

      <div ref={containerRef} className="w-full h-screen min-h-96" />
    </div>
  );
}