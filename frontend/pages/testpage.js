import useGetPatientData from "@/hooks/useGetPatientData";
import { useAccount } from "wagmi";

export default function TestPage() {
  const { address } = useAccount();
  const { generalHash } = useGetPatientData(address);

  console.log(generalHash);
}
