import { useState } from "react";
import usePrepareRequest from "./usePrepareRequest";
import axios from "axios";
import { useNetwork } from "wagmi";

export default function useRelayTransaction() {
  const prepareRequest = usePrepareRequest();

  const [txnLoading, setTxnLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  async function relayTransaction(functionName, args) {
    let txReciept = null;
    try {
      setTxnLoading(true);
      const request = await prepareRequest(functionName, args);

      const response = await axios.post(process.env.NEXT_PUBLIC_AUTOTASK_URL, request, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      txReciept = JSON.parse(response.data.result);

      setSuccess(true);
    } catch (err) {
      console.log(err);
    }

    setTxnLoading(false);
    return txReciept;
  }

  return { relayTransaction, txnLoading, success };
}
