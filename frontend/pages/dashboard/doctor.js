import { useEffect } from "react";
import { useContractRead, useContractWrite } from "wagmi";
import { useRouter } from "next/router";
import useValidTxnData from "@/utils/hooks/useValidTxnData";
import DoctorController from "../../components/Doctor/Controller";

export default function DoctorDashboard() {
  const { address, contractAddress, abi, enabled } = useValidTxnData();
  const router = useRouter();

  const { data: isDoctorRegistered } = useContractRead({
    address: contractAddress,
    abi,
    functionName: "isDoctorRegistered",
    args: [address],
    enabled,
  });

  useEffect(() => {
    if (!address) router.replace("/");
    if (isDoctorRegistered != undefined && !isDoctorRegistered)
      router.replace("/");
  }, [address, isDoctorRegistered]);

  return <DoctorController />;
}
