import messages from "@/utils/messages";
import { Button, Center, Flex, SimpleGrid, Text } from "@mantine/core";
import { IconReload } from "@tabler/icons-react";

export default function Retry({ status, retryHandler }) {
  return (
    <Flex align="center" direction="column">
      <Text fw="700">{messages[status]}</Text>
      <Button color="red" variant="filled" onClick={() => retryHandler()} compact>
        <IconReload /> Reload
      </Button>
    </Flex>
  );
}
