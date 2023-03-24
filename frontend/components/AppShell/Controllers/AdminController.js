import { useRouter } from "next/router";
import { Button, Tabs } from "@mantine/core";
import AllDoctors from "@/components/Doctor/AllDoctors";
import AllPatients from "@/components/Patient/AllPatients";
import useApproveDoctor from "@/hooks/useApproveDoctor";
import { useState } from "react";

export default function AdminController() {
  const router = useRouter();
  const { location } = router.query;

  const [doctor, setDoctor] = useState(null);
  const { isDoctorPending, isApproving, runApproveDoctor } = useApproveDoctor(doctor);

  return (
    <Tabs value={location}>
      <Tabs.Panel value="all-doctors">
        <AllDoctors user="admin" setDoctor={setDoctor} />

        {doctor && isDoctorPending && (
          <Button
            onClick={runApproveDoctor}
            variant="white"
            ml="xl"
            px="xl"
            compact
            disabled={isApproving}
          >
            Approve Doctor
          </Button>
        )}
      </Tabs.Panel>
      <Tabs.Panel value="all-patients">
        <AllPatients />
      </Tabs.Panel>
    </Tabs>
  );
}
