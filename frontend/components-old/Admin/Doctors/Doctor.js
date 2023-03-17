import {
  useContractRead,
  usePrepareContractWrite,
  useContractWrite,
} from "wagmi";
import useValidTxnData from "@/hooks/useValidTxnData";
import DisplayDoctorData from "../../UtilityComponents/DisplayDoctorData";

export default function Doctor({ drAddress, clearCurrDoctor }) {
  const { contractAddress, abi, enabled } = useValidTxnData();

  const { data: isPendingDoctor, refetch: runIsPendingDoctor } =
    useContractRead({
      address: contractAddress,
      abi,
      functionName: "isDrPending",
      args: [drAddress],
      enabled,
    });

  const { config: approveDoctorConfig } = usePrepareContractWrite({
    address: contractAddress,
    abi,
    functionName: "approveDr",
    args: [drAddress],
  });

  const { writeAsync: runApproveDoctor } =
    useContractWrite(approveDoctorConfig);

  function approveDoctor() {
    runApproveDoctor()
      .then(runIsPendingDoctor)
      .catch((err) => console.log(err));
  }

  return (
    <div>
      <DisplayDoctorData address={drAddress} />
      <br />
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
