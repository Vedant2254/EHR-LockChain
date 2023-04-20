import useValidTxnData from "./useValidTxnData";
import { useContractRead } from "wagmi";

export default function useIsDoctorRegistered(address) {
  const { contractAddress, enabled, abi } = useValidTxnData();

  const {
    data: isDoctorRegistered,
    isFetched,
    refetch: runIsDoctorRegistered,
  } = useContractRead({
    address: contractAddress,
    abi,
    functionName: "isDrRegistered",
    args: [address],
    enabled: enabled && address,
  });

  return { isDoctorRegistered, isFetched, runIsDoctorRegistered };
}
