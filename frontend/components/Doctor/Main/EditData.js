import RegistrationForm from "@/components/Forms/RegistrationForm";
import useHashAndData from "@/hooks/useHashAndData";
import { doctor as doctorInitials } from "@/utils/initials";

export default function EditData() {
  const { certificates } = useHashAndData("getDrHash");
  const { initialInputs, initialValues } = doctorInitials;

  return (
    <RegistrationForm
      initialInputs={initialInputs}
      initialValues={initialValues}
      certcount={certificates.length}
    />
  );
}
