import messages from "@/utils/messages";
import { Skeleton, Text } from "@mantine/core";

export default function CertificatesSkeleton({ status }) {
  return (
    <>
      <Skeleton height={120} w="100%" radius="md" />
      <Skeleton height={120} w="100%" radius="md" mt="lg" />
      <Skeleton height={120} w="100%" radius="md" mt="lg" />
      <Text>{messages[status]}</Text>
    </>
  );
}
