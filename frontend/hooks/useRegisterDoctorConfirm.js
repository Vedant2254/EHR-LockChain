import { useEffect, useState } from "react";
import { useContractWrite } from "wagmi";
import useIsDoctor from "@/hooks/useIsDoctor";
import useValidTxnData from "./useValidTxnData";
import { getPublicKey } from "@/utils/metamask";

export default function useRegisterDoctorConfirm() {
  const { address, contractAddress, abi, enabled } = useValidTxnData();
  const { isDoctor, runIsDoctor } = useIsDoctor(address);

  const [publicKey, setPublicKey] = useState(null);

  const { writeAsync: runRegisterDrConfirm } = useContractWrite({
    address: contractAddress,
    abi,
    functionName: "registerDrConfirm",
    args: [publicKey],
    enabled: enabled && publicKey,
  });

  async function registerDrConfirm() {
    setPublicKey(await getPublicKey(address));
  }

  useEffect(() => {
    (async () => {
      if (publicKey) {
        const response = await runRegisterDrConfirm();
        await response.wait(1);
        await runIsDoctor();
        setPublicKey(null);
      }
    })();
  }, [publicKey]);

  return { isDoctor, runIsDoctor, registerDrConfirm };
}
