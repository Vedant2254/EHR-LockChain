import { useEffect } from "react";
import useAddPatientData from "./useAddPatientData";
import useStatus from "./useStatus";
import useRelayTransaction from "./useRelayTransaction";

export default function useUpdatePatient(ptAddress, updater) {
  const {
    isLoading: uploading,
    CIDs,
    setupCIDs,
    resetCIDs,
  } = useAddPatientData(ptAddress, updater);
  const { relayTransaction, txnLoading, success } = useRelayTransaction();
  const message = useStatus({
    uploading,
    txnLoading,
    success,
  });

  useEffect(() => {
    const { generalDataCID, keyDataCID } = CIDs;

    (generalDataCID || keyDataCID) &&
      (async () => {
        try {
          await relayTransaction("setPtBothHash", [
            ptAddress,
            generalDataCID || "",
            keyDataCID || "",
          ]);
        } catch (err) {
          console.log(err);
          resetCIDs();
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
