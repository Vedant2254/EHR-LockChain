import { useContractWrite, usePrepareContractWrite } from "wagmi";
import useValidTxnData from "./useValidTxnData";

export default function useChangeEditorAccess(address) {
  const { contractAddress, abi, enabled } = useValidTxnData();

  const { config: changeEditorAccessConfig } = usePrepareContractWrite({
    address: contractAddress,
    abi,
    functionName: "changeEditorAccess",
    args: [address],
    enabled: enabled && address,
  });

  const { data: changeEditorAccessResponse, writeAsync: changeEditorAccess } =
    useContractWrite(changeEditorAccessConfig);

  return { changeEditorAccessResponse, changeEditorAccess };
}
