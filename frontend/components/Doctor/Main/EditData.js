import RegistrationForm from "@/components/Forms/RegistrationForm";
import useHashAndData from "@/utils/hooks/useHashAndData";
import { initialInputs, initialValues } from "@/utils/initials";

export default function EditData() {
  const { drHash, data, certificates } = useHashAndData("getDrHash");

  return (
    <RegistrationForm
      initialInputs={initialInputs}
      initialValues={initialValues}
      certcount={certificates.length}
    />
  );
}
