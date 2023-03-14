import useValidTxnData from "@/utils/hooks/useValidTxnData";
import { readAsTextAsync } from "@/utils/readFileAsync";
import { useContractRead } from "wagmi";
import { retrieveIPFS } from "../../../utils/ipfs";

export default function DoctorData() {
  const { address, contractAddress, abi, enabled } = useValidTxnData();

  // get hash
  const { data: drHash } = useContractRead({
    address: contractAddress,
    abi,
    functionName: "getDrHash",
    args: [address],
    enabled,
  });

  // get data from IPFS
  async function getDataFromIPFS() {
    return await retrieveIPFS(drHash);
  }

  // display data

  return (
    <button
      onClick={async () => {
        const file = (await getDataFromIPFS())[0];
        const data = await readAsTextAsync(file);
        console.log(JSON.parse(data));
      }}
    >
      Get data
    </button>
  );
}
