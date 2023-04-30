import { useEffect, useState } from "react";
import { useAccount } from "wagmi";
import { useRouter } from "next/router";
import useGetDoctorOfPatient from "@/hooks/useGetDoctorOfPatient";
import useChangeEditorAccess from "@/hooks/useChangeEditorAccess";
import useRemoveEditorAccess from "@/hooks/useRemoveEditorAccess";
import AllDoctors from "@/components/Doctor/AllDoctors";
import Doctor from "@/components/Doctor/Doctor";
import Patient from "@/components/Patient/Patient";
import { Button, Tabs, Text, Title } from "@mantine/core";
import BlurLoader from "@/components/Utils/BlurLoader";

export default function PatientController() {
  const { address } = useAccount();
  const { status: statusOfGet, doctor: doctorOfPatient } = useGetDoctorOfPatient();

  const router = useRouter();
  const { location } = router.query;

  // Current doctor is used here
  // It is passed to useChangeEditorAccess
  const [data, setData] = useState(null);
  const [doctor, setDoctor] = useState(null);
  const { status: statusOfChange, runChangeEditorAccess } = useChangeEditorAccess(doctor);
  const { status: statusOfRemove, runRemoveEditorAccess } = useRemoveEditorAccess();

  useEffect(() => {
    (statusOfChange == "success" || statusOfRemove == "success") &&
      router.reload(window.location.pathname);
  }, [statusOfChange, statusOfRemove]);

  return (
    <>
      <BlurLoader
        visible={statusOfChange || statusOfRemove}
        status={statusOfChange || statusOfRemove}
      />
      <Tabs value={location}>
        <Tabs.Panel value="dashboard">
          <Patient user="patient" address={address} setData={setData} />
        </Tabs.Panel>

        <Tabs.Panel value="my-doctor">
          {address != doctorOfPatient ? (
            <>
              <Doctor user="patient" address={doctorOfPatient} />
              <Button
                onClick={() => runRemoveEditorAccess(data)}
                ml="lg"
                variant="white"
                disabled={statusOfRemove}
                compact
              >
                Revoke Access
              </Button>
            </>
          ) : (
            <Title order={4}>No doctor is allowed to view / edit your data</Title>
          )}
        </Tabs.Panel>

        <Tabs.Panel value="all-doctors">
          <AllDoctors user="patient" setDoctor={setDoctor} />

          {doctor && (
            <Button
              onClick={() => {
                doctor && doctor != doctorOfPatient
                  ? runChangeEditorAccess(data)
                  : runRemoveEditorAccess(data);
              }}
              ml="lg"
              variant="white"
              disabled={statusOfChange || statusOfRemove}
              compact
            >
              {doctor != doctorOfPatient
                ? "Grant your data access to this doctor"
                : "Revoke access"}
            </Button>
          )}
        </Tabs.Panel>
      </Tabs>
    </>
  );
}
