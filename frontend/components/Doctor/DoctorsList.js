import { SimpleGrid, Badge, Text, createStyles, Divider, Grid, Center } from "@mantine/core";

const useStyles = createStyles((theme) => ({
  doctorBtn: {
    cursor: "pointer",
    padding: theme.spacing.lg,
    backgroundColor: theme.colorScheme == "light" ? theme.white : theme.colors.dark[6],
    border: `1px solid ${theme.colorScheme == "light" ? theme.colors.gray[1] : theme.black}`,
    borderRadius: theme.radius.md,
    boxShadow: theme.shadows.xs,
    transition: "200ms",
    "&:hover": {
      transform: "scale(1.005)",
      backgroundColor: theme.colorScheme == "light" ? theme.colors.gray[0] : theme.colors.dark[5],

      boxShadow: theme.shadows.sm,
      border: `1px solid ${
        theme.colorScheme == "light" ? theme.colors.gray[2] : theme.colors.gray[9]
      }`,
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
            pendingDoctors && (
              <div key={index}>
                <DoctorListItem
                  index={index}
                  doctor={doctor}
                  pending={pendingDoctors.indexOf(doctor) == -1}
                  onClick={() => setActiveTab(doctor)}
                />
              </div>
            )
          );
        })}
    </SimpleGrid>
  );
}
