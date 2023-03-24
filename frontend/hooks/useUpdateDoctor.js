import { useEffect } from "react";
import { useContractWrite } from "wagmi";
import useAddDoctorData from "./useAddDoctorData";
import useValidTxnData from "./useValidTxnData";

export default function useUpdateDoctor() {
  const { address, contractAddress, abi } = useValidTxnData();
  const { isLoading: isUploadingData, dataCID, setupCID } = useAddDoctorData(address);

  const { writeAsync: setDrHash, isLoading: isTxnLoading } = useContractWrite({
    address: contractAddress,
    abi,
    functionName: "setDrHash",
    args: [dataCID],
  });

  useEffect(() => {
    dataCID &&
      (async () => {
        try {
          await setDrHash();
        } catch (err) {
          console.log(err);
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

  return { isLoading: isUploadingData || isTxnLoading, isUploadingData, isTxnLoading, updateData };
}
