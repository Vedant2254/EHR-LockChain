import { readAsDataURLAsync } from "@/utils/readFileAsync";
import { Card, Text, Button, Group, ActionIcon, Center } from "@mantine/core";
import InsertCertificate from "@/components/Utils/InsertCertificate";
import { IconEdit, IconPlus } from "@tabler/icons-react";

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

export default function MedicalCertificates({ certificates, setEditedCertificates }) {
  async function insertCertificate(index, certificate) {
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
