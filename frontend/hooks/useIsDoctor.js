import useValidTxnData from "./useValidTxnData";
import { useContractRead } from "wagmi";

export default function useIsDoctor(address) {
  const { contractAddress, enabled, contractAbi } = useValidTxnData();

  const { data: isDoctor, refetch: runIsDoctor } = useContractRead({
    address: contractAddress,
    abi: contractAbi,
    functionName: "isDoctor",
    args: [address],
    enabled: enabled && address,
  });

  return { isDoctor, runIsDoctor };
}
