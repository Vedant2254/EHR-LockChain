import { useEffect, useState } from "react";
import { useContractWrite } from "wagmi";
import useValidTxnData from "./useValidTxnData";
import useAddPatientData from "./useAddPatientData";
import useStatus from "./useStatus";
import useRelayTransaction from "./useRelayTransaction";

export default function useRemoveEditorAccess() {
  const { address: curraddress } = useValidTxnData();
  const { isLoading: uploading, CIDs, setupCIDs, resetCIDs } = useAddPatientData(curraddress);
  const { relayTransaction, txnLoading, txnWaiting, success } = useRelayTransaction();
  const status = useStatus({ uploading, txnLoading, txnWaiting, success });

  // storing hashes (CIDs) to smart contract happens here
  useEffect(() => {
    const { generalDataCID, keyDataCID } = CIDs;

    generalDataCID &&
      keyDataCID &&
      (async () => {
        try {
          await relayTransaction("removeEditorAccess", [generalDataCID, keyDataCID]);
        } catch (err) {
          console.log(err);
        }
        resetCIDs();
      })();
  }, [CIDs]);

  async function runRemoveEditorAccess({ generalData, certificatesData, keyData }) {
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
    runRemoveEditorAccess,
  };
}
