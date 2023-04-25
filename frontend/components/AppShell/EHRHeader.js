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
} from "@mantine/core";
import ConnectButton from "@/components/AppShell/ConnectButton";
import Link from "next/link";
import useIsPatient from "@/hooks/useIsPatient";
import useIsDoctorRegistered from "@/hooks/useIsDoctorRegistered";
import useIsAdmin from "@/hooks/useIsAdmin";
import { useAccount } from "wagmi";
import { useRouter } from "next/router";
import LogosMetamaskIcon from "../Utils/Icons/MetamaskIcon";
import { IconPlug } from "@tabler/icons-react";

const useStyles = createStyles((theme) => ({
  header: {
    padding: theme.spacing.lg,
    // borderBottom: `1px solid ${theme.colors.gray[3]}`,
    boxShadow: `1px -7px 10px 0px ${theme.black}`,
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
  const { address } = useAccount();
  const { isPatient } = useIsPatient(address);
  const { isDoctorRegistered } = useIsDoctorRegistered(address);
  const { isAdmin } = useIsAdmin(address);
  const { classes } = useStyles();

  const router = useRouter();

  const theme = useMantineTheme();

  return (
    <Header height={{ base: 50, md: 70 }} className={classes.header}>
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

        <Group onClick={() => router.replace("/")} sx={{ cursor: "pointer" }}>
          <Avatar src="/ehr-logo-main.png" />
          <Text size="lg" fw="bold" variant="gradient">
            EHR data management system
          </Text>
        </Group>

        <Box>
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
        </Box>

        {router.asPath == "/" && (
          <Box leftIcon={<LogosMetamaskIcon />} className={classes.connectBtn}>
            <Flex align="center">
              <IconPlug />
              <ConnectButton />
            </Flex>
          </Box>
        )}
      </Flex>
    </Header>
  );
}
