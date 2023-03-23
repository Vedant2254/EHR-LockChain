import { useEffect, useState } from "react";
import useContractCall from "./useContractCall";
import { retrieveIPFS } from "@/utils/ipfs";
import { readAsTextAsync } from "@/utils/readFileAsync";

export default function useGetPatientHash(address) {
  const { contract } = useContractCall();
  const [hashData, setHashData] = useState({
    generalHash: null,
    keyHash: null,
    certificatesHash: null,
  });

  async function getHash() {
    try {
      const generalHash = await contract.getPtGeneralHash(address);
      const keyHash = await contract.getPtRecordHash(address);

      const cipherKeyFile = (await retrieveIPFS(keyHash))[0];
      const cipherKeyEnc = JSON.parse(await readAsTextAsync(cipherKeyFile));
      const certificatesHash = cipherKeyEnc.medicalRecordCID;

      setHashData({ generalHash, keyHash, certificatesHash });
    } catch (err) {
      console.log(err);
    }
  }

  useEffect(() => {
    contract && address && getHash();
  }, [contract, address]);

  return hashData;
}
