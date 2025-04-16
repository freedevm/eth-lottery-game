"use client";

import { useContext, useEffect, useState } from "react";
import { AppContext } from "@/lib/providers/AppContextProvider";
import NFTMintItem from "./_components/NFTMintItem";
import { cardDescriptions } from "@/lib/constants/cardDescriptions";

export default function NFTMints() {
  const { data } = useContext(AppContext);
  console.log("##### appData => ", data);

  return (
    <div className="w-full rounded-2xl p-2 sm:px-4 sm:py-5 flex flex-col justify-center ml-auto mr-auto lg:even:ml-0 lg:odd:mr-0 relative">
      <div className="grid grid-cols-1 sm:grid-cols-2">
        {data.cards && data.cards.map((card, index) => (
          <NFTMintItem
            key={card.cardName}
            data={card}
            maxMintable={data.maxMintCount}
            stockNum={card.supplyLimits - data.mintedCounts[index]}
            description={cardDescriptions[card.cardName]}
          />
        ))}
      </div>
    </div>
  );
}