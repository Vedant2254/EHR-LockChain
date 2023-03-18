import { useEffect } from "react";
import { useAccount } from "wagmi";
import useIsAdmin from "@/hooks/useIsAdmin";
import { useRouter } from "next/router";

import { LoadingOverlay } from "@mantine/core";
import AdminController from "@/components/AppShell/Controllers/AdminController";
import EHRAppShell from "@/components/AppShell/EHRAppShell";

export default function MainScreen() {
  const { address } = useAccount();
  const { isAdmin } = useIsAdmin(address);
  const router = useRouter();

  // no need to check for connected using address seperately as isAdmin stays undefined and user is redirected to /
  useEffect(() => {
    isAdmin != undefined && !isAdmin && router.replace("/");
  }, [isAdmin]);

  const navlinks = [
    { label: "Dashboard", location: "dashboard" },
    { label: "All doctors", location: "all-doctors" },
    { label: "All patients", location: "all-patients" },
  ];

  return (
    <>
      <LoadingOverlay visible={!isAdmin} overlayBlur={2} />
      <EHRAppShell navlinks={navlinks} Controller={AdminController} />
    </>
  );
}
