import { useAccount, useNetwork } from "wagmi";
import useSWR from "swr";
import { useRouter } from "next/router";

const fetcher = (url) => fetch(url).then((res) => res.json());

export default function useValidTxnData() {
  const { data: contract } = useSWR("/api/constants", fetcher);
  const { chain } = useNetwork();
  const { address } = useAccount();
  const router = useRouter();

  const contractAddress =
    contract && chain && JSON.parse(contract).contractAddresses[chain.id];
  const abi = contract && JSON.parse(contract).abi;
  const enabled = contract && chain && address;

  return { address, chain, contractAddress, abi, enabled };
}
