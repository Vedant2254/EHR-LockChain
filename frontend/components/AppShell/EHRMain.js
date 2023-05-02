import {
  createStyles,
  Image,
  Title,
  Button,
  Group,
  Text,
  List,
  ThemeIcon,
  rem,
  Flex,
  Container,
  Grid,
  Center,
  Divider,
  useMantineColorScheme,
} from "@mantine/core";
import { IconCheck } from "@tabler/icons-react";
import { useAccount } from "wagmi";
import ConnectButton from "./ConnectButton";
import useValidTxnData from "@/hooks/useValidTxnData";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

const useStyles = createStyles((theme) => ({
  back: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: theme.colorScheme === "dark" ? theme.black : theme.white,
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

export default function EHRMain() {
  const { colorScheme } = useMantineColorScheme();
  const { classes } = useStyles();
  const { isConnected } = useAccount();
  const { contractAddress } = useValidTxnData();
  const router = useRouter();

  const [isDefinitelyConnected, setIsDefninitelyConnected] = useState(false);

  useEffect(() => {
    setIsDefninitelyConnected(isConnected);
  }, [isConnected]);

  return (
    <Flex className={classes.back}>
      <Container>
        <Grid>
          <Grid.Col span="auto">
            <Title className={classes.title}>
              A{" "}
              <Text
                component="a"
                href="https://ethereum.org/en/dapps/#what-are-dapps"
                target="_blank"
                variant="gradient"
                gradient={{ from: "blue", to: "purple", deg: 90 }}
                span
              >
                decentralized
              </Text>{" "}
              EHR <br /> data management system
            </Title>
            <Text color="dimmed" mt="md">
              This system ensures the security and privacy of your medical records by encrypting and
              storing your data on a distributed network, and providing an easy way to grant /
              revoke access to your data
            </Text>

            <List
              mt={30}
              spacing="sm"
              size="sm"
              icon={
                <ThemeIcon size={20} radius="xl">
                  <IconCheck size={rem(12)} stroke={1.5} />
                </ThemeIcon>
              }
            >
              <List.Item>
                <b>Decentralization</b> – no single organization or authority is in control of your
                data
              </List.Item>
              <List.Item>
                <b>Distributed storage</b> – techniques stores data on a distributed network rather
                than storing on a single server or database
              </List.Item>
              <List.Item>
                <b>Transparency</b> – refers to publicly visible and verifiable ongoing transactions
                and source code of this application
              </List.Item>
            </List>

            <Group mt={30}>
              <Button
                onClick={() => {
                  const elem = isDefinitelyConnected
                    ? document.getElementById("permissions")
                    : document.getElementById("instructions");
                  const header = document.getElementById("header");
                  window &&
                    elem &&
                    window.scrollTo({
                      top: elem.getBoundingClientRect().top - header.getBoundingClientRect().height,
                      behavior: "smooth",
                    });
                }}
                radius="xl"
                size="md"
                variant="gradient"
                className={classes.control}
              >
                {isDefinitelyConnected ? "Know Permissions" : "Getting Started"}
              </Button>
              {!isDefinitelyConnected ? (
                <Button radius="xl" size="md" className={classes.control}>
                  <Center>
                    <ConnectButton />
                  </Center>
                </Button>
              ) : (
                <Button
                  radius="xl"
                  size="md"
                  className={classes.control}
                  onClick={() => router.push("/register")}
                >
                  Dashboard
                </Button>
              )}
              {/* <Button
                component="a"
                href="https://github.com/Vedant2254/EHR-data-management-system"
                target="_blank"
                variant="default"
                radius="xl"
                size="md"
                className={classes.control}
              >
                Source code
              </Button> */}
              <Button
                component="a"
                href={`https://sepolia.etherscan.io/address/${contractAddress || ""}`}
                target="_blank"
                variant="default"
                radius="xl"
                size="md"
                className={classes.control}
              >
                Smart Contract
              </Button>
            </Group>
          </Grid.Col>
          <Grid.Col span={5} className={classes.image}>
            <Image
              src={
                colorScheme === "light"
                  ? "/ehr-logo-main-animated.gif"
                  : "/ehr-logo-main-dark-animated.gif"
              }
            />
          </Grid.Col>
        </Grid>
      </Container>
      <Divider className="hello" size="xl" />
    </Flex>
  );
}
