import { useState } from "react";
import useGetDoctorPubKey from "./useGetDoctorPubKey";
import { generateKey, symmetricEncrypt } from "@/utils/cryptography";
import { encryptData } from "@/utils/metamask";
import { makeFileObjects, storeIPFS } from "@/utils/ipfs";

// it expects ptAddress (data owner), drAddress (one who can access data)
// it returns a function setupCIDs that expects generalData and certificates, plane format
// setupCIDs
// 1. generate new key
// 2. encrypt generalData and certificatesData
// 3. encrypt symmetric key using ptAddress and drAddress public key
// 3. store generaldata, certificatesdata and keys to IPFS
// 4. setCIDs
// 5. Further actions are performed by functions that use this hook

export default function useAddPatientData(ptAddress, drAddress) {
  const [CIDs, setCIDs] = useState({ generalDataCID: null, keyDataCID: null });
  const { publicKey: drPublicKey } = useGetDoctorPubKey(drAddress || null);

  function resetCIDs() {
    setCIDs({ generalDataCID: null, keyDataCID: null });
  }

  async function setupCIDs(generalData, certificates) {
    // encrypt both data using new symmetric key
    const { key, iv } = generateKey();
    const cipherGeneralData = symmetricEncrypt(JSON.stringify(generalData), key, iv);
    const cipherCertificates = symmetricEncrypt(JSON.stringify(certificates), key, iv);

    // store encrypted general data to IPFS
    const generalDataFile = await makeFileObjects([cipherGeneralData], [drAddress]);
    const generalDataCID = await storeIPFS(generalDataFile, { wrapWithDirectory: false });

    // store encrypted certificates to IPFS
    const certificatesFiles = await makeFileObjects([cipherCertificates], [drAddress]);
    const certificatesCID = await storeIPFS(certificatesFiles, { wrapWithDirectory: false });

    // encrypt newly generated key
    const S = JSON.stringify({
      key: key.toString("hex"),
      iv: iv.toString("hex"),
    });

    const keyDataFile = {
      keys: drAddress
        ? {
            [ptAddress]: JSON.stringify(await encryptData(ptAddress, S)),
            [drAddress]: JSON.stringify(await encryptData(null, S, drPublicKey)),
          }
        : { [ptAddress]: JSON.stringify(await encryptData(ptAddress, S)) },
      medicalRecordCID: certificatesCID,
    };

    const keyDataFiles = await makeFileObjects([keyDataFile], [drAddress]);
    const keyDataCID = await storeIPFS(keyDataFiles, { wrapWithDirectory: false });

    // finally change the state of cids
    setCIDs({ generalDataCID, keyDataCID });
    console.log(generalDataCID);
    console.log(keyDataCID);
  }

  return { CIDs, setupCIDs, resetCIDs };
}
