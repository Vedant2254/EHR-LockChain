import { useEffect } from "react";
import useValidTxnData from "./useValidTxnData";
import useAddPatientData from "./useAddPatientData";
import useStatus from "./useStatus";
import useRelayTransaction from "./useRelayTransaction";

export default function useChangeEditorAccess(drAddress) {
  const { address: curraddress } = useValidTxnData();
  const { relayTransaction, txnLoading, txnWaiting, success } = useRelayTransaction();
  const {
    isLoading: uploading,
    CIDs,
    setupCIDs,
    resetCIDs,
  } = useAddPatientData(curraddress, drAddress);

  const status = useStatus({ uploading, txnLoading, txnWaiting, success });

  // storing hashes (CIDs) to smart contract happens here
  useEffect(() => {
    const { generalDataCID, keyDataCID } = CIDs;

    generalDataCID &&
      keyDataCID &&
      (async () => {
        try {
          await relayTransaction("changeEditorAccess", [drAddress, generalDataCID, keyDataCID]);
        } catch (err) {
          console.log(err);
        }
        resetCIDs();
      })();
  }, [CIDs]);

  // work of encryption and storing to ipfs happens here
  async function runChangeEditorAccess({ generalData, certificatesData, keyData }) {
    try {
      await setupCIDs(
        { prevCertificatesData: certificatesData, prevKeyData: keyData },
        generalData,
        certificatesData.data.certificates
      );
    } catch (err) {
      console.log(err);
    }
  }

  return {
    status,
    runChangeEditorAccess,
  };
}
