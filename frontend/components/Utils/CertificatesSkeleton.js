import messages from "@/utils/messages";
import { Box, Skeleton, Text } from "@mantine/core";

export default function CertificatesSkeleton({ status }) {
  return (
    <Box my="lg">
      <Skeleton height={120} w="100%" radius="md" />
      <Skeleton height={120} w="100%" radius="md" mt="lg" />
      <Skeleton height={120} w="100%" radius="md" mt="lg" />
    </Box>
  );
}
