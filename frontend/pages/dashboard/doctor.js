import { useState, useEffect } from "react";
import { useAccount, useContractWrite } from "wagmi";
import { useRouter } from "next/router";
import useIsDoctorRegistered from "@/hooks/useIsDoctorRegistered";
import useIsDoctorPending from "@/hooks/useIsDoctorPending";
import useIsDoctor from "@/hooks/useIsDoctor";
import useValidTxnData from "@/hooks/useValidTxnData";
import { getPublicKey } from "@/utils/metamask";
import DoctorController from "@/components/Doctor/Controller";
import useRegisterDoctorConfirm from "@/hooks/useRegisterDoctorConfirm";

export default function DoctorDashboard() {
  const { address } = useAccount();
  const { isDoctorRegistered } = useIsDoctorRegistered(address);
  const { isDoctorPending } = useIsDoctorPending(address);
  const { isDoctor, registerDrConfirm } = useRegisterDoctorConfirm();
  const router = useRouter();

  useEffect(() => {
    if (!address) router.replace("/");
    if (isDoctorRegistered != undefined && !isDoctorRegistered)
      router.replace("/register/doctor");
  }, [address, isDoctorRegistered]);

  return (
    <>
      {!isDoctor && (
        <button onClick={registerDrConfirm} disabled={isDoctorPending}>
          Confirm Registration
        </button>
      )}
      <DoctorController />
    </>
  );
}
