import BasicChart from "@/components/Charts/BasicChart";
import { Metadata } from "next";
import DefaultLayout from "@/components/Layouts/DefaultLaout";
import React from "react";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import TradingViewWidget from '@/app/charts/basic-chart/tradingview-widget';


export default function TradingviewChart() {
  return (
    <DefaultLayout>
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