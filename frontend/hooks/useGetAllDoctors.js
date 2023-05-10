import { useContractRead } from "wagmi";
import useValidTxnData from "@/hooks/useValidTxnData";

export default function useGetAllDoctors() {
  const { contractAddress, contractAbi, enabled } = useValidTxnData();

  const { data: allDoctors } = useContractRead({
    address: contractAddress,
    abi: contractAbi,
    functionName: "getAllDrs",
    enabled,
  });

  return { allDoctors };
}
