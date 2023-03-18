import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { useAccount } from "wagmi";
import useIsDoctorRegistered from "@/hooks/useIsDoctorRegistered";
import useIsPatient from "@/hooks/useIsPatient";

import { Tabs, LoadingOverlay } from "@mantine/core";
import EHRAppShell from "@/components/AppShell/EHRAppShell";
import RegisterPatient from "@/components/Register/RegsiterPatient";
import RegisterDoctor from "@/components/Register/RegisterDoctor";

export default function RegisterUser() {
  const [activeTab, setActiveTab] = useState("patient");

  const { address } = useAccount();
  const { isDoctorRegistered } = useIsDoctorRegistered(address);
  const { isPatient } = useIsPatient(address);
  const router = useRouter();

  useEffect(() => {
    !address && router.replace("/");
  }, [address]);

  useEffect(() => {
    isDoctorRegistered && router.replace("/doctor/dashboard");
    isPatient && router.replace("/patient/dashboard");
  }, [isPatient, isDoctorRegistered]);

  return (
    <>
      <LoadingOverlay
        visible={
          isDoctorRegistered == undefined ||
          isPatient == undefined ||
          isPatient ||
          isDoctorRegistered
        }
        overlayBlur={2}
      />
      <EHRAppShell
        navlinks={[{ label: "Registration", location: "" }]}
        Controller={() => (
          <Tabs value={activeTab} onTabChange={setActiveTab} px="xl" pt="md">
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
    </>
  );
}
