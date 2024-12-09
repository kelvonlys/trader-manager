'use client';
import { WATCHLIST } from "@/types/watchlist";
import Image from "next/image";
import Link from 'next/link';
import ButtonDefault from "@/components/Buttons/ButtonDefault";
import { useWebSocket } from "@/lib/websocket";
import FormattedPrice from "@/components/Layouts/FormattedPrice";

const watchlistData: WATCHLIST[] = [
  {
    logoTop: "/images/instruments/btc.svg",
    logoBottom: "/images/instruments/usd.svg",
    pair: "BTCUSD",
    bid: 2625.34,
    ask: 2625.44,
    spread: 0.11,
  },
  {
    logoTop: "/images/instruments/eu.svg",
    logoBottom: "/images/instruments/usd.svg",
    pair: "EURUSD",
    bid: 2625.34,
    ask: 2625.44,
    spread: 0.11,
  },
  // {
  //   logoTop: "/images/instruments/xau.svg",
  //   logoBottom: "/images/instruments/usd.svg",
  //   pair: "XAUUSD",
  //   bid: 2625.34,
  //   ask: 2625.44,
  //   spread: 0.11,
  // },
  // {
  //   logoTop: "/images/instruments/btc.svg",
  //   logoBottom: "/images/instruments/usd.svg",
  //   pair: "BTCUSD",
  //   bid: 2625.34,
  //   ask: 2625.44,
  //   spread: 0.11,
  // },
  // Add more pairs as needed
];

const WatchlistTable = () => {
  return (
    <div className="rounded-[10px] bg-white px-7.5 pb-4 pt-7.5 shadow-1 dark:bg-gray-dark dark:shadow-card">
      <h4 className="mb-5.5 text-body-2xlg font-bold text-dark dark:text-white">
        Instrument  
      </h4>

      <div className="flex flex-col">
        <div className="grid grid-cols-3 md:grid-cols-5">
          <div className="px-2 pb-3.5">
            <h5 className="text-sm font-medium uppercase xsm:text-base">
              Symbol
            </h5>
          </div>
          <div className="hidden px-2 pb-3.5 text-center md:block">
            <h5 className="text-sm font-medium uppercase xsm:text-base">
              Bid
            </h5>
          </div>
          <div className="hidden px-2 pb-3.5 text-center md:block">
            <h5 className="text-sm font-medium uppercase xsm:text-base">
              Ask
            </h5>
          </div>
          <div className="px-2 pb-3.5 text-center">
            <h5 className="text-sm font-medium uppercase xsm:text-base">
              Spread
            </h5>
          </div>
          <div className="px-2 pb-3.5 text-center">
            <h5 className="text-sm font-medium uppercase xsm:text-base">
              
            </h5>
          </div>
        </div>

        {watchlistData.map((pair, key) => (
          <WatchlistRow key={key} pair={pair} />
        ))}
      </div>
    </div>
  );
};

const WatchlistRow = ({ pair }: { pair: WATCHLIST }) => {
  const priceData = useWebSocket(pair.pair);

  const bidClass = getPriceClass(priceData?.bid, priceData?.previous_bid);
  const askClass = getPriceClass(priceData?.ask, priceData?.previous_ask);

  console.log("Current Bid:", priceData?.bid, "Previous Bid:", priceData?.previous_bid);
  console.log("Current Ask:", priceData?.ask, "Previous Ask:", priceData?.previous_ask);


  return (
    <div
      className={`grid grid-cols-3 md:grid-cols-5 ${
        pair === watchlistData.length - 1
          ? ""
          : "border-b border-stroke dark:border-dark-3"
      }`}
    >
      <div className="flex items-center gap-3.5 px-2 py-4">
        <div className="flex-shrink-0 h-12">
          <Image
            alt="First Symbol"
            className="boxShadowWhite rounded-full"
            src={pair.logoTop}
            width={30} height={30} />
          <Image
            alt="Second Symbol"
            className="transform translate-x-1/2 -translate-y-1/2 z-20 boxShadowWhite rounded-full"
            src={pair.logoBottom}
            width={30}
            height={30}
          />
        </div>
        <p className="hidden font-medium text-dark dark:text-white sm:block ml-3">
          {pair.pair}
        </p>
      </div>
      <div className="hidden items-center justify-center px-2 py-4 md:flex">
        <p className={`font-medium ${bidClass || 'text-dark dark:text-white'}`}>
          <FormattedPrice current={priceData?.bid || pair.bid} previous={priceData?.previous_bid} />
        </p>
      </div>

      <div className="hidden items-center justify-center px-2 py-4 md:flex">
        <p className={`font-medium ${askClass || 'text-dark dark:text-white'}`}>
          <FormattedPrice current={priceData?.ask || pair.ask} previous={priceData?.previous_ask} />
        </p>
      </div>

      <div className="flex items-center justify-center px-2 py-4">
        <p className="font-medium text-dark dark:text-white">
          {priceData?.spread || pair.spread}
        </p>
      </div>

      <div className="flex items-center justify-center px-2 py-4">
        <ButtonDefault
          label="Trade"
          link="/"
          customClasses="bg-blue-700 text-white px-10 py-3.5 lg:px-8 xl:px-10"
        />
      </div>
    </div>
  );
};

