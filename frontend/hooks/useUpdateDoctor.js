import { useEffect, useState } from "react";
import { useContractWrite } from "wagmi";
import useAddDoctorData from "./useAddDoctorData";
import useValidTxnData from "./useValidTxnData";
import useStatus from "./useStatus";

export default function useUpdateDoctor() {
  const { address, contractAddress, abi } = useValidTxnData();
  const { isLoading: uploading, dataCID, setupCID, resetCID } = useAddDoctorData(address);

  const { writeAsync: setDrHash, isLoading: txnLoading } = useContractWrite({
    address: contractAddress,
    abi,
    functionName: "setDrHash",
    args: [dataCID],
  });

  const [txnWaiting, setTxnWaiting] = useState(false);
  const [success, setSuccess] = useState(false);

  const message = useStatus({ uploading, txnLoading, txnWaiting, success });

  useEffect(() => {
    dataCID &&
      (async () => {
        try {
          const res = await setDrHash();

          setTxnWaiting(true);
          await res.wait(1);
          setTxnWaiting(false);

          setSuccess(true);
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
