import { useEffect } from "react";
import { useContractRead, useContractWrite } from "wagmi";
import useValidTxnData from "@/hooks/useValidTxnData";
import useAddDoctorData from "./useAddDoctorData";
import { readAsDataURLAsync } from "@/utils/readFileAsync";

export default function useRegisterDoctor() {
  const { address, contractAddress, abi, enabled } = useValidTxnData();
  const { isLoading: isUploadingData, dataCID, setupCID, resetCID } = useAddDoctorData(address);

  /* Contract functions */
  const { data: isDoctorRegistered, refetch: runIsDoctorRegistered } = useContractRead({
    address: contractAddress,
    abi,
    functionName: "isDrRegistered",
    args: [address],
    enabled,
  });

  const { writeAsync: registerDr, isLoading: isTxnLoading } = useContractWrite({
    address: contractAddress,
    abi,
    functionName: "registerDr",
    args: [dataCID],
    enabled: enabled && dataCID,
  });

  /* useEffects */
  useEffect(() => {
    dataCID &&
      (async () => {
        try {
          const response = await registerDr();
          await response.wait(1);
          await runIsDoctorRegistered();
        } catch (err) {
          console.log(err);
        }
        resetCID();
      })();
  }, [dataCID]);

  /* handlers */
  async function handleOnSubmit(data) {
    try {
      // convert date to string
      const { dob } = data;
      if (dob && dob.constructor.name == "Date") data.dob = dob.toDateString();

      // changes files to dataURLS in data
      const { photo } = data;
      if (photo && photo.constructor.name == "File") data.photo = await readAsDataURLAsync(photo);

      // changes files to dataURLS in data
      for (let i in data.certificates) {
        const { media } = data.certificates[i];
        if (media.constructor.name == "File")
          data.certificates[i].media = await readAsDataURLAsync(media);
      }

      await setupCID(data);
    } catch (err) {
      console.log(err);
    }
  }

  return {
    isDoctorRegistered,
    isLoading: isUploadingData || isTxnLoading,
    isUploadingData,
    isTxnLoading,
    handleOnSubmit,
  };
}
