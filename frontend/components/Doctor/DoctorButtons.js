import useIsDoctorPending from "@/hooks/useIsDoctorPending";
import useRegisterDoctorConfirm from "@/hooks/useRegisterDoctorConfirm";
import { Badge, Button, Group } from "@mantine/core";

export default function DoctorButtons({ address, user }) {
  const { isDoctorPending } = useIsDoctorPending(address);
  const { isDoctor, registerDrConfirm } = useRegisterDoctorConfirm();

  return (
    <Group>
      {isDoctorPending ? (
        <Badge color="red">Not Approved</Badge>
      ) : (
        <Badge color="green">Approved</Badge>
      )}

      {/* <Group mt="xs"> */}
      {user == "doctor" && (
        <>
          {!isDoctorPending && !isDoctor && (
            <Button onClick={registerDrConfirm} compact>
              Confirm Registration
            </Button>
          )}
          <Button compact disabled>
            Edit (not ready)
          </Button>
        </>
      )}
    </Group>
  );
}
