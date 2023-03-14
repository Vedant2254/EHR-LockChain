import { useAccount, useContractRead, useNetwork } from "wagmi";
import useSWR from "swr";
import Doctor from "./Doctor";

const fetcher = (url) => fetch(url).then((res) => res.json());

export default function AllDoctors({ handleViewDoctor }) {
  const { data: contract } = useSWR("/api/constants", fetcher);
  const { chain } = useNetwork();
  const { address } = useAccount();

  const contractAddress =
    contract && chain && JSON.parse(contract).contractAddresses[chain.id];
  const abi = contract && JSON.parse(contract).abi;
  const enabled = contract && chain && address;

  const { data: allDoctors } = useContractRead({
    address: contractAddress,
    abi,
    functionName: "getAllDrs",
    enabled,
  });

  return (
    allDoctors &&
    allDoctors.map((doctor, index) => {
      return (
        <div key={index}>
          <button onClick={() => handleViewDoctor(doctor)}>{doctor}</button>
          <br />
        </div>
      );
    })
  );
}
