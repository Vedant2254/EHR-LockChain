import { useEffect } from "react";
import { useRouter } from "next/router";
import { useAccount } from "wagmi";
import useIsPatient from "@/hooks/useIsPatient";

export default function PatientDashboard() {
  const { address } = useAccount();
  const { isPatient } = useIsPatient(address);
  const router = useRouter();

  useEffect(() => {
    !address && router.replace("/");
    isPatient != undefined && !isPatient && router.replace("/");
  }, [address, isPatient]);

  return isPatient ? "Patient Dashboard" : "";
}
