import { useAccount, useContractRead, useNetwork } from "wagmi";
import useSWR from "swr";

const fetcher = (url) => fetch(url).then((res) => res.json());

export default function Doctor({ drAddress, clearCurrDoctor }) {
  const { data: contract } = useSWR("/api/constants", fetcher);
  const { chain } = useNetwork();
  const { address } = useAccount();

  const contractAddress =
    contract && chain && JSON.parse(contract).contractAddresses[chain.id];
  const abi = contract && JSON.parse(contract).abi;
  const enabled = contract && chain && address;

  const { data: drHash } = useContractRead({
    address: contractAddress,
    abi,
    functionName: "getDrHash",
    args: [drAddress],
    enabled,
  });

  console.log(drHash);

  return (
    <div>
      <div>{drHash}</div>
      <button onClick={clearCurrDoctor}>Go back</button>
    </div>
  );
}
