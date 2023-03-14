import { useEffect } from "react";
import { useContractRead, useContractWrite } from "wagmi";
import { useRouter } from "next/router";
import useValidTxnData from "@/utils/hooks/useValidTxnData";
import AdminController from "@/components/Admin/Controller";

export default function AdminDashboard() {
  const { address, contractAddress, abi, enabled } = useValidTxnData();
  const router = useRouter();

  const { data: isAdmin } = useContractRead({
    address: contractAddress,
    abi,
    functionName: "isAdmin",
    args: [address],
    enabled,
  });

  useEffect(() => {
    if (!address) router.replace("/");
    if (isAdmin != undefined && !isAdmin) router.replace("/");
  }, [address, isAdmin]);

  return <AdminController />;
}
