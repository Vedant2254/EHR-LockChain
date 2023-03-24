import { readAsDataURLAsync } from "@/utils/readFileAsync";
import { Box, Button, Modal, SimpleGrid, Text } from "@mantine/core";
import { useForm } from "@mantine/form";
import { useDisclosure } from "@mantine/hooks";
import { IconEdit } from "@tabler/icons-react";
import GeneralDataInput from "./CustomInputs/GeneralDataInput";
import SocialInput from "./CustomInputs/SocialInput";

export default function EditGeneralDataForm({ initialValues, setEditedGeneralData }) {
  const [opened, { open, close }] = useDisclosure(false);

  const form = useForm({ initialValues: {} });

  return (
    <Box mb="xs">
      <Modal
        opened={opened}
        onClose={close}
        title={
          <Text>
            Edit your general data{" "}
            <Text c="dimmed" size="xs">
              Fill out the fields you want to edit, leave empty to keep unchanged
            </Text>
          </Text>
        }
      >
        <form
          onSubmit={form.onSubmit(async (formdata) => {
            const data = { ...formdata };

            const { dob } = data;
            if (dob) data.dob = data.dob.toDateString();

            const { photo } = data;
            if (photo && photo.constructor.name == "File")
              data.photo = await readAsDataURLAsync(photo);

            setEditedGeneralData({ ...initialValues, ...data });
            form.reset();
          })}
        >
          <SimpleGrid cols={1}>
            <GeneralDataInput form={form} />
            <SocialInput form={form} />
            <Button type="submit">Update fields</Button>
          </SimpleGrid>
        </form>
      </Modal>

      <Button onClick={open} variant="subtle" compact>
        <IconEdit /> Edit data
      </Button>
    </Box>
  );
}
