import { patient as patientInitials } from "@/utils/initials";
import RegistrationForm from "@/components/Forms/RegistrationForm";
import useRegisterPatient from "@/hooks/useRegisterPatient";

export default function RegisterPatient() {
  const { isLoading, handleOnSumbit } = useRegisterPatient();

  const { initialValues } = patientInitials;

  return (
    <RegistrationForm
      user="patient"
      initialValues={initialValues}
      handleOnSubmit={handleOnSumbit}
      submitIsDisabled={isLoading}
    />
  );
}
