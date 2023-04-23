import { useEffect } from "react";
import { useAccount } from "wagmi";
import { useRouter } from "next/router";
import useIsDoctorRegistered from "@/hooks/useIsDoctorRegistered";
import DoctorController from "@/components/AppShell/Controllers/DoctorController";
import EHRAppShell from "@/components/AppShell/EHRAppShell";

export default function MainScreen() {
  const navlinks = [
    { label: "Dashboard", location: "dashboard" },
    { label: "Patients", location: "my-patients" },
  ];

  const { address } = useAccount();
  const { isDoctorRegistered, isFetched } = useIsDoctorRegistered(address);
  const router = useRouter();

  useEffect(() => {
    !address && router.replace("/");
    isFetched && !isDoctorRegistered && router.replace("/register");
  }, [address, isDoctorRegistered]);

  return (
    <EHRAppShell
      loading={!address || !isFetched || !isDoctorRegistered}
      navlinks={navlinks}
      Controller={DoctorController}
    />
  );
}
