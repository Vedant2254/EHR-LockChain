import useGetDoctorData from "@/hooks/useGetDoctorData";
import { Box, Tabs } from "@mantine/core";
import { useEffect, useState } from "react";
import GeneralDetails from "./GeneralDetails";
import Certifications from "./Certifications";
import DoctorButtons from "./DoctorButtons";
import ConfirmChangesDialog from "../Utils/ConfirmChangesDialog";
import useUpdateDoctor from "@/hooks/useUpdateDoctor";
import useCheckAccess from "@/hooks/useCheckAccess";

export default function Doctor({ user, address, setDoctor }) {
  // get data
  const { generalData, certificates } = useGetDoctorData(address);
  const { updateData } = useUpdateDoctor();
  const { access } = useCheckAccess(address);

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
          <DoctorButtons user={user} address={address} />

          <Tabs.Panel value="general-details" mt="md">
            <GeneralDetails
              access={access}
              data={editedGeneralData}
              setEditedGeneralData={setEditedGeneralData}
            />
          </Tabs.Panel>
          <Tabs.Panel value="certificates" mt="md">
            <Certifications
              access={access}
              certificates={editedCertificates}
              setEditedCertificates={setEditedCertificates}
            />
          </Tabs.Panel>
        </Box>
      </Tabs>
      <ConfirmChangesDialog
        isEdited={isEdited}
        handleOnConfirm={() => updateData(editedGeneralData, editedCertificates)}
        handleOnReset={() => {
          setEditedGeneralData(generalData);
          setEditedCertificates(certificates);
        }}
      />
    </>
  );
}
