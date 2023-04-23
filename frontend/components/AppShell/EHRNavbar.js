import { useRouter } from "next/router";
import { Navbar, Tabs, createStyles } from "@mantine/core";

const useStyles = createStyles((theme) => ({
  navbar: {
    paddingTop: theme.spacing.md,
    paddingLeft: theme.spacing.md,
    boxShadow: "-7px 0px 10px 0px black",
    zIndex: 100,
  },
}));

export default function EHRNavbar({ navlinks, opened }) {
  const router = useRouter();
  const { location } = router.query;
  const { classes } = useStyles();

  const basePath = location
    ? router.asPath.slice(0, router.asPath.indexOf(location))
    : router.pathname;

  return (
    <Navbar
      hiddenBreakpoint="sm"
      hidden={!opened}
      width={{ sm: 200, lg: 300 }}
      className={classes.navbar}
    >
      <Navbar.Section></Navbar.Section>
      <Navbar.Section grow>
        <Tabs
          value={location || "/"}
          onTabChange={(value) => {
            value != "/" &&
              router.asPath != `${basePath}${value}` &&
              router.push(`${basePath}${value}`);
          }}
          orientation="vertical"
        >
          <Tabs.List w="100%">
            {navlinks.map((navlink, index) => {
              return (
                <Tabs.Tab key={index} value={navlink.location || "/"}>
                  {navlink.label}
                </Tabs.Tab>
              );
            })}
          </Tabs.List>
        </Tabs>
      </Navbar.Section>
      <Navbar.Section></Navbar.Section>
    </Navbar>
  );
}
