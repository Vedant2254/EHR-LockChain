import { useRouter } from "next/router";
import { Tabs } from "@mantine/core";
import PatientDashboard from "@/components/Patient/Dashboard";
import AllDoctors from "@/components/Doctor/AllDoctors";
import Doctor from "@/components/Doctor/Doctor";

export default function PatientController() {
  const router = useRouter();
  const { location } = router.query;

  if (location == "dashboard") return <PatientDashboard />;
  if (location == "my-doctor") return <Doctor />;
  if (location == "all-doctors") return <AllDoctors />;

  return (
    <Tabs value={location}>
      <Tabs.Panel value="dashboard">
        <PatientDashboard />
      </Tabs.Panel>
      <Tabs.Panel value="my-doctor">
        <Doctor />
      </Tabs.Panel>
      <Tabs.Panel value="all-doctors">
        <AllDoctors />
      </Tabs.Panel>
    </Tabs>
  );
}
