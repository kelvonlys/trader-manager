'use client';
import { WATCHLIST } from "@/types/watchlist";
import Image from "next/image";
import ButtonDefault from "@/components/Buttons/ButtonDefault";
import { useWebSocket } from "@/lib/websocket";
import FormattedPrice from "@/components/Layouts/FormattedPrice";
import PopupBox from "@/components/Popup/BasicPopup"
import { useState } from 'react';
import { useEffect } from "react";
import TradePopupBox from "@/components/Popup/TradePopup";

const watchlistData: WATCHLIST[] = [
  {
    logoTop: "/images/instruments/au.svg",
    logoBottom: "/images/instruments/usd.svg",
    pair: "AUDUSD",
    pairName: "Australian Dolloar To US Dollar",
    bid: 0.6443,
    ask: 0.6444,
    spread: 0.01,
    day_change_pct: 0.5,
  },
  {
    logoTop: "/images/instruments/eu.svg",
    logoBottom: "/images/instruments/usd.svg",
    pair: "EURUSD",
    pairName: "European Dolloar To US Dollar",
    bid: 1.1539,
    ask: 1.1539,
    spread: 0.02,
    day_change_pct: 0.2,
  },
  // {
  //   logoTop: "/images/instruments/eu.svg",
  //   logoBottom: "/images/instruments/usd.svg",
  //   pair: "EURUSD",
  //   bid: 2625.34,
  //   ask: 2625.44,
  //   spread: 0.11,
  //   day_change_pct: 0.5,
  // },
  // {
  //   logoTop: "/images/instruments/eu.svg",
  //   logoBottom: "/images/instruments/usd.svg",
  //   pair: "EURUSD",
  //   bid: 2625.34,
  //   ask: 2625.44,
  //   spread: 0.11,
  //   day_change_pct: 0.5,
  // },
  // Add more pairs as needed
];

const WatchlistTable = () => {
  return (
    <div className="rounded-xl bg-white px-7.5 pb-4 pt-7.5 shadow-1 dark:bg-gray-dark dark:shadow-card">
      <h5 className="mb-5.5 text-xl font-bold text-dark dark:text-white">
        Instrument
      </h5>
      <div className="flex flex-col mb-1.5">
        <div className="grid grid-cols-2 md:grid-cols-5 xl:grid-cols-7">
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
          <div className="hidden px-2 pb-3.5 text-center md:block">
            <h5 className="text-sm font-medium uppercase xsm:text-base">
              Spread
            </h5>
          </div>
          <div className="hidden px-2 pb-3.5 text-center xl:block">
            <h5 className="text-sm font-medium uppercase xsm:text-base">
              Change Percentage
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
  // const priceData = "test"
  const bidClass = getPriceClass(priceData?.bid, priceData?.previous_bid);
  const askClass = getPriceClass(priceData?.ask, priceData?.previous_ask);

  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const openPopup = () => setIsPopupOpen(true);
  const closePopup = () => setIsPopupOpen(false);


  const [isTradePopupOpen, setIsTradePopupOpen] = useState(false);
  const openTradePopup = () => setIsTradePopupOpen(true);
  const closeTradePopup = () => setIsTradePopupOpen(false);

  return (
    <div className="py-0.5">
      <div className={`grid grid-cols-2 md:grid-cols-5 xl:grid-cols-7 hover:bg-gray-100 dark:hover:bg-gray-700 group hover:rounded-lg`}>
        <div className="flex items-center gap-3.5 px-2 py-4 col-span-1.5">
          <div className="flex-shrink-0 h-12 relative">
            <Image
              alt="First Symbol"
              className="boxShadowWhite rounded-full"
              src={pair.logoTop}
              width={30}
              height={30}
            />
            <Image
              alt="Second Symbol"
              className="transform translate-x-1/2 -translate-y-1/2 z-20 boxShadowWhite rounded-full"
              src={pair.logoBottom}
              width={30}
              height={30}
            />
          </div>
          <div className="ml-3 flex-grow w-[200px] min-w-0">
            <p className="font-medium text-dark dark:text-white sm:block truncate">
              {pair.pairName}
            </p>
            <button disabled className="font-normal mt-1 px-2 py-1.5 text-xs bg-gray-700 text-white rounded-lg group-hover:bg-blue-700 focus:outline-none focus:ring focus:ring-blue-300">
              {pair.pair}
            </button>
          </div>
        </div>
        <div className="hidden items-center justify-center px-2 py-4 md:flex col-span-1">
          <p className={`font-medium ${bidClass || 'text-dark dark:text-white'}`}>
            <FormattedPrice current={priceData?.bid || pair.bid} previous={priceData?.previous_bid} />
          </p>
          <div className="ml-1 font-thin text-xs text-dark dark:text-gray">USD</div>
        </div>
        <div className="hidden items-center justify-center px-2 py-4 md:flex col-span-1">
          <p className={`font-medium ${askClass || 'text-dark dark:text-white'}`}>
            <FormattedPrice current={priceData?.ask || pair.ask} previous={priceData?.previous_ask} />
          </p>
          <div className="ml-1 font-thin text-xs text-dark dark:text-gray">USD</div>
        </div>
        <div className="hidden items-center justify-center px-2 py-4 md:flex col-span-1">
          <p className="font-medium text-dark dark:text-white">
            {priceData?.spread ?? pair.spread} 
          </p>
          <div className="ml-1 font-thin text-xs text-dark dark:text-gray">pips</div>
        </div>
        <div className={`
          hidden items-center justify-center px-2 py-4 xl:flex col-span-1
          ${getChangeColor(priceData?.day_change_pct || pair.day_change_pct)}`}>
          {priceData?.day_change_pct || pair.day_change_pct} %
        </div>
        
        {/* <div className="flex items-center justify-center px-2 py-4 col-span-1">
          <ButtonDefault
            label="Manage"
            // onClick={() => { alert("Manage button clicked!"); }}
            onClick={openPopup}
            customClasses="bg-blue-700 text-white px-10 py-3 text-xs sm:px-4"
          />
          <PopupBox isOpen={isPopupOpen} onClose={closePopup} />
        </div> */}
        <div className="flex items-center justify-center px-2 py-4 col-span-1">
          <ButtonDefault
            label="Trade"
            // onClick={() => { alert("Manage button clicked!"); }}
            onClick={openTradePopup}
            customClasses="bg-blue-700 text-white px-10 py-3 text-xs sm:px-4"
          />
          <TradePopupBox
            isOpen={isTradePopupOpen}
            onClose={closeTradePopup}
            bid={priceData?.bid}
            ask={priceData?.ask}
          />
        </div>
      </div>
      
    </div>
    
  );
};

const getPriceClass = (current: number | undefined, previous: number | undefined): string => {
  if (previous === null || previous === undefined || current === undefined) {
    return '';
  }
  return current > previous ? 'text-blue-500' : current < previous ? 'text-red-500' : '';
};

function addCommas(number: { toString: () => string; }) {
  return number.toString().replace(/\B(?=(\d{3})+\b)/g, ",");
}

const getChangeColor = (value: number) => {
  if (value > 0) {
    return 'text-blue-500';
  } else if (value < 0) {
    return 'text-red-500';
  } else {
    return 'text-white'; // or any default color for zero or undefined
  }
};

export default WatchlistTable;
