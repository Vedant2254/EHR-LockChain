import { useState, useEffect } from "react";
import { useContractRead, useContractWrite } from "wagmi";
import useValidTxnData from "@/hooks/useValidTxnData";
import { makeFileObjects, storeIPFS } from "@/utils/ipfs";
import { generateKey, symmetricEncrypt } from "@/utils/cryptography";
import { encryptData } from "@/utils/metamask";

export default function useRegisterPatient() {
  const { address, contractAddress, abi, enabled } = useValidTxnData();

  const CIDsInitialState = { dataCID: null, keyCID: null };
  const [CIDs, setCIDs] = useState(CIDsInitialState);
  const [isLoading, setIsLoading] = useState(false);

  // check if user is patient
  const { data: isPatient, refetch: runIsPatient } = useContractRead({
    address: contractAddress,
    abi,
    functionName: "isPatient",
    args: [address],
    enabled,
  });

  // perform registration
  const { writeAsync: runRegisterPt } = useContractWrite({
    address: contractAddress,
    abi,
    functionName: "registerPt",
    args: [CIDs.dataCID, CIDs.keyCID],
    enabled: enabled && CIDs.dataCID && CIDs.keyCID,
  });

  /* Utility functions */
  async function registerPatient() {
    const { dataCID, keyCID } = CIDs;

    if (dataCID && keyCID) {
      // add patient by passing dataCID
      try {
        await runRegisterPt();
        await runIsPatient();
      } catch (err) {
        console.log(err);
      }

      // finally set dataCID to null to reset the state of component
      setCIDs(CIDsInitialState);
    }
  }

  // registers patient when CIDs are available
  useEffect(() => {
    (async () => {
      await registerPatient();
      setIsLoading(false);
    })();
  }, [CIDs]);

  /* Handler functions */
  async function handleOnSumbit(data) {
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

      // seperate certificates from data
      const { certificates } = data;
      delete data.certificates;

      // changes files to dataURLS in data
      for (let key in data) {
        if (data[key].constructor.name == "File") {
          data[key] = await readFileAsync(data[key]);
        }
      }

      // changes media in certificates to dataURLS in data
      for (let i in certificates) {
        const { media } = certificates[i];
        if (media && media.constructor.name == "File")
          certificates[i].media = await readFileAsync(media);
      }

      // encrypt data using symmetric key
      const { key, iv } = generateKey();
      const { cipherData } = symmetricEncrypt(JSON.stringify(data), key, iv);
      const { cipherData: cipherCertificates } = symmetricEncrypt(
        JSON.stringify(certificates),
        key,
        iv
      );

      // create JSON of key and iv of symmetric encryption, then encrypt it using
      // patients public key
      const S = {
        key: key.toString("hex"),
        iv: iv.toString("hex"),
      };
      const encS = await encryptData(address, JSON.stringify(S));

      // store encrypted data to IPFS
      const dataFiles = await makeFileObjects([cipherData], [address]);
      const dataCID = await storeIPFS(dataFiles, { wrapWithDirectory: false });

      // store encrypted certificates to IPFS
      const certificateFiles = await makeFileObjects([cipherCertificates], [address]);
      const certificatesCID = await storeIPFS(certificateFiles, { wrapWithDirectory: false });

      // store encrypted key to IPFS in below format
      const keyFile = {
        keys: { [address]: JSON.stringify(encS) },
        medicalRecordCID: certificatesCID,
      };
      const keyFiles = await makeFileObjects([keyFile], [address]);
      const keyCID = await storeIPFS(keyFiles, { wrapWithDirectory: false });

      // set dataCID and keyCID in state CIDs
      setCIDs({ dataCID, keyCID });
      console.log(dataCID);
      console.log(keyCID);
    } catch (err) {
      console.log(err);
      setIsLoading(false);
    }

    /* Contract function runAddPatient (addPatient) is performed in
      useEffect hook triggered by change in CIDs because we don't get
      updated value of changed state of CIDs here */
  }

  return { isPatient, isLoading, handleOnSumbit };
}
