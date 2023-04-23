import { Skeleton } from "@mantine/core";

export default function CertificatesSkeleton() {
  return (
    <>
      <Skeleton height={120} w="100%" radius="md" />
      <Skeleton height={120} w="100%" radius="md" mt="lg" />
      <Skeleton height={120} w="100%" radius="md" mt="lg" />
    </>
  );
}
