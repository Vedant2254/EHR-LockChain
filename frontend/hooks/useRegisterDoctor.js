import { useEffect } from "react";
import { useContractRead, useContractWrite } from "wagmi";
import useValidTxnData from "@/hooks/useValidTxnData";
import useAddDoctorData from "./useAddDoctorData";

export default function useRegisterDoctor() {
  const { address, contractAddress, abi, enabled } = useValidTxnData();
  const { isLoading: isUploadingData, dataCID, setupCID, resetCID } = useAddDoctorData(address);

  /* Contract functions */
  const { data: isDoctorRegistered, refetch: runIsDoctorRegistered } = useContractRead({
    address: contractAddress,
    abi,
    functionName: "isDrRegistered",
    args: [address],
    enabled,
  });

  const { writeAsync: registerDr, isLoading: isTxnLoading } = useContractWrite({
    address: contractAddress,
    abi,
    functionName: "registerDr",
    args: [dataCID],
    enabled: enabled && dataCID,
  });

  /* useEffects */
  useEffect(() => {
    dataCID &&
      (async () => {
        try {
          const response = await registerDr();
          await response.wait(1);
          await runIsDoctorRegistered();
        } catch (err) {
          console.log(err);
        }
        resetCID();
      })();
  }, [dataCID]);

  /* handlers */
  async function handleOnSubmit(data) {
    try {
      await setupCID(data);
    } catch (err) {
      console.log(err);
    }
  }

  return {
    isDoctorRegistered,
    isLoading: isUploadingData || isTxnLoading,
    isUploadingData,
    isTxnLoading,
    handleOnSubmit,
  };
}
