import useIsDoctorPending from "@/hooks/useIsDoctorPending";
import useRegisterDoctorConfirm from "@/hooks/useRegisterDoctorConfirm";
import { ActionIcon, Badge, Button, Group } from "@mantine/core";
import { IconKey } from "@tabler/icons-react";

export default function DoctorButtons({ access, address }) {
  const { isDoctorPending } = useIsDoctorPending(address);
  const { isLoading, isDoctor, registerDrConfirm } = useRegisterDoctorConfirm();

  return (
    <Group>
      {isDoctorPending ? (
        <Badge color="red">Not Approved</Badge>
      ) : (
        <Badge color="green">Approved</Badge>
      )}

      {access == 2 && (
        <>
          {!isDoctorPending && !isDoctor && (
            <Button onClick={registerDrConfirm} variant="subtle" disabled={isLoading} compact>
              <ActionIcon size="sm" color="blue">
                <IconKey />
              </ActionIcon>{" "}
              Confirm Registration
            </Button>
          )}
        </>
      )}
    </Group>
  );
}
