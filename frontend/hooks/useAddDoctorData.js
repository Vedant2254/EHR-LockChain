import { useState } from "react";
import { makeFileObjects, storeIPFS } from "@/utils/ipfs";

export default function useAddDoctorData(address) {
  const [isLoading, setIsLoading] = useState(false);
  const [dataCID, setDataCID] = useState(null);

  function resetCID() {
    setDataCID(null);
  }

  async function setupCID(data) {
    setIsLoading(true);
    try {
      // store data to IPFS and set dataCID
      console.log("Uploading data....");
      const dataFiles = await makeFileObjects([data], [address]);
      const cid = await storeIPFS(dataFiles, { wrapWithDirectory: false });
      console.log(cid);
      setDataCID(cid);
    } catch (err) {
      setIsLoading(false);
      throw err;
    }
    setIsLoading(false);
  }

  return { isLoading, dataCID, setupCID, resetCID };
}
