import { useEffect, useState } from "react";
import { useWaitForTransaction } from "wagmi";
import axios from "axios";
import usePrepareRequest from "./usePrepareRequest";

export default function useRelayTransaction() {
  const prepareRequest = usePrepareRequest();

  const [txnLoading, setTxnLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [hash, setHash] = useState(null);

  const { data, isFetching: txnWaiting } = useWaitForTransaction({
    confirmations: 5,
    hash,
  });

  useEffect(() => {
    if (data) {
      setSuccess(true);
      setHash(null);
    }
  }, [data]);

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
      setTxnLoading(false);
      setHash(tx.hash);
    } catch (err) {
      setTxnLoading(false);
      console.log(err);
    }

    return tx;
  }

  return { relayTransaction, txnLoading, txnWaiting, success };
}
