import useRegisterDoctor from "@/hooks/useRegisterDoctor";
import RegistrationForm from "@/components/Forms/RegistrationForm";

export default function RegisterDoctor() {
  const { isLoading, handleOnSubmit } = useRegisterDoctor();

  return (
    <RegistrationForm
      user="doctor"
      initialValues={{}}
      submitIsDisabled={isLoading}
      handleOnSubmit={handleOnSubmit}
    />
  );
}
