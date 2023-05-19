import { useEffect, useState } from "react";
import { useContractWrite } from "wagmi";
import useIsDoctor from "@/hooks/useIsDoctor";
import useValidTxnData from "./useValidTxnData";
import { getPublicKey } from "@/utils/metamask";
import useRelayTransaction from "./useRelayTransaction";
import useStatus from "./useStatus";

export default function useRegisterDoctorConfirm() {
  const { address } = useValidTxnData();
  const { relayTransaction, txnLoading, success } = useRelayTransaction();

  const [publicKey, setPublicKey] = useState(null);
  const [uploading, setIsUploading] = useState(false);

  const message = useStatus({ uploading, txnLoading, success });

  useEffect(() => {
    publicKey &&
      (async () => {
        try {
          console.log(await relayTransaction("registerDrConfirm", [publicKey]));
        } catch (err) {
          console.log(err);
        }
        setPublicKey(null);
      })();
  }, [publicKey]);

  async function registerDrConfirm() {
    setIsUploading(true);
    try {
      setPublicKey(await getPublicKey(address));
    } catch (err) {
      console.log(err);
      setIsUploading(false);
    }
    setIsUploading(false);
  }

  return { status: message, registerDrConfirm };
}
