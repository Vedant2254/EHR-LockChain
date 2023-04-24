import messages from "@/utils/messages";
import { Alert, Center, Grid, Group, Notification, Progress, Skeleton, Text } from "@mantine/core";

export default function GeneralDataSkeleton({ status, details }) {
  return (
    <>
      <Skeleton height={25} w="20%" my="lg" radius="xl" />
      <Grid my="xs">
        <Grid.Col span={3} bor>
          <Skeleton height={200} mt={15} circle />
        </Grid.Col>
        <Grid.Col span={5}>
          <Skeleton height={20} radius="xl" />
          <Skeleton height={20} mt={15} radius="xl" />
          <Skeleton height={20} mt={15} radius="xl" />
          <Skeleton height={20} mt={15} radius="xl" />
          <Skeleton height={20} mt={15} radius="xl" />
          <Skeleton height={20} mt={15} radius="xl" />
          <Skeleton height={20} mt={15} radius="xl" />
          <Skeleton height={20} mt={15} radius="xl" />
        </Grid.Col>
        <Grid.Col span={1}></Grid.Col>
        <Grid.Col span={3}>
          <Group>
            <Skeleton height={40} mt={6} circle radius="xl" />
            <Skeleton height={40} mt={6} circle radius="xl" />
            <Skeleton height={40} mt={6} circle radius="xl" />
          </Group>
        </Grid.Col>
      </Grid>
    </>
  );
}
