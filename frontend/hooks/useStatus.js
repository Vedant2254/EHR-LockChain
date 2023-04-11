import { useEffect, useState } from "react";

const messages = [
  null,
  "uploading",
  "retrieving",
  "encrypting",
  "decrypting",
  "signing",
  "transaction",
  "waiting",
  "success",
  "failure, please reload the page",
];

// {uploading, retrieving, encrypting, decrypting, signing, txnLoading, txnWaiting}
export default function useStatus(status) {
  const [message, setMessage] = useState(messages[0]);

  useEffect(() => {
    const {
      uploading,
      retrieving,
      encrypting,
      decrypting,
      signing,
      txnLoading,
      txnWaiting,
      success,
      failure,
    } = status;

    if (uploading) setMessage(messages[1]);
    else if (retrieving) setMessage(messages[2]);
    else if (encrypting) setMessage(messages[3]);
    else if (decrypting) setMessage(messages[4]);
    else if (signing) setMessage(messages[5]);
    else if (txnLoading) setMessage(messages[6]);
    else if (txnWaiting) setMessage(messages[7]);
    else if (success) setMessage(messages[8]);
    else if (failure) setMessage(messages[9]);
    else setMessage(messages[0]);
  }, [status]);

  return message;
}
