import { useContractRead } from "wagmi";
import useValidTxnData from "./useValidTxnData";

export default function useGetDoctorOfPatient() {
  const { contractAddress, abi, enabled } = useValidTxnData();

  const { data: doctor } = useContractRead({
    address: contractAddress,
    abi,
    functionName: "getDrOfPt",
    enabled,
  });

  return { doctor };
}
