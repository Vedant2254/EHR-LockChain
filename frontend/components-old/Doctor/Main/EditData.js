import RegistrationForm from "@/components-old/Forms/RegistrationForm";
import useHashAndData from "@/hooks/useDrHashAndData";
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
