import { useState, useEffect } from "react";
import { useContractRead, useContractWrite } from "wagmi";
import useValidTxnData from "@/hooks/useValidTxnData";
import useAddPatientData from "./useAddPatientData";
import { readAsDataURLAsync } from "@/utils/readFileAsync";
import useStatus from "./useStatus";

export default function useRegisterPatient() {
  const { address, contractAddress, abi, enabled } = useValidTxnData();
  const { isLoading: uploading, CIDs, setupCIDs, resetCIDs } = useAddPatientData(address);

  const [txnWaiting, setTxnWaiting] = useState(false);

  // check if user is patient
  const { data: isPatient, refetch: runIsPatient } = useContractRead({
    address: contractAddress,
    abi,
    functionName: "isPatient",
    args: [address],
    enabled,
  });

  // perform registration
  const { writeAsync: registerPatient, isLoading: txnLoading } = useContractWrite({
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
          const response = await registerPatient();

          setTxnWaiting(true);
          await response.wait(1);
          setTxnWaiting(false);

          await runIsPatient();
        } catch (err) {
          console.log(err);
        }

        resetCIDs();
      })();
  }, [CIDs]);

  const message = useStatus({ uploading, txnLoading, txnWaiting });

  /* Handler functions */
  async function handleOnSumbit(data) {
    try {
      const { certificates } = data;
      delete data.certificates;

      // convert date to string
      const { dob } = data;
      if (dob && dob.constructor.name == "Date") data.dob = dob.toDateString();

      // change photo from File to data url
      const { photo } = data;
      if (photo && photo.constructor.name == "File") data.photo = await readAsDataURLAsync(photo);

      // changes media in certificates to dataURLS in data
      for (let i in certificates) {
        const { media } = certificates[i];
        if (media && media.constructor.name == "File")
          certificates[i].media = await readAsDataURLAsync(media);
      }

      await setupCIDs({ prevCertificatesData: {}, prevKeyData: {} }, data, certificates);
    } catch (err) {
      console.log(err);
    }

    /* Contract function runAddPatient (addPatient) is performed in
      useEffect hook triggered by change in CIDs because we don't get
      updated value of changed state of CIDs here */
  }

  return {
    isPatient,
    status: message,
    handleOnSumbit,
  };
}
