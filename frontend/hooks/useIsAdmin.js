import useValidTxnData from "./useValidTxnData";
import { useContractRead } from "wagmi";

export default function useIsAdmin(address) {
  const { contractAddress, enabled, contractAbi } = useValidTxnData();

  const { data: isAdmin, isFetched } = useContractRead({
    address: contractAddress,
    abi: contractAbi,
    functionName: "isAdmin",
    args: [address],
    enabled: enabled && address,
  });

  return { isAdmin, isFetched };
}
