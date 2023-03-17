import { useContractRead } from "wagmi";
import useValidTxnData from "@/hooks/useValidTxnData";

export default function AllDoctors() {
  const { contractAddress, abi, enabled } = useValidTxnData();

  const { data: allPatients } = useContractRead({
    address: contractAddress,
    abi,
    functionName: "getAllPts",
    enabled,
  });

  return (
    allPatients &&
    allPatients.map((patient, index) => {
      return (
        <div key={index}>
          <button>{patient}</button>
          <br />
        </div>
      );
    })
  );
}
