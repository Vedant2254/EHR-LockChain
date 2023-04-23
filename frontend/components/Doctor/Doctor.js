import useGetDoctorData from "@/hooks/useGetDoctorData";
import { Box, Center, Flex, Loader, LoadingOverlay, Tabs, Text, createStyles } from "@mantine/core";
import { useEffect, useState } from "react";
import GeneralDetails from "./GeneralDetails";
import Certifications from "./Certifications";
import DoctorButtons from "./DoctorButtons";
import ConfirmChangesDialog from "../Utils/ConfirmChangesDialog";
import useUpdateDoctor from "@/hooks/useUpdateDoctor";
import useCheckAccess from "@/hooks/useCheckAccess";
import GeneralDataSkeleton from "../Utils/GeneralDataSkeleton";
import CertificatesSkeleton from "../Utils/CertificatesSkeleton";
import messages from "@/utils/messages";
import { useRouter } from "next/router";

const useStyles = createStyles((theme) => ({
  tabs: {},
}));

export default function Doctor({ user, address, setDoctor }) {
  // get data
  const router = useRouter();
  const { status: statusOfGet, generalData, certificates } = useGetDoctorData(address);
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
    setIsEdited(!(editedGeneralData == generalData && editedCertificates == certificates));
  }, [editedGeneralData, editedCertificates]);

  useEffect(() => {
    statusOfUpdate == "success" && router.reload(window.location.pathname);
  }, [statusOfUpdate]);

  useEffect(() => {
    setDoctor && setDoctor(address);
  }, [address]);

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
            <Text>{messages[statusOfUpdate]}</Text>
          </>
        }
      />
      <Tabs value={activeTab} onTabChange={setActiveTab} orientation="horizontal" px="xl" mt="md">
        <Tabs.List className={classes.tabs} grow>
          <Tabs.Tab value="general-details">General Details</Tabs.Tab>
          <Tabs.Tab value="certificates">Doctor's Certificates</Tabs.Tab>
        </Tabs.List>

        <Box my="md">
          <DoctorButtons access={access} address={address} />

          <Tabs.Panel value="general-details" mt="md">
            {statusOfGet != "success" ? (
              <>
                <GeneralDataSkeleton />
                <Text>{messages[statusOfGet]}</Text>
              </>
            ) : (
              <GeneralDetails
                address={address}
                access={access}
                data={editedGeneralData}
                setEditedGeneralData={setEditedGeneralData}
              />
            )}
          </Tabs.Panel>
          <Tabs.Panel value="certificates" mt="md">
            {statusOfGet != "success" ? (
              <>
                <CertificatesSkeleton />
                <Text>{messages[statusOfGet]}</Text>
              </>
            ) : (
              <Certifications
                access={access}
                certificates={editedCertificates}
                setEditedCertificates={setEditedCertificates}
              />
            )}
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
