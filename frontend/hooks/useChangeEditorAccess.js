import { useEffect, useState } from "react";
import { useContractWrite } from "wagmi";
import useValidTxnData from "./useValidTxnData";
import useAddPatientData from "./useAddPatientData";

export default function useChangeEditorAccess(drAddress) {
  const { address: curraddress, contractAddress, abi, enabled } = useValidTxnData();

  const {
    isLoading: isUploadingData,
    CIDs,
    setupCIDs,
    resetCIDs,
  } = useAddPatientData(curraddress, drAddress);

  const { writeAsync: changeEditorAccess, isLoading: isTxnLoading } = useContractWrite({
    address: contractAddress,
    abi,
    functionName: "changeEditorAccess",
    args: [drAddress, CIDs.generalDataCID, CIDs.keyDataCID],
    enabled: enabled && drAddress && CIDs.generalDataCID && CIDs.keyDataCID,
  });

  // storing hashes (CIDs) to smart contract happens here
  useEffect(() => {
    CIDs.generalDataCID &&
      CIDs.keyDataCID &&
      (async () => {
        try {
          await changeEditorAccess();
        } catch (err) {
          console.log(err);
        }
        resetCIDs();
      })();
  }, [CIDs]);

  // work of encryption and storing to ipfs happens here
  async function runChangeEditorAccess({ generalData, certificates }) {
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
    runChangeEditorAccess,
  };
}