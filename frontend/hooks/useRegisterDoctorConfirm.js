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

  useEffect(() => {
    publicKey &&
      (async () => {
        try {
          const response = await runRegisterDrConfirm();
          await response.wait(1);
          await runIsDoctor();
        } catch (err) {
          console.log(err);
        }
        setPublicKey(null);
      })();
  }, [publicKey]);

  async function registerDrConfirm() {
    setPublicKey(await getPublicKey(address));
  }

  return { isDoctor, runIsDoctor, registerDrConfirm };
}
