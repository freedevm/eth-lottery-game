"use client";

import {
  ReactNode,
  SetStateAction,
  createContext,
  useEffect,
  useState,
} from "react";
import { toast } from "react-toastify";
import { useAccount, useChainId, useBalance } from "wagmi";
import PreLoading from "@/components/PreLoading";

// Define the shape of an NFT
export interface NFT {
  id: string;
  name: string; // e.g., "diamond", "platinum", etc.
  imageUrl: string;
  count?: number; // Optional count for boosting
}

interface ContextData {
  network: number | null;
  userAddress: string | null;
  userBalance: string | null;
  isWalletConnected: boolean;
  currentJackpot: string | null;
  userTickets: number;
  lotteryStatus: "active" | "closed" | "pending" | null;
  lastWinner: string | null;
  isNFTHolder: boolean;
  participatedJackpots: string[];
  userNFTCount: number;
  userNFTs: NFT[];
  boostedNFTs: { [jackpotId: string]: NFT[] }; // Store boosted NFTs per jackpot
}

const initialData: ContextData = {
  network: null,
  userAddress: null,
  userBalance: null,
  isWalletConnected: false,
  currentJackpot: null,
  userTickets: 0,
  lotteryStatus: null,
  lastWinner: null,
  isNFTHolder: false,
  participatedJackpots: [],
  userNFTCount: 0,
  userNFTs: [],
  boostedNFTs: {},
};

export const AppContext = createContext<{
  data: ContextData;
  setData: (data: Partial<ContextData>) => void;
  setDataT: (value: SetStateAction<ContextData>) => void;
  addParticipation: (jackpotId: string) => Promise<boolean>;
  mintNFTs: (nfts: { name: string; count: number }[]) => Promise<boolean>;
  boostNFTs: (jackpotId: string, nfts: NFT[]) => Promise<boolean>;
}>({
  data: initialData,
  setData: () => {},
  setDataT: () => {},
  addParticipation: async () => false,
  mintNFTs: async () => false,
  boostNFTs: async () => false,
});

export const AppContextProvider = ({ children }: { children: ReactNode }) => {
  const [data, setDataT] = useState<ContextData>(initialData);
  const [firstLoad, setFirstLoad] = useState(true);
  const [loading, setLoading] = useState(true);

  const chainId = useChainId();
  const account = useAccount();
  const { data: balanceData } = useBalance({
    address: account.address,
  });

  const setData = (d: Partial<ContextData>) =>
    setDataT((prevData) => ({ ...prevData, ...d }));

  const addParticipation = async (jackpotId: string): Promise<boolean> => {
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setDataT((prev) => ({
        ...prev,
        userTickets: prev.userTickets + 1,
        participatedJackpots: [...prev.participatedJackpots, jackpotId],
      }));
      return true;
    } catch (error) {
      console.error("Failed to add participation:", error);
      return false;
    }
  };

  const mintNFTs = async (nfts: { name: string; count: number }[]): Promise<boolean> => {
    if (!account.isConnected) {
      console.error("Wallet not connected");
      return false;
    }

    try {
      await new Promise((resolve) => setTimeout(resolve, 2000));
      let newNFTs: NFT[] = [];
      let totalCount = 0;

      nfts.forEach(({ name, count }) => {
        totalCount += count;
        for (let i = 0; i < count; i++) {
          newNFTs.push({
            id: `${data.userNFTCount + newNFTs.length + 1}`,
            name: name.toLowerCase(), // Ensure consistent casing
            imageUrl: `https://via.placeholder.com/150?text=${name}`,
          });
        }
      });

      setDataT((prev) => ({
        ...prev,
        userNFTCount: prev.userNFTCount + totalCount,
        userNFTs: [...prev.userNFTs, ...newNFTs],
        isNFTHolder: true,
        userTickets: prev.userTickets + totalCount * 2,
      }));
      return true;
    } catch (error) {
      console.error("Failed to mint NFTs:", error);
      return false;
    }
  };

  const boostNFTs = async (jackpotId: string, nfts: NFT[]): Promise<boolean> => {
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setDataT((prev) => ({
        ...prev,
        boostedNFTs: {
          ...prev.boostedNFTs,
          [jackpotId]: nfts,
        },
      }));
      return true;
    } catch (error) {
      console.error("Failed to boost NFTs:", error);
      return false;
    }
  };

  useEffect(() => {
    if (data !== initialData) {
      localStorage.setItem("lottery-app-data", JSON.stringify(data));
    }
  }, [data]);

  useEffect(() => {
    const appDataJson = localStorage.getItem("lottery-app-data");
    if (appDataJson) {
      const appData = JSON.parse(appDataJson) as ContextData;
      setData(appData);
    }
  }, []);

  useEffect(() => {
    if (account.isConnected && account.address) {
      setData({
        network: chainId,
        userAddress: account.address,
        userBalance: balanceData?.formatted || "0",
        isWalletConnected: true,
        isNFTHolder: data.userNFTCount > 0,
      });
    } else {
      setData({
        network: null,
        userAddress: null,
        userBalance: null,
        isWalletConnected: false,
        isNFTHolder: false,
        participatedJackpots: [],
        userNFTCount: 0,
        userNFTs: [],
        boostedNFTs: {},
      });
    }
  }, [account.isConnected, account.address, chainId, balanceData, data.userNFTCount]);

  useEffect(() => {
    (async function init() {
      if (!firstLoad) return;
      setLoading(true);

      try {
        const mockJackpot = "10.5";
        const mockStatus = "active";
        const mockLastWinner = "0x123...abc";
        const mockUserTickets = account.isConnected ? 5 : 0;

        setData({
          currentJackpot: mockJackpot,
          lotteryStatus: mockStatus,
          lastWinner: mockLastWinner,
          userTickets: mockUserTickets,
        });
      } catch (error) {
        toast.error("Failed to load lottery data!");
        console.error(error);
      }
    })();
  }, [firstLoad, account.isConnected]);

  useEffect(() => {
    if (!account.isConnected) return;

    setData({ network: chainId });

    const supportedChains = [1, 11155111];
    if (!supportedChains.includes(chainId)) {
      toast.error("Please switch to a supported network (Ethereum Mainnet or Sepolia).");
    }
  }, [chainId, account.isConnected]);

  if (firstLoad && loading) {
    return (
      <PreLoading
        loading={firstLoad || loading}
        setLoading={setLoading}
        setFirstLoad={setFirstLoad}
      />
    );
  }

  return (
    <AppContext.Provider
      value={{
        data,
        setData,
        setDataT,
        addParticipation,
        mintNFTs,
        boostNFTs,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};