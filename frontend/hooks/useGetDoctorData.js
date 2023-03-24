import useValidTxnData from "@/hooks/useValidTxnData";
import { useEffect, useState } from "react";
import { useContractRead } from "wagmi";
import { retrieveIPFS } from "@/utils/ipfs";
import { readAsTextAsync } from "@/utils/readFileAsync";

// This hook gets patient or doctor hash from contract, gets corresponding data from IPFS
// and returns hash, data and certificates of data
export default function useGetDoctorData(address) {
  const { contractAddress, abi, enabled } = useValidTxnData();
  const [data, setData] = useState({ generalData: {}, certificates: [] });

  // get hash
  const { data: hashData } = useContractRead({
    address: contractAddress,
    abi,
    functionName: "getDrHash",
    args: [address],
    enabled: enabled && address,
  });

  async function getData() {
    try {
      const files = await retrieveIPFS(hashData);
      const file = files[0];
      const ipfsData = JSON.parse(await readAsTextAsync(file));
      const certificates = ipfsData.certificates;
      delete ipfsData.certificates;
      ipfsData && certificates && setData({ generalData: ipfsData, certificates });
    } catch (err) {
      console.log(err);
    }
  }

  // get data from IPFS
  useEffect(() => {
    hashData && getData();
  }, [hashData]);

  return { hashData, ...data };
}
