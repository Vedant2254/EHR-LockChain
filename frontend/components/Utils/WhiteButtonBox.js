import { Box, useMantineTheme } from "@mantine/core";

export default function ({ doctor }) {
  const theme = useMantineTheme();

  return (
    <Box
      sx={{
        fontFamily: theme.fontFamily,
        height: "70px",
        margin: "10px",
        backgroundColor: "#fff",
        borderRadius: "10px",
        boxShadow: theme.shadows.xs,
        display: "flex",
        alignItems: "center",
        cursor: "pointer",
        "&:hover": {
          boxShadow: theme.shadows.md,
        },
      }}
    >
      <Box pl="md">{doctor}</Box>
    </Box>
  );
}
