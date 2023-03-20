import { FileInput, TextInput, Textarea, Button, SimpleGrid } from "@mantine/core";
import { isNotEmpty, useForm } from "@mantine/form";

export default function CertificateInput({ index, initialValues, insertCertificate }) {
  const form = useForm({
    initialValues: initialValues || { media: null, title: "", description: "" },
    validate: {
      // media: isNotEmpty("Media cannot be empty"),
      // title: isNotEmpty("Title cannot be empty"),
      // description: isNotEmpty("Description cannot be empty"),
    },
  });

  function runInsertCertificate() {
    if (form.validate().hasErrors) return;
    form.setValues({ media: null, title: "", description: "" });
    insertCertificate(index, form.values);
  }

  return (
    <>
      <SimpleGrid cols={2} pb="md">
        <FileInput name="media" {...form.getInputProps("media")} />
        <TextInput name="title" type="text" placeholder="Title" {...form.getInputProps("title")} />
      </SimpleGrid>
      <Textarea
        pb="md"
        name="description"
        placeholder="Description"
        {...form.getInputProps("description")}
        autosize
      />
      <Button onClick={runInsertCertificate}>Add certificate</Button>
    </>
  );
}
