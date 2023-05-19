import { useEffect, useState } from "react";
import { useContractWrite } from "wagmi";
import useAddDoctorData from "./useAddDoctorData";
import useValidTxnData from "./useValidTxnData";
import useStatus from "./useStatus";
import useRelayTransaction from "./useRelayTransaction";

export default function useUpdateDoctor() {
  const { address, contractAddress, contractAbi } = useValidTxnData();
  const { isLoading: uploading, dataCID, setupCID, resetCID } = useAddDoctorData(address);
  const { relayTransaction, txnLoading, success } = useRelayTransaction();
  const message = useStatus({ uploading, txnLoading, success });

  useEffect(() => {
    dataCID &&
      (async () => {
        try {
          await relayTransaction("setDrHash", [dataCID]);
        } catch (err) {
          console.log(err);
          resetCID();
        }
      })();
  }, [dataCID]);

  async function updateData(generalData, certificates) {
    try {
      await setupCID({ ...generalData, certificates });
    } catch (err) {
      console.log(err);
    }
  }

  return {
    status: message,
    updateData,
  };
}
