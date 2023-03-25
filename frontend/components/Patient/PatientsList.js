import { SimpleGrid, Text, createStyles, Divider, Grid, Center, Badge } from "@mantine/core";

const useStyles = createStyles((theme) => ({
  patientBtn: {
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

export default function PatientList({ patients, setActiveTab }) {
  return (
    <SimpleGrid px="xl">
      <Text fz="xl" fw={500}>
        All Patients
      </Text>
      <Divider />
      {patients &&
        patients.map((patient, index) => {
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
