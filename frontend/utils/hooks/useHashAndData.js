import useValidTxnData from "@/utils/hooks/useValidTxnData";
import { useEffect, useState } from "react";
import { useContractRead } from "wagmi";
import { retrieveIPFS } from "@/utils/ipfs";
import { readAsTextAsync } from "@/utils/readFileAsync";

// This hook gets patient or doctor hash from contract, gets corresponding data from IPFS
// and returns hash, data and certificates of data
export default function useHashAndData(functionName, address) {
  const {
    address: curraddress,
    contractAddress,
    abi,
    enabled,
  } = useValidTxnData();
  const [data, setData] = useState({});
  const [certificates, setCertificates] = useState([]);

  // get hash
  const { data: drHash } = useContractRead({
    address: contractAddress,
    abi,
    functionName,
    args: [address || curraddress],
    enabled,
  });

  // get data from IPFS
  useEffect(() => {
    (async () => {
      if (!drHash) return;
      const files = await retrieveIPFS(drHash);
      const file = files[0];
      const ipfsData = JSON.parse(await readAsTextAsync(file));
      setCertificates(ipfsData.certificates);
      delete ipfsData.certificates;
      setData(ipfsData);
    })();
  }, [drHash]);

  return { drHash, data, certificates };
}
