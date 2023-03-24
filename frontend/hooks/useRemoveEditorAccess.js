import { useEffect, useState } from "react";
import { useContractWrite } from "wagmi";
import useValidTxnData from "./useValidTxnData";
import useAddPatientData from "./useAddPatientData";

export default function useRemoveEditorAccess() {
  const { address: curraddress, contractAddress, abi, enabled } = useValidTxnData();

  const { isLoading: isUploadingData, CIDs, setupCIDs, resetCIDs } = useAddPatientData(curraddress);

  const { writeAsync: removeEditorAccess, isLoading: isTxnLoading } = useContractWrite({
    address: contractAddress,
    abi,
    functionName: "removeEditorAccess",
    args: [CIDs.generalDataCID, CIDs.keyDataCID],
    enabled: enabled && CIDs.generalDataCID && CIDs.keyDataCID,
  });

  // storing hashes (CIDs) to smart contract happens here
  useEffect(() => {
    CIDs.generalDataCID &&
      CIDs.keyDataCID &&
      (async () => {
        try {
          await removeEditorAccess();
        } catch (err) {
          console.log(err);
        }
        resetCIDs();
      })();
  }, [CIDs]);

  async function runRemoveEditorAccess({ generalData, certificates }) {
    try {
      await setupCIDs(generalData, certificates);
    } catch (err) {
      console.log(err);
    }
  }

  return {
    isLoading: isUploadingData || isTxnLoading,
    isUploadingData,
    isTxnLoading,
    runRemoveEditorAccess,
  };
}
