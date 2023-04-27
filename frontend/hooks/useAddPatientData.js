import { useEffect, useState } from "react";
import useGetDoctorPubKey from "./useGetDoctorPubKey";
import useGetPatientHash from "./useGetPatientHash";
import useSignCertificates from "@/hooks/useSignCertificates";
import { generateKey, symmetricEncrypt } from "@/utils/cryptography";
import { encryptData, decryptData } from "@/utils/metamask";
import { makeFileObjects, storeIPFS } from "@/utils/ipfs";

// it expects ptAddress (data owner), drAddress (one who can access data)
// it returns a function setupCIDs that expects generalData and certificates, plane format
// setupCIDs
// 1. generate new key (if required)
// 2. encrypt generalData and certificatesData
// 3. encrypt symmetric key using ptAddress and drAddress public key
// 3. store generaldata, certificatesdata and keys to IPFS
// 4. setCIDs
// 5. Further actions are performed by functions that use this hook

export default function useAddPatientData(ptAddress, drAddress) {
  const { signCertificates } = useSignCertificates();
  const { publicKey: drPublicKey } = useGetDoctorPubKey(drAddress || null);
  const { certificatesHash } = useGetPatientHash(ptAddress);

  const [isLoading, setIsLoading] = useState(false);
  const [CIDs, setCIDs] = useState({ generalDataCID: null, keyDataCID: null });

  function resetCIDs() {
    setCIDs({ generalDataCID: null, keyDataCID: null });
  }

  // complex logic, but all data addition and updation stuff gets done from single function
  // decrypter is ptAddress if drAddress or keyData is absent
  // else decrypter is drAddress if decryption key for drAddress is present in keyData
  // else decrypter is again ptAddress
  // if generalData is provided create new data and save it to ipfs
  // if certificates is provided create new certificates and save it to ipfs
  // if keyData is provided, use the provided key, do not generate a new key
  // change keyData if keyData, certificates are changed or drAddress is provided and drAddress is not the decrypter
  // update keyData such that, keys are encrypted if they have changed
  async function setupCIDs(
    { prevCertificatesData, prevKeyData },
    generalData,
    certificates,
    keyData
  ) {
    setIsLoading(true);
    try {
      const decrypter =
        drAddress && keyData ? (keyData.keys[drAddress] ? drAddress : ptAddress) : ptAddress;

      let { key, iv } = keyData
        ? JSON.parse(await decryptData(decrypter, keyData.keys[decrypter]))
        : generateKey();

      if (keyData) {
        key = Buffer.from(key, "hex");
        iv = Buffer.from(iv, "hex");
      }

      let generalDataCID, certificatesCID, keyDataCID;

      if (generalData) {
        // store encrypted general data to IPFS
        console.log("changing general data");

        const cipherGeneralData = symmetricEncrypt(JSON.stringify(generalData), key, iv);
        const generalDataFile = await makeFileObjects([cipherGeneralData], [drAddress]);
        generalDataCID = await storeIPFS(generalDataFile, { wrapWithDirectory: false });
      } else generalDataCID = null;

      if (certificates) {
        // store encrypted certificates to IPFS
        console.log("changing certificates");

        const certificatesData = {
          certificates,
          metadata: {
            version:
              prevCertificatesData && prevCertificatesData.metadata
                ? prevCertificatesData.metadata.version + 1
                : 1,
            lastUpdatedDate: new Date(Date.now()).toDateString(),
            lastUpdatedBy: decrypter,
          },
        };

        const cipherCertificatesData = symmetricEncrypt(JSON.stringify(certificatesData), key, iv);

        const certificatesFile = {
          previousVersion: {
            hash: certificatesHash,
            key: prevKeyData && prevKeyData.keys && prevKeyData.keys[ptAddress],
          },
          data: cipherCertificatesData,
          digitalSignatureOfLastUpdater: await signCertificates(certificatesData),
        };

        const certificatesFiles = await makeFileObjects([certificatesFile], [drAddress]);
        certificatesCID = await storeIPFS(certificatesFiles, { wrapWithDirectory: false });
      } else certificatesCID = null;

      if (certificates || !keyData || (drAddress && decrypter != drAddress)) {
        console.log("changing keys");
        // encrypt newly generated key
        const S = JSON.stringify({
          key: key.toString("hex"),
          iv: iv.toString("hex"),
        });

        const keyDataFile = {
          keys: drAddress
            ? {
                [ptAddress]: keyData
                  ? keyData.keys[ptAddress]
                  : JSON.stringify(await encryptData(ptAddress, S)),
                [drAddress]: keyData
                  ? keyData.keys[drAddress]
                  : JSON.stringify(await encryptData(null, S, drPublicKey)),
              }
            : {
                [ptAddress]: keyData
                  ? keyData.keys[ptAddress]
                  : JSON.stringify(await encryptData(ptAddress, S)),
              },
          medicalRecordCID: certificatesCID || certificatesHash,
        };

        const keyDataFiles = await makeFileObjects([keyDataFile], [drAddress]);
        keyDataCID = await storeIPFS(keyDataFiles, { wrapWithDirectory: false });
      } else keyDataCID = null;

      // finally change the state of cids
      setCIDs({ generalDataCID, keyDataCID });
      console.log(generalDataCID);
      console.log(certificatesCID);
      console.log(keyDataCID);
    } catch (err) {
      setIsLoading(false);
      throw err;
    }
    setIsLoading(false);
  }

  return { isLoading, CIDs, setupCIDs, resetCIDs };
}
