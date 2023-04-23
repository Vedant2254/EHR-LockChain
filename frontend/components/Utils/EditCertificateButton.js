const { ActionIcon } = require("@mantine/core");
const { IconEdit } = require("@tabler/icons-react");

export default function EditCertificateButton() {
  return (
    <ActionIcon
      component="button"
      color="blue"
      variant="subtle"
      radius="xl"
      sx={{ "&:hover": { backgroundColor: "none" } }}
    >
      <IconEdit />
    </ActionIcon>
  );
}