const getPriceClass = (current, previous) => {
  if (previous === null || previous === undefined) {
    return '';
  }
  return current > previous ? 'text-blue-500' : current < previous ? 'text-red-500' : '';
};

function addCommas(number) {
    return number.toString().replace(/\B(?=(\d{3})+\b)/g, ",");
}

export default WatchlistTable;


// const WatchlistTable = () => {
//   return (
//     <div className="rounded-[10px] bg-white px-7.5 pb-4 pt-7.5 shadow-1 dark:bg-gray-dark dark:shadow-card">
//       <h4 className="mb-5.5 text-body-2xlg font-bold text-dark dark:text-white">
//         Instrument  
//       </h4>

//       <div className="flex flex-col">
//         <div className="grid grid-cols-3 md:grid-cols-5">
          // <div className="px-2 pb-3.5">
          //   <h5 className="text-sm font-medium uppercase xsm:text-base">
          //     Symbol
          //   </h5>
          // </div>
          // <div className="hidden px-2 pb-3.5 text-center md:block">
          //   <h5 className="text-sm font-medium uppercase xsm:text-base">
          //     Bid
          //   </h5>
          // </div>
          // <div className="hidden px-2 pb-3.5 text-center md:block">
          //   <h5 className="text-sm font-medium uppercase xsm:text-base">
          //     Ask
          //   </h5>
          // </div>
          // <div className="px-2 pb-3.5 text-center">
          //   <h5 className="text-sm font-medium uppercase xsm:text-base">
          //     Spread
          //   </h5>
          // </div>
          // <div className="px-2 pb-3.5 text-center">
          //   <h5 className="text-sm font-medium uppercase xsm:text-base">
              
          //   </h5>
          // </div>
//         </div>

//         {watchlistData.map((pair, key) => (
//           <div
//             className={`grid grid-cols-3 md:grid-cols-5 ${
//               key === watchlistData.length - 1
//                 ? ""
//                 : "border-b border-stroke dark:border-dark-3"
//             }`}
//             key={key}
//           >
//             <div className="flex items-center gap-3.5 px-2 py-4">
//               <div className="flex-shrink-0 h-12">
//                 <Image
//                   alt="First Symbol"
//                   className="boxShadowWhite rounded-full"
//                   src={pair.logoTop}
//                   width={30} height={30} />
//                 <Image
//                   alt="Second Symbol"
//                   className="transform translate-x-1/2 -translate-y-1/2 z-20 boxShadowWhite rounded-full"
//                   src={pair.logoBottom}
//                   width={30}
//                   height={30}
//                 />
//               </div>
//               <p className="hidden font-medium text-dark dark:text-white sm:block ml-3">
//                 {pair.pair}
//               </p>
//             </div>
//             <div className="hidden items-center justify-center px-2 py-4 md:flex">
//               <p className="font-medium text-dark dark:text-white">
//                 {pair.bid}
//               </p>
//             </div>

//             <div className="hidden items-center justify-center px-2 py-4 md:flex">
//               <p className="font-medium text-green-light-1">
//                 {pair.ask}
//               </p>
//             </div>

//             <div className="flex items-center justify-center px-2 py-4">
//               <p className="font-medium text-dark dark:text-white">
//                 {pair.spread}
//               </p>
//             </div>

//             <div className="flex items-center justify-center px-2 py-4">
//                 <ButtonDefault
//                   label="Trade"
//                   link="/"
//                   customClasses="bg-blue-700 text-white px-10 py-3.5 lg:px-8 xl:px-10"
//                 />
              
//             </div>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// };

// export default WatchlistTable;
