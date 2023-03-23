import { useEffect, useState } from "react";
import { useAccount } from "wagmi";
import { useRouter } from "next/router";
import useGetDoctorOfPatient from "@/hooks/useGetDoctorOfPatient";
import useChangeEditorAccess from "@/hooks/useChangeEditorAccess";
import AllDoctors from "@/components/Doctor/AllDoctors";
import Doctor from "@/components/Doctor/Doctor";
import Patient from "@/components/Patient/Patient";
import { Button, Tabs, Text } from "@mantine/core";

export default function PatientController() {
  const { address } = useAccount();
  const { doctor: doctorOfPatient } = useGetDoctorOfPatient();

  const router = useRouter();
  const { location } = router.query;

  // Current doctor is used here
  // It is passed to useChangeEditorAccess
  const [data, setData] = useState(null);
  const [doctor, setDoctor] = useState(null);
  const { isLoading, runChangeEditorAccess } = useChangeEditorAccess(doctor);

  return (
    <Tabs value={location}>
      <Tabs.Panel value="dashboard">
        <Patient address={address} user="patient" setData={setData} />
      </Tabs.Panel>

      <Tabs.Panel value="my-doctor">
        {address != doctorOfPatient ? (
          <Doctor address={doctorOfPatient} user="patient" />
        ) : (
          <Text>You don't have any doctor</Text>
        )}
      </Tabs.Panel>

      <Tabs.Panel value="all-doctors">
        <AllDoctors user="patient" setDoctor={setDoctor} />

        {doctor && doctor != doctorOfPatient && (
          <Button
            onClick={() => {
              doctor && doctor != doctorOfPatient && runChangeEditorAccess(data);
            }}
            variant="white"
            compact
            disabled={isLoading}
          >
            Grant access
          </Button>
        )}
      </Tabs.Panel>
    </Tabs>
  );
}
