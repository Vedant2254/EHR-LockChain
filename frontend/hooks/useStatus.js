import { useEffect, useState } from "react";

// {uploading, retrieving, encrypting, decrypting, signing, txnLoading, txnWaiting}
export default function useStatus(statuses) {
  const [status, setStatus] = useState(null);

  useEffect(() => {
    const {
      loading,
      uploading,
      retrieving,
      encrypting,
      decrypting,
      signing,
      txnLoading,
      txnWaiting,
      success,
      failure,
    } = statuses;

    if (loading) setStatus("loading");
    else if (uploading) setStatus("uploading");
    else if (retrieving) setStatus("retrieving");
    else if (encrypting) setStatus("encrypting");
    else if (decrypting) setStatus("decrypting");
    else if (signing) setStatus("signing");
    else if (txnLoading) setStatus("txnLoading");
    else if (txnWaiting) setStatus("txnWaiting");
    else if (success) setStatus("success");
    else if (failure) setStatus("failure");
    else setStatus(null);
  }, [statuses]);

  return status;
}
