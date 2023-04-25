import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { useAccount } from "wagmi";
import useIsDoctorRegistered from "@/hooks/useIsDoctorRegistered";
import useIsPatient from "@/hooks/useIsPatient";

import { Tabs } from "@mantine/core";
import EHRAppShell from "@/components/AppShell/EHRAppShell";
import RegisterPatient from "@/components/Register/RegsiterPatient";
import RegisterDoctor from "@/components/Register/RegisterDoctor";
import { IconLogin } from "@tabler/icons-react";

export default function RegisterUser() {
  const [activeTab, setActiveTab] = useState("patient");

  const { address } = useAccount();
  const { isDoctorRegistered, isFetched: isDRFetched } = useIsDoctorRegistered(address);
  const { isPatient, isFetched: isPtFetched } = useIsPatient(address);
  const router = useRouter();

  useEffect(() => {
    !address && router.replace("/");
  }, [address]);

  useEffect(() => {
    isDoctorRegistered && router.replace("/doctor/dashboard");
    isPatient && router.replace("/patient/dashboard");
  }, [isPatient, isDoctorRegistered]);

  return (
    <EHRAppShell
      loading={!isDRFetched || !isPtFetched || isPatient || isDoctorRegistered}
      navlinks={[{ label: "Registration", location: "", icon: IconLogin }]}
      Controller={() => (
        <Tabs value={activeTab} onTabChange={setActiveTab} px="xl" pt="md" keepMounted={false}>
          <Tabs.List grow mb="xl">
            <Tabs.Tab value="patient">Register as patient</Tabs.Tab>
            <Tabs.Tab value="doctor">Register as doctor</Tabs.Tab>
          </Tabs.List>

          <Tabs.Panel value="patient">
            <RegisterPatient />
          </Tabs.Panel>
          <Tabs.Panel value="doctor">
            <RegisterDoctor />
          </Tabs.Panel>
        </Tabs>
      )}
    />
  );
}
