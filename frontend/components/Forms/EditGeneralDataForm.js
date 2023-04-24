import { readAsDataURLAsync } from "@/utils/readFileAsync";
import { Box, Button, Modal, SimpleGrid, Text } from "@mantine/core";
import { hasLength, useForm } from "@mantine/form";
import { useDisclosure } from "@mantine/hooks";
import { IconEdit } from "@tabler/icons-react";
import GeneralDataInput from "./CustomInputs/GeneralDataInput";
import SocialInput from "./CustomInputs/SocialInput";
import { matches } from "@mantine/form";
import { isEmail } from "@mantine/form";

export default function EditGeneralDataForm({ initialValues, setEditedGeneralData }) {
  const [opened, { open, close }] = useDisclosure(false);

  const form = useForm({
    initialValues: {},
    validate: {
      photo: (value) =>
        value
          ? value.size / 1024 > 250
            ? "Size of file must be less than or equal to 250KB"
            : null
          : null,
      name: (value) =>
        value ? hasLength({ min: 2, max: 25 }, "Name must be 2-25 characters")(value) : null,
      age: (value) =>
        value
          ? value < 18 || value > 99
            ? "You must be 18-99 years old to register"
            : null
          : value == 0
          ? "Age cannot be 0"
          : null,
      gender: (value) =>
        value
          ? matches(
              /^(male|female|Male|Female)$/,
              "Input must be Male/male or Female/female"
            )(value)
          : null,
      phone: (value) =>
        value ? hasLength(10, "Phone number must be a 10 digit number")(value) : null,
      email: (value) => (value ? isEmail("Invalid Email")(value) : null),
    },
    validateInputOnChange: ["photo"],
    validateInputOnBlur: ["name", "age", "gender", "phone", "email"],
  });

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

            Object.keys(data).forEach((key) => !data[key] && delete data[key]);

            setEditedGeneralData({ ...initialValues, ...data });
            form.reset();
            close();
          })}
        >
          <SimpleGrid cols={1}>
            <GeneralDataInput form={form} />
            <SocialInput form={form} />
            <Button type="submit">Update fields</Button>
          </SimpleGrid>
        </form>
      </Modal>

      <Button onClick={open} variant="subtle" p="0" compact>
        <IconEdit /> Edit data
      </Button>
    </Box>
  );
}
