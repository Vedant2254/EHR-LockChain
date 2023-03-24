import useRegisterPatient from "@/hooks/useRegisterPatient";
import RegistrationForm from "@/components/Forms/RegistrationForm";

export default function RegisterPatient() {
  const { isLoading, handleOnSumbit } = useRegisterPatient();

  return (
    <RegistrationForm
      user="patient"
      initialValues={{}}
      handleOnSubmit={handleOnSumbit}
      submitIsDisabled={isLoading}
    />
  );
}
