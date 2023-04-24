import useGetDoctorData from "@/hooks/useGetDoctorData";
import { Box, Tabs, createStyles } from "@mantine/core";
import { useEffect, useState } from "react";
import GeneralDetails from "./GeneralDetails";
import Certifications from "./Certifications";
import DoctorButtons from "./DoctorButtons";
import ConfirmChangesDialog from "../Utils/ConfirmChangesDialog";
import useUpdateDoctor from "@/hooks/useUpdateDoctor";
import useCheckAccess from "@/hooks/useCheckAccess";
import GeneralDataSkeleton from "../Utils/GeneralDataSkeleton";
import CertificatesSkeleton from "../Utils/CertificatesSkeleton";
import { useRouter } from "next/router";
import Retry from "../Utils/Retry";
import SkeletonLoader from "../Utils/SkeletonLoader";
import BlurLoader from "../Utils/BlurLoader";
import deepEqual from "@/utils/deepEqual";

const useStyles = createStyles((theme) => ({
  tabs: {},
}));

export default function Doctor({ user, address, setDoctor }) {
  // get data
  const router = useRouter();
  const { status: statusOfGet, generalData, certificates, getData } = useGetDoctorData(address);
  const { status: statusOfUpdate, updateData } = useUpdateDoctor();
  const { access } = useCheckAccess(address);

  const [activeTab, setActiveTab] = useState("general-details");
  const [editedGeneralData, setEditedGeneralData] = useState();
  const [editedCertificates, setEditedCertificates] = useState();
  const [isEdited, setIsEdited] = useState(false);

  const { classes } = useStyles();

  useEffect(() => {
    setEditedGeneralData(generalData);
    setEditedCertificates(certificates);
  }, [generalData, certificates]);

  useEffect(() => {
    setIsEdited(
      !(deepEqual(generalData, editedGeneralData) && deepEqual(certificates, editedCertificates))
    );
  }, [editedGeneralData, editedCertificates]);

  useEffect(() => {
    statusOfUpdate == "success" && router.reload(window.location.pathname);
  }, [statusOfUpdate]);

  useEffect(() => {
    setDoctor && setDoctor(address);
  }, [address]);

  return (
    <>
      <BlurLoader visible={Boolean(statusOfUpdate)} status={statusOfUpdate} />

      <Tabs value={activeTab} onTabChange={setActiveTab} orientation="horizontal" px="xl" mt="md">
        <Tabs.List className={classes.tabs} grow>
          <Tabs.Tab value="general-details">General Details</Tabs.Tab>
          <Tabs.Tab value="certificates">Doctor's Certificates</Tabs.Tab>
        </Tabs.List>

        <Box my="md">
          <DoctorButtons access={access} address={address} />

          <Tabs.Panel value="general-details" mt="md">
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
          <Tabs.Panel value="certificates" mt="md">
            <SkeletonLoader
              status={statusOfGet}
              SkeletonComponent={() => <CertificatesSkeleton status={statusOfGet} />}
              RetryComponent={() => <Retry status={statusOfGet} retryHandler={getData} />}
              DataComponent={() => (
                <Certifications
                  access={access}
                  certificates={editedCertificates}
                  setEditedCertificates={setEditedCertificates}
                />
              )}
            />
          </Tabs.Panel>
        </Box>
      </Tabs>
      <ConfirmChangesDialog
        isEdited={isEdited}
        handleOnConfirm={async () => {
          await updateData(editedGeneralData, editedCertificates);
        }}
        handleOnReset={() => {
          setEditedGeneralData(generalData);
          setEditedCertificates(certificates);
        }}
      />
    </>
  );
}
