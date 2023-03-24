import { useEffect, useState } from "react";
import useGetPatientData from "@/hooks/useGetPatientData";

import { Tabs } from "@mantine/core";
import GeneralDetails from "./GeneralDetails";
import MedicalCertificates from "./MedicalCertificates";
import ConfirmChangesDialog from "../Utils/ConfirmChangesDialog";
import useUpdatePatient from "@/hooks/useUpdatePatient";
import { useAccount } from "wagmi";

export default function Patient({ user, address, setData }) {
  // get data
  const { address: curraddress } = useAccount();
  const { generalData, certificates, keyData } = useGetPatientData(address);
  const { updateData } = useUpdatePatient(address, curraddress);

  const [activeTab, setActiveTab] = useState("general-details");
  const [editedGeneralData, setEditedGeneralData] = useState();
  const [editedCertificates, setEditedCertificates] = useState();
  const [isEdited, setIsEdited] = useState(false);

  useEffect(() => {
    setEditedGeneralData(generalData);
    setEditedCertificates(certificates);
    setData && setData({ generalData, certificates });
  }, [generalData, certificates]);

  useEffect(() => {
    setIsEdited(!(editedGeneralData == generalData && editedCertificates == certificates));
  }, [editedGeneralData, editedCertificates]);

  return (
    <>
      <Tabs value={activeTab} onTabChange={setActiveTab} orientation="horizontal" px="xl" mt="md">
        <Tabs.List grow>
          <Tabs.Tab value="general-details">General Details</Tabs.Tab>
          <Tabs.Tab value="certificates">Medical Certificates</Tabs.Tab>
        </Tabs.List>

        <Tabs.Panel value="general-details" mt="md" h="100%">
          <GeneralDetails data={editedGeneralData} setEditedGeneralData={setEditedGeneralData} />
        </Tabs.Panel>
        <Tabs.Panel value="certificates" mt="md" h="100%">
          <MedicalCertificates
            certificates={editedCertificates}
            setEditedCertificates={setEditedCertificates}
          />
        </Tabs.Panel>
      </Tabs>
      <ConfirmChangesDialog
        isEdited={isEdited}
        handleOnConfirm={() =>
          updateData(
            editedGeneralData != generalData ? editedGeneralData : null,
            editedCertificates != certificates ? editedCertificates : null,
            keyData
          )
        }
        handleOnReset={() => {
          setEditedGeneralData(generalData);
          setEditedCertificates(certificates);
        }}
      />
    </>
  );
}
