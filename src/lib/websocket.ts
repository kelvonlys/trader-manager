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

// Singleton maps
const connections = new Map<string, WebSocket>();
const listeners = new Map<string, Set<(data: PriceData) => void>>();
const latestData = new Map<string, PriceData>();
const RECONNECT_INTERVAL = 3000;

export function useWebSocket(symbol: string | undefined) {
  const [priceData, setPriceData] = useState<PriceData | null>(null);

  useEffect(() => {
    if (!symbol) return;

    // Ensure listener set exists first
    if (!listeners.has(symbol)) {
      listeners.set(symbol, new Set());
    }

    let ws = connections.get(symbol);

    // Create new connection if none exists or it's dead
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
            const callbacks = listeners.get(symbol);
            if (callbacks) {
              callbacks.forEach(cb => cb(msg.data));
            }
          }
        } catch (e) {
          console.error('WS parse error:', e);
        }
      };

      ws.onerror = () => console.error(`WS error: ${symbol}`);

      ws.onclose = () => {
        console.log(`WebSocket closed: ${symbol}`);
        connections.delete(symbol);

        // Only reconnect if someone is still interested
        const currentListeners = listeners.get(symbol);
        if (currentListeners && currentListeners.size > 0) {
          setTimeout(() => {
            console.log(`Reconnecting to ${symbol}...`);
            // Trigger reconnection by doing nothing — next mount will recreate
          }, RECONNECT_INTERVAL);
        }
      };

      connections.set(symbol, ws);
    }

    // Add this component as listener
    const callback = (data: PriceData) => setPriceData(data);
    listeners.get(symbol)!.add(callback);

    // Restore latest price immediately if we have it
    if (latestData.has(symbol)) {
      setPriceData(latestData.get(symbol)!);
    }

    // Cleanup
    return () => {
      const set = listeners.get(symbol);
      if (set) {
        set.delete(callback);
        if (set.size === 0) {
          ws?.close();
          connections.delete(symbol);
          listeners.delete(symbol);
          latestData.delete(symbol);
        }
      }
    };
  }, [symbol]);

  return priceData;
}
