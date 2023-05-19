import useValidTxnData from "./useValidTxnData";
import { useContractRead } from "wagmi";

export default function useIsPatient(address) {
  const { contractAddress, enabled, contractAbi } = useValidTxnData();

  const {
    data: isPatient,
    isFetched,
    refetch: runIsPatient,
  } = useContractRead({
    address: contractAddress,
    abi: contractAbi,
    functionName: "isPatient",
    args: [address],
    enabled: enabled && address,
  });

  return { isPatient, isFetched, runIsPatient };
}
