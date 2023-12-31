import { usePrepareContractWrite, useContractWrite } from "wagmi";
import useValidTxnData from "./useValidTxnData";
import useIsDoctorRegistered from "./useIsDoctorRegistered";
import useStatus from "./useStatus";
import { useState } from "react";

export default function useDisapproveDoctor(address) {
  const { contractAddress, contractAbi, enabled } = useValidTxnData();
  const { isDoctorRegistered } = useIsDoctorRegistered(address);

  const [txnWaiting, setTxnWaiting] = useState(false);
  const [success, setSuccess] = useState(false);

  const { config: disapproveDoctorConfig } = usePrepareContractWrite({
    address: contractAddress,
    abi: contractAbi,
    functionName: "disapproveDr",
    args: [address],
    enabled: enabled && address,
  });

  const { writeAsync: disapproveDoctor, isLoading: txnLoading } =
    useContractWrite(disapproveDoctorConfig);

  async function runDisapproveDoctor() {
    try {
      const response = await disapproveDoctor();

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

  return { status, isDoctorRegistered, runDisapproveDoctor };
}
