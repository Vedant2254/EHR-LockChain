import { useContractRead } from "wagmi";
import useValidTxnData from "./useValidTxnData";

export default function useGetDoctorPubKey(address) {
  const { contractAddress, abi, enabled } = useValidTxnData();

  const { data: publicKey, isFetched } = useContractRead({
    address: contractAddress,
    abi,
    functionName: "getDrPubKey",
    args: [address],
    enabled: enabled && address,
  });

  return { isFetched, publicKey };
}
