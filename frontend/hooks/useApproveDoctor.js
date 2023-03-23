import { usePrepareContractWrite, useContractWrite } from "wagmi";
import useIsDoctorPending from "./useIsDoctorPending";
import useValidTxnData from "./useValidTxnData";

export default function useApproveDoctor(address) {
  const { contractAddress, abi, enabled } = useValidTxnData();
  const { isDoctorPending, runIsDoctorPending } = useIsDoctorPending(address);

  const { config: approveDoctorConfig } = usePrepareContractWrite({
    address: contractAddress,
    abi,
    functionName: "approveDr",
    args: [address],
    enabled: enabled && address,
  });

  const { writeAsync: approveDoctor, isLoading: isApproving } =
    useContractWrite(approveDoctorConfig);

  async function runApproveDoctor() {
    try {
      const response = await approveDoctor();
      await response.wait(1);
      await runIsDoctorPending();
    } catch (e) {
      console.log(e);
    }
  }

  return { isDoctorPending, isApproving, runApproveDoctor };
}
