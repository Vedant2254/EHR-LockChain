import {
  createStyles,
  Title,
  Group,
  Text,
  List,
  ThemeIcon,
  rem,
  Flex,
  Container,
  SimpleGrid,
  Box,
} from "@mantine/core";
import { IconCheck, IconCircleKey, IconKey, IconLockCheck } from "@tabler/icons-react";

const useStyles = createStyles((theme) => ({
  back: {
    flexGrow: 1,
    justifyContent: "center",
    flexDirection: "column",
    alignItems: "center",
    backgroundColor: theme.colorScheme === "dark" ? theme.black : theme.colors.violet[0],
  },

  outerContainer: {
    mt: "2rem",

    [theme.fn.smallerThan("lg")]: {
      flexDirection: "column",
    },
  },

  innerContainer: {
    [theme.fn.smallerThan("xl")]: {
      marginLeft: theme.spacing.xl,
      marginRight: theme.spacing.xl,
    },
  },

  title: {
    color: theme.colorScheme === "dark" ? theme.white : theme.black,
    fontFamily: `Greycliff CF, ${theme.fontFamily}`,
    fontSize: rem(44),
    lineHeight: 1.2,
    fontWeight: 900,

    [theme.fn.smallerThan("xs")]: {
      fontSize: rem(28),
    },
  },

  subtitle: {
    color: theme.colorScheme === "dark" ? theme.white : theme.black,
  },

  control: {
    [theme.fn.smallerThan("xs")]: {
      flex: 1,
    },
  },

  image: {
    marginLeft: rem(10),

    [theme.fn.smallerThan("md")]: {
      display: "none",
    },
  },

  highlight: {
    position: "relative",
    backgroundColor: theme.fn.variant({ variant: "light", color: theme.primaryColor }).background,
    borderRadius: theme.radius.sm,
    padding: `${rem(4)} ${rem(12)}`,
  },
}));

export default function EHRPermissions() {
  const { classes } = useStyles();

  return (
    <Flex className={classes.back} id="permissions">
      <Title variant="gradient" className={classes.title}>
        Permissions
      </Title>
      <Flex className={classes.outerContainer}>
        <Box ml="18rem" mr="xl" className={classes.innerContainer}>
          <Title align="center" className={classes.subtitle}>
            Patient
          </Title>

          <List
            mt="xl"
            spacing="sm"
            size="sm"
            icon={
              <ThemeIcon size={20} radius="xl">
                <IconKey size={rem(12)} stroke={1.5} />
              </ThemeIcon>
            }
            styles={{ itemWrapper: { marginBottom: "0.7rem" } }}
          >
            <List.Item>
              <Text fw="bold" span>
                View general details:
              </Text>{" "}
              Patients can view their personal information such as their name, age, gender, and
              contact information from the patient dashboard.
            </List.Item>
            <List.Item>
              <Text fw="bold" span>
                View medical certificates:
              </Text>{" "}
              Patients can view and manage their medical certificates from the dashboard. This may
              include certificates for vaccinations, medical procedures, and other health-related
              information.
            </List.Item>
            <List.Item>
              <Text fw="bold" span>
                Edit general details:
              </Text>{" "}
              Patients can edit their personal information from the dashboard, such as their phone
              number or email address.
            </List.Item>
            <List.Item>
              <Text fw="bold" span>
                Edit medical certificates:
              </Text>{" "}
              Patients can update or add new medical certificates as needed. This includes uploading
              scanned copies of physical documents and entering relevant details.
            </List.Item>
            <List.Item>
              <Text fw="bold" span>
                Grant access to a doctor:
              </Text>{" "}
              Patients can grant access to their medical data to any one doctor at a time. This is
              done through a secure access control system that uses blockchain technology to ensure
              the privacy and security of patient data.
            </List.Item>
            <List.Item>
              <Text fw="bold" span>
                Revoke access from doctors:
              </Text>{" "}
              Patients can revoke access to their data from doctor at any time, providing them with
              complete control over who can view their medical information.
            </List.Item>
          </List>
        </Box>

        <Box mr="18rem" ml="xl" className={classes.innerContainer}>
          <Title align="center" className={classes.subtitle}>
            Doctor
          </Title>

          <List
            mt="xl"
            spacing="sm"
            size="sm"
            icon={
              <ThemeIcon size={20} radius="xl">
                <IconKey size={rem(12)} stroke={1.5} />
              </ThemeIcon>
            }
            styles={{ itemWrapper: { marginBottom: "0.7rem" } }}
          >
            <List.Item>
              <Text fw="bold" span>
                View general details:
              </Text>{" "}
              Doctors can view their personal information such as their name, age, gender, and
              contact information from the doctor dashboard.
            </List.Item>
            <List.Item>
              <Text fw="bold" span>
                View doctor certificates
              </Text>{" "}
              Doctors can view and manage their certificates from the dashboard. This includes
              certificates for medical licenses, medical education, and other related certificates.
            </List.Item>
            <List.Item>
              <Text fw="bold" span>
                Edit general details:
              </Text>{" "}
              Doctors can edit their personal information from the dashboard, such as their phone
              number or email address.
            </List.Item>
            <List.Item>
              <Text fw="bold" span>
                Edit doctor certificates:
              </Text>{" "}
              Doctors can update or add new certificates as needed. This includes uploading scanned
              copies of physical documents and entering relevant details.
            </List.Item>
            <List.Item>
              <Text fw="bold" span>
                View patients:
              </Text>{" "}
              Doctors can view a list of their patients and access their medical records from the
              dashboard.
            </List.Item>
            <List.Item>
              <Text fw="bold" span>
                View and edit patient medical certificates:
              </Text>{" "}
              Doctors can view and edit patient medical certificates as needed. This includes
              reviewing test results, updating treatment plans, and recording other medical notes.
            </List.Item>
          </List>
        </Box>
      </Flex>
    </Flex>
  );
}
