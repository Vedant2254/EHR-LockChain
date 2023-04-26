import { useEffect, useState } from "react";
import useGetPatientData from "@/hooks/useGetPatientData";

import { Badge, Group, Tabs, Text } from "@mantine/core";
import GeneralDetails from "./GeneralDetails";
import MedicalCertificates from "./MedicalCertificates";
import ConfirmChangesDialog from "../Utils/ConfirmChangesDialog";
import useUpdatePatient from "@/hooks/useUpdatePatient";
import { useAccount } from "wagmi";
import useCheckAccess from "@/hooks/useCheckAccess";
import GeneralDataSkeleton from "../Utils/GeneralDataSkeleton";
import CertificatesSkeleton from "../Utils/CertificatesSkeleton";
import { useRouter } from "next/router";
import Retry from "../Utils/Retry";
import SkeletonLoader from "../Utils/SkeletonLoader";
import BlurLoader from "../Utils/BlurLoader";
import deepEqual from "@/utils/deepEqual";
import useSignCertificates from "@/hooks/useSignCertificates";

export default function Patient({ user, address, setData }) {
  // get data
  const router = useRouter();
  const { address: curraddress } = useAccount();
  const {
    status: statusOfGet,
    generalData,
    certificatesData: { previousVersion, data, digitalSignatureOfLastUpdater },
    keyData,
    getData,
  } = useGetPatientData(address);
  const { status: statusOfUpdate, updateData } = useUpdatePatient(address, curraddress);
  const { access } = useCheckAccess(address);
  const { recoverSigner } = useSignCertificates();

  // console.log(data);

  const [activeTab, setActiveTab] = useState("general-details");
  const [editedGeneralData, setEditedGeneralData] = useState();
  const [editedCertificates, setEditedCertificates] = useState();
  const [isEdited, setIsEdited] = useState(false);

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

  useEffect(() => {
    statusOfUpdate == "success" && router.reload(window.location.pathname);
  }, [statusOfUpdate]);

  return (
    <>
      <BlurLoader visible={Boolean(statusOfUpdate)} status={statusOfUpdate} />
      <Tabs value={activeTab} onTabChange={setActiveTab} orientation="horizontal" px="xl" mt="md">
        <Tabs.List grow>
          <Tabs.Tab value="general-details">General Details</Tabs.Tab>
          <Tabs.Tab value="certificates">Medical Certificates</Tabs.Tab>
        </Tabs.List>

        <Tabs.Panel value="general-details" mt="md" h="100%">
          <SkeletonLoader
            status={statusOfGet}
            SkeletonComponent={() => <GeneralDataSkeleton status={statusOfGet} />}
            RetryComponent={() => <Retry status={statusOfGet} retryHandler={getData} />}
            DataComponent={() => (
              <GeneralDetails
                address={address}
                access={access}
                data={editedGeneralData}
                setEditedGeneralData={setEditedGeneralData}
              />
            )}
          />
        </Tabs.Panel>
        <Tabs.Panel value="certificates" mt="md" h="100%">
          <SkeletonLoader
            status={statusOfGet}
            SkeletonComponent={() => <CertificatesSkeleton status={statusOfGet} />}
            RetryComponent={() => <Retry status={statusOfGet} retryHandler={getData} />}
            DataComponent={() => (
              <>
                <Group mb="xs">
                  <Text c="blue" size="sm" fw="bold">
                    Last Updated by:{" "}
                    <Text c="dimmed" span>
                      {data.metadata.lastUpdatedBy}
                    </Text>
                  </Text>
                  <Text c="blue" size="sm" fw="bold">
                    Last Updated Date:{" "}
                    <Text c="dimmed" span>
                      {data.metadata.lastUpdatedDate}
                    </Text>
                  </Text>
                  <Text c="blue" size="sm" fw="bold">
                    Version:{" "}
                    <Text c="dimmed" span>
                      {data.metadata.version}
                    </Text>
                  </Text>
                  {recoverSigner(data, digitalSignatureOfLastUpdater) ===
                  data.metadata.lastUpdatedBy.toLowerCase() ? (
                    <Badge color="green">Valid signature</Badge>
                  ) : (
                    <Badge color="red">Invalid signature</Badge>
                  )}
                </Group>
                <MedicalCertificates
                  access={access}
                  certificates={editedCertificates}
                  setEditedCertificates={setEditedCertificates}
                />
              </>
            )}
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
