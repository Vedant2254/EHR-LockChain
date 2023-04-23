import { TextInput, FileInput, NumberInput } from "@mantine/core";
import { DateInput } from "@mantine/dates";
import { useEffect } from "react";

export default function GeneralDataInputs({ form }) {
  useEffect(() => {
    form.setValues({
      ...form.values,
      age:
        form.values.dob &&
        new Date().getYear() -
          form.values.dob.getYear() -
          (new Date().getMonth() - form.values.dob.getMonth() < 0 ? 1 : 0),
    });
  }, [form.values.dob]);

  return (
    <>
      {/* General details */}
      <FileInput placeholder="Your photo" {...form.getInputProps("photo")} />
      <TextInput placeholder="Name" {...form.getInputProps("name")} />
      <DateInput
        placeholder="Date of birth"
        valueFormat="DD MMM YYYY"
        {...form.getInputProps("dob")}
      />
      <NumberInput
        placeholder="Age, autofilled using DOB"
        {...form.getInputProps("age")}
        disabled
      />
      <TextInput placeholder="Gender" {...form.getInputProps("gender")} />

      {/* Contact details */}
      <TextInput placeholder="Address" {...form.getInputProps("address")} />
      <TextInput placeholder="Phone no." {...form.getInputProps("phone")} />
      <TextInput placeholder="Email" {...form.getInputProps("email")} />
    </>
  );
}
