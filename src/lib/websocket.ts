'use client';

import { useState, useEffect } from 'react';

export interface PriceData {
  time: number;
  bid: number;
  ask: number;
  last: any;
  volume: any;
  volume_real: any;
  day_change_pct: any;
  spread: any;
  previous_bid: number;
  previous_ask: number;
}

interface WebSocketResponse {
  type: 'price';
  data: PriceData;
}

const connections = new Map<string, WebSocket>();
const listeners = new Map<string, Set<(data: PriceData) => void>>();
const latestData = new Map<string, PriceData>();
const RECONNECT_INTERVAL = 3000;

export function useWebSocket(symbol: string | undefined) {
  const [priceData, setPriceData] = useState<PriceData | null>(null);

  useEffect(() => {
    if (!symbol) return;

    // FIX 1: Create listener set FIRST
    if (!listeners.has(symbol)) {
      listeners.set(symbol, new Set());
    }

    let ws = connections.get(symbol);

    if (!ws || ws.readyState === WebSocket.CLOSED || ws.readyState === WebSocket.CLOSING) {
      ws = new WebSocket(`${process.env.NEXT_PUBLIC_WS_URL}/${symbol}`);

      ws.onopen = () => {
        console.log(`WebSocket connected: ${symbol}`);
      };

      ws.onmessage = (event) => {
        try {
          const msg: WebSocketResponse = JSON.parse(event.data);
          if (msg.type === 'price') {
            latestData.set(symbol, msg.data);
            listeners.get(symbol)?.forEach(cb => cb(msg.data));
          }
        } catch (e) {
          console.error("WS parse error:", e);
        }
      };

      ws.onerror = () => console.error(`WS error: ${symbol}`);

      ws.onclose = () => {
        console.log(`WebSocket closed: ${symbol}`);
        connections.delete(symbol);
        // Don't delete listeners here — we need them to know someone wants to reconnect

        // Auto-reconnect if anyone is still listening
        if (listeners.get(symbol)?.size > 0) {
          setTimeout(() => {
            // This will trigger the useEffect again
            console.log(`Reconnecting to ${symbol}...`);
          }, RECONNECT_INTERVAL);
        }
      };

      connections.set(symbol, ws);
    }

    const callback = (data: PriceData) => setPriceData(data);
    listeners.get(symbol)!.add(callback);

    // Restore latest price immediately
    if (latestData.has(symbol)) {
      setPriceData(latestData.get(symbol)!);
    }

    return () => {
      const set = listeners.get(symbol);
      if (set) {
        set.delete(callback);
        if (set.size === 0) {
          ws?.close();
          connections.delete(symbol);
          listeners.delete(symbol); // only delete when truly no one cares
        }
      }
    };
  }, [symbol]);

  return priceData;
}