import { useState } from "react";

import { ActionIcon, Button, Divider, Tabs, Text } from "@mantine/core";
import Doctor from "./Doctor";
import DoctorButtonsList from "./DoctorButtonsList";
import useGetAllDoctors from "@/hooks/useGetAllDoctors";
import useGetPendingDoctors from "@/hooks/useGetPendingDoctors";
import { IconArrowLeft } from "@tabler/icons-react";

export default function AllDoctors() {
  // 'all' shows list of all doctors, else doctor with address of activeTab
  const { allDoctors } = useGetAllDoctors();
  const { pendingDoctors } = useGetPendingDoctors();

  const [activeTab, setActiveTab] = useState("all");

  return (
    <>
      <Tabs orientation="vertical" onTabChange={setActiveTab} value={activeTab}>
        <Tabs.Panel value="all">
          <Tabs.List>
            <DoctorButtonsList
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
                <Divider mt="sm" />
                <Doctor address={doctor} />
              </Tabs.Panel>
            );
          })}
      </Tabs>
    </>
  );
}
