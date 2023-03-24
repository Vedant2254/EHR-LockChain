import { useEffect } from "react";
import { useContractWrite } from "wagmi";
import useAddPatientData from "./useAddPatientData";
import useValidTxnData from "./useValidTxnData";

export default function useUpdatePatient(ptAddress, updater) {
  const { contractAddress, abi } = useValidTxnData();
  const { isLoading: isUploadingData, CIDs, setupCIDs } = useAddPatientData(ptAddress, updater);

  const { writeAsync: setPtGeneralHash, isLoading: isSettingGeneralHash } = useContractWrite({
    address: contractAddress,
    abi,
    functionName: "setPtGeneralHash",
    args: [CIDs.generalDataCID],
  });

  const { writeAsync: setPtRecordHash, isLoading: isSettingRecordHash } = useContractWrite({
    address: contractAddress,
    abi,
    functionName: "setPtRecordHash",
    args: [ptAddress, CIDs.keyDataCID],
  });

  useEffect(() => {
    CIDs.generalDataCID &&
      (async () => {
        await setPtGeneralHash();
      })();
  }, [CIDs.generalDataCID]);

  useEffect(() => {
    CIDs.keyDataCID &&
      (async () => {
        await setPtRecordHash();
      })();
  }, [CIDs.keyDataCID]);

  async function updateData(generalData, certificates, keyData) {
    try {
      await setupCIDs(generalData, certificates, keyData);
    } catch (err) {
      console.log(err);
    }
  }

  return {
    isLoading: isUploadingData || isSettingGeneralHash || isSettingRecordHash,
    isUploadingData,
    isTxnLoading: isSettingGeneralHash || isSettingRecordHash,
    updateData,
  };
}
