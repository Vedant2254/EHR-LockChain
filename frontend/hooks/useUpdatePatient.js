import { useEffect, useState } from "react";
import { useContractWrite } from "wagmi";
import useAddPatientData from "./useAddPatientData";
import useValidTxnData from "./useValidTxnData";
import useStatus from "./useStatus";

export default function useUpdatePatient(ptAddress, updater) {
  const { contractAddress, abi } = useValidTxnData();
  const { isLoading: uploading, CIDs, setupCIDs } = useAddPatientData(ptAddress, updater);

  const [txnWaiting, setTxnWaiting] = useState(false);
  const [success, setSuccess] = useState(false);

  const { writeAsync: setPtGeneralHash, isLoading: txnGeneralLoading } = useContractWrite({
    address: contractAddress,
    abi,
    functionName: "setPtGeneralHash",
    args: [CIDs.generalDataCID],
  });

  const { writeAsync: setPtRecordHash, isLoading: txnRecordLoading } = useContractWrite({
    address: contractAddress,
    abi,
    functionName: "setPtRecordHash",
    args: [ptAddress, CIDs.keyDataCID],
  });

  const message = useStatus({
    uploading,
    txnLoading: txnGeneralLoading || txnRecordLoading,
    txnWaiting,
    success,
  });

  useEffect(() => {
    const { generalDataCID, keyDataCID } = CIDs;

    (async () => {
      try {
        const res1 = generalDataCID && (await setPtGeneralHash());
        const res2 = keyDataCID && (await setPtRecordHash());

        setTxnWaiting(true);
        res1 && (await res1.wait(1));
        res2 && (await res2.wait(1));
        setTxnWaiting(false);

        setSuccess(true);
      } catch (err) {
        console.log(err);
      }
    })();
  }, [CIDs]);

  async function updateData(previousData, generalData, certificates, keyData) {
    try {
      await setupCIDs(previousData, generalData, certificates, keyData);
    } catch (err) {
      console.log(err);
    }
  }

  return {
    status: message,
    updateData,
  };
}
