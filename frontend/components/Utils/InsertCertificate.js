import { Box, Modal, Text } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import CertificateInput from "../Forms/CustomInputs/CertificateInput";

export default function InsertCertificate({ index, certificate, insertCertificate, BtnIcon }) {
  const [opened, { open, close }] = useDisclosure(false);

  return (
    <>
      <Modal opened={opened} onClose={close} title={<Text>Add/Edit a certificate</Text>}>
        <CertificateInput
          index={index}
          initialValues={certificate || {}}
          insertCertificate={insertCertificate}
        />
      </Modal>

      <Box onClick={open}>
        <BtnIcon />
      </Box>
    </>
  );
}
