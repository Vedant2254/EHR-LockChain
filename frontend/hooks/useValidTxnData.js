import { useAccount, useNetwork } from "wagmi";
import useSWR from "swr";

const fetcher = (url) => fetch(url).then((res) => res.json());

// This hook returns all the variables required for executing a
// smart contract function
export default function useValidTxnData() {
  const { data: contract } = useSWR("/api/constants", fetcher);
  const { chain } = useNetwork();
  const { address } = useAccount();
  // const [enabled, setEnabled] = useState(false);

  const contractAddress = contract && chain && JSON.parse(contract).contractAddresses[chain.id];
  const abi = contract && JSON.parse(contract).abi;
  const enabled = Boolean(contract && chain && address);

  // console.log(contractAddress);

  return { address, chain, contractAddress, abi, enabled };
}
