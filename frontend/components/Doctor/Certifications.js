import { readAsDataURLAsync } from "@/utils/readFileAsync";
import { Card, Text, Button, Center, ActionIcon, Group } from "@mantine/core";
import { IconEdit, IconPlus } from "@tabler/icons-react";
import InsertCertificate from "../Utils/InsertCertificate";

const AddCertificateBtn = () => (
  <Center>
    <ActionIcon component={Button} color="blue" variant="filled" radius="xl" size="lg">
      <IconPlus />
    </ActionIcon>
  </Center>
);

const EditCertificateBtn = () => (
  <ActionIcon
    component="button"
    color="blue"
    variant="subtle"
    radius="xl"
    sx={{ "&:hover": { backgroundColor: "none" } }}
  >
    <IconEdit />
  </ActionIcon>
);

export default function Certifications({ certificates, setEditedCertificates }) {
  async function insertCertificate(index, certificate) {
    const { media } = certificate;
    if (media && media.constructor.name == "File")
      certificate.media = await readAsDataURLAsync(media);

    const temp = [...certificates];
    if (index < certificates.length) temp[index] = { ...certificate };
    else temp.push(certificate);
    setEditedCertificates(temp);
  }

  return (
    <div>
      {certificates &&
        certificates.map((certificate, index) => {
          return (
            <Card key={index} shadow="sm" padding="lg" mb="lg" radius="lg">
              <Text weight={500}>{certificate.title}</Text>
              <Text size="sm" color="dimmed">
                {certificate.description}
              </Text>
              <Group mt="xs">
                <Button component="a" href={certificate.media} download compact>
                  Download certificate
                </Button>
                <InsertCertificate
                  index={index}
                  certificate={certificate}
                  insertCertificate={insertCertificate}
                  BtnIcon={EditCertificateBtn}
                />
                <Button
                  onClick={() => {
                    setEditedCertificates([
                      ...certificates.slice(0, index),
                      ...certificates.slice(index + 1, certificates.length),
                    ]);
                  }}
                  variant="subtle"
                  color="red"
                  compact
                >
                  Delete
                </Button>
              </Group>
            </Card>
          );
        })}
      <InsertCertificate
        index={certificates ? certificates.length : 1}
        certificate={{ media: "", title: "", description: "" }}
        insertCertificate={insertCertificate}
        BtnIcon={AddCertificateBtn}
      />
    </div>
  );
}
