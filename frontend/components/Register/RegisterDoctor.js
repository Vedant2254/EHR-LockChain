import useRegisterDoctor from "@/hooks/useRegisterDoctor";
import { patient as patientInitials } from "@/utils/initials";
import RegistrationForm from "@/components/Forms/RegistrationForm";

export default function RegisterDoctor() {
  const { isLoading, handleOnSubmit } = useRegisterDoctor();

  const { initialInputs, initialValues } = patientInitials;

  return (
    <RegistrationForm
      user="doctor"
      initialValues={initialValues}
      submitIsDisabled={isLoading}
      handleOnSubmit={handleOnSubmit}
    />
  );
}
