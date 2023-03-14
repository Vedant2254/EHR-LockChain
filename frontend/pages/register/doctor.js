import { useState, useEffect } from "react";
import { useContractRead, useContractWrite } from "wagmi";
import { useRouter } from "next/router";
import { makeFileObjects, storeIPFS } from "../../utils/ipfs";
import RegistrationForm from "../../components/Forms/RegistrationForm";
import useValidTxnData from "@/utils/hooks/useValidTxnData";

export default function RegisterDoctor() {
  const { address, contractAddress, abi, enabled } = useValidTxnData();
  const router = useRouter();

  const [dataCID, setDataCID] = useState(null);

  /* Contract functions */
  const { data: isDoctor, refetch: runIsDoctor } = useContractRead({
    address: contractAddress,
    abi,
    functionName: "isDoctorRegistered",
    args: [address],
    enabled,
  });

  const { writeAsync: runAddDoctor } = useContractWrite({
    address: contractAddress,
    abi,
    functionName: "addDoctor",
    args: [dataCID],
    enabled: enabled && dataCID,
  });

  /* Utility functions */
  function registerDoctor() {
    if (dataCID) {
      runAddDoctor()
        .then(runIsDoctor)
        .catch((err) => console.log(err));

      setDataCID(null);
    }
  }

  /* useEffects */
  useEffect(() => {
    if (!address) router.replace("/");
    else if (isDoctor) router.replace("/dashboard/doctor");
  }, [address, isDoctor]);

  useEffect(() => {
    registerDoctor();
  }, [dataCID]);

  /* handlers */
  async function handleOnSubmit(data) {
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
  }

  return (
    <>
      <RegistrationForm
        initialInputs={{
          photo: "file",
          name: "string",
          address: "string",
          phone: "number",
          email: "email",
        }}
        certCount={1}
        handleOnSubmit={handleOnSubmit}
      />
    </>
  );
}
