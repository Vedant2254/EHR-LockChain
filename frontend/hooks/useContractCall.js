import { ethers } from "ethers";
import { useEffect, useState } from "react";
import { useSigner } from "wagmi";
import useValidTxnData from "./useValidTxnData";

export default function useContractCall() {
  const { contractAddress, abi, enabled } = useValidTxnData();
  const { data: signer } = useSigner();

  const [contract, setContract] = useState(null);

  useEffect(() => {
    try {
      enabled && signer && setContract(new ethers.Contract(contractAddress, abi, signer));
    } catch (err) {}
  }, [enabled, signer]);

  return { contract };
}
