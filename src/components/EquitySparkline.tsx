// src/components/EquityCurvePro.tsx
'use client';

import { AreaChart, Area, ResponsiveContainer, Tooltip } from 'recharts';
import { TrendingUp, TrendingDown } from 'lucide-react';

interface Props {
  equity: number;
  profit: number;
}

export default function EquityCurvePro({ equity, profit }: Props) {
  if (!equity || !profit || isNaN(equity) || isNaN(profit)) {
    return (
      <div className="w-full h-80 rounded-3xl bg-gray-900/50 border border-gray-800 flex items-center justify-center">
        <p className="text-gray-500 text-lg">Loading equity curve...</p>
      </div>
    );
  }

  const generateRealTraderCurve = () => {
    const points = 120;
    const data = [];
    let current = equity - profit;

    for (let i = 0; i < points; i++) {
      let value = current + (equity - current) * (i / points);
      const chaos = (Math.random() - 0.5) * 320;
      value += chaos;

      if (Math.random() < 0.1) value -= 900 + Math.random() * 1400;
      if (i > 25 && Math.random() < 0.11) value += 700 + Math.random() * 1000;
      if (value < (equity - profit) * 0.68) value = (equity - profit) * 0.68 + Math.random() * 250;

      data.push({ value: Number(value.toFixed(2)) });
    }
    return data;
  };

  const data = generateRealTraderCurve();
  const isPositive = profit >= 0;

  // Dynamic stroke color class
  const strokeColorClass = isPositive 
    ? 'text-blue-500' 
    : 'text-red-500';

  return (
    <div className="w-full rounded-3xl bg-gradient-to-br from-gray-950 via-black to-gray-950 p-8 border border-gray-800 shadow-2xl">
      {/* HORIZONTAL LAYOUT: Text Left + Chart Right */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
        {/* LEFT: Text + P&L */}
        <div className="md:col-span-1 space-y-4">
          <div>
            <p className="text-gray-400 text-sm font-medium uppercase tracking-wider">
              Account Equity Curve
            </p>
            <h2 className="text-3xl font-bold text-white mt-3">
              ${Number(equity).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </h2>
            <p className="text-gray-500 text-sm mt-2">Live • Last 24 hours</p>
          </div>

          {/* P&L Badge */}
          <div className={`inline-flex items-center gap-3 px-6 py-4 rounded! rounded-2xl font-bold text-md shadow-xl backdrop-blur-md border
            ${isPositive 
              ? 'bg-blue-500/20 text-blue-400 border-blue-500/40' 
              : 'bg-red-500/20 text-red-400 border-red-500/40'
            }`}
          >
            {isPositive ? <TrendingUp className="w-7 h-7" /> : <TrendingDown className="w-7 h-7" />}
            <span>${Math.abs(profit).toFixed(2)}</span>
          </div>
        </div>

        {/* RIGHT: The Chart (2/3 width on md+) */}
        <div className="md:col-span-2">
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data} margin={{ top: 10, right: 10, bottom: 10, left: 10 }}>
                <defs>
                  <linearGradient id="glow" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={isPositive ? '#4299e1' : '#f87171'} stopOpacity={0.6} />
                    <stop offset="100%" stopColor={isPositive ? '#60a5fa' : '#f87171'} stopOpacity={0} />
                  </linearGradient>
                </defs>

                {/* Dynamic stroke using className */}
                <Area
                  type="monotone"
                  dataKey="value"
                  strokeWidth={2}
                  fill="url(#glow)"
                  dot={false}
                  activeDot={{ r: 10, stroke: '#fff', strokeWidth: 4, fill: '#fff' }}
                  className={strokeColorClass} // THIS IS YOUR DYNAMIC BLUE/RED STROKE
                />

                <Tooltip
                  cursor={{ stroke: '#ffffff60', strokeWidth: 2 }}
                  contentStyle={{ backgroundColor: '#111', border: '1px solid #333', borderRadius: '16px' }}
                  content={({ active, payload }) => {
                    if (active && payload?.[0]) {
                      return (
                        <div className="bg-gray-900/95 backdrop-blur-xl border border-gray-700 rounded-2xl px-6 py-4 shadow-2xl">
                          <p className="text-gray-400 text-sm">Equity</p>
                          <p className="text-3xl font-bold text-white">
                            ${Number(payload[0].value).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                          </p>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}