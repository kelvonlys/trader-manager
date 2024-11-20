import { INSTRUMENT } from "@/types/instrument";
import Image from "next/image";

const instrumentData: INSTRUMENT[] = [
  {
    logoTop: "/images/instruments/xau.svg",
    logoBottom: "/images/instruments/usd.svg",
    pair: "Gold",
    bid: 2625.34,
    ask: 2625.44,
    spread: 0.11,
  },
  {
    logoTop: "/images/instruments/eu.svg",
    logoBottom: "/images/instruments/usd.svg",
    pair: "Gold",
    bid: 2625.34,
    ask: 2625.44,
    spread: 0.11,
  },
  {
    logoTop: "/images/instruments/xau.svg",
    logoBottom: "/images/instruments/usd.svg",
    pair: "Gold",
    bid: 2625.34,
    ask: 2625.44,
    spread: 0.11,
  },
  
];

const TableOne = () => {
  return (
    <div className="rounded-[10px] bg-white px-7.5 pb-4 pt-7.5 shadow-1 dark:bg-gray-dark dark:shadow-card">
      <h4 className="mb-5.5 text-body-2xlg font-bold text-dark dark:text-white">
        Instrument  
      </h4>

      <div className="flex flex-col">
        <div className="grid grid-cols-3 sm:grid-cols-5">
          <div className="px-2 pb-3.5">
            <h5 className="text-sm font-medium uppercase xsm:text-base">
              Pairs
            </h5>
          </div>
          <div className="px-2 pb-3.5 text-center">
            <h5 className="text-sm font-medium uppercase xsm:text-base">
              Bid
            </h5>
          </div>
          <div className="px-2 pb-3.5 text-center">
            <h5 className="text-sm font-medium uppercase xsm:text-base">
              Ask
            </h5>
          </div>
          <div className="px-2 pb-3.5 text-center">
            <h5 className="text-sm font-medium uppercase xsm:text-base">
              Spread
            </h5>
          </div>
        </div>

        {instrumentData.map((pair, key) => (
          <div
            className={`grid grid-cols-3 sm:grid-cols-5 ${
              key === instrumentData.length - 1
                ? ""
                : "border-b border-stroke dark:border-dark-3"
            }`}
            key={key}
          >
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="relative w-[48px] h-[48px]">
                  <Image 
                    className="absolute inset-0 flex items-center justify-center transform translate-x-3 z-10 boxShadowWhite rounded-full" 
                    src={pair.logoTop} 
                    alt="pair" 
                    width={28} 
                    height={28} 
                  />
                </div>
                <div className="relative w-[48px] h-[48px] ">
                  <Image 
                    className="absolute inset-0 flex items-center justify-center transform -translate-x-2/3 translate-y-1/2 z-20 boxShadowWhite rounded-full" 
                    src={pair.logoBottom} 
                    alt="pair" 
                    width={28} 
                    height={28} 
                  />
                </div>
              </div>
            </div>


            <div className="flex items-center justify-center px-2 py-4">
              <p className="font-medium text-dark dark:text-white">
                {pair.bid}
              </p>
            </div>

            <div className="flex items-center justify-center px-2 py-4">
              <p className="font-medium text-green-light-1">
                {pair.ask}
              </p>
            </div>

            <div className="hidden items-center justify-center px-2 py-4 sm:flex">
              <p className="font-medium text-dark dark:text-white">
                {pair.spread}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TableOne;
