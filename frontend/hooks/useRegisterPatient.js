import { useState, useEffect } from "react";
import { useContractRead, useContractWrite } from "wagmi";
import useValidTxnData from "@/hooks/useValidTxnData";
import useAddPatientData from "./useAddPatientData";
import { readAsDataURLAsync } from "@/utils/readFileAsync";

export default function useRegisterPatient() {
  const { address, contractAddress, abi, enabled } = useValidTxnData();
  const { CIDs, setupCIDs, resetCIDs } = useAddPatientData(address);

  const [isLoading, setIsLoading] = useState(false);

  // check if user is patient
  const { data: isPatient, refetch: runIsPatient } = useContractRead({
    address: contractAddress,
    abi,
    functionName: "isPatient",
    args: [address],
    enabled,
  });

  // perform registration
  const { writeAsync: runRegisterPt } = useContractWrite({
    address: contractAddress,
    abi,
    functionName: "registerPt",
    args: [CIDs.generalDataCID, CIDs.keyDataCID],
    enabled: enabled && CIDs.generalDataCID && CIDs.keyDataCID,
  });

  /* Utility functions */
  async function registerPatient() {
    const { generalDataCID, keyDataCID: keyCID } = CIDs;

    if (generalDataCID && keyCID) {
      // add patient by passing dataCID
      try {
        const response = await runRegisterPt();
        await response.wait(1);
        await runIsPatient();
      } catch (err) {
        console.log(err);
      }

      resetCIDs();
    }
  }

  // registers patient when CIDs are available
  useEffect(() => {
    const { generalDataCID, keyDataCID: keyCID } = CIDs;

    generalDataCID &&
      keyCID &&
      (async () => {
        await registerPatient();
        setIsLoading(false);
      })();
  }, [CIDs]);

  /* Handler functions */
  async function handleOnSumbit(data) {
    setIsLoading(true);
    try {
      // seperate certificates from data
      const { certificates } = data;
      delete data.certificates;

      data.photo = data.photo && (await readAsDataURLAsync(data.photo));

      // changes media in certificates to dataURLS in data
      for (let i in certificates) {
        const { media } = certificates[i];
        if (media && media.constructor.name == "File")
          certificates[i].media = await readAsDataURLAsync(media);
      }

      setupCIDs(data, certificates);
    } catch (err) {
      console.log(err);
      setIsLoading(false);
    }

    /* Contract function runAddPatient (addPatient) is performed in
      useEffect hook triggered by change in CIDs because we don't get
      updated value of changed state of CIDs here */
  }

  return { isPatient, isLoading, handleOnSumbit };
}
