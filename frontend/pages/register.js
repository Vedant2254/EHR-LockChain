import { useState } from "react";
import { Tabs } from "@mantine/core";
import EHRAppShell from "@/components/AppShell/EHRAppShell";
import RegisterPatient from "@/components/Register/RegsiterPatient";
import RegisterDoctor from "@/components/Register/RegisterDoctor";

export default function RegisterUser() {
  const [activeTab, setActiveTab] = useState("patient");

  return (
    <EHRAppShell
      navlinks={[{ label: "Registration", location: "" }]}
      Controller={() => (
        <Tabs value={activeTab} onTabChange={setActiveTab}>
          <Tabs.List grow>
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
