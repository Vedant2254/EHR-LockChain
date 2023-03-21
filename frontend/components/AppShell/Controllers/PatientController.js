import { useRouter } from "next/router";
import { Tabs } from "@mantine/core";
import AllDoctors from "@/components/Doctor/AllDoctors";
import Doctor from "@/components/Doctor/Doctor";
import Patient from "@/components/Patient/Patient";
import { useAccount } from "wagmi";
import useGetDoctorOfPatient from "@/hooks/useGetDoctorOfPatient";

export default function PatientController() {
  const { address } = useAccount();
  const { doctorOfPatient } = useGetDoctorOfPatient();
  const router = useRouter();
  const { location } = router.query;

  return (
    <Tabs value={location}>
      {/* <Tabs.Panel value="dashboard">
        <Patient address={address} user="patient" />
      </Tabs.Panel> */}
      <Tabs.Panel value="my-doctor">
        {doctorOfPatient != address ? <Doctor address={doctorOfPatient} user="patient" /> : ""}
      </Tabs.Panel>
      <Tabs.Panel value="all-doctors">
        <AllDoctors user="patient" />
      </Tabs.Panel>
    </Tabs>
  );
}
