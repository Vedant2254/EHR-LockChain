import { useState } from "react";
import { useRouter } from "next/router";
import { useContractRead } from "wagmi";
import useValidTxnData from "@/hooks/useValidTxnData";

import { Button, Tabs } from "@mantine/core";
import WhiteButtonBox from "../Utils/WhiteButtonBox";
import Doctor from "./Doctor";

export default function AllDoctors() {
  const { contractAddress, abi, enabled } = useValidTxnData();
  const router = useRouter();

  // 'all' shows list of all doctors, else doctor with address of activeTab
  const [activeTab, setActiveTab] = useState("all");

  const { data: allDoctors } = useContractRead({
    address: contractAddress,
    abi,
    functionName: "getAllDrs",
    enabled,
  });

  const { data: pendingDoctors } = useContractRead({
    address: contractAddress,
    abi,
    functionName: "getPendingDrs",
    enabled,
  });

  return (
    <>
      <Tabs orientation="vertical" onTabChange={setActiveTab} value={activeTab}>
        <Tabs.Panel value="all">
          <Tabs.List>
            {allDoctors &&
              allDoctors.map((doctor, index) => {
                // return <WhiteButtonBox doctor={doctor} />;
                return <Tabs.Tab value={doctor}>{doctor}</Tabs.Tab>;
              })}
          </Tabs.List>
        </Tabs.Panel>

        {allDoctors &&
          allDoctors.map((doctor, index) => {
            return (
              <Tabs.Panel value={doctor}>
                <Button onClick={() => setActiveTab("all")}>Back</Button>
                <Doctor />
              </Tabs.Panel>
            );
          })}
      </Tabs>
    </>
  );
}
