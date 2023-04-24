import { useEffect, useState } from "react";
import { useAccount } from "wagmi";
import { retrieveIPFS } from "@/utils/ipfs";
import { readAsTextAsync } from "@/utils/readFileAsync";
import { decryptData } from "@/utils/metamask";
import { symmetricDecrypt } from "@/utils/cryptography";
import useGetPatientHash from "./useGetPatientHash";
import useStatus from "./useStatus";

export default function useGetPatientData(address, enabled = true) {
  const { address: curraddress } = useAccount();
  const { generalHash, keyHash, certificatesHash } = useGetPatientHash(address);

  const [data, setData] = useState({ generalData: {}, certificatesData: {}, keyData: {} });
  const [isRetrieving, setIsRetrieving] = useState(false);
  const [retrieved, setHasRetrieved] = useState(false);
  const [failed, setHasFailed] = useState(false);
  const message = useStatus({
    retrieving: isRetrieving,
    success: retrieved,
    failure: failed,
  });

  async function getFromIPFS() {
    const cipherGeneralData = await retrieveIPFS(generalHash);
    const cipherKey = await retrieveIPFS(keyHash);
    const cipherCertificatesData = await retrieveIPFS(certificatesHash);

    return { cipherGeneralData, cipherKey, cipherCertificatesData };
  }

  async function finalStepDecryption(ciphers) {
    const { cipherGeneralData, cipherKey, cipherCertificatesData } = ciphers;

    const { key, iv } = JSON.parse(await decryptData(curraddress, cipherKey.keys[curraddress]));

    const generalData = JSON.parse(
      symmetricDecrypt(cipherGeneralData, Buffer.from(key, "hex"), Buffer.from(iv, "hex"))
    );

    const certificatesData = {
      ...cipherCertificatesData,
      data: JSON.parse(
        symmetricDecrypt(
          cipherCertificatesData.data,
          Buffer.from(key, "hex"),
          Buffer.from(iv, "hex")
        )
      ),
    };

    generalData &&
      certificatesData &&
      setData({
        generalData,
        certificatesData,
        keyData: cipherKey,
      });
  }

  async function master() {
    setIsRetrieving(true);

    try {
      const ciphers = await getFromIPFS();
      await finalStepDecryption(ciphers);
      setHasRetrieved(true);
    } catch (err) {
      console.log(err);
      setHasFailed(true);
    }

    setIsRetrieving(false);
  }

  // this useEffect is triggered when hashes are available
  // these hashes are made available by previous useEffect
  useEffect(() => {
    enabled && generalHash && keyHash && master();
  }, [enabled, generalHash, keyHash]);

  return { status: message, generalHash, keyHash, certificatesHash, ...data, getData: master };
}
