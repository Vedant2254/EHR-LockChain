import { useRouter } from "next/router";
import { Tabs } from "@mantine/core";
import DoctorDashboard from "@/components/Doctor/Dashboard";
import PatientsOfDoctor from "@/components/Patient/PatientsOfDoctor";

export default function DoctorController() {
  const router = useRouter();
  const { location } = router.query;

  return (
    <Tabs value={location}>
      <Tabs.Panel value="dashboard">
        <DoctorDashboard />
      </Tabs.Panel>
      <Tabs.Panel value="my-patients">
        <PatientsOfDoctor />
      </Tabs.Panel>
    </Tabs>
  );
}
