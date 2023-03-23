import { useRouter } from "next/router";
import { Tabs } from "@mantine/core";
import Doctor from "@/components/Doctor/Doctor";
import PatientsOfDoctor from "@/components/Patient/PatientsOfDoctor";
import { useAccount } from "wagmi";

export default function DoctorController() {
  const { address } = useAccount();
  const router = useRouter();
  const { location } = router.query;

  return (
    <Tabs value={location}>
      <Tabs.Panel value="dashboard">
        <Doctor address={address} user="doctor" />
      </Tabs.Panel>
      <Tabs.Panel value="my-patients">
        <PatientsOfDoctor user="doctor" />
      </Tabs.Panel>
    </Tabs>
  );
}
