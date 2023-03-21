import { useContractRead } from "wagmi";
import useValidTxnData from "./useValidTxnData";

export default function useGetAllPatients() {
  const { contractAddress, abi, enabled } = useValidTxnData();

  const { data: allPatients } = useContractRead({
    address: contractAddress,
    abi,
    functionName: "getAllPts",
    enabled,
  });

  return { allPatients };
}
