import { useEffect, useState } from "react";
import { useContractWrite } from "wagmi";
import useValidTxnData from "./useValidTxnData";
import useAddPatientData from "./useAddPatientData";

export default function useRemoveEditorAccess() {
  const { address: curraddress, contractAddress, abi, enabled } = useValidTxnData();

  const [isLoading, setIsLoading] = useState(false);
  const { CIDs, setupCIDs, resetCIDs } = useAddPatientData(curraddress);

  const { writeAsync: removeEditorAccess } = useContractWrite({
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
        setIsLoading(false);
        resetCIDs();
      })();
  }, [CIDs]);

  async function runRemoveEditorAccess({ generalData, certificates }) {
    setIsLoading(true);
    try {
      await setupCIDs(generalData, certificates);
    } catch (err) {
      setIsLoading(false);
      console.log(err);
    }
  }

  return { isLoading, runRemoveEditorAccess };
}
