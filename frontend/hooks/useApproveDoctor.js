import { usePrepareContractWrite, useContractWrite } from "wagmi";
import useValidTxnData from "./useValidTxnData";

export default function useApproveDoctor(address) {
  const { contractAddress, abi, enabled } = useValidTxnData();

  const { config: approveDoctorConfig } = usePrepareContractWrite({
    address: contractAddress,
    abi,
    functionName: "approveDr",
    args: [address],
    enabled: enabled && address,
  });

  const { writeAsync: approveDoctor } = useContractWrite(approveDoctorConfig);

  async function runApproveDoctor() {
    try {
      await approveDoctor();
    } catch (e) {
      console.log(e);
    }
  }

  return { runApproveDoctor };
}
