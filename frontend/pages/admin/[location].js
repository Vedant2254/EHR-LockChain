import { useEffect } from "react";
import { useAccount } from "wagmi";
import useIsAdmin from "@/hooks/useIsAdmin";
import { useRouter } from "next/router";

import AdminController from "@/components/AppShell/Controllers/AdminController";
import EHRAppShell from "@/components/AppShell/EHRAppShell";
import { IconUsers } from "@tabler/icons-react";

export default function MainScreen() {
  const { address } = useAccount();
  const { isAdmin, isFetched } = useIsAdmin(address);
  const router = useRouter();

  useEffect(() => {
    !address && router.replace("/");
    isFetched && !isAdmin && router.replace("/");
  }, [address, isAdmin]);

  const navlinks = [
    { label: "All doctors", location: "all-doctors", icon: IconUsers },
    { label: "All patients", location: "all-patients", icon: IconUsers },
  ];

  return (
    <EHRAppShell
      loading={!address || !isFetched || !isAdmin}
      navlinks={navlinks}
      Controller={AdminController}
    />
  );
}
