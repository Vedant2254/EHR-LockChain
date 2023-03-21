import { SimpleGrid, Text, createStyles, Divider, Grid, Center, Badge } from "@mantine/core";

const useStyles = createStyles((theme) => ({
  patientBtn: {
    padding: theme.spacing.lg,
    backgroundColor: theme.white,
    border: `1px solid ${theme.colors.gray[1]}`,
    borderRadius: theme.radius.md,
    boxShadow: theme.shadows.sm,
    transition: "200ms",
  },
}));

function PatientListItem({ index, patient, onClick }) {
  const { classes } = useStyles();

  return (
    <Grid className={classes.patientBtn} onClick={onClick} mt="xs">
      <Grid.Col span={1}>
        <Text fz="sm" fw={500}>
          {index + 1}
        </Text>
      </Grid.Col>
      <Grid.Col span="auto">
        <Center>
          <Text fz="sm" fw={500}>
            {patient}
          </Text>
        </Center>
      </Grid.Col>
      <Grid.Col span={2} dir="rtl">
        <Badge color="green">Active</Badge>
      </Grid.Col>
    </Grid>
  );
}

export default function PatientList({ allPatients, setActiveTab }) {
  return (
    <SimpleGrid px="xl">
      <Text fz="xl" fw={500}>
        All Patient addresses (Not allowed to view data)
      </Text>
      <Divider />
      {allPatients &&
        allPatients.map((patient, index) => {
          return (
            <div key={index}>
              <PatientListItem
                index={index}
                patient={patient}
                onClick={() => setActiveTab(patient)}
              />
            </div>
          );
        })}
    </SimpleGrid>
  );
}
