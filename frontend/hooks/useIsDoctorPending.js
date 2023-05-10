import useValidTxnData from "./useValidTxnData";
import { useContractRead } from "wagmi";

export default function useIsDoctorPending(address) {
  const { contractAddress, enabled, contractAbi } = useValidTxnData();

  const { data: isDoctorPending, refetch: runIsDoctorPending } = useContractRead({
    address: contractAddress,
    abi: contractAbi,
    functionName: "isDrPending",
    args: [address],
    enabled: enabled && address,
  });

  return { isDoctorPending, runIsDoctorPending };
}
