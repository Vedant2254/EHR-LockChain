import { Text, Dialog, Group, TextInput, Button } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { IconCheck, IconCross } from "@tabler/icons-react";
import { useEffect } from "react";

export default function ConfirmChangesDialog({ isEdited, handleOnConfirm, handleOnReset }) {
  const [opened, { open, close }] = useDisclosure(isEdited);

  useEffect(() => {
    isEdited ? open() : close();
  }, [isEdited]);

  return (
    <Dialog opened={opened} onClose={close} size="lg" radius="md">
      <Text size="sm" mb="xs" weight={500}>
        Confirm or reset all profile data and certificates changes{" "}
        <Text color="dimmed" size="xs">
          Confirm to save, reset to restore last saved state
        </Text>
      </Text>

      <Group align="flex-end">
        <Button onClick={handleOnConfirm} variant="outline" compact>
          Confirm
        </Button>
        <Button onClick={handleOnReset} color="red" variant="outline" compact>
          Reset
        </Button>
      </Group>
    </Dialog>
  );
}
