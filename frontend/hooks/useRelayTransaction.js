import { useState } from "react";
import usePrepareRequest from "./usePrepareRequest";
import axios from "axios";

export default function useRelayTransaction() {
  const prepareRequest = usePrepareRequest();

  const [txnLoading, setTxnLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  async function relayTransaction(functionName, args) {
    let tx = null;
    try {
      setTxnLoading(true);
      const request = await prepareRequest(functionName, args);

      const response = await axios.post(process.env.NEXT_PUBLIC_AUTOTASK_URL, request, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      tx = JSON.parse(response.data.result);
      setSuccess(true);
    } catch (err) {
      console.log(err);
    }

    setTxnLoading(false);
    return tx;
  }

  return { relayTransaction, txnLoading, success };
}
