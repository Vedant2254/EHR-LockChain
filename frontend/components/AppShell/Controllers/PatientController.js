import { useState } from "react";
import { useAccount } from "wagmi";
import { useRouter } from "next/router";
import useGetDoctorOfPatient from "@/hooks/useGetDoctorOfPatient";
import useChangeEditorAccess from "@/hooks/useChangeEditorAccess";
import AllDoctors from "@/components/Doctor/AllDoctors";
import Doctor from "@/components/Doctor/Doctor";
import Patient from "@/components/Patient/Patient";
import { Button, Tabs, Text } from "@mantine/core";
import useRemoveEditorAccess from "@/hooks/useRemoveEditorAccess";

export default function PatientController() {
  const { address } = useAccount();
  const { doctor: doctorOfPatient } = useGetDoctorOfPatient();

  const router = useRouter();
  const { location } = router.query;

  // Current doctor is used here
  // It is passed to useChangeEditorAccess
  const [data, setData] = useState(null);
  const [doctor, setDoctor] = useState(null);
  const { isLoading: isChangeLoading, runChangeEditorAccess } = useChangeEditorAccess(doctor);
  const { isLoading: isRemoveLoading, runRemoveEditorAccess } = useRemoveEditorAccess();

  return (
    <Tabs value={location}>
      <Tabs.Panel value="dashboard">
        <Patient address={address} user="patient" setData={setData} />
      </Tabs.Panel>

      <Tabs.Panel value="my-doctor">
        {address != doctorOfPatient ? (
          <>
            <Doctor address={doctorOfPatient} user="patient" />
            <Button
              onClick={() => runRemoveEditorAccess(data)}
              ml="lg"
              variant="white"
              disabled={isRemoveLoading}
              compact
            >
              Revoke Access
            </Button>
          </>
        ) : (
          <Text>You don't have any doctor</Text>
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
            disabled={isChangeLoading || isRemoveLoading}
            compact
          >
            {doctor != doctorOfPatient ? "Grant your data access to this doctor" : "Revoke access"}
          </Button>
        )}
      </Tabs.Panel>
    </Tabs>
  );
}
