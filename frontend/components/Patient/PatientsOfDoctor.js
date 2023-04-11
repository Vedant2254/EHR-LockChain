import useGetPatientsOfDoctor from "@/hooks/useGetPatientsOfDoctor";
import { Button, Divider, Tabs } from "@mantine/core";
import { IconArrowLeft } from "@tabler/icons-react";
import { useState } from "react";
import Patient from "./Patient";
import PatientList from "./PatientsList";

export default function PatientsOfDoctor({ user }) {
  const { patients } = useGetPatientsOfDoctor();

  const [activeTab, setActiveTab] = useState("all");

  // return <PatientList patients={patients} setActiveTab={() => {}} />;
  return (
    <Tabs orientation="vertical" onTabChange={setActiveTab} value={activeTab} keepMounted={false}>
      <Tabs.Panel value="all">
        <Tabs.List>
          <PatientList patients={patients} setActiveTab={setActiveTab} />
        </Tabs.List>
      </Tabs.Panel>

      {patients &&
        patients.map((patient, index) => {
          return (
            <Tabs.Panel key={index} value={patient}>
              <Button
                variant="light"
                onClick={() => setActiveTab("all")}
                w="100%"
                leftIcon={<IconArrowLeft />}
              >
                Back to all doctors
              </Button>
              <Divider my="sm" />
              <Patient address={patient} user={user} />
            </Tabs.Panel>
          );
        })}
    </Tabs>
  );
}
