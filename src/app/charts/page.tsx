import BasicChart from "@/components/Charts/BasicChart";
import { Metadata } from "next";
import DefaultLayout from "@/components/Layouts/DefaultLaout";
import React from "react";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import TradingViewWidget from "./basic-chart/tradingview-widget"

export const metadata: Metadata = {
  title: "Next.js Basic Chart Page | NextAdmin - Next.js Dashboard Kit",
  description: "This is Next.js Basic Chart page for NextAdmin Dashboard Kit",
  // other metadata
};

export default function TradingviewChart() {
  return (
    <DefaultLayout>
      <h1>My TradingView Widget</h1>
      <TradingViewWidget />
    </DefaultLayout>
  );
}

// const BasicChartPage: React.FC = () => {
//   return (
//     <DefaultLayout>
//       <Breadcrumb pageName="Basic Chart" />

//       <BasicChart />
//     </DefaultLayout>
//   );
// };

// export default BasicChartPage;