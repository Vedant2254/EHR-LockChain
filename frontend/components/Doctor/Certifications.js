import { Card, Text } from "@mantine/core";

export default function Certifications({ certificates }) {
  return certificates.map((certificate, index) => {
    return (
      <Card shadow="sm" padding="lg" my="lg" radius="lg">
        <Card.Section>
          <iframe src={certificate.media} height="100px" width="100%" scrolling="no" />
        </Card.Section>
        <Text weight={500}>{certificate.title}</Text>
        <Text size="sm" color="dimmed">
          {certificate.description}
        </Text>
      </Card>
    );
  });
}
