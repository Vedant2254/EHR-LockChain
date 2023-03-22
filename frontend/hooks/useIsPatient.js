import useValidTxnData from "./useValidTxnData";
import { useContractRead } from "wagmi";

export default function useIsPatient(address) {
  const { contractAddress, enabled, abi } = useValidTxnData();

  const { data: isPatient, isFetched } = useContractRead({
    address: contractAddress,
    abi,
    functionName: "isPatient",
    args: [address],
    enabled: enabled && address,
  });

  return { isPatient, isFetched };
}
