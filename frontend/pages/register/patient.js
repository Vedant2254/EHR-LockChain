import { useState, useEffect } from "react";
import {
  useAccount,
  useContractRead,
  useContractWrite,
  useNetwork,
} from "wagmi";
import useSWR from "swr";
import { useRouter } from "next/router";
import { makeFileObjects, storeIPFS, deleteIPFS } from "../../utils/ipfs";
import { symmetricEncrypt } from "../../utils/cryptography";
import { encryptData } from "../../utils/metamask";
import RegistrationForm from "../../components/Forms/RegistrationForm";

const fetcher = (url) => fetch(url).then((res) => res.json());

export default function RegisterPatient() {
  const { data: contract } = useSWR("/api/constants", fetcher);
  const { chain } = useNetwork();
  const { address } = useAccount();
  const router = useRouter();

  const CIDsInitialState = { dataCID: null, keyCID: null };
  const [CIDs, setCIDs] = useState(CIDsInitialState);

  const contractAddress =
    contract && chain && JSON.parse(contract).contractAddresses[chain.id];
  const abi = contract && JSON.parse(contract).abi;
  const enabled = contract && chain && address;

  /* Transactions */
  // check if user is already registered as patient
  const { data: isPatient, refetch: runIsPatient } = useContractRead({
    address: contractAddress,
    abi,
    functionName: "isPatient",
    args: [address],
    enabled,
  });

  // perform registration
  const { writeAsync: runAddPatient } = useContractWrite({
    address: contractAddress,
    abi,
    functionName: "addPatient",
    args: [CIDs.dataCID, CIDs.keyCID],
    enabled: enabled && CIDs.dataCID && CIDs.keyCID,
  });

  /* Utility functions */
  async function registerPatient() {
    const { dataCID, keyCID } = CIDs;
    if (dataCID && keyCID) {
      // add patient by passing dataCID
      runAddPatient()
        .then(runIsPatient)
        .catch((e) => {
          console.log(e);
        });

      // finally set dataCID to null to reset the state of component
      setCIDs(CIDsInitialState);
    }
  }

  /* useEffects */
  // routes user back to home page if user is not connected or not registered
  useEffect(() => {
    if (!address) router.replace("/");
    else if (isPatient) router.replace("/dashboard/patient");
  }, [address, isPatient]);

  // registers patient when CIDs are available
  useEffect(() => {
    registerPatient();
  }, [CIDs]);

  /* Handler functions */
  async function handleOnSumbit(data) {
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

    // encrypt data using symmetric key
    const { key, iv, cipherData } = symmetricEncrypt(JSON.stringify(data));

    // create JSON of key and iv of symmetric encryption, then encrypt it using
    // patients public key
    const S = {
      key: key.toString("hex"),
      iv: iv.toString("hex"),
    };
    const encS = await encryptData(address, JSON.stringify(S));

    // store encrypted data to IPFS
    const dataFiles = await makeFileObjects([cipherData], [address]);
    const dataCID = await storeIPFS(dataFiles);

    // store encrypted key to IPFS in below format
    const keyFile = { keys: { [address]: JSON.stringify(encS) } };
    const keyFiles = await makeFileObjects([keyFile], [`${[address]}.json`]);
    const keyCID = await storeIPFS(keyFiles);

    // set dataCID and keyCID in state CIDs
    setCIDs({ dataCID, keyCID });

    /* Contract function runAddPatient (addPatient) is performed in
    useEffect hook triggered by change in CIDs because we don't get
    updated value of changed state of CIDs here */
  }

  return (
    <>
      <RegistrationForm
        handleOnSubmit={handleOnSumbit}
        initialInputs={{
          name: "string",
          address: "string",
          phone: "number",
          email: "email",
          photo: "file",
        }}
      />
    </>
  );
}
