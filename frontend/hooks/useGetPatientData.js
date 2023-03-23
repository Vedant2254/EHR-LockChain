import { useEffect, useState } from "react";
import { useAccount } from "wagmi";
import { retrieveIPFS } from "@/utils/ipfs";
import { readAsTextAsync } from "@/utils/readFileAsync";
import { decryptData } from "@/utils/metamask";
import { symmetricDecrypt } from "@/utils/cryptography";
import useGetPatientHash from "./useGetPatientHash";

export default function useGetPatientData(address, enabled = true) {
  const { address: curraddress } = useAccount();
  const { generalHash, keyHash, certificatesHash } = useGetPatientHash(address);

  const [isLoading, setIsLoading] = useState(enabled);
  const [data, setData] = useState({ generalData: {}, certificates: [], keyData: {} });

  async function getFromIPFS() {
    const cipherDataFile = (await retrieveIPFS(generalHash))[0];
    const cipherDataEnc = await readAsTextAsync(cipherDataFile);

    const cipherKeyFile = (await retrieveIPFS(keyHash))[0];
    const cipherKeyEnc = JSON.parse(await readAsTextAsync(cipherKeyFile));

    const cipherCertificatesFile = (await retrieveIPFS(certificatesHash))[0];
    const cipherCertificatesEnc = await readAsTextAsync(cipherCertificatesFile);

    return { cipherDataEnc, cipherKeyEnc, cipherCertificatesEnc };
  }

  async function finalStepDecryption(ciphers) {
    const { cipherDataEnc, cipherKeyEnc, cipherCertificatesEnc } = ciphers;

    const { key, iv } = JSON.parse(await decryptData(curraddress, cipherKeyEnc.keys[curraddress]));
    const generalData = JSON.parse(
      symmetricDecrypt(cipherDataEnc, Buffer.from(key, "hex"), Buffer.from(iv, "hex"))
    );
    const certificates = JSON.parse(
      symmetricDecrypt(cipherCertificatesEnc, Buffer.from(key, "hex"), Buffer.from(iv, "hex"))
    );

    generalData && certificates && setData({ generalData, certificates, keyData: cipherKeyEnc });
  }

  async function master() {
    setIsLoading(true);
    try {
      const ciphers = await getFromIPFS();
      ciphers && (await finalStepDecryption(ciphers));
    } catch (err) {
      console.log(err);
    }
    setIsLoading(false);
  }

  // this useEffect is triggered when hashes are available
  // these hashes are made available by previous useEffect
  useEffect(() => {
    enabled && generalHash && keyHash && master();
  }, [enabled, generalHash, keyHash]);

  return { isLoading, generalHash, keyHash, certificatesHash, ...data, getData: master };
}
