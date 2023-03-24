import useGetDoctorData from "@/hooks/useGetDoctorData";
import { Box, Tabs } from "@mantine/core";
import { useEffect, useState } from "react";
import GeneralDetails from "./GeneralDetails";
import Certifications from "./Certifications";
import DoctorButtons from "./DoctorButtons";
import ConfirmChangesDialog from "../Utils/ConfirmChangesDialog";
import useUpdateDoctor from "@/hooks/useUpdateDoctor";

export default function Doctor({ user, address, setDoctor }) {
  // get data
  const { generalData, certificates } = useGetDoctorData(address);
  const { updateData } = useUpdateDoctor();

  const [activeTab, setActiveTab] = useState("general-details");
  const [editedGeneralData, setEditedGeneralData] = useState();
  const [editedCertificates, setEditedCertificates] = useState();
  const [isEdited, setIsEdited] = useState(false);

  useEffect(() => {
    setEditedGeneralData(generalData);
    setEditedCertificates(certificates);
  }, [generalData, certificates]);

  useEffect(() => {
    setIsEdited(!(editedGeneralData == generalData && editedCertificates == certificates));
  }, [editedGeneralData, editedCertificates]);

  useEffect(() => {
    setDoctor && setDoctor(address);
  }, [address]);

  return (
    <>
      <Tabs value={activeTab} onTabChange={setActiveTab} orientation="horizontal" px="xl" mt="md">
        <Tabs.List grow>
          <Tabs.Tab value="general-details">General Details</Tabs.Tab>
          <Tabs.Tab value="certificates">Doctor's Certificates</Tabs.Tab>
        </Tabs.List>

        <Box my="md">
          <DoctorButtons address={address} user={user} />

          <Tabs.Panel value="general-details" mt="md">
            <GeneralDetails data={editedGeneralData} setEditedGeneralData={setEditedGeneralData} />
          </Tabs.Panel>
          <Tabs.Panel value="certificates" mt="md">
            <Certifications
              certificates={editedCertificates}
              setEditedCertificates={setEditedCertificates}
            />
          </Tabs.Panel>
        </Box>
      </Tabs>
      <ConfirmChangesDialog
        isEdited={isEdited}
        handleOnConfirm={() => updateData({ ...generalData, certificates })}
        handleOnReset={() => {
          setEditedGeneralData(generalData);
          setEditedCertificates(certificates);
        }}
      />
    </>
  );
}
