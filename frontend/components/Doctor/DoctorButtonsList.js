import { SimpleGrid, Badge, Text, Flex, createStyles, Divider } from "@mantine/core";

const useStyles = createStyles((theme) => ({
  doctorBtn: {
    cursor: "pointer",
    padding: theme.spacing.xl,
    backgroundColor: "#ffffff",
    borderRadius: theme.radius.md,
    boxShadow: theme.shadows.sm,
    transition: "200ms",
    "&:hover": {
      transform: "scale(1.005)",
      backgroundColor: "#fafafa",
      boxShadow: theme.shadows.md,
    },
    "&:active": { transform: "scale(0.99)" },
  },
}));

function DoctorButton({ index, doctor, pending, onClick }) {
  const { classes } = useStyles();

  return (
    <Flex justify="space-between" onClick={onClick} className={classes.doctorBtn}>
      <Text fz="sm" fw={500}>
        {index + 1}
      </Text>
      <Text fz="sm" fw={500}>
        {doctor}
      </Text>
      <Badge color={pending ? "green" : "red"}>{pending ? "Approved" : "Not approved"}</Badge>
    </Flex>
  );
}

export default function DoctorButtonsList({ allDoctors, pendingDoctors, setActiveTab }) {
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
              <DoctorButton
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
