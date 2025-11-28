// src/components/MiniTVChart.tsx
'use client';

import { useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';

interface MiniTVChartProps {
  symbol: string;
  height?: number;
}

export default function MiniTVChart({ symbol, height = 140 }: MiniTVChartProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useEffect(() => {
    if (!containerRef.current) return;

    containerRef.current.innerHTML = '';

    const script = document.createElement('script');
    script.src = 'https://s3.tradingview.com/tv.js';
    script.async = true;

    script.onload = () => {
      const tvSymbol = symbol.includes(':') ? symbol : `FX:${symbol.toUpperCase()}`;

      new (window as any).TradingView.widget({
        container_id: containerRef.current!.id,
        width: "100%",
        height: height,
        symbol: tvSymbol,
        interval: "60",
        timezone: "Etc/UTC",
        theme: "dark",
        style: "3",
        backgroundColor: "transparent",
        locale: "en",

        hide_top_toolbar: true,
        hide_side_toolbar: true,
        hide_legend: true,
        hide_volume: true,
        allow_symbol_change: false,
        save_image: false,

        disabled_features: [
          "header_widget",
          "header_symbol_search",
          "header_chart_type",
          "header_settings",
          "header_screenshot",
          "header_compare",
          "header_undo_redo",
          "timeframes_toolbar",
          "show_logo_on_all_charts",
          "left_toolbar",
          "control_bar",
          "bottom_toolbar",
        ],

        overrides: {
          "paneProperties.background": "#000000",
          "paneProperties.vertGridProperties.color": "#000000",
          "paneProperties.horzGridProperties.color": "#000000",
          "scalesProperties.showRightScale": false,
          "scalesProperties.showLeftScale": false,
          "mainSeriesProperties.showPriceLine": false,
          "paneProperties.rightMargin": 0,
          "paneProperties.leftMargin": 0,
        },
      });
    };

    document.head.appendChild(script);

    return () => {
      if (script.parentNode) document.head.removeChild(script);
    };
  }, [symbol, height]);

  const containerId = `tv-clean-${symbol}-${Math.random().toString(36).substr(2, 9)}`;

  return (
    <div
      className="relative mt-8 rounded-2xl overflow-hidden border border-gray-800 bg-black cursor-pointer hover:border-gray-600 transition-all group"
      onClick={() => router.push(`/charts?symbol=${symbol}`)}
    >
      {/* Custom header */}
      <div className="absolute top-3 left-3 z-30 bg-black/80 backdrop-blur-md px-4 py-2 rounded-lg border border-gray-700">
        <p className="text-white font-bold text-sm tracking-wider">{symbol}</p>
      </div>

      {/* Hover overlay */}
      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/50 transition-all z-20 flex items-center justify-center pointer-events-none">
        <p className="text-white/70 text-sm opacity-0 group-hover:opacity-100 transition-opacity">
          Click for full chart →
        </p>
      </div>

      {/* FINAL CSS CLEANUP */}
      <style jsx>{`
        #${containerId} * {
          font-size: 0 !important;
        }
        #${containerId} .tv-lightweight-charts-watermark,
        #${containerId} img,
        #${containerId} .tv-logo,
        #${containerId} .tv-chart-footer,
        #${containerId} .tv-right-axis,
        #${containerId} .tv-left-axis,
        #${containerId} [class*="button"],
        #${containerId} [class*="settings"],
        #${containerId} canvas + div,
        #${containerId} .tv-chart__canvas-wrapper > div:not(canvas) {
          display: none !important;
        }
      `}</style>

      <div
        ref={containerRef}
        id={containerId}
        className="w-full"
        style={{ height: `${height}px` }}
      />
    </div>
  );
}