import { useEffect } from "react";
import { useAccount } from "wagmi";
import useIsAdmin from "@/hooks/useIsAdmin";
import { useRouter } from "next/router";

import AdminController from "@/components/AppShell/Controllers/AdminController";
import EHRAppShell from "@/components/AppShell/EHRAppShell";

export default function MainScreen() {
  const { address } = useAccount();
  const { isAdmin, isFetched } = useIsAdmin(address);
  const router = useRouter();

  useEffect(() => {
    !address && router.replace("/");
    isFetched && !isAdmin && router.replace("/");
  }, [address, isAdmin]);

  const navlinks = [
    { label: "Dashboard", location: "dashboard" },
    { label: "All doctors", location: "all-doctors" },
    { label: "All patients", location: "all-patients" },
  ];

  return (
    <EHRAppShell
      loading={!isFetched || !isAdmin}
      navlinks={navlinks}
      Controller={AdminController}
    />
  );
}
