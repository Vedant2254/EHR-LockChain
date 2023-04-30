import { useEffect, useState } from "react";

import { Button, Divider, Tabs, Title } from "@mantine/core";
import Doctor from "./Doctor";
import DoctorsList from "./DoctorsList";
import useGetAllDoctors from "@/hooks/useGetAllDoctors";
import useGetPendingDoctors from "@/hooks/useGetPendingDoctors";
import { IconArrowLeft } from "@tabler/icons-react";

export default function AllDoctors({ user, setDoctor }) {
  // 'all' shows list of all doctors, else doctor with address of activeTab
  const { allDoctors } = useGetAllDoctors();
  const { pendingDoctors } = useGetPendingDoctors();

  const [activeTab, setActiveTab] = useState("all");

  useEffect(() => {
    activeTab == "all" && setDoctor && setDoctor(null);
  }, [activeTab]);

  return allDoctors && allDoctors.length > 0 ? (
    <Tabs orientation="vertical" onTabChange={setActiveTab} value={activeTab} keepMounted={false}>
      <Tabs.Panel value="all">
        <Tabs.List>
          <DoctorsList
            allDoctors={allDoctors}
            pendingDoctors={pendingDoctors}
            setActiveTab={setActiveTab}
          />
        </Tabs.List>
      </Tabs.Panel>

      {allDoctors &&
        allDoctors.map((doctor, index) => {
          return (
            <Tabs.Panel key={index} value={doctor}>
              <Button
                variant="light"
                onClick={() => setActiveTab("all")}
                w="100%"
                leftIcon={<IconArrowLeft />}
              >
                Back to all doctors
              </Button>
              <Divider my="sm" />
              <Doctor address={doctor} user={user} setDoctor={setDoctor} />
            </Tabs.Panel>
          );
        })}
    </Tabs>
  ) : (
    <Title order={4}>No doctor registered yet</Title>
  );
}
