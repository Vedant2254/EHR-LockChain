import { useEffect } from "react";
import { useContractRead } from "wagmi";
import { useRouter } from "next/router";
import useValidTxnData from "@/utils/hooks/useValidTxnData";
import AdminController from "@/components/Admin/Controller";

export default function AdminDashboard() {
  const { address, contractAddress, abi, enabled } = useValidTxnData();
  const router = useRouter();

  const { data: isAdmin, isFetching } = useContractRead({
    address: contractAddress,
    abi,
    functionName: "isAdmin",
    args: [address],
    onError: (err) => console.log(err),
    enabled,
  });

  useEffect(() => {
    if (!address) router.replace("/");
    if (isAdmin != undefined && !isAdmin) router.replace("/");
  }, [isAdmin]);

  return isAdmin ? <AdminController /> : "";
}
