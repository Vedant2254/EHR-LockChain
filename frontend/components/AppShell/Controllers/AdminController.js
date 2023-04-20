import { useRouter } from "next/router";
import { Button, Tabs } from "@mantine/core";
import AllDoctors from "@/components/Doctor/AllDoctors";
import AllPatients from "@/components/Patient/AllPatients";
import useApproveDoctor from "@/hooks/useApproveDoctor";
import { useState } from "react";
import useDisapproveDoctor from "@/hooks/useDisapproveDoctor";

export default function AdminController() {
  const router = useRouter();
  const { location } = router.query;

  const [doctor, setDoctor] = useState(null);
  const { isDoctorPending, isApproving, runApproveDoctor } = useApproveDoctor(doctor);
  const { isDoctorRegistered, isDisapproving, runDisapproveDoctor } = useDisapproveDoctor(doctor);

  return (
    <Tabs value={location}>
      <Tabs.Panel value="all-doctors">
        <AllDoctors user="admin" setDoctor={setDoctor} />

        {doctor && isDoctorRegistered && isDoctorPending && (
          <>
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
            <Button
              onClick={async () => {
                await runDisapproveDoctor();
              }}
              variant="white"
              ml="xl"
              px="xl"
              compact
              disabled={isDisapproving}
            >
              Disapprove Doctor
            </Button>
          </>
        )}
      </Tabs.Panel>
      <Tabs.Panel value="all-patients">
        <AllPatients />
      </Tabs.Panel>
    </Tabs>
  );
}
