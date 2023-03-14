import { useAccount, useContractRead, useNetwork } from "wagmi";
import useSWR from "swr";

const fetcher = (url) => fetch(url).then((res) => res.json());

export default function AllDoctors() {
  const { data: contract } = useSWR("/api/constants", fetcher);
  const { chain } = useNetwork();
  const { address } = useAccount();

  const contractAddress =
    contract && chain && JSON.parse(contract).contractAddresses[chain.id];
  const abi = contract && JSON.parse(contract).abi;
  const enabled = contract && chain && address;

  const { data: allPatients } = useContractRead({
    address: contractAddress,
    abi,
    functionName: "getAllPats",
    enabled,
  });

  return (
    allPatients &&
    allPatients.map((patient, index) => {
      return (
        <div key={index}>
          <button>{patient}</button>
          <br />
        </div>
      );
    })
  );
}
