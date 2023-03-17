import { useRouter } from "next/router";
import { Navbar, Tabs } from "@mantine/core";

export default function EHRNavbar({ navlinks, opened }) {
  const router = useRouter();
  const { location } = router.query;

  const basePath = location
    ? router.asPath.slice(0, router.asPath.indexOf(location))
    : router.pathname;

  return (
    <Navbar
      pt="md"
      pl="md"
      hiddenBreakpoint="sm"
      hidden={!opened}
      width={{ sm: 200, lg: 300 }}
    >
      <Navbar.Section></Navbar.Section>
      <Navbar.Section grow>
        <Tabs
          value={location || "/"}
          onTabChange={(value) => router.push(`${basePath}${value}`)}
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
