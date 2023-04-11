import { useEffect, useState } from "react";
import useGetPatientData from "@/hooks/useGetPatientData";

import { Center, Loader, LoadingOverlay, Tabs, Text } from "@mantine/core";
import GeneralDetails from "./GeneralDetails";
import MedicalCertificates from "./MedicalCertificates";
import ConfirmChangesDialog from "../Utils/ConfirmChangesDialog";
import useUpdatePatient from "@/hooks/useUpdatePatient";
import { useAccount } from "wagmi";
import useCheckAccess from "@/hooks/useCheckAccess";

export default function Patient({ user, address, setData }) {
  // get data
  const { address: curraddress } = useAccount();
  const {
    status: statusOfGet,
    generalData,
    certificatesData: { previousVersion, data, digitalSignatureOfLastUpdater },
    keyData,
  } = useGetPatientData(address);
  const { status: statusOfUpdate, updateData } = useUpdatePatient(address, curraddress);
  const { access } = useCheckAccess(address);

  const [activeTab, setActiveTab] = useState("general-details");
  const [editedGeneralData, setEditedGeneralData] = useState();
  const [editedCertificates, setEditedCertificates] = useState();
  const [isEdited, setIsEdited] = useState(false);

  useEffect(() => {
    if (generalData && data) {
      setEditedGeneralData(generalData);
      data && setEditedCertificates(data.certificates);
      setData && setData({ generalData, certificates: data.certificates });
    }
  }, [generalData, data]);

  useEffect(() => {
    generalData &&
      data &&
      setIsEdited(!(editedGeneralData == generalData && editedCertificates == data.certificates));
  }, [editedGeneralData, editedCertificates]);

  console.log(statusOfGet);

  return (
    <>
      <LoadingOverlay
        visible={statusOfGet != "success"}
        overlayBlur={4}
        loader={
          <>
            <Center>
              <Loader />
            </Center>
            <Text>{statusOfGet}</Text>
          </>
        }
      />
      <LoadingOverlay
        visible={statusOfUpdate && statusOfUpdate != "success"}
        overlayBlur={4}
        loader={
          <>
            <Center>
              <Loader />
            </Center>
            <Text>{statusOfUpdate}</Text>
          </>
        }
      />
      <Tabs value={activeTab} onTabChange={setActiveTab} orientation="horizontal" px="xl" mt="md">
        <Tabs.List grow>
          <Tabs.Tab value="general-details">General Details</Tabs.Tab>
          <Tabs.Tab value="certificates">Medical Certificates</Tabs.Tab>
        </Tabs.List>

        <Tabs.Panel value="general-details" mt="md" h="100%">
          <GeneralDetails
            access={access}
            data={editedGeneralData}
            setEditedGeneralData={setEditedGeneralData}
          />
        </Tabs.Panel>
        <Tabs.Panel value="certificates" mt="md" h="100%">
          <MedicalCertificates
            access={access}
            certificates={editedCertificates}
            setEditedCertificates={setEditedCertificates}
          />
        </Tabs.Panel>
      </Tabs>
      <ConfirmChangesDialog
        isEdited={isEdited}
        handleOnConfirm={async () => {
          await updateData(
            {
              prevCertificatesData: { previousVersion, data, digitalSignatureOfLastUpdater },
              prevKeyData: keyData,
            },
            editedGeneralData != generalData ? editedGeneralData : null,
            editedCertificates != data.certificates ? editedCertificates : null,
            keyData
          );
        }}
        handleOnReset={() => {
          setEditedGeneralData(generalData);
          setEditedCertificates(data.certificates);
        }}
      />
    </>
  );
}
