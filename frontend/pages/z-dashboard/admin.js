import { useEffect } from "react";
import { useAccount } from "wagmi";
import { useRouter } from "next/router";
import useIsAdmin from "@/hooks/useIsAdmin";
import AdminController from "@/components-old/Admin/Controller";

export default function AdminDashboard() {
  const { address } = useAccount();
  const { isAdmin } = useIsAdmin(address);
  const router = useRouter();

  useEffect(() => {
    !address && router.replace("/");
    isAdmin != undefined && !isAdmin && router.replace("/");
  }, [address, isAdmin]);

  return isAdmin ? <AdminController /> : "";
}
