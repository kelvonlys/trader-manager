'use client';

import React, { useState, useEffect } from "react";
import EquityCurvePro from "@/components/EquitySparkline";
import MiniTVChart from "@/components/MiniTVChart";

interface AccountData {
  balance: number;
  equity: number;
  profit: number;
  balance_str?: string;
  equity_str?: string;
  profit_str?: string;
}

const DataStatsOne: React.FC = () => {
  const [account, setAccount] = useState<AccountData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAccount = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/account`);
        const data = await res.json();
        if (!data.error) {
          setAccount(data);
        }
      } catch (err) {
        console.error("Failed to fetch account");
      } finally {
        setLoading(false);
      }
    };

    fetchAccount();
    const interval = setInterval(fetchAccount, 2000);
    return () => clearInterval(interval);
  }, []);

  // Fallback formatting if backend doesn't send _str
  const fmt = (val: number) => (val >= 1000 ? (val / 1000).toFixed(1) + "K" : val.toFixed(2));

  const profitPercent = account && account.balance > 0 
    ? ((account.equity - account.balance) / account.balance) * 100 
    : 0;

  if (loading || !account) {
    return <div className="text-center py-10">Loading account...</div>;
  }

  const liveProfit = account.profit;                   
  const currentEquity = account.equity;              

  return (
    <>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-3 xl:grid-cols-3 2xl:gap-7.5">

        {/* 1. Total Balance (steady) */}
        <div className="rounded-[10px] bg-white p-6 shadow-1 dark:bg-gray-dark hover:bg-gray-100 dark:hover:bg-gray-700">
          <div className="flex items-end justify-between">
            <div>
              <span className="text-body-sm font-medium text-gray-600 dark:text-gray-400">Total Balance (USD)</span>
              <h4 className="text-heading-6 font-bold text-dark dark:text-white mt-1">
                {account.balance_str || fmt(account.balance)}
              </h4>
            </div>
            <span className="text-sm text-gray-500">Base</span>
          </div>
        </div>

        {/* 2. Equity (dances live) */}
        <div className="rounded-[10px] bg-white p-6 shadow-1 dark:bg-gray-dark hover:bg-gray-100 dark:hover:bg-gray-700">
          <div className="flex items-end justify-between">
            <div>
              <span className="text-body-sm font-medium text-gray-600 dark:text-gray-400">Equity (USD)</span>
              <h4 className="text-heading-6 font-bold text-dark dark:text-white mt-1">
                {account.equity_str || fmt(account.equity)}
              </h4>
            </div>
            {/* <span className={`flex items-center gap-1 text-sm font-medium ${profitPercent >= 0 ? "text-blue-600" : "text-red-600"}`}>
              {profitPercent >= 0 ? "+" : ""}{profitPercent.toFixed(2)}%
            </span> */}
          </div>
        </div>

        {/* 3. Floating Profit */}
        <div className="rounded-[10px] bg-white p-6 shadow-1 dark:bg-gray-dark hover:bg-gray-100 dark:hover:bg-gray-700">
          <div className="flex items-end justify-between">
            <div>
              <span className="text-body-sm font-medium text-gray-600 dark:text-gray-400">Floating P&L (USD)</span>
              <h4 className={`text-heading-6 font-bold mt-1 ${account.profit >= 0 ? "text-blue-500" : "text-red-500"}`}>
                {account.profit >= 0 ? "+" : "-"}{account.profit_str || fmt(Math.abs(account.profit))}
              </h4>
            </div>
            <span className={`flex items-center gap-1.5 text-body-sm font-medium ${account.profit >= 0 ? "text-blue-500" : "text-red-500"}`}>
              {account.profit>= 0 ? (
                <svg className="fill-current w-4 h-4" viewBox="0 0 10 10"><path d="M4.35716 2.3925L0.908974 5.745L5.0443e-07 4.86125L5 -5.1656e-07L10 4.86125L9.09103 5.745L5.64284 2.3925L5.64284 10L4.35716 10L4.35716 2.3925Z"/></svg>
              ) : (
                <svg className="fill-current w-4 h-4 text-red-500" viewBox="0 0 10 10"><path d="M5.64284 7.6075L9.09102 4.255L10 5.13875L5 10L-8.98488e-07 5.13875L0.908973 4.255L4.35716 7.6075L4.35716 7.6183e-07L5.64284 9.86625e-07L5.64284 7.6075Z"/> </svg>
              )}
            </span>
          </div>
        </div>

        {/* Equity Curve */}
        {/* <div className="col-span-2">
          <EquityCurvePro equity={account.equity} profit={account.profit} />
        </div> */}

        {/* Tradingview Chart on dashboard
        <div className="col-span-2 mt-8">
          <MiniTVChart symbol="EURUSD" height={400}/>
        </div> */}

      </div>
    </>
  );
};

export default DataStatsOne;