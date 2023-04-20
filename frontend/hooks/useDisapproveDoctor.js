import { usePrepareContractWrite, useContractWrite } from "wagmi";
import useValidTxnData from "./useValidTxnData";
import useIsDoctorRegistered from "./useIsDoctorRegistered";

export default function useDisapproveDoctor(address) {
  const { contractAddress, abi, enabled } = useValidTxnData();
  const { isDoctorRegistered, runIsDoctorRegistered } = useIsDoctorRegistered(address);

  const { config: disapproveDoctorConfig } = usePrepareContractWrite({
    address: contractAddress,
    abi,
    functionName: "disapproveDr",
    args: [address],
    enabled: enabled && address,
  });

  const { writeAsync: disapproveDoctor, isLoading: isDisapproving } =
    useContractWrite(disapproveDoctorConfig);

  async function runDisapproveDoctor() {
    try {
      const response = await disapproveDoctor();
      await response.wait(1);
      await runIsDoctorRegistered();
    } catch (e) {
      console.log(e);
    }
  }

  return { isDoctorRegistered, isDisapproving, runDisapproveDoctor };
}
