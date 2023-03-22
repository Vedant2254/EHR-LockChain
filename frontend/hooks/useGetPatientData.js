import { useEffect, useState } from "react";
import useValidTxnData from "./useValidTxnData";
import { useSigner } from "wagmi";
import { ethers } from "ethers";
import { retrieveIPFS } from "@/utils/ipfs";
import { readAsTextAsync } from "@/utils/readFileAsync";
import { decryptData } from "@/utils/metamask";
import { symmetricDecrypt } from "@/utils/cryptography";

export default function useGetPatientData(address) {
  const { address: curraddress, contractAddress, abi, enabled } = useValidTxnData();
  const { data: signer } = useSigner();

  const [hashData, setHashData] = useState({
    generalHash: null,
    keyHash: null,
    certificatesHash: null,
  });
  const [data, setData] = useState({ generalData: {}, certificates: [] });

  async function getHash() {
    try {
      const contract = new ethers.Contract(contractAddress, abi, signer);
      const generalHash = await contract.getPtGeneralHash(address);
      const keyHash = await contract.getPtRecordHash(address);
      setHashData({ generalHash, keyHash });
    } catch (err) {
      console.log(err);
    }
  }

  async function getFromIPFS() {
    try {
      const { generalHash, keyHash } = hashData;
      if (!generalHash || !keyHash) return;

      const cipherDataFile = (await retrieveIPFS(generalHash))[0];
      const cipherDataEnc = await readAsTextAsync(cipherDataFile);

      const cipherKeyFile = (await retrieveIPFS(keyHash))[0];
      const cipherKeyEnc = JSON.parse(await readAsTextAsync(cipherKeyFile));

      const certificatesHash = cipherKeyEnc.medicalRecordCID;
      const cipherCertificatesFile = (await retrieveIPFS(certificatesHash))[0];
      const cipherCertificatesEnc = await readAsTextAsync(cipherCertificatesFile);

      setHashData({ ...hashData, certificatesHash });
      return { cipherDataEnc, cipherKeyEnc: cipherKeyEnc.keys, cipherCertificatesEnc };
    } catch (err) {
      console.log(err);
    }
  }

  async function finalStepDecryption(ciphers) {
    const { cipherDataEnc, cipherKeyEnc, cipherCertificatesEnc } = ciphers;

    try {
      const { key, iv } = JSON.parse(await decryptData(curraddress, cipherKeyEnc[curraddress]));
      const generalData = JSON.parse(
        symmetricDecrypt(cipherDataEnc, Buffer.from(key, "hex"), Buffer.from(iv, "hex"))
      );
      const certificates = JSON.parse(
        symmetricDecrypt(cipherCertificatesEnc, Buffer.from(key, "hex"), Buffer.from(iv, "hex"))
      );

      generalData && certificates && setData({ generalData, certificates });
    } catch (err) {
      console.log(err);
    }
  }

  // this useEffect initiates the call
  // call is initiated only if all required values are available
  useEffect(() => {
    enabled && signer && address && getHash();
  }, [enabled, signer, address]);

  // this useEffect is triggered when hashes are available
  // these hashes are made available by previous useEffect
  useEffect(() => {
    (async () => {
      const ciphers = await getFromIPFS();
      ciphers && (await finalStepDecryption(ciphers));
    })();
  }, [hashData.generalHash, hashData.keyHash]);

  return { hashData, ...data };
}
