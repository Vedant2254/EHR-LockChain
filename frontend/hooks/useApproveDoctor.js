import { usePrepareContractWrite, useContractWrite } from "wagmi";
import useIsDoctorPending from "./useIsDoctorPending";
import useValidTxnData from "./useValidTxnData";
import { useState } from "react";
import useStatus from "./useStatus";

export default function useApproveDoctor(address) {
  const { contractAddress, contractAbi, enabled } = useValidTxnData();
  const { isDoctorPending } = useIsDoctorPending(address);

  const [txnWaiting, setTxnWaiting] = useState(false);
  const [success, setSuccess] = useState(false);

  const { config: approveDoctorConfig } = usePrepareContractWrite({
    address: contractAddress,
    abi: contractAbi,
    functionName: "approveDr",
    args: [address],
    enabled: enabled && address,
  });

  const { writeAsync: approveDoctor, isLoading: txnLoading } =
    useContractWrite(approveDoctorConfig);

  async function runApproveDoctor() {
    try {
      const response = await approveDoctor();

      setTxnWaiting(true);
      await response.wait(1);
      setTxnWaiting(false);

      setSuccess(true);
    } catch (e) {
      console.log(e);
    }
  }

  const status = useStatus({
    txnLoading,
    txnWaiting,
    success,
  });

  return { status, isDoctorPending, runApproveDoctor };
}
