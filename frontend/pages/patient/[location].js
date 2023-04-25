import PatientController from "@/components/AppShell/Controllers/PatientController";
import EHRAppShell from "@/components/AppShell/EHRAppShell";
import useIsPatient from "@/hooks/useIsPatient";
import { IconHome, IconUserPlus, IconUsers } from "@tabler/icons-react";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { useAccount } from "wagmi";

export default function MainScreen() {
  const { address } = useAccount();
  const { isPatient, isFetched } = useIsPatient(address);
  const router = useRouter();

  const navlinks = [
    { label: "Dashboard", location: "dashboard", icon: IconHome },
    { label: "My doctor", location: "my-doctor", icon: IconUserPlus },
    { label: "All doctors", location: "all-doctors", icon: IconUsers },
  ];

  useEffect(() => {
    !address && router.replace("/");
    isFetched && !isPatient && router.replace("/register");
  }, [address, isPatient]);

  return (
    <EHRAppShell
      loading={!address || !isFetched || !isPatient}
      navlinks={navlinks}
      Controller={PatientController}
    />
  );
}
