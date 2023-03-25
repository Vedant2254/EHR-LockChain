import {
  Header,
  Burger,
  Text,
  Flex,
  Box,
  MediaQuery,
  useMantineTheme,
  NavLink,
  Button,
} from "@mantine/core";
import ConnectButton from "@/components/AppShell/ConnectButton";
import Link from "next/link";
import useIsPatient from "@/hooks/useIsPatient";
import useIsDoctorRegistered from "@/hooks/useIsDoctorRegistered";
import useIsAdmin from "@/hooks/useIsAdmin";
import { useAccount } from "wagmi";

export default function EHRHeader({ opened, setOpened }) {
  const { address } = useAccount();
  const { isPatient } = useIsPatient(address);
  const { isDoctorRegistered } = useIsDoctorRegistered(address);
  const { isAdmin } = useIsAdmin(address);

  const theme = useMantineTheme();

  return (
    <Header height={{ base: 50, md: 70 }} p="md">
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

        <Text>EHR data management system</Text>

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

        <ConnectButton />
      </Flex>
    </Header>
  );
}
