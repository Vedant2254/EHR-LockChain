import { useAccount } from "wagmi";
import Doctor from "./Doctor";

export default function DoctorDashboard() {
  const { address } = useAccount();

  return <Doctor address={address} user="doctor" />;
}
