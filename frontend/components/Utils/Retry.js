import { Button, Text } from "@mantine/core";

export default function Retry({ status, retryHandler }) {
  return (
    <>
      <Text>{status}</Text>
      <Button color="red" variant="outline" onClick={() => retryHandler()}>
        Reload
      </Button>
    </>
  );
}
