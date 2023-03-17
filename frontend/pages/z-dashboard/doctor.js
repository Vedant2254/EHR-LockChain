import { useEffect } from "react";
import { useAccount } from "wagmi";
import { useRouter } from "next/router";
import useIsDoctorRegistered from "@/hooks/useIsDoctorRegistered";
import useIsDoctorPending from "@/hooks/useIsDoctorPending";
import DoctorController from "@/components-old/Doctor/Controller";
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
