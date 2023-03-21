import { useRouter } from "next/router";
import { Tabs } from "@mantine/core";
import AdminDashboard from "@/components/Admin/Dashboard";
import AllDoctors from "@/components/Doctor/AllDoctors";
import AllPatients from "@/components/Patient/AllPatients";

export default function AdminController() {
  const router = useRouter();
  const { location } = router.query;

  return (
    <Tabs value={location}>
      <Tabs.Panel value="all-doctors">
        <AllDoctors user="admin" />
      </Tabs.Panel>
      <Tabs.Panel value="all-patients">
        <AllPatients />
      </Tabs.Panel>
    </Tabs>
  );
}
