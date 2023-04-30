import { createStyles, Container, Group, ActionIcon, Image, Text, Box } from "@mantine/core";
import { IconBrandGithub, IconBrandInstagram, IconBrandYoutube } from "@tabler/icons-react";

const useStyles = createStyles((theme) => ({
  footer: {
    background: theme.colors.dark[5],
    // background: "linear-gradient(to right, #800180 0%, #2586e3 100%)",
  },

  inner: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    marginLeft: theme.spacing.lg,
    marginRight: theme.spacing.lg,
    paddingTop: theme.spacing.md,
    paddingBottom: theme.spacing.md,

    [theme.fn.smallerThan("xs")]: {
      flexDirection: "column",
    },
  },

  links: {
    [theme.fn.smallerThan("xs")]: {
      marginTop: theme.spacing.md,
    },
  },
}));

export default function EHRFooter() {
  const { classes } = useStyles();

  return (
    <div className={classes.footer}>
      <Container mx="auto" className={classes.inner}>
        <ActionIcon
          component="a"
          href="https://github.com/Vedant2254/EHR-data-management-system"
          target="_blank"
          size="xl"
          c="white"
          variant="transparent"
        >
          <IconBrandGithub size="1.3rem" stroke={2} />
        </ActionIcon>
        {/* <ActionIcon size="xl" c="white" variant="transparent">
          <IconBrandYoutube size="1.3rem" stroke={2} />
        </ActionIcon>
        <ActionIcon size="xl" c="white" variant="transparent">
          <IconBrandInstagram size="1.3rem" stroke={2} />
        </ActionIcon> */}
      </Container>
    </div>
  );
}
