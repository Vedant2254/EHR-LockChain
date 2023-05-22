import { useState } from "react";
import {
  Button,
  Stepper,
  TextInput,
  Group,
  Code,
  FileInput,
  SimpleGrid,
  ActionIcon,
} from "@mantine/core";
import { hasLength, isEmail, isNotEmpty, matches, useForm } from "@mantine/form";
import CertificateInput from "./CustomInputs/CertificateInput";
import { IconCamera, IconFileCheck, IconUser } from "@tabler/icons-react";
import GeneralDataInputs from "./CustomInputs/GeneralDataInput";
import SocialInput from "./CustomInputs/SocialInput";

export default function RegistrationForm({
  user,
  initialValues,
  submitIsDisabled,
  handleOnSubmit,
}) {
  const [active, setActive] = useState(0);
  const form = useForm({
    initialValues: { ...initialValues, certificates: initialValues.certificates || [] },
    validate: {
      photo: (value) =>
        !value
          ? "Photo cannot be empty"
          : value.size / 1024 > 250
          ? "Size of file must be less than or equal to 250KB"
          : null,
      name: hasLength({ min: 2, max: 25 }, "Name must be 2-25 characters"),
      dob: isNotEmpty("Date of birth cannot be empty"),
      age: (value) =>
        !value
          ? "Age cannot be empty"
          : value < 18 || value > 99
          ? "You must be 18-99 years old to register"
          : null,
      gender: matches(/^(male|female|Male|Female)$/, "Input must be Male/male or Female/female"),
      address: isNotEmpty("Address cannot be empty"),
      phone: matches(/^\d{10}$/, "Phone number must be a 10 digit number"),
      email: isEmail("Invalid Email"),
    },
    validateInputOnChange: ["photo"],
    validateInputOnBlur: ["name", "dob", "age", "gender", "address", "phone", "email"],
  });

  function nextStep() {
    setActive((current) => {
      if (form.validate().hasErrors) {
        return current;
      }
      return current < 3 ? current + 1 : current;
    });
  }

  function prevStep() {
    setActive((current) => (current > 0 ? current - 1 : current));
  }

  function insertCertificate(index, certificate) {
    if (index < form.values.certificates.length) form.removeListItem("certificates", index);
    form.insertListItem("certificates", certificate, index);
  }

  return (
    <form onSubmit={form.onSubmit((data) => handleOnSubmit({ ...data }))}>
      <Stepper active={active} breakpoint="sm" p="sm">
        <Stepper.Step label="Profile" description="Basic details" icon={<IconUser />}>
          <SimpleGrid cols={2}>
            <GeneralDataInputs form={form} />

            {/* General details */}
            {/* <FileInput placeholder="Your photo" {...form.getInputProps("photo")} />
            <TextInput placeholder="Name" {...form.getInputProps("name")} />
            <DateInput placeholder="Date of birth" {...form.getInputProps("dob")} />
            <TextInput placeholder="Age" {...form.getInputProps("age")} />
            <TextInput placeholder="Gender" {...form.getInputProps("gender")} /> */}

            {/* Contact details */}
            {/* <TextInput placeholder="Address" {...form.getInputProps("address")} />
            <TextInput placeholder="Phone no." {...form.getInputProps("phone")} />
            <TextInput placeholder="Email" {...form.getInputProps("email")} /> */}
          </SimpleGrid>
        </Stepper.Step>

        <Stepper.Step
          label={user == "doctor" ? "Doctor's Certificates" : "Medical Certificates"}
          description="Let them know you better"
          icon={<IconFileCheck />}
        >
          <CertificateInput
            index={form.values.certificates.length}
            insertCertificate={insertCertificate}
            values={form.values.certificates}
          />
          {form.values.certificates.map((certificate, index) => {
            return (
              <Code block mt="xl" key={index}>
                {JSON.stringify(certificate, null, 2)}
              </Code>
            );
          })}
        </Stepper.Step>

        <Stepper.Step
          label="Social media"
          description="Make it easy to contact you"
          icon={<IconCamera />}
        >
          <SimpleGrid cols={3}>
            <SocialInput form={form} />
          </SimpleGrid>
        </Stepper.Step>

        <Stepper.Completed>
          <Button type="submit" disabled={submitIsDisabled}>
            Submit
          </Button>
          <Code block mt="xl">
            {JSON.stringify(form.values, null, 2)}
          </Code>
        </Stepper.Completed>
      </Stepper>

      <Group position="right" mt="xl">
        {active !== 0 && (
          <Button variant="default" onClick={prevStep}>
            Back
          </Button>
        )}
        {active !== 3 && <Button onClick={nextStep}>Next step</Button>}
      </Group>
    </form>
  );
}
