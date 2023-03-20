import { useContractRead } from "wagmi";
import useValidTxnData from "@/hooks/useValidTxnData";

export default function useGetPendingDoctors() {
  const { contractAddress, abi, enabled } = useValidTxnData();

  const { data: pendingDoctors } = useContractRead({
    address: contractAddress,
    abi,
    functionName: "getPendingDrs",
    enabled,
  });

  return { pendingDoctors };
}
