import { useEffect, useState } from "react";
import { useContractWrite } from "wagmi";
import useValidTxnData from "./useValidTxnData";
import useAddPatientData from "./useAddPatientData";
import useGetPatientData from "./useGetPatientData";
import useStatus from "./useStatus";

export default function useChangeEditorAccess(drAddress) {
  const { address: curraddress, contractAddress, abi, enabled } = useValidTxnData();

  const [txnWaiting, setTxnWaiting] = useState(false);
  const [success, setSuccess] = useState(false);

  const {
    isLoading: uploading,
    CIDs,
    setupCIDs,
    resetCIDs,
  } = useAddPatientData(curraddress, drAddress);

  const { writeAsync: changeEditorAccess, isLoading: txnLoading } = useContractWrite({
    address: contractAddress,
    abi,
    functionName: "changeEditorAccess",
    args: [drAddress, CIDs.generalDataCID, CIDs.keyDataCID],
    enabled: enabled && drAddress && CIDs.generalDataCID && CIDs.keyDataCID,
  });

  const status = useStatus({ uploading, txnLoading, txnWaiting, success });

  // storing hashes (CIDs) to smart contract happens here
  useEffect(() => {
    CIDs.generalDataCID &&
      CIDs.keyDataCID &&
      (async () => {
        try {
          const res = await changeEditorAccess();

          setTxnWaiting(true);
          await res.wait(1);
          setTxnWaiting(false);

          setSuccess(true);
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
