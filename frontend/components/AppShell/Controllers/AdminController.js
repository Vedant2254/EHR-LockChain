import { useRouter } from "next/router";
import { Button, Center, Loader, LoadingOverlay, Tabs, Text } from "@mantine/core";
import AllDoctors from "@/components/Doctor/AllDoctors";
import AllPatients from "@/components/Patient/AllPatients";
import useApproveDoctor from "@/hooks/useApproveDoctor";
import { useState } from "react";
import useDisapproveDoctor from "@/hooks/useDisapproveDoctor";

export default function AdminController() {
  const router = useRouter();
  const { location } = router.query;

  const [doctor, setDoctor] = useState(null);
  const { status: statusOfApprove, isDoctorPending, runApproveDoctor } = useApproveDoctor(doctor);
  const {
    status: statusOfDisapprove,
    isDoctorRegistered,
    runDisapproveDoctor,
  } = useDisapproveDoctor(doctor);

  return (
    <>
      <LoadingOverlay
        visible={doctor && (statusOfApprove || statusOfDisapprove)}
        loader={
          <>
            <Center>
              <Loader />
            </Center>
            <Text>{statusOfApprove || statusOfDisapprove}</Text>
          </>
        }
        overlayBlur={4}
      />
      <Tabs value={location} keepMounted={false}>
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
                disabled={statusOfApprove}
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
                disabled={statusOfDisapprove}
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
    </>
  );
}
