import { useRouter } from "next/router";
import { Tabs } from "@mantine/core";
import AllDoctors from "@/components/Doctor/AllDoctors";
import { useAccount } from "wagmi";
import useGetDoctorOfPatient from "@/hooks/useGetDoctorOfPatient";
import Doctor from "@/components/Doctor/Doctor";
import Patient from "@/components/Patient/Patient";
import { Text } from "@mantine/core";

export default function PatientController() {
  const { address } = useAccount();
  const { doctor } = useGetDoctorOfPatient();

  const router = useRouter();
  const { location } = router.query;

  return (
    <Tabs value={location}>
      <Tabs.Panel value="dashboard">
        <Patient address={address} user="patient" />
      </Tabs.Panel>
      <Tabs.Panel value="my-doctor">
        {address != doctor ? (
          <Doctor address={doctor} user="patient" />
        ) : (
          <Text>You don't have any doctor</Text>
        )}
      </Tabs.Panel>
      <Tabs.Panel value="all-doctors">
        <AllDoctors user="patient" />
      </Tabs.Panel>
    </Tabs>
  );
}
