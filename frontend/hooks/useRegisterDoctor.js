import { useEffect, useState } from "react";
import { useContractRead, useContractWrite } from "wagmi";
import useValidTxnData from "@/hooks/useValidTxnData";
import useAddDoctorData from "./useAddDoctorData";
import { readAsDataURLAsync } from "@/utils/readFileAsync";
import useStatus from "./useStatus";
import useRelayTransaction from "./useRelayTransaction";

export default function useRegisterDoctor() {
  const { address } = useValidTxnData();
  const { isLoading: uploading, dataCID, setupCID, resetCID } = useAddDoctorData(address);
  const { relayTransaction, txnLoading, txnWaiting, success } = useRelayTransaction();

  const message = useStatus({ uploading, txnLoading, txnWaiting, success });

  /* useEffects */
  useEffect(() => {
    dataCID &&
      (async () => {
        try {
          await relayTransaction("registerDr", [dataCID]);
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
    status: message,
    handleOnSubmit,
  };
}
