// components/TVSparkline.tsx
'use client';

import { useEffect, useRef } from 'react';

interface TVSparklineProps {
  symbol: string;
}

export default function TVSparkline({ symbol }: TVSparklineProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    containerRef.current.innerHTML = '';

    const script = document.createElement('script');
    script.src = 'https://s3.tradingview.com/tv.js';
    script.async = true;

    script.onload = () => {
      let tvSymbol = symbol.toUpperCase();

      // CORRECT SYMBOL MAPPING
      if (['EURUSD','GBPUSD','USDJPY','AUDUSD','USDCAD','NZDUSD','XAUUSD','XAGUSD'].includes(tvSymbol)) {
        tvSymbol = `FX:${tvSymbol}`;
      } else if (tvSymbol.includes('BTC') || tvSymbol.includes('ETH') || tvSymbol.includes('SOL')) {
        tvSymbol = `BINANCE:${tvSymbol}`;
      } else {
        tvSymbol = `FX:${tvSymbol}`; // Fixed: was missing closing `
      }

      new (window as any).TradingView.widget({
        container_id: containerRef.current!.id,
        width: 130,
        height: 56,
        symbol: tvSymbol,
        interval: "60",
        timezone: "Etc/UTC",
        theme: "dark",
        style: "3", // Line chart only
        backgroundColor: "transparent",
        locale: "en",
        hide_top_toolbar: true,
        hide_side_toolbar: true,
        hide_legend: true,
        hide_volume: true,
        save_image: false,
        enable_publishing: false,
        withdateranges: false,

        disabled_features: [
          "header_widget",
          "header_symbol_search",
          "header_chart_type",
          "timeframes_toolbar",
          "header_screenshot",
          "show_logo_on_all_charts", // This kills the logo
        ],

        overrides: {
          "paneProperties.background": "transparent",
          "paneProperties.vertGridProperties.color": "transparent",
          "paneProperties.horzGridProperties.color": "transparent",
        },
      });
    };

    document.head.appendChild(script);

    return () => {
      if (script.parentNode) document.head.removeChild(script);
    };
  }, [symbol]);

  const containerId = `tv-spark-${symbol}`;

  return (
    <div className="flex items-center justify-center">
      <div
        ref={containerRef}
        id={containerId}
        className="w-[130px] h-[56px] rounded overflow-hidden"
      />
      {/* Hide logo gently */}
      <style jsx>{`
        #${containerId} .tv-logo,
        #${containerId} img[alt="TradingView"],
        #${containerId} .tv-lightweight-charts-watermark {
          display: none !important;
        }
      `}</style>
    </div>
  );
}