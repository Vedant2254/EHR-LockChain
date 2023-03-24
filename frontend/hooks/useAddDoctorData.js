import { useState } from "react";
import { readAsDataURLAsync } from "@/utils/readFileAsync";
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
      // changes files to dataURLS in data
      const { photo } = data;
      if (photo && photo.constructor.name == "File") data.photo = await readAsDataURLAsync(photo);

      // changes files to dataURLS in data
      for (let i in data.certificates) {
        const { media } = data.certificates[i];
        if (media.constructor.name == "File")
          data.certificates[i].media = await readAsDataURLAsync(media);
      }

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
