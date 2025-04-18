import { cardImages } from "@/lib/constants/cardImages";
import Image from "next/image";
import { useEffect, useState } from "react";

interface Props {
  index: number;
  nftName: string;
  boostValue: number;
  userNFTs: number[];
  boostCards: {id:number; count:number}[];
  setBoostCards: React.Dispatch<
    React.SetStateAction<{ id: number; count: number }[]>
  >;
  setBoostCount: React.Dispatch<
  React.SetStateAction<number>
>;
}

export default function NFTBoostCard({ index, nftName, boostValue, userNFTs, boostCards, setBoostCards, setBoostCount }: Props) {
  // Initialize count state
  const [count, setCount] = useState(0);

  useEffect(() => {
    const updatedCards = boostCards.filter(item => item.id !== index);
    setBoostCards([
      ...updatedCards,
      {id: index, count: count}
    ])

  }, [count, index, setBoostCards]);

  const handleIncrement = () => {
    if (count < userNFTs[index]) {
      setCount((prev) => prev + 1);
      setBoostCount((prev) => prev + boostValue);
    }
  };

  const handleDecrement = () => {
    if (count > 0) {
      setCount((prev) => prev - 1);
      setBoostCount((prev) => prev - boostValue);
    }
  };

  return (
    <div
      role="button"
      tabIndex={0}
      className="bg-purple-700 rounded-lg flex flex-col items-center relative cursor-pointer pb-1"
    >
      <div className="w-full h-28 relative rounded-md mb-2 overflow-hidden">
        <Image
          src={cardImages[nftName]}
          alt={`${nftName} card`}
          fill
        />
      </div>
      <p className="text-sm text-white">{nftName.toUpperCase()} : {userNFTs[index]}</p>
      {/* Counter */}
      <div className="w-full flex justify-center">
        <div className="inline-flex items-center overflow-hidden shadow-sm">
          <button
            onClick={handleDecrement}
            disabled={count === 0}
            className="rounded-lg w-7 h-7 flex items-center justify-center text-white text-lg font-semibold hover:bg-purple-500 active:bg-purple-600 disabled:cursor-not-allowed transition-colors duration-200"
          >
            -
          </button>

          <input
            type="number"
            value={count}
            readOnly
            className="w-14 h-7 text-center bg-purple-700 text-white text-lg px-2 focus:outline-none focus:ring-2 focus:ring-purple-700 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
          />

          <button
            onClick={handleIncrement}
            disabled={count >= userNFTs[index]}
            className="rounded-lg w-7 h-7 flex items-center justify-center text-white text-lg font-semibold hover:bg-purple-500 active:bg-purple-600 disabled:cursor-not-allowed transition-colors duration-200"
          >
            +
          </button>
        </div>
      </div>
    </div>
  );
}