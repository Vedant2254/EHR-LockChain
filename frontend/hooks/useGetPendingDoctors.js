import { useContractRead } from "wagmi";
import useValidTxnData from "@/hooks/useValidTxnData";

export default function useGetPendingDoctors() {
  const { contractAddress, contractAbi, enabled } = useValidTxnData();

  const { data: pendingDoctors } = useContractRead({
    address: contractAddress,
    abi: contractAbi,
    functionName: "getPendingDrs",
    enabled,
  });

  return { pendingDoctors };
}
