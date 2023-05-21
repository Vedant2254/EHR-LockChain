import { useContractEvent } from "wagmi";
import useValidTxnData from "./useValidTxnData";

export default function useContractEvents(eventName, listener, once) {
  const { contractAddress, contractAbi } = useValidTxnData();

  useContractEvent({
    address: contractAddress,
    abi: contractAbi,
    eventName,
    listener,
    once,
  });
}
