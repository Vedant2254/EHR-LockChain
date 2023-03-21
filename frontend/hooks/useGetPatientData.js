import { useContractRead } from "wagmi";
import useValidTxnData from "./useValidTxnData";

export default function useGetPatientData(address) {
  const { contractAddress, abi, enabled } = useValidTxnData();

  const { data: generalHash } = useContractRead({
    address: contractAddress,
    abi,
    functionName: "getPtGeneralHash",
    args: [address],
    enabled,
  });

  return { generalHash };
}
