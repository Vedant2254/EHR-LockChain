import { ethers } from "ethers";
import { useEffect, useState } from "react";
import { useWalletClient } from "wagmi";
import useValidTxnData from "./useValidTxnData";

export default function useContractCall() {
  const { contractAddress, contractAbi, enabled } = useValidTxnData();
  const { data: signer } = useWalletClient();

  const [contract, setContract] = useState(null);

  useEffect(() => {
    try {
      enabled && signer && setContract(new ethers.Contract(contractAddress, contractAbi, signer));
    } catch (err) {}
  }, [enabled, signer, contractAddress, contractAbi]);

  return { contract };
}
