import { readAsDataURLAsync } from "@/utils/readFileAsync";
import { Card, Text, Button, Group } from "@mantine/core";
import AddCertificateBtn from "../Utils/AddCertificateButton";
import EditCertificateBtn from "../Utils/EditCertificateButton";
import InsertCertificate from "../Utils/InsertCertificate";

export default function Certifications({ access, certificates, setEditedCertificates }) {
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
            <Card key={index} shadow="xs" padding="lg" mb="lg" radius="md">
              <Text weight={500}>{certificate.title}</Text>
              <Text size="sm" color="dimmed">
                {certificate.description}
              </Text>
              <Group mt="xs">
                <Button component="a" href={certificate.media} download compact>
                  Download certificate
                </Button>
                {access == 2 && (
                  <InsertCertificate
                    index={index}
                    certificate={certificate}
                    insertCertificate={insertCertificate}
                    BtnIcon={EditCertificateBtn}
                  />
                )}
                {access == 2 && (
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
                )}
              </Group>
            </Card>
          );
        })}
      {access == 2 && (
        <InsertCertificate
          index={certificates ? certificates.length : 1}
          certificate={{ media: "", title: "", description: "" }}
          insertCertificate={insertCertificate}
          BtnIcon={AddCertificateBtn}
        />
      )}
    </div>
  );
}
