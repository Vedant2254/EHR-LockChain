import {
  useContractRead,
  usePrepareContractWrite,
  useContractWrite,
} from "wagmi";
import useValidTxnData from "@/utils/hooks/useValidTxnData";

export default function Doctor({ drAddress, clearCurrDoctor }) {
  const { contractAddress, abi, enabled } = useValidTxnData();

  const { data: drHash } = useContractRead({
    address: contractAddress,
    abi,
    functionName: "getDrHash",
    args: [drAddress],
    enabled,
  });

  const { data: isPendingDoctor, refetch: runIsPendingDoctor } =
    useContractRead({
      address: contractAddress,
      abi,
      functionName: "isPendingDoctor",
      args: [drAddress],
      enabled,
    });

  const { config: approveDoctorConfig } = usePrepareContractWrite({
    address: contractAddress,
    abi,
    functionName: "approveDoctor",
    args: [drAddress],
  });

  const { data: approveDoctorResponse, writeAsync: runApproveDoctor } =
    useContractWrite(approveDoctorConfig);

  function approveDoctor() {
    runApproveDoctor()
      .then(runIsPendingDoctor)
      .catch((err) => console.log(err));
  }

  return (
    <div>
      <p>{drHash}</p>
      {isPendingDoctor ? (
        <button onClick={approveDoctor}>Approve Doctor</button>
      ) : (
        "Approved"
      )}
      <br />
      <br />
      <button onClick={clearCurrDoctor}>Go back</button>
    </div>
  );
}
