"use client"
import { Metadata } from "next";
import React from "react";
import { useWindowDimensions } from "./useWindowDimensions"

export const metadata: Metadata = {
  title: "Trader Manager Dashboard Page",
  description: "This is Next.js Home page for Trader Manager",
};

export default function TradingViewWidget() {
  const { width, height } = useWindowDimensions();
  const containerRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (containerRef.current) {
      const script = document.createElement('script');
      script.src = 'https://s3.tradingview.com/external-embedding/embed-widget-advanced-chart.js';
      script.type = 'text/javascript';
      script.async = true;

      console.log("width: ", width)
      const chartOptions = `
        {
          "width": "980",
          "height": "610",
          "autosize": true,
          "symbol": "OANDA:XAUUSD",
          "interval": "D",
          "timezone": "Etc/UTC",
          "theme": "dark",
          "style": "1",
          "locale": "en",
          "allow_symbol_change": true,
          "calendar": false,
          "support_host": "https://www.tradingview.com"
        }
      `;

      script.innerHTML = chartOptions;
      containerRef.current.appendChild(script);

      return () => {
        if (script.parentNode) {
          script.parentNode.removeChild(script);
        }
      };
    }
  }, []);

  return (
    <div className="tradingview-widget-container" ref={containerRef} >
    </div>
  );
}

// export default function Home() {
//   return (
//         <TradingViewWidget />
//   );
// }
