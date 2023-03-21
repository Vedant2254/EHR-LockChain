import useIsDoctorPending from "@/hooks/useIsDoctorPending";
import useApproveDoctor from "@/hooks/useApproveDoctor";
import useRegisterDoctorConfirm from "@/hooks/useRegisterDoctorConfirm";
import { Badge, Box, Button, Group } from "@mantine/core";

export default function DoctorButtons({ address, user }) {
  const { isDoctorPending } = useIsDoctorPending(address);
  const { runApproveDoctor } = useApproveDoctor(address);
  const { isDoctor, registerDrConfirm } = useRegisterDoctorConfirm();

  return (
    <Group>
      {isDoctorPending ? (
        <Badge color="red">Not Approved</Badge>
      ) : (
        <Badge color="green">Approved</Badge>
      )}

      {/* <Group mt="xs"> */}
      {isDoctorPending
        ? user == "admin" && (
            <Button onClick={runApproveDoctor} compact>
              Approve Doctor
            </Button>
          )
        : user == "doctor" &&
          !isDoctor && (
            <Button onClick={registerDrConfirm} compact>
              Confirm Registration
            </Button>
          )}

      {user == "doctor" && (
        <Button compact disabled>
          Edit (not ready)
        </Button>
      )}
      {/* </Group> */}
    </Group>
  );
}
