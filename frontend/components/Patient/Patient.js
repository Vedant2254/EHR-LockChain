import { useEffect, useState } from "react";
import useGetPatientData from "@/hooks/useGetPatientData";

import { Center, Flex, Loader, LoadingOverlay, Tabs, Text } from "@mantine/core";
import GeneralDetails from "./GeneralDetails";
import MedicalCertificates from "./MedicalCertificates";
import ConfirmChangesDialog from "../Utils/ConfirmChangesDialog";
import useUpdatePatient from "@/hooks/useUpdatePatient";
import { useAccount } from "wagmi";
import useCheckAccess from "@/hooks/useCheckAccess";
import GeneralDataSkeleton from "../Utils/GeneralDataSkeleton";
import CertificatesSkeleton from "../Utils/CertificatesSkeleton";

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

  function deepEqual(x, y) {
    return x && y && typeof x === "object" && typeof y === "object"
      ? Object.keys(x).length === Object.keys(y).length &&
          Object.keys(x).reduce(function (isEqual, key) {
            return isEqual && deepEqual(x[key], y[key]);
          }, true)
      : x === y;
  }

  useEffect(() => {
    if (generalData && data) {
      setEditedGeneralData(generalData);
      data && setEditedCertificates(data.certificates);
      setData &&
        setData({
          generalData,
          certificatesData: { previousVersion, data, digitalSignatureOfLastUpdater },
          keyData,
        });
    }
  }, [generalData, data]);

  useEffect(() => {
    generalData &&
      data &&
      setIsEdited(
        !(
          deepEqual(generalData, editedGeneralData) &&
          deepEqual(data.certificates, editedCertificates)
        )
      );
  }, [editedGeneralData, editedCertificates]);

  return (
    <>
      <LoadingOverlay
        visible={statusOfUpdate}
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
          {statusOfGet != "success, please reload the page" ? (
            <GeneralDataSkeleton />
          ) : (
            <GeneralDetails
              address={address}
              access={access}
              data={editedGeneralData}
              setEditedGeneralData={setEditedGeneralData}
            />
          )}
        </Tabs.Panel>
        <Tabs.Panel value="certificates" mt="md" h="100%">
          {statusOfGet != "success, please reload the page" ? (
            <CertificatesSkeleton />
          ) : (
            <MedicalCertificates
              access={access}
              certificates={editedCertificates}
              setEditedCertificates={setEditedCertificates}
            />
          )}
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
            !deepEqual(generalData, editedGeneralData) ? editedGeneralData : null,
            !deepEqual(data.certificates, editedCertificates) ? editedCertificates : null,
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
