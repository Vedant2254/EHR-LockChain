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
  getStylesRef,
} from "@mantine/core";
import { IconCheck } from "@tabler/icons-react";

const useStyles = createStyles((theme) => ({
  back: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: theme.colorScheme === "dark" ? theme.black : theme.colors.blue[0],
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

export default function EHRInstructions() {
  const { classes } = useStyles();

  return (
    <Flex className={classes.back} id="instructions">
      <Container>
        <Title className={classes.title}>
          Essential Prerequisite:{" "}
          <Text c="orangered" span>
            MetaMask
          </Text>
        </Title>
        <Text color="dimmed" mt="md">
          MetaMask is a digital wallet that enables users to manage their Ethereum accounts and
          interact with Ethereum applications directly in their web browsers. With MetaMask, users
          can securely store and manage their private keys, send and receive Ether and other
          Ethereum-based tokens, and sign transactions.
        </Text>

        <Group mt="xl">
          <Title order={2} className={classes.subtitle}>
            To install MetaMask
          </Title>

          <List
            spacing="sm"
            size="sm"
            icon={
              <ThemeIcon size={20} radius="xl">
                <IconCheck size={rem(12)} stroke={1.5} />
              </ThemeIcon>
            }
          >
            <List.Item>
              Go to{" "}
              <Text component="a" href="https://metamask.io" target="_blank" c="orangered" span>
                metamask.io
              </Text>{" "}
              and click the "Download" button.
            </List.Item>
            <List.Item>Choose your browser and install the MetaMask extension.</List.Item>
            <List.Item>
              Follow the setup instructions, including creating a new wallet and recording your seed
              phrase (which is important to keep safe and private).
            </List.Item>
            <List.Item>
              Once you've set up MetaMask, you should see a small orange fox icon in your browser
              toolbar.
            </List.Item>
          </List>
        </Group>

        <Group mt="xl">
          <Title order={2} className={classes.subtitle}>
            To use MetaMask with our project
          </Title>

          <List
            spacing="sm"
            size="sm"
            icon={
              <ThemeIcon size={20} radius="xl">
                <IconCheck size={rem(12)} stroke={1.5} />
              </ThemeIcon>
            }
          >
            <List.Item>
              Make sure you are done with metamask installation and wallet creation.
            </List.Item>
            <List.Item>Now click on "Connect" button to the right of navigation bar.</List.Item>
            <List.Item>
              A MetaMask popup should appear asking for permission to connect to the application.
              Click "Connect" to grant permission.
            </List.Item>
            <List.Item>
              In case you have multiple accounts in MetaMask, select the one you intend to use with
              our application.
            </List.Item>
            <List.Item>
              Once connected, you should see your wallet address partially displayed in the place of
              "Connect" button.
            </List.Item>
            <List.Item>
              Now you can start using the website by registering as a doctor or patient.
            </List.Item>
          </List>
        </Group>

        <Group mt="xl">
          <Text fw="bold" variant="gradient">
            While MetaMask can seem intimidating at first, it's an essential tool for interacting
            with Ethereum-based applications like this one. With just a few simple steps, you can
            get up and running with MetaMask and start using the application.
          </Text>
        </Group>
      </Container>
    </Flex>
  );
}
