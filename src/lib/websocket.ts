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

const RECONNECT_INTERVAL = 5000; // 10 seconds
const MAX_RECONNECT_ATTEMPTS = 5;

export function useWebSocket(symbol: string | undefined) {
  const [connection, setConnection] = useState<WebSocket | null>(null);
  const [priceData, setPriceData] = useState<PriceData | null>(null);
  const [reconnectAttempts, setReconnectAttempts] = useState<number>(0);

  useEffect(() => {
    let ws: WebSocket | null = null;
    let reconnectTimer: NodeJS.Timeout | null = null;

    const connectWebSocket = () => {
      if (!symbol) return;

      // ws = new WebSocket(`wss://47.130.90.161:5000/ws/${symbol}`);
      ws = new WebSocket(`wss://ws.fitopts.com/ws/${symbol}`);
      
      ws.onopen = () => {
        console.log('WebSocket connection established');
        setConnection(ws);
        setReconnectAttempts(0); // Reset attempts on successful connection
      };

      ws.onmessage = (event) => {
        const data: WebSocketResponse = JSON.parse(event.data);
        if (data.type === 'price') {
          setPriceData(data.data);
        }
      };

      ws.onerror = (error) => {
        console.error('WebSocket Error:', error);
        handleDisconnect();
      };

      ws.onclose = () => {
        console.log('WebSocket Connection Closed');
        setConnection(null);
        setPriceData(null);
        handleDisconnect();
      };
    };

    const handleDisconnect = () => {
      if (reconnectTimer) clearTimeout(reconnectTimer);
      
      if (reconnectAttempts < MAX_RECONNECT_ATTEMPTS) {
        setReconnectAttempts(prev => prev + 1);
        reconnectTimer = setTimeout(connectWebSocket, RECONNECT_INTERVAL);
      } else {
        console.log('Max reconnection attempts reached. Giving up.');
      }
    };

    connectWebSocket();

    return () => {
      if (ws) {
        ws.close();
      }
      if (reconnectTimer) clearTimeout(reconnectTimer);
    };
  }, [symbol]);

  return priceData;
}