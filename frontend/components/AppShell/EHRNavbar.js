import { useEffect, useState } from "react";
import {
  createStyles,
  Navbar,
  Group,
  Code,
  getStylesRef,
  rem,
  Box,
  ActionIcon,
} from "@mantine/core";
import { useRouter } from "next/router";
import Link from "next/link";
import ConnectButton from "@/components/AppShell/ConnectButton";
import { IconBrandGithub, IconLogout, IconSwitch, IconSwitchHorizontal } from "@tabler/icons-react";
import LogosMetamaskIcon from "../Utils/Icons/MetamaskIcon";
import SwitchNetworkButton from "./SwitchNetworkButton";
import { useNetwork } from "wagmi";

const useStyles = createStyles((theme) => ({
  header: {
    paddingBottom: theme.spacing.md,
    marginBottom: `calc(${theme.spacing.md} * 1.5)`,
    borderBottom: `${rem(1)} solid ${
      theme.colorScheme === "dark" ? theme.colors.dark[4] : theme.colors.gray[2]
    }`,
  },

  footer: {
    paddingTop: theme.spacing.md,
    marginTop: theme.spacing.md,
    borderTop: `${rem(1)} solid ${
      theme.colorScheme === "dark" ? theme.colors.dark[4] : theme.colors.gray[2]
    }`,
  },

  link: {
    ...theme.fn.focusStyles(),
    display: "flex",
    alignItems: "center",
    textDecoration: "none",
    fontSize: theme.fontSizes.sm,
    color: theme.colorScheme === "dark" ? theme.colors.dark[1] : theme.colors.gray[7],
    padding: `${theme.spacing.xs} ${theme.spacing.sm}`,
    borderRadius: theme.radius.sm,
    fontWeight: 500,

    "&:hover": {
      backgroundColor: theme.colorScheme === "dark" ? theme.colors.dark[6] : theme.colors.gray[0],
      color: theme.colorScheme === "dark" ? theme.white : theme.black,

      [`& .${getStylesRef("icon")}`]: {
        color: theme.colorScheme === "dark" ? theme.white : theme.black,
      },
    },
  },

  linkIcon: {
    ref: getStylesRef("icon"),
    color: theme.colorScheme === "dark" ? theme.colors.dark[2] : theme.colors.gray[6],
    marginRight: theme.spacing.sm,
  },

  linkActive: {
    "&, &:hover": {
      backgroundColor: theme.fn.variant({ variant: "light", color: theme.primaryColor }).background,
      color: theme.fn.variant({ variant: "light", color: theme.primaryColor }).color,
      [`& .${getStylesRef("icon")}`]: {
        color: theme.fn.variant({ variant: "light", color: theme.primaryColor }).color,
      },
    },
  },
}));

export default function EHRNavbar({ navlinks, opened }) {
  const { classes, cx } = useStyles();
  const router = useRouter();
  const { location } = router.query;
  const { chain } = useNetwork();

  const [active, setActive] = useState("");

  const basePath = location
    ? router.asPath.slice(0, router.asPath.indexOf(location))
    : router.pathname;

  useEffect(() => {
    setActive(location);
  }, [location]);

  const links = navlinks.map((link) => (
    <Link
      className={cx(classes.link, { [classes.linkActive]: link.location === active })}
      href={`${basePath}${link.location}`}
      key={link.label}
    >
      <link.icon className={classes.linkIcon} stroke={1.5} />
      {link.label}
    </Link>
  ));

  return (
    <Navbar hiddenBreakpoint="sm" hidden={!opened} width={{ sm: 200, lg: 300 }} p="md">
      <Navbar.Section grow>
        {/* <Group className={classes.header} position="apart">
          <Code sx={{ fontWeight: 700 }}>v3.1.2</Code>
        </Group> */}
        {links}
      </Navbar.Section>

      <Navbar.Section className={classes.footer}>
        {/* <a
          href="https://github.com/Vedant2254/EHR-data-management-system"
          target="_blank"
          className={classes.link}
        >
          <IconBrandGithub className={classes.linkIcon} stroke={1.5} />
          <span>Source Code</span>
        </a> */}

        <a className={classes.link} onClick={(e) => e.preventDefault()}>
          <ActionIcon className={classes.linkIcon}>
            <LogosMetamaskIcon />
          </ActionIcon>
          <ConnectButton />
        </a>
      </Navbar.Section>
    </Navbar>
  );
}
