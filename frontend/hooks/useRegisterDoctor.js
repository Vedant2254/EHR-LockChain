import { useState, useEffect } from "react";
import { useContractRead, useContractWrite } from "wagmi";
import { makeFileObjects, storeIPFS } from "@/utils/ipfs";
import useValidTxnData from "@/hooks/useValidTxnData";

export default function useRegisterDoctor() {
  const { address, contractAddress, abi, enabled } = useValidTxnData();

  const [dataCID, setDataCID] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  /* Contract functions */
  const { data: isDoctorRegistered, refetch: runIsDoctorRegistered } =
    useContractRead({
      address: contractAddress,
      abi,
      functionName: "isDrRegistered",
      args: [address],
      enabled,
    });

  const { writeAsync: runAddDoctor } = useContractWrite({
    address: contractAddress,
    abi,
    functionName: "registerDr",
    args: [dataCID],
    enabled: enabled && dataCID,
  });

  /* Utility functions */
  async function registerDoctor() {
    if (dataCID) {
      try {
        await runAddDoctor();
        await runIsDoctorRegistered();
      } catch (err) {
        console.log(err);
      }

      setDataCID(null);
    }
  }

  /* useEffects */
  useEffect(() => {
    (async () => {
      await registerDoctor();
      setIsLoading(false);
    })();
  }, [dataCID]);

  /* handlers */
  async function handleOnSubmit(data) {
    setIsLoading(true);
    try {
      // read file as data urls
      function readFileAsync(file) {
        return new Promise((resolve) => {
          const reader = new FileReader();
          reader.readAsDataURL(file);
          reader.onloadend = () => resolve(reader.result);
        });
      }

      // changes files to dataURLS in data
      for (let key in data) {
        if (data[key].constructor.name == "File") {
          data[key] = await readFileAsync(data[key]);
        }
      }

      // changes files to dataURLS in data
      for (let i in data.certificates) {
        const { media } = data.certificates[i];
        if (media.constructor.name == "File")
          data.certificates[i].media = await readFileAsync(media);
      }

      // store data to IPFS and set dataCID
      console.log("Uploading data....");
      const dataFiles = await makeFileObjects([data], [address]);
      const cid = await storeIPFS(dataFiles, { wrapWithDirectory: false });
      console.log(cid);
      setDataCID(cid);
    } catch (e) {
      setIsLoading(false);
    }
  }

  return { isDoctorRegistered, isLoading, handleOnSubmit };
}
