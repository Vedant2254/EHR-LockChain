import { useAccount, useNetwork } from "wagmi";
import useSWR from "swr";

const fetcher = (url) => fetch(url).then((res) => res.json());

// This hook returns all the variables required for executing a
// smart contract function
export default function useValidTxnData() {
  const { data } = useSWR("/api/constants", fetcher);
  const { chain } = useNetwork();
  const { address } = useAccount();

  const jsonData = data ? JSON.parse(data) : null;

  const forwarderAddress = jsonData && chain && jsonData.forwarder.addresses[chain.id];
  const forwarderAbi = jsonData && chain && jsonData.forwarder.abi;

  const contractAddress = jsonData && chain && jsonData.contract.addresses[chain.id];
  const contractAbi = jsonData && chain && jsonData.contract.abi;

  const enabled = Boolean(data && chain && address);

  return { address, chain, enabled, forwarderAddress, forwarderAbi, contractAddress, contractAbi };
}
