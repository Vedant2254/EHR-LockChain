import { SimpleGrid, Badge, Text, Flex, createStyles, Divider, Grid, Center } from "@mantine/core";

const useStyles = createStyles((theme) => ({
  doctorBtn: {
    cursor: "pointer",
    padding: theme.spacing.lg,
    backgroundColor: theme.white,
    border: `1px solid ${theme.colors.gray[1]}`,
    borderRadius: theme.radius.md,
    boxShadow: theme.shadows.sm,
    transition: "200ms",
    "&:hover": {
      transform: "scale(1.005)",
      backgroundColor: "#fafafa",
      boxShadow: theme.shadows.md,
      border: `1px solid ${theme.colors.gray[2]}`,
    },
    "&:active": { transform: "scale(0.99)" },
  },
}));

function DoctorListItem({ index, doctor, pending, onClick }) {
  const { classes } = useStyles();

  return (
    <Grid className={classes.doctorBtn} onClick={onClick} mt="xs">
      <Grid.Col span={1}>
        <Text fz="sm" fw={500}>
          {index + 1}
        </Text>
      </Grid.Col>
      <Grid.Col span="auto">
        <Center>
          <Text fz="sm" fw={500}>
            {doctor}
          </Text>
        </Center>
      </Grid.Col>
      <Grid.Col span={2} dir="rtl">
        <Badge color={pending ? "green" : "red"}>{pending ? "Approved" : "Not approved"}</Badge>
      </Grid.Col>
    </Grid>
  );
}

export default function DoctorList({ allDoctors, pendingDoctors, setActiveTab }) {
  return (
    <SimpleGrid px="xl">
      <Text fz="xl" fw={500}>
        All doctors
      </Text>
      <Divider />
      {allDoctors &&
        allDoctors.map((doctor, index) => {
          return (
            <div key={index}>
              <DoctorListItem
                index={index}
                doctor={doctor}
                pending={pendingDoctors.indexOf(doctor) == -1}
                onClick={() => setActiveTab(doctor)}
              />
            </div>
          );
        })}
    </SimpleGrid>
  );
}
