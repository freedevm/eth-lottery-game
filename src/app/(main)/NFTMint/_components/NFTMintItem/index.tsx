"use client";

import Image from "next/image";
import NumberCounter from "../NumberCounter";
import { cardImages } from "@/lib/constants/cardImages";

interface MintItemProps {
  nftName: string;
  nftPrice: number;
  handleCountChange: (value: number) => void;
  onMint: () => void;
  isLoading: boolean;
  maxMintable: number;
  description?: string;
}

export default function NFTMintItem({
  nftName,
  nftPrice,
  handleCountChange,
  onMint,
  isLoading,
  maxMintable,
  description = "Boost your chances with this exclusive NFT card!",
}: MintItemProps) {

  return (
    <div className="w-full mx-auto p-4">
      <div className="bg-purple-800 rounded-xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-xl flex flex-col sm:flex-row">
        {/* Image Container */}
        <div className="relative w-full sm:w-[300px] h-64 shrink-0">
          <Image
            src={cardImages[nftName]}
            alt={`${nftName}`}
            fill
            className="object-cover"
            sizes="(max-width: 640px) 100vw, 300px"
            priority
            quality={85}
            placeholder="blur"
            blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mN8/+F9PQAIUwNRP9fKOQAAAABJRU5ErkJggg=="
          />
        </div>

        {/* Content Container */}
        <div className="flex-1 p-4 flex flex-col gap-4">
          {/* NFT Info - Top */}
          <div className="space-y-2">
            <h3 className="text-lg font-semibold text-white truncate uppercase">
              {nftName} card - {nftPrice} ETH
            </h3>
            <h3 className="text-md font-semibold text-white truncate uppercase">
              {(maxMintable !== 0) ? `${maxMintable} in stock` : "out of stock"} 
            </h3>
            <p className="text-sm text-gray-300 line-clamp-3">{description}</p>
          </div>

          {/* Spacer */}
          <div className="flex-1" />

          {/* Controls - Bottom */}
          <div className="flex justify-between">
            <NumberCounter
              min={0}
              max={maxMintable}
              initialValue={0}
              onChange={handleCountChange}
            />
            <button
              onClick={onMint}
              disabled={isLoading}
              className="w-full max-w-xs px-6 py-2 bg-purple-600 text-white font-semibold rounded-lg shadow-md hover:bg-purple-500 active:bg-purple-700 disabled:bg-purple-400 disabled:cursor-not-allowed transition-all duration-200"
            >
              {isLoading ? "Processing..." : "Mint"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}