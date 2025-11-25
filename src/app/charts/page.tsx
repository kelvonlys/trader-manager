// src/app/charts/page.tsx
'use client';

import DefaultLayout from "@/components/Layouts/DefaultLaout";
import TradingViewChart from "@/components/TradingviewChart";
import TradePopupBox from "@/components/Popup/TradePopup";
import { useWebSocket } from "@/lib/websocket";
import { useState, useEffect } from "react";
import { useSearchParams } from 'next/navigation';

export default function TradingviewChartPage() {
  const searchParams = useSearchParams();
  const urlSymbol = searchParams.get('symbol') || 'BTCUSD'; // default fallback

  const priceData = useWebSocket(urlSymbol);

  // Trade popup state
  const [isTradePopupOpen, setIsTradePopupOpen] = useState(false);
  const [tradeSide, setTradeSide] = useState<"buy" | "sell">("buy");
  const [tradeVolume, setTradeVolume] = useState(0.10);

  const openTrade = (side: "buy" | "sell", volume: number) => {
    setTradeSide(side);
    setTradeVolume(volume);
    setIsTradePopupOpen(true);
  };

  // Optional: Update page title dynamically
  useEffect(() => {
    document.title = `${urlSymbol} • Live Chart`;
  }, [urlSymbol]);

  if (!priceData) {
    return (
      <DefaultLayout>
        <div className="flex h-screen items-center justify-center">
          <div className="text-white text-2xl animate-pulse">Loading {urlSymbol}...</div>
        </div>
      </DefaultLayout>
    );
  }

  return (
    <DefaultLayout>
      <div className="p-4 md:p-0.5">
        <h1 className="mb-4 text-2xl font-bold text-white">{urlSymbol}</h1>

        <TradingViewChart
          symbol={`FX:${urlSymbol}`}  // TradingView format
          bid={priceData.bid}
          ask={priceData.ask}
          onTrade={openTrade}
        />

        <TradePopupBox
          isOpen={isTradePopupOpen}
          onClose={() => setIsTradePopupOpen(false)}
          symbol={urlSymbol}
          bid={priceData.bid}
          ask={priceData.ask}
        />
      </div>
    </DefaultLayout>
  );
}