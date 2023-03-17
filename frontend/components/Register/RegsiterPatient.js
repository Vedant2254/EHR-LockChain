import { useEffect } from "react";
import { useRouter } from "next/router";
import { patient as patientInitials } from "@/utils/initials";
import RegistrationForm from "@/components/Forms/RegistrationForm";
import useRegisterPatient from "@/hooks/useRegisterPatient";
import { useAccount } from "wagmi";

export default function RegisterPatient() {
  const { isConnected } = useAccount();
  const { isPatient, isLoading, handleOnSumbit } = useRegisterPatient();
  const router = useRouter();

  const { initialInputs, initialValues } = patientInitials;

  useEffect(() => {
    !isConnected && router.replace("/");
  }, [isConnected]);

  useEffect(() => {
    isPatient && router.replace("/patient/dashboard");
  }, [isPatient]);

  return (
    <RegistrationForm
      handleOnSubmit={handleOnSumbit}
      initialInputs={initialInputs}
      initialValues={initialValues}
      submitIsDisabled={isLoading}
    />
  );
}
