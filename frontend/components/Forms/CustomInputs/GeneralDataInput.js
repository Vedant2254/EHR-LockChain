import { TextInput, FileInput } from "@mantine/core";
import { DateInput } from "@mantine/dates";

export default function GeneralDataInputs({ form }) {
  return (
    <>
      {/* General details */}
      <FileInput placeholder="Your photo" {...form.getInputProps("photo")} />
      <TextInput placeholder="Name" {...form.getInputProps("name")} />
      <DateInput placeholder="Date of birth" {...form.getInputProps("dob")} />
      <TextInput placeholder="Age" {...form.getInputProps("age")} />
      <TextInput placeholder="Gender" {...form.getInputProps("gender")} />

      {/* Contact details */}
      <TextInput placeholder="Address" {...form.getInputProps("address")} />
      <TextInput placeholder="Phone no." {...form.getInputProps("phone")} />
      <TextInput placeholder="Email" {...form.getInputProps("email")} />
    </>
  );
}
