import { useMoralis, useWeb3Contract } from "react-moralis";

import degenMarket from "../constants/DegenMarket.json";

import nftAbi from "../constants/BasicNft.json";
import Image from "next/image";
const { useState, useEffect } = require("react");

import { Card, useNotification } from "web3uikit";
import { ethers } from "ethers";
import UpdateListingModal from "./UpdateListingModal";


export default function NftCard({ price, nftAddress, degenMarketAddress,tokenId, seller }) {
 
  const { isWeb3Enabled, account } = useMoralis()
  const [imageUri, setImageUri] = useState("");
  const [tokenName, setTokenName] = useState("");
  const [tokenDesc, setTokenDesc] = useState("");
  const [showModal,setShowModal] = useState(false);
  const hideModal = ()=> setShowModal(false)
  const dispatch = useNotification()

  const { runContractFunction: getTokenUri } = useWeb3Contract({
    abi: nftAbi,
    contractAddress: nftAddress,
    functionName: "tokenURI()",

  });


  const {runContractFunction : buyItem } = useWeb3Contract({
    abi:degenMarket,
    contractAddress:degenMarketAddress,
    functionName:"buyItem",
    msgValue:price,
    params:{
      nftAddress:nftAddress,
      tokenId:tokenId
    }
  })

  async function updateUi() {
    const tokenUri = await getTokenUri();
    if (tokenUri) {
      const requestUrl = tokenUri.replace("ipfs://", "https://ipfs.io/ipfs/");
      const tokenUrl = await (await fetch(requestUrl)).json();
      const imageUri = tokenUrl.image;
      const imageUriUrl = imageUri.replace("ipfs://", "https://ipfs.io/ipfs/");
      setImageUri(imageUriUrl);
      setTokenName(tokenUrl.name);
      setTokenDesc(tokenUrl.description);
    }
   
  }

  useEffect(() => {
    if (isWeb3Enabled) {
      updateUi();
    }
  }, [isWeb3Enabled]);

  const isOwnedByUser = seller === account || seller === undefined
    // const formattedSellerAddress = isOwnedByUser ? "you" : 
  console.log(typeof seller);
  const handleCardClick = () => {
        isOwnedByUser
            ? setShowModal(true)
            : buyItem({
                  onError: (error) => console.log(error),
                  onSuccess: () => handleBuyItemSuccess(),
              })
    }

    const handleBuyItemSuccess = () => {
        dispatch({
            type: "success",
            message: "Item bought!",
            title: "Item Bought",
            position: "topR",
        })
    }

  return (
    <div className="container mx-auto" > 
      <h1 className="py-4 px-4 font-bold text-2xl">Recently Listed</h1>

      {imageUri ? (
        <div className="w-30">
          <UpdateListingModal
            isVisible={showModal}
            tokenId={tokenId}
            degenMarketAddress={degenMarketAddress}
            nftAddress={nftAddress}
            onClose={hideModal}
          />
          <Card title={tokenName} description={tokenDesc} onClick={handleCardClick}>
            <div className="flex flex-col items-center ">
              <div>#{tokenId}</div>
              <Image
                loader={() => imageUri}
                src={imageUri}
                height="200"
                width="200"
              ></Image>
              <div className="italic text-sm">Owner: {seller}</div>
              <div className="font-bold">
              {ethers.utils.formatEther(price)} ETH
              </div>
            </div>
          </Card>
        </div>
      ) : (
        <div>Loading...</div>
      )}
    </div>
  );
}
