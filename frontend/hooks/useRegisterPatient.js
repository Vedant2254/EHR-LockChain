import { useState, useEffect } from "react";
import { useContractRead, useContractWrite } from "wagmi";
import useValidTxnData from "@/hooks/useValidTxnData";
import useAddPatientData from "./useAddPatientData";
import { readAsDataURLAsync } from "@/utils/readFileAsync";

export default function useRegisterPatient() {
  const { address, contractAddress, abi, enabled } = useValidTxnData();
  const { isLoading: isUploadingData, CIDs, setupCIDs, resetCIDs } = useAddPatientData(address);

  const [status, setStatus] = useState({ message: null, error: "" });

  // check if user is patient
  const { data: isPatient, refetch: runIsPatient } = useContractRead({
    address: contractAddress,
    abi,
    functionName: "isPatient",
    args: [address],
    enabled,
  });

  // perform registration
  const { writeAsync: registerPatient, isLoading: isTxnLoading } = useContractWrite({
    address: contractAddress,
    abi,
    functionName: "registerPt",
    args: [CIDs.generalDataCID, CIDs.keyDataCID],
    enabled: enabled && CIDs.generalDataCID && CIDs.keyDataCID,
  });

  // registers patient when CIDs are available
  useEffect(() => {
    const { generalDataCID, keyDataCID: keyCID } = CIDs;

    generalDataCID &&
      keyCID &&
      (async () => {
        try {
          // do
          setStatus({ message: "Sending transaction", error: null });
          const response = await registerPatient();

          // wait
          setStatus({ message: "Waiting for transaction confirmation", error: null });
          await response.wait(1);

          // verify
          setStatus({ message: null, error: null });
          await runIsPatient();
        } catch (err) {
          console.log(err);
          setStatus({ message: null, error: err });
        }

        resetCIDs();
      })();
  }, [CIDs]);

  /* Handler functions */
  async function handleOnSumbit(data) {
    setStatus({ message: "Uploading data", error: null });
    try {
      const { certificates } = data;
      delete data.certificates;

      await setupCIDs(data, certificates);
    } catch (err) {
      console.log(err);
      setStatus({ message: "Idle", error: "Data upload failed" });
    }

    /* Contract function runAddPatient (addPatient) is performed in
      useEffect hook triggered by change in CIDs because we don't get
      updated value of changed state of CIDs here */
  }

  return {
    isPatient,
    status,
    isLoading: isUploadingData || isTxnLoading,
    isUploadingData,
    isTxnLoading,
    handleOnSumbit,
  };
}
