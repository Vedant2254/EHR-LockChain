import { useEffect } from "react";
import { useAccount } from "wagmi";
import { useRouter } from "next/router";
import useRegisterDoctor from "@/hooks/useRegisterDoctor";
import { patient as patientInitials } from "@/utils/initials";
import RegistrationForm from "@/components/Forms/RegistrationForm";

export default function RegisterDoctor() {
  const { isConnected } = useAccount();
  const { isDoctorRegistered, isLoading, handleOnSubmit } = useRegisterDoctor();
  const router = useRouter();

  const { initialInputs, initialValues } = patientInitials;

  useEffect(() => {
    !isConnected && router.replace("/");
  }, [isConnected]);

  useEffect(() => {
    isDoctorRegistered && router.replace("/doctor/dashboard");
  }, [isDoctorRegistered]);

  return (
    <RegistrationForm
      initialInputs={initialInputs}
      initialValues={initialValues}
      submitIsDisabled={isLoading}
      certcount={1}
      handleOnSubmit={handleOnSubmit}
    />
  );
}
