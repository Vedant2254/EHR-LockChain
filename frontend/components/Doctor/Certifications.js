import { Card, Text, Button } from "@mantine/core";

export default function Certifications({ certificates }) {
  return (
    <>
      {certificates.map((certificate, index) => {
        return (
          <Card key={index} shadow="sm" padding="lg" mb="lg" radius="lg">
            <Text weight={500}>{certificate.title}</Text>
            <Text size="sm" color="dimmed">
              {certificate.description}
            </Text>
            <Button component="a" href={certificate.media} mt="xs" download>
              Download certificate
            </Button>
          </Card>
        );
      })}
    </>
  );
}
