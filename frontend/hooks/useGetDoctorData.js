import useValidTxnData from "@/hooks/useValidTxnData";
import { useEffect, useState } from "react";
import { useContractRead } from "wagmi";
import { retrieveIPFS } from "@/utils/ipfs";
import { readAsTextAsync } from "@/utils/readFileAsync";
import useStatus from "./useStatus";

// This hook gets patient or doctor hash from contract, gets corresponding data from IPFS
// and returns hash, data and certificates of data
export default function useGetDoctorData(address) {
  const { contractAddress, abi, enabled } = useValidTxnData();
  const [data, setData] = useState({ generalData: {}, certificates: [] });

  const [isRetrieving, setIsRetrieving] = useState(false);
  const [retrieved, setRetrieved] = useState(false);
  const [failed, setFailed] = useState(false);
  const status = useStatus({ retrieving: isRetrieving, success: retrieved, failure: failed });

  // get hash
  const { data: hashData } = useContractRead({
    address: contractAddress,
    abi,
    functionName: "getDrHash",
    args: [address],
    enabled: enabled && address,
  });

  async function getData() {
    setIsRetrieving(true);
    try {
      const ipfsData = await retrieveIPFS(hashData);
      const certificates = ipfsData.certificates;
      delete ipfsData.certificates;
      ipfsData && certificates && setData({ generalData: ipfsData, certificates });
      setRetrieved(true);
    } catch (err) {
      console.log(err);
      setFailed(true);
    }
    setIsRetrieving(false);
  }

  // get data from IPFS
  useEffect(() => {
    hashData && getData();
  }, [hashData]);

  return { status, hashData, ...data, getData };
}
