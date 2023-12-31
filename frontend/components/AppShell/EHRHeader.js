import {
  Header,
  Burger,
  Text,
  Flex,
  Box,
  MediaQuery,
  useMantineTheme,
  Button,
  createStyles,
  Center,
  ActionIcon,
  Image,
  Avatar,
  Group,
  useMantineColorScheme,
  ColorSchemeProvider,
} from "@mantine/core";
import ConnectButton from "@/components/AppShell/ConnectButton";
import Link from "next/link";
import useIsPatient from "@/hooks/useIsPatient";
import useIsDoctorRegistered from "@/hooks/useIsDoctorRegistered";
import useIsAdmin from "@/hooks/useIsAdmin";
import { useAccount, useNetwork } from "wagmi";
import { useRouter } from "next/router";
import { IconMoonStars, IconPlug, IconSun, IconSwitch, IconSwitch3 } from "@tabler/icons-react";
import SwitchNetworkButton from "./SwitchNetworkButton";

const useStyles = createStyles((theme) => ({
  header: {
    position: "fixed",
    padding: theme.spacing.lg,
    boxShadow: `1px -7px 10px 0px ${theme.black}`,
    // backgroundColor: "rgba(255, 255, 255, 0.15)",
    // backdropFilter: `blur(250px)`,
    zIndex: 101,
  },

  connectBtn: {
    padding: `${theme.spacing.xs} ${theme.spacing.sm}`,
    borderRadius: theme.radius.sm,
    fontSize: theme.fontSizes.md,
    fontWeight: "bold",
    color: theme.colors.blue[5],
  },
}));

export default function EHRHeader({ opened, setOpened }) {
  const { colorScheme, toggleColorScheme } = useMantineColorScheme();
  const { address } = useAccount();
  const { isPatient } = useIsPatient(address);
  const { isDoctorRegistered } = useIsDoctorRegistered(address);
  const { isAdmin } = useIsAdmin(address);
  const { classes } = useStyles();
  const { chain } = useNetwork();
  const router = useRouter();
  const theme = useMantineTheme();

  const dark = colorScheme === "dark";

  return (
    <Header height={{ base: 50, md: 70 }} className={classes.header} id="header">
      <Flex justify="space-between" align="center" h="100%">
        <MediaQuery largerThan="sm" styles={{ display: "none" }}>
          <Burger
            opened={opened}
            onClick={() => setOpened((o) => !o)}
            size="sm"
            color={theme.colors.gray[6]}
            mr="xl"
          />
        </MediaQuery>

        <Group onClick={() => router.push("/")} sx={{ cursor: "pointer" }}>
          <Avatar src="/ehr-logo-main.png" />
          <Text size="xl" fw="bold" variant="gradient">
            EHR-LockChain
          </Text>
        </Group>

        <Group spacing="xs">
          <Button component={Link} href="/" variant="subtle">
            Home
          </Button>
          {!isPatient && !isDoctorRegistered && (
            <Button component={Link} href="/register" variant="subtle">
              Register
            </Button>
          )}
          {isAdmin && (
            <Button component={Link} href="/admin/all-doctors" variant="subtle">
              Admin Dashboard
            </Button>
          )}
          {isPatient && (
            <Button component={Link} href="/patient/dashboard" variant="subtle">
              Patient Dashboard
            </Button>
          )}
          {isDoctorRegistered && (
            <Button component={Link} href="/doctor/dashboard" variant="subtle">
              Doctor Dashboard
            </Button>
          )}
          <ActionIcon
            variant="subtle"
            color={dark ? "yellow" : "blue"}
            onClick={toggleColorScheme}
            title={`Change to ${dark ? "light" : "dark"} mode`}
          >
            {dark ? <IconSun size="1.1rem" /> : <IconMoonStars size="1.1rem" />}
          </ActionIcon>
        </Group>

        {router.asPath == "/" && (
          <Group className={classes.connectBtn}>
            <SwitchNetworkButton />
            <Flex align="center">
              <IconPlug />
              <ConnectButton />
            </Flex>
          </Group>
        )}
      </Flex>
    </Header>
  );
}
