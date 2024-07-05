import Image from "next/image";
import { Inter } from "next/font/google";
import NftCard from "@/components/NftCard";
const inter = Inter({ subsets: ["latin"] });

import networkMapping from "../constants/networkMapping.json"
import { useMoralis } from "react-moralis";
import { useNotification } from "web3uikit";
import { useQuery } from "@apollo/client";
import GET_ACTIVE_ITEMS from "@/constants/subGraphQueries";


export default function Home() {
  const {isWeb3Enabled,chainId} = useMoralis();
  const chainString = chainId ? parseInt(chainId).toString() : "31337";
  const degenmarketAddress = networkMapping[chainString].DegenMarket[0];


  const {loading,error,data:listedNfts} = useQuery(GET_ACTIVE_ITEMS);


  return (
  <main className={`flex min-h-screen flex-col items-center justify-between p-24 ${inter.className}`}>

    {isWeb3Enabled ? 
      (loading || !listedNfts ? 
        (<div> LOADING...</div>) : 
        (listedNfts.activeItems.map((nfts) => {
          const { price, nftAddress, tokenId, seller } = nfts;
          return degenmarketAddress ? 
            (<NftCard 
              price={price}
              nftAddress={nftAddress}
              degenMarketAddress={degenmarketAddress}
              tokenId={tokenId}
              seller={seller}
              key={`${nftAddress}${tokenId}`}
            />) : 
            (<div>Network error, please switch to a supported network.</div>);
        }))
      ) : 
      (<div>Web3 Currently Not Enabled</div>)
    }
  </main>
);

 
}
