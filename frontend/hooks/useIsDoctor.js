import useValidTxnData from "./useValidTxnData";
import { useContractRead } from "wagmi";

export default function useIsDoctor(address) {
  const { contractAddress, enabled, abi } = useValidTxnData();

  const { data: isDoctor, refetch: runIsDoctor } = useContractRead({
    address: contractAddress,
    abi,
    functionName: "isDoctor",
    args: [address],
    enabled: enabled && address,
  });

  return { isDoctor, runIsDoctor };
}
