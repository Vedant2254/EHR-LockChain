import { useContractRead } from "wagmi";
import useValidTxnData from "@/utils/hooks/useValidTxnData";

export default function AllDoctors({ handleViewDoctor }) {
  const { contractAddress, abi, enabled } = useValidTxnData();

  const { data: allDoctors } = useContractRead({
    address: contractAddress,
    abi,
    functionName: "getAllDrs",
    enabled,
  });

  const { data: pendingDoctors } = useContractRead({
    address: contractAddress,
    abi,
    functionName: "getPendingDrs",
    enabled,
  });

  return (
    allDoctors &&
    allDoctors.map((doctor, index) => {
      return (
        <div key={index}>
          <button onClick={() => handleViewDoctor(doctor)}>{doctor}</button>
          {pendingDoctors &&
            pendingDoctors.indexOf(doctor) != -1 &&
            " Need your Approval"}
          <br />
          <br />
        </div>
      );
    })
  );
}
