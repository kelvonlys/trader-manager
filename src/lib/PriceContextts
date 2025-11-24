// src/lib/PriceContext.tsx
'use client';

import { createContext, useContext, useEffect, useRef, ReactNode } from 'react';
import { useWebSocket, PriceData } from '@/lib/websocket'; // your existing hook

type PriceContextType = {
  getPrice: (symbol: string) => PriceData | null;
};

const PriceContext = createContext<PriceContextType | null>(null);

export const PriceProvider = ({ children, symbols }: { children: ReactNode; symbols: string[] }) => {
  const latestPrices = useRef<Map<string, PriceData>>(new Map());

  // Subscribe to all symbols
  symbols.forEach(symbol => {
    const data = useWebSocket(symbol);
    if (data) {
      latestPrices.current.set(symbol, data);
    }
  });

  const getPrice = (symbol: string) => latestPrices.current.get(symbol) || null;

  return <PriceContext.Provider value={ { getPrice } }>{children}</PriceContext.Provider>;
};

export const usePriceContext = () => {
  const context = useContext(PriceContext);
  if (!context) throw new Error("usePriceContext must be inside PriceProvider");
  return context;
};