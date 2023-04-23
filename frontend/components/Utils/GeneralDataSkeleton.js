import { Grid, Group, Skeleton } from "@mantine/core";

export default function GeneralDataSkeleton() {
  return (
    <>
      {/* <Skeleton height={20} w="5%" radius="xl" /> */}
      <Skeleton height={25} w="20%" mt={15} radius="xl" />
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
