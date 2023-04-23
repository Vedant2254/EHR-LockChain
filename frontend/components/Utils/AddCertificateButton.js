const { Center, Button, ActionIcon } = require("@mantine/core");
const { IconPlus } = require("@tabler/icons-react");

export default function AddCertificateButton() {
  return (
    <Center>
      <Button variant="light" w="100%">
        <IconPlus />
      </Button>
    </Center>
  );
}
