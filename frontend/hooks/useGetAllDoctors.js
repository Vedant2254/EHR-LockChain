import { useContractRead } from "wagmi";
import useValidTxnData from "@/hooks/useValidTxnData";

export default function useGetAllDoctors() {
  const { contractAddress, abi, enabled } = useValidTxnData();

  const { data: allDoctors } = useContractRead({
    address: contractAddress,
    abi,
    functionName: "getAllDrs",
    enabled,
  });

  return { allDoctors };
}
