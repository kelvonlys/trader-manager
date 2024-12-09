'use client';
import { useState, useEffect } from 'react';

export interface PriceData {
    time: number;
    bid: number;
    ask: number;
    last: any;
    volume: any;
    volume_real: any;
    day_change_pct: string;
    spread: any;
    previous_bid: number;
    previous_ask: number;
}

interface WebSocketResponse {
  type: 'price';
  data: PriceData;
}

export const useWebSocket = (symbol: string | undefined) => {
  const [connection, setConnection] = useState<WebSocket | null>(null);
  const [priceData, setPriceData] = useState<PriceData | null>(null);

  useEffect(() => {
    if (!symbol) return;

    const wsUrl = `ws://47.130.90.161:5000/ws/${symbol}`;
    const ws = new WebSocket(wsUrl);

    ws.onopen = () => {
      console.log('WebSocket connection established');
      setConnection(ws);
    };

    ws.onmessage = (event) => {
      const data: WebSocketResponse = JSON.parse(event.data);
      if (data.type === 'price') {
        setPriceData(data.data);
      }
    };

    ws.onerror = (error) => {
      console.error('WebSocket Error:', error);
    };

    ws.onclose = () => {
      console.log('WebSocket Connection Closed');
      setConnection(null);
      setPriceData(null);
    };

    return () => {
      if (ws.readyState === WebSocket.OPEN) {
        ws.close();
      }
    };
  }, [symbol]);

  return priceData;
};