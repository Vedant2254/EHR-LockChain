import { isDataURL } from "@/utils/isDataURL";
import useHashAndData from "@/hooks/useHashAndData";
import { Badge, Tabs, Button, Grid, createStyles, Image, Text, Title } from "@mantine/core";
import { useState } from "react";
import useIsDoctorPending from "@/hooks/useIsDoctorPending";
import useApproveDoctor from "@/hooks/useApproveDoctor";
import GeneralDetails from "./GeneralDetails";
import Certifications from "./Certifications";

const useStyles = createStyles((theme) => ({
  image: {
    border: `1px solid ${theme.colors.dark[0]}`,
    // borderRadius: 100,
    // boxShadow: theme.shadows.sm,
  },
  socialcard: {
    border: `1px solid ${theme.colors.dark[0]}`,
    borderRadius: theme.radius.md,
  },
}));

export default function Doctor({ address }) {
  // get hash
  const { data, certificates } = useHashAndData("getDrHash", address || null);
  const { isDoctorPending } = useIsDoctorPending(address);
  const { runApproveDoctor } = useApproveDoctor(address);
  const { classes } = useStyles();

  const [activeTab, setActiveTab] = useState("general-details");

  return (
    <>
      <Grid mt="md" px="xl">
        <Grid.Col span={2}>
          <Image
            src={data.photo}
            height={200}
            width={200}
            radius={100}
            classNames={{ image: "mantine-Image-image" }}
            styles={{ image: classes.image }}
            caption={
              <>
                <Text fw={500}>{data.name}</Text>
                {data.title || "No title provided"}
              </>
            }
          />
        </Grid.Col>
        <Grid.Col span={10}>
          <Tabs
            value={activeTab}
            onTabChange={setActiveTab}
            orientation="vertical"
            placement="right"
          >
            <Tabs.List>
              <Tabs.Tab value="general-details">General Details</Tabs.Tab>
              <Tabs.Tab value="certificates">Certificates</Tabs.Tab>
            </Tabs.List>

            <Tabs.Panel className="helloworld" value="general-details">
              <GeneralDetails data={data} />
            </Tabs.Panel>
            <Tabs.Panel value="certificates">
              <Certifications certificates={certificates} />
            </Tabs.Panel>
          </Tabs>
          {isDoctorPending ? (
            <Button onClick={runApproveDoctor}>Approve Doctor</Button>
          ) : (
            <Badge color="green">Approved</Badge>
          )}
        </Grid.Col>
      </Grid>
    </>
  );
}
