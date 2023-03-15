import { useState, useEffect } from "react";
import { useContractRead, useContractWrite } from "wagmi";
import { useRouter } from "next/router";
import { getPublicKey } from "../../utils/metamask";
import useValidTxnData from "@/utils/hooks/useValidTxnData";
import DoctorController from "../../components/Doctor/Controller";

export default function DoctorDashboard() {
  const { address, contractAddress, abi, enabled } = useValidTxnData();
  const [publicKey, setPublicKey] = useState(null);
  const router = useRouter();

  const { data: isDoctorRegistered } = useContractRead({
    address: contractAddress,
    abi,
    functionName: "isDoctorRegistered",
    args: [address],
    enabled,
  });

  const { data: isDoctor, refetch: runIsDoctor } = useContractRead({
    address: contractAddress,
    abi,
    functionName: "isDoctor",
    args: [address],
    enabled: false,
  });

  const { writeAsync: runConfirmAddDr } = useContractWrite({
    address: contractAddress,
    abi,
    functionName: "confirmAddDr",
    args: [publicKey],
    enabled,
  });

  async function confirmAddDr() {
    if (publicKey) {
      try {
        await runConfirmAddDr();
        await runIsDoctor();
      } catch (e) {
        console.log(e);
      }
      setPublicKey(null);
    }
  }

  useEffect(() => {
    (async () => {
      await confirmAddDr();
    })();
  }, [publicKey]);

  useEffect(() => {
    if (!address) router.replace("/");
    if (isDoctorRegistered != undefined && !isDoctorRegistered)
      router.replace("/register/doctor");
  }, [address, isDoctorRegistered]);

  return isDoctorRegistered ? (
    <>
      {!isDoctor && (
        <button
          onClick={async () => {
            setPublicKey(await getPublicKey(address));
          }}
        >
          Confirm Registration
        </button>
      )}
      <DoctorController />
    </>
  ) : (
    ""
  );
}
