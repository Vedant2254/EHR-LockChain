import { useContractRead } from "wagmi";
import useValidTxnData from "./useValidTxnData";

export default function useGetAllPatients() {
  const { contractAddress, contractAbi, enabled } = useValidTxnData();

  const { data: allPatients } = useContractRead({
    address: contractAddress,
    abi: contractAbi,
    functionName: "getAllPts",
    enabled,
  });

  return { allPatients };
}
